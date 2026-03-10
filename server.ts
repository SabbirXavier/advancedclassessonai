import express from 'express';
import { createServer as createViteServer } from 'vite';
import { initDB, getItems, createItem, updateItem, deleteItem } from './db';

async function startServer() {
  await initDB();
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/login', (req, res) => {
    const { password } = req.body;
    // Use environment variable for admin password, fallback to 'AckOP'
    const adminPassword = process.env.ADMIN_PASSWORD || 'AckOP';
    
    if (password === adminPassword) {
      res.json({ success: true, token: 'admin-token' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  });

  // Middleware to check admin token
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization;
    if (token === 'Bearer admin-token') {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  };

  // Generic Get Route
  app.get('/api/:type', async (req, res) => {
    const { type } = req.params;
    if (!['batches', 'routines', 'downloads', 'fees'].includes(type)) {
      return res.status(404).json([]);
    }
    const items = await getItems(type);
    res.json(items);
  });

  // Generic Post Route
  app.post('/api/:type', requireAdmin, async (req, res) => {
    const { type } = req.params;
    if (!['batches', 'routines', 'downloads', 'fees'].includes(type)) {
      return res.status(404).json({ success: false });
    }
    try {
      const id = await createItem(type, req.body);
      res.json({ success: true, id });
    } catch (err: any) {
      if (err.message === 'STORAGE_FULL') {
        res.status(507).json({ success: false, message: 'MongoDB Storage is Full. Please delete some items.' });
      } else {
        res.status(500).json({ success: false, message: 'Server Error' });
      }
    }
  });

  // Generic Put Route
  app.put('/api/:type/:id', requireAdmin, async (req, res) => {
    const { type, id } = req.params;
    if (!['batches', 'routines', 'downloads', 'fees'].includes(type)) {
      return res.status(404).json({ success: false });
    }
    try {
      await updateItem(type, id, req.body);
      res.json({ success: true });
    } catch (err: any) {
      if (err.message === 'STORAGE_FULL') {
        res.status(507).json({ success: false, message: 'MongoDB Storage is Full. Please delete some items.' });
      } else {
        res.status(500).json({ success: false, message: 'Server Error' });
      }
    }
  });

  // Generic Delete Route
  app.delete('/api/:type/:id', requireAdmin, async (req, res) => {
    const { type, id } = req.params;
    if (!['batches', 'routines', 'downloads', 'fees'].includes(type)) {
      return res.status(404).json({ success: false });
    }
    await deleteItem(type, id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
