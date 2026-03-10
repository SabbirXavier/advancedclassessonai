import mongoose from 'mongoose';
import fs from 'fs';

const MONGODB_URI = process.env.MONGODB_URI;
const useMongo = !!MONGODB_URI;

// Mongoose Schemas
const batchSchema = new mongoose.Schema({ name: String, tag: String, date: String, description: String, color: String, tagColor: String });
const routineSchema = new mongoose.Schema({ time: String, mon: String, tue: String, wed: String, thu: String, fri: String, sat: String, sun: String });
const downloadSchema = new mongoose.Schema({ subject: String, icon: String, color: String, links: Array });
const feeSchema = new mongoose.Schema({ subject: String, amount: String });

let Batch: any, Routine: any, Download: any, Fee: any;

if (useMongo) {
  Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);
  Routine = mongoose.models.Routine || mongoose.model('Routine', routineSchema);
  Download = mongoose.models.Download || mongoose.model('Download', downloadSchema);
  Fee = mongoose.models.Fee || mongoose.model('Fee', feeSchema);
}

// Local Fallback State (for AI Studio Preview)
let localData: any = { batches: [], routines: [], downloads: [], fees: [] };
const LOCAL_FILE = 'local_db.json';

export const initDB = async () => {
  if (useMongo) {
    try {
      await mongoose.connect(MONGODB_URI!);
      console.log('Connected to MongoDB');
      
      // Seed default data if empty
      if (await Batch.countDocuments() === 0) {
        await Batch.insertMany([
          { name: 'CLASS XII', tag: 'URGENT', date: 'APR 15', description: 'Target: Boards + JEE.', color: 'var(--primary)', tagColor: 'var(--primary)' },
          { name: 'CLASS X', tag: 'FRESH', date: 'MAY 01', description: 'Foundation Batch.', color: 'var(--success)', tagColor: 'var(--success)' },
          { name: 'CLASS XI', tag: 'SCIENCE', date: 'JUN 01', description: 'Starts after X Results.', color: 'var(--secondary)', tagColor: 'var(--secondary)' }
        ]);
        await Routine.insertMany([
          { time: '02:30', mon: 'Math X', tue: '-', wed: '-', thu: 'Math X', fri: '-', sat: 'Math X', sun: '-' },
          { time: '04:30', mon: 'Math XI', tue: 'Math XII', wed: 'Chem XI', thu: 'Math XI', fri: 'Chem XI', sat: 'Math XII', sun: 'Math XII' },
          { time: 'EVE', mon: '-', tue: '-', wed: 'Chem XII', thu: '-', fri: 'Chem XII', sat: '-', sun: '-' }
        ]);
        await Download.insertMany([
          { subject: 'CHEMISTRY XII', icon: 'FlaskConical', color: 'var(--accent)', links: [{ label: 'PYQ Download', url: 'https://drive.google.com/file/d/1j1x7cZiluh0dxkuvGlm_I2eL9wmc-5rE/view?usp=drivesdk', icon: 'Download' }] },
          { subject: 'PHYSICS XII', icon: 'Atom', color: 'var(--secondary)', links: [{ label: 'PYQ Download', url: 'https://drive.google.com/file/d/1JlLrMddHxAinz9za-iv3etyCXTEST8jT/view?usp=drivesdk', icon: 'Download' }] },
          { subject: 'BIOLOGY XII', icon: 'Dna', color: 'var(--success)', links: [{ label: 'PYQ Download', url: 'https://drive.google.com/file/d/1p3AJTAuPgPcQqSxMiLYJlNFGjevTuyf1/view?usp=drivesdk', icon: 'Download' }] },
          { subject: 'MATHEMATICS XII', icon: 'Calculator', color: 'var(--primary)', links: [{ label: 'Question Bank', url: 'https://drive.google.com/drive/folders/1j2uD7ofSE_y5B0_PT8mGelXkQO0bPOgu', icon: 'FolderOpen' }] }
        ]);
        await Fee.insertMany([
          { subject: 'Mathematics', amount: '₹1000/mo' },
          { subject: 'Chemistry', amount: '₹1000/mo' },
          { subject: 'Physics', amount: '₹1000/mo' }
        ]);
      }
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  } else {
    console.log('Using local JSON fallback');
    if (fs.existsSync(LOCAL_FILE)) {
      localData = JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf-8'));
    } else {
      localData.batches = [
        { id: 'b1', name: 'CLASS XII', tag: 'URGENT', date: 'APR 15', description: 'Target: Boards + JEE.', color: 'var(--primary)', tagColor: 'var(--primary)' },
        { id: 'b2', name: 'CLASS X', tag: 'FRESH', date: 'MAY 01', description: 'Foundation Batch.', color: 'var(--success)', tagColor: 'var(--success)' },
        { id: 'b3', name: 'CLASS XI', tag: 'SCIENCE', date: 'JUN 01', description: 'Starts after X Results.', color: 'var(--secondary)', tagColor: 'var(--secondary)' }
      ];
      localData.routines = [
        { id: 'r1', time: '02:30', mon: 'Math X', tue: '-', wed: '-', thu: 'Math X', fri: '-', sat: 'Math X', sun: '-' },
        { id: 'r2', time: '04:30', mon: 'Math XI', tue: 'Math XII', wed: 'Chem XI', thu: 'Math XI', fri: 'Chem XI', sat: 'Math XII', sun: 'Math XII' },
        { id: 'r3', time: 'EVE', mon: '-', tue: '-', wed: 'Chem XII', thu: '-', fri: 'Chem XII', sat: '-', sun: '-' }
      ];
      localData.downloads = [
        { id: 'd1', subject: 'CHEMISTRY XII', icon: 'FlaskConical', color: 'var(--accent)', links: [{ label: 'PYQ Download', url: 'https://drive.google.com/file/d/1j1x7cZiluh0dxkuvGlm_I2eL9wmc-5rE/view?usp=drivesdk', icon: 'Download' }] },
        { id: 'd2', subject: 'PHYSICS XII', icon: 'Atom', color: 'var(--secondary)', links: [{ label: 'PYQ Download', url: 'https://drive.google.com/file/d/1JlLrMddHxAinz9za-iv3etyCXTEST8jT/view?usp=drivesdk', icon: 'Download' }] },
        { id: 'd3', subject: 'BIOLOGY XII', icon: 'Dna', color: 'var(--success)', links: [{ label: 'PYQ Download', url: 'https://drive.google.com/file/d/1p3AJTAuPgPcQqSxMiLYJlNFGjevTuyf1/view?usp=drivesdk', icon: 'Download' }] },
        { id: 'd4', subject: 'MATHEMATICS XII', icon: 'Calculator', color: 'var(--primary)', links: [{ label: 'Question Bank', url: 'https://drive.google.com/drive/folders/1j2uD7ofSE_y5B0_PT8mGelXkQO0bPOgu', icon: 'FolderOpen' }] }
      ];
      localData.fees = [
        { id: 'f1', subject: 'Mathematics', amount: '₹1000/mo' },
        { id: 'f2', subject: 'Chemistry', amount: '₹1000/mo' },
        { id: 'f3', subject: 'Physics', amount: '₹1000/mo' }
      ];
      saveLocal();
    }
  }
};

const saveLocal = () => {
  if (!useMongo) fs.writeFileSync(LOCAL_FILE, JSON.stringify(localData, null, 2));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const getModel = (type: string) => {
  switch(type) {
    case 'batches': return Batch;
    case 'routines': return Routine;
    case 'downloads': return Download;
    case 'fees': return Fee;
    default: return null;
  }
};

// Generic CRUD Operations
export const getItems = async (type: string) => {
  if (useMongo) {
    const Model = getModel(type);
    if (!Model) return [];
    const items = await Model.find();
    return items.map((i: any) => ({ ...i.toObject(), id: i._id.toString() }));
  }
  return localData[type] || [];
};

export const createItem = async (type: string, data: any) => {
  if (useMongo) {
    const Model = getModel(type);
    if (!Model) return null;
    try {
      const item = await Model.create(data);
      return item._id.toString();
    } catch (err: any) {
      if (err.code === 12501 || err.message.includes('quota') || err.message.includes('space')) {
        throw new Error('STORAGE_FULL');
      }
      throw err;
    }
  }
  const id = generateId();
  if (!localData[type]) localData[type] = [];
  localData[type].push({ ...data, id });
  saveLocal();
  return id;
};

export const updateItem = async (type: string, id: string, data: any) => {
  if (useMongo) {
    const Model = getModel(type);
    if (!Model) return false;
    const { id: _, _id, ...updateData } = data; // Remove id to avoid immutable field error
    try {
      await Model.findByIdAndUpdate(id, updateData);
      return true;
    } catch (err: any) {
      if (err.code === 12501 || err.message.includes('quota') || err.message.includes('space')) {
        throw new Error('STORAGE_FULL');
      }
      throw err;
    }
  }
  if (!localData[type]) return false;
  const index = localData[type].findIndex((i: any) => i.id === id);
  if (index !== -1) {
    localData[type][index] = { ...localData[type][index], ...data, id };
    saveLocal();
  }
  return true;
};

export const deleteItem = async (type: string, id: string) => {
  if (useMongo) {
    const Model = getModel(type);
    if (!Model) return false;
    await Model.findByIdAndDelete(id);
    return true;
  }
  if (!localData[type]) return false;
  localData[type] = localData[type].filter((i: any) => i.id !== id);
  saveLocal();
  return true;
};
