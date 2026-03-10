import React, { useState, useEffect } from 'react';

export default function TabAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('batches');

  // Data states
  const [batches, setBatches] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newItemData, setNewItemData] = useState<any>({});
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [bRes, rRes, dRes, fRes] = await Promise.all([
        fetch('/api/batches'),
        fetch('/api/routines'),
        fetch('/api/downloads'),
        fetch('/api/fees')
      ]);
      setBatches(await bRes.json());
      setRoutines(await rRes.json());
      setDownloads(await dRes.json());
      setFees(await fRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        fetchData();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string, name: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      callback(event.target?.result as string, file.name);
    };
    reader.readAsDataURL(file);
  };

  const updateItem = async (endpoint: string, id: any, data: any) => {
    setDbError('');
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(data)
      });
      if (res.status === 507) {
        const errData = await res.json();
        setDbError(errData.message || 'Storage Full');
        return;
      }
      if (res.ok) {
        fetchData();
      } else {
        console.error('Update failed');
      }
    } catch (err) {
      console.error('Error updating', err);
    }
  };

  const createItem = async (endpoint: string, data: any = {}) => {
    setDbError('');
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(data)
      });
      if (res.status === 507) {
        const errData = await res.json();
        setDbError(errData.message || 'Storage Full');
        return false;
      }
      if (res.ok) {
        fetchData();
        return true;
      } else {
        console.error('Create failed');
        return false;
      }
    } catch (err) {
      console.error('Error creating', err);
      return false;
    }
  };

  const deleteItem = async (endpoint: string, id: any) => {
    // Removed confirm() as it is blocked in iframes
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (res.ok) {
        fetchData();
      } else {
        console.error('Delete failed');
      }
    } catch (err) {
      console.error('Error deleting', err);
    }
  };

  const openAddModal = (type: string, initialData: any) => {
    setModalType(type);
    setNewItemData(initialData);
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createItem(modalType, newItemData);
    if (success) {
      setIsModalOpen(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="space-y-5">
        <div className="glass-card max-w-md mx-auto mt-10">
          <h2 className="text-2xl font-bold text-center mb-5 text-[var(--primary)]">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <input 
                type="password" 
                className="w-full p-3 bg-white/10 dark:bg-black/10 border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--primary)]" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full p-3 rounded-xl bg-[var(--primary)] text-white font-bold">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={handleLogout} className="text-sm text-red-500 font-bold">Logout</button>
      </div>

      {dbError && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl font-bold flex justify-between items-center">
          <span>{dbError}</span>
          <button onClick={() => setDbError('')} className="text-xl">&times;</button>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['batches', 'routines', 'downloads', 'fees'].map(sec => (
          <button 
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize whitespace-nowrap ${activeSection === sec ? 'bg-[var(--primary)] text-white' : 'bg-white/10 border border-[var(--border-color)]'}`}
          >
            {sec}
          </button>
        ))}
      </div>

      <div className="glass-card">
        {activeSection === 'batches' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[var(--primary)]">Edit Batches</h3>
              <button onClick={() => openAddModal('batches', { name: '', tag: '', date: '', description: '', color: 'var(--primary)', tagColor: 'var(--primary)' })} className="px-3 py-1 bg-[var(--primary)] text-white rounded-lg text-sm font-bold">+ Add Batch</button>
            </div>
            {batches.map(batch => (
              <div key={batch.id} className="border border-[var(--border-color)] p-4 rounded-xl space-y-3">
                <input className="w-full p-2 bg-white/5 border border-[var(--border-color)] rounded" value={batch.name} onChange={e => setBatches(batches.map(b => b.id === batch.id ? {...b, name: e.target.value} : b))} placeholder="Name" />
                <div className="flex gap-2">
                  <input className="w-1/2 p-2 bg-white/5 border border-[var(--border-color)] rounded" value={batch.tag} onChange={e => setBatches(batches.map(b => b.id === batch.id ? {...b, tag: e.target.value} : b))} placeholder="Tag" />
                  <input className="w-1/2 p-2 bg-white/5 border border-[var(--border-color)] rounded" value={batch.date} onChange={e => setBatches(batches.map(b => b.id === batch.id ? {...b, date: e.target.value} : b))} placeholder="Date" />
                </div>
                <div className="flex gap-2">
                  <select className="w-1/2 p-2 bg-white/5 border border-[var(--border-color)] rounded [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white" value={batch.color} onChange={e => setBatches(batches.map(b => b.id === batch.id ? {...b, color: e.target.value} : b))}>
                    <option value="var(--primary)">Theme Default</option>
                    <option value="#ef4444">Red</option>
                    <option value="#f97316">Orange</option>
                    <option value="#eab308">Yellow</option>
                    <option value="#22c55e">Green</option>
                    <option value="#3b82f6">Blue</option>
                    <option value="#a855f7">Purple</option>
                  </select>
                  <select className="w-1/2 p-2 bg-white/5 border border-[var(--border-color)] rounded [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white" value={batch.tagColor} onChange={e => setBatches(batches.map(b => b.id === batch.id ? {...b, tagColor: e.target.value} : b))}>
                    <option value="var(--primary)">Theme Default</option>
                    <option value="#ef4444">Red</option>
                    <option value="#f97316">Orange</option>
                    <option value="#eab308">Yellow</option>
                    <option value="#22c55e">Green</option>
                    <option value="#3b82f6">Blue</option>
                    <option value="#a855f7">Purple</option>
                  </select>
                </div>
                <input className="w-full p-2 bg-white/5 border border-[var(--border-color)] rounded" value={batch.description} onChange={e => setBatches(batches.map(b => b.id === batch.id ? {...b, description: e.target.value} : b))} placeholder="Description" />
                <div className="flex gap-2">
                  <button onClick={() => updateItem('batches', batch.id, batch)} className="flex-1 px-4 py-2 bg-[var(--success)] text-white rounded-lg text-sm font-bold">Save Changes</button>
                  <button onClick={() => deleteItem('batches', batch.id)} className="px-4 py-2 bg-[var(--danger)] text-white rounded-lg text-sm font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'routines' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[var(--primary)]">Edit Routines</h3>
              <button onClick={() => openAddModal('routines', { time: '', mon: '-', tue: '-', wed: '-', thu: '-', fri: '-', sat: '-', sun: '-' })} className="px-3 py-1 bg-[var(--primary)] text-white rounded-lg text-sm font-bold">+ Add Routine</button>
            </div>
            {routines.map(routine => (
              <div key={routine.id} className="border border-[var(--border-color)] p-4 rounded-xl space-y-3">
                <input className="w-full p-2 bg-white/5 border border-[var(--border-color)] rounded font-bold" value={routine.time} onChange={e => setRoutines(routines.map(r => r.id === routine.id ? {...r, time: e.target.value} : r))} placeholder="Time" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                    <div key={day}>
                      <label className="text-xs uppercase opacity-70">{day}</label>
                      <input className="w-full p-2 bg-white/5 border border-[var(--border-color)] rounded text-sm" value={routine[day]} onChange={e => setRoutines(routines.map(r => r.id === routine.id ? {...r, [day]: e.target.value} : r))} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateItem('routines', routine.id, routine)} className="flex-1 px-4 py-2 bg-[var(--success)] text-white rounded-lg text-sm font-bold">Save Changes</button>
                  <button onClick={() => deleteItem('routines', routine.id)} className="px-4 py-2 bg-[var(--danger)] text-white rounded-lg text-sm font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'downloads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[var(--primary)]">Edit Downloads</h3>
              <button onClick={() => openAddModal('downloads', { subject: '', icon: 'Download', color: 'var(--primary)', links: [] })} className="px-3 py-1 bg-[var(--primary)] text-white rounded-lg text-sm font-bold">+ Add Download</button>
            </div>
            {downloads.map(dl => (
              <div key={dl.id} className="border border-[var(--border-color)] p-4 rounded-xl space-y-3">
                <input className="w-full p-2 bg-white/5 border border-[var(--border-color)] rounded font-bold" value={dl.subject} onChange={e => setDownloads(downloads.map(d => d.id === dl.id ? {...d, subject: e.target.value} : d))} placeholder="Subject" />
                <div className="flex gap-2">
                  <select className="w-1/2 p-2 bg-white/5 border border-[var(--border-color)] rounded [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white" value={dl.icon} onChange={e => setDownloads(downloads.map(d => d.id === dl.id ? {...d, icon: e.target.value} : d))}>
                    <option value="Download">Download Icon</option>
                    <option value="Book">Book Icon</option>
                    <option value="FlaskConical">Science Icon</option>
                    <option value="Atom">Physics/Atom Icon</option>
                    <option value="Dna">Biology/DNA Icon</option>
                    <option value="Calculator">Math Icon</option>
                    <option value="FolderOpen">Folder Icon</option>
                  </select>
                  <select className="w-1/2 p-2 bg-white/5 border border-[var(--border-color)] rounded [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white" value={dl.color} onChange={e => setDownloads(downloads.map(d => d.id === dl.id ? {...d, color: e.target.value} : d))}>
                    <option value="var(--primary)">Theme Default</option>
                    <option value="var(--secondary)">Theme Secondary</option>
                    <option value="var(--accent)">Theme Accent</option>
                    <option value="var(--success)">Theme Success</option>
                    <option value="#ef4444">Red</option>
                    <option value="#f97316">Orange</option>
                    <option value="#eab308">Yellow</option>
                    <option value="#22c55e">Green</option>
                    <option value="#3b82f6">Blue</option>
                    <option value="#a855f7">Purple</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Links</label>
                  {(dl.links || []).map((link: any, i: number) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input className="w-1/3 p-2 bg-white/5 border border-[var(--border-color)] rounded text-sm" value={link.label || ''} onChange={e => {
                        const newLinks = [...dl.links];
                        newLinks[i].label = e.target.value;
                        setDownloads(downloads.map(d => d.id === dl.id ? {...d, links: newLinks} : d));
                      }} placeholder="Label (e.g. PYQ)" />
                      <div className="flex-1 flex gap-1 items-center">
                        <input className="flex-1 p-2 bg-white/5 border border-[var(--border-color)] rounded text-sm" value={link.url?.startsWith('data:') ? 'Local File Uploaded' : (link.url || '')} onChange={e => {
                          const newLinks = [...dl.links];
                          newLinks[i].url = e.target.value;
                          setDownloads(downloads.map(d => d.id === dl.id ? {...d, links: newLinks} : d));
                        }} placeholder="URL (e.g. https://...)" disabled={link.url?.startsWith('data:')} />
                        
                        {link.url?.startsWith('data:') ? (
                          <button type="button" onClick={() => {
                            const newLinks = [...dl.links];
                            newLinks[i].url = '';
                            setDownloads(downloads.map(d => d.id === dl.id ? {...d, links: newLinks} : d));
                          }} className="px-2 py-2 text-xs bg-red-500/20 text-red-500 rounded font-bold">Clear</button>
                        ) : (
                          <label className="flex items-center justify-center px-3 py-2 bg-white/10 hover:bg-white/20 rounded cursor-pointer transition-colors">
                            <span className="text-xs font-bold">File</span>
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url, name) => {
                              const newLinks = [...dl.links];
                              newLinks[i].url = url;
                              if (!newLinks[i].label) newLinks[i].label = name;
                              setDownloads(downloads.map(d => d.id === dl.id ? {...d, links: newLinks} : d));
                            })} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                          </label>
                        )}
                      </div>
                      <button onClick={() => {
                        const newLinks = dl.links.filter((_: any, index: number) => index !== i);
                        setDownloads(downloads.map(d => d.id === dl.id ? {...d, links: newLinks} : d));
                      }} className="px-3 bg-red-500/20 text-red-500 rounded font-bold">X</button>
                    </div>
                  ))}
                  <button onClick={() => {
                    const newLinks = [...(dl.links || []), { label: '', url: '', icon: 'Download' }];
                    setDownloads(downloads.map(d => d.id === dl.id ? {...d, links: newLinks} : d));
                  }} className="text-xs bg-[var(--primary)] text-white px-3 py-1.5 rounded-lg font-bold">+ Add Link</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateItem('downloads', dl.id, dl)} className="flex-1 px-4 py-2 bg-[var(--success)] text-white rounded-lg text-sm font-bold">Save Changes</button>
                  <button onClick={() => deleteItem('downloads', dl.id)} className="px-4 py-2 bg-[var(--danger)] text-white rounded-lg text-sm font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'fees' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[var(--primary)]">Edit Fees</h3>
              <button onClick={() => openAddModal('fees', { subject: '', amount: '' })} className="px-3 py-1 bg-[var(--primary)] text-white rounded-lg text-sm font-bold">+ Add Fee</button>
            </div>
            {fees.map(fee => (
              <div key={fee.id} className="border border-[var(--border-color)] p-4 rounded-xl space-y-3 flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-xs opacity-70">Subject</label>
                  <input className="w-full p-2 bg-white/5 border border-[var(--border-color)] rounded" value={fee.subject} onChange={e => setFees(fees.map(f => f.id === fee.id ? {...f, subject: e.target.value} : f))} />
                </div>
                <div className="flex-1">
                  <label className="text-xs opacity-70">Amount</label>
                  <input className="w-full p-2 bg-white/5 border border-[var(--border-color)] rounded" value={fee.amount} onChange={e => setFees(fees.map(f => f.id === fee.id ? {...f, amount: e.target.value} : f))} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => updateItem('fees', fee.id, fee)} className="px-4 py-2 bg-[var(--success)] text-white rounded-lg text-sm font-bold h-[42px]">Save</button>
                  <button onClick={() => deleteItem('fees', fee.id)} className="px-4 py-2 bg-[var(--danger)] text-white rounded-lg text-sm font-bold h-[42px]">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/20">
            <div className="p-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold capitalize">Add New {modalType.slice(0, -1)}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {modalType === 'batches' && (
                <>
                  <input className="w-full p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" value={newItemData.name} onChange={e => setNewItemData({...newItemData, name: e.target.value})} placeholder="Batch Name" required />
                  <div className="flex gap-2">
                    <input className="w-1/2 p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" value={newItemData.tag} onChange={e => setNewItemData({...newItemData, tag: e.target.value})} placeholder="Tag (e.g. URGENT)" required />
                    <input className="w-1/2 p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" value={newItemData.date} onChange={e => setNewItemData({...newItemData, date: e.target.value})} placeholder="Date (e.g. APR 15)" required />
                  </div>
                  <div className="flex gap-2">
                    <select className="w-1/2 p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white" value={newItemData.color} onChange={e => setNewItemData({...newItemData, color: e.target.value})} required>
                      <option value="var(--primary)">Theme Default</option>
                      <option value="#ef4444">Red</option>
                      <option value="#f97316">Orange</option>
                      <option value="#eab308">Yellow</option>
                      <option value="#22c55e">Green</option>
                      <option value="#3b82f6">Blue</option>
                      <option value="#a855f7">Purple</option>
                    </select>
                    <select className="w-1/2 p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white" value={newItemData.tagColor} onChange={e => setNewItemData({...newItemData, tagColor: e.target.value})} required>
                      <option value="var(--primary)">Theme Default</option>
                      <option value="#ef4444">Red</option>
                      <option value="#f97316">Orange</option>
                      <option value="#eab308">Yellow</option>
                      <option value="#22c55e">Green</option>
                      <option value="#3b82f6">Blue</option>
                      <option value="#a855f7">Purple</option>
                    </select>
                  </div>
                  <input className="w-full p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" value={newItemData.description} onChange={e => setNewItemData({...newItemData, description: e.target.value})} placeholder="Description" required />
                </>
              )}
              {modalType === 'routines' && (
                <>
                  <input className="w-full p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-900 dark:text-white" value={newItemData.time} onChange={e => setNewItemData({...newItemData, time: e.target.value})} placeholder="Time (e.g. 02:30)" required />
                  <div className="grid grid-cols-2 gap-2">
                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                      <div key={day}>
                        <label className="text-xs uppercase opacity-70 ml-1 text-gray-700 dark:text-gray-300">{day}</label>
                        <input className="w-full p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white" value={newItemData[day]} onChange={e => setNewItemData({...newItemData, [day]: e.target.value})} placeholder="-" />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {modalType === 'downloads' && (
                <>
                  <input className="w-full p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-900 dark:text-white" value={newItemData.subject} onChange={e => setNewItemData({...newItemData, subject: e.target.value})} placeholder="Subject Name" required />
                  <div className="flex gap-2">
                    <select className="w-1/2 p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white" value={newItemData.icon} onChange={e => setNewItemData({...newItemData, icon: e.target.value})} required>
                      <option value="Download">Download Icon</option>
                      <option value="Book">Book Icon</option>
                      <option value="FlaskConical">Science Icon</option>
                      <option value="Atom">Physics/Atom Icon</option>
                      <option value="Dna">Biology/DNA Icon</option>
                      <option value="Calculator">Math Icon</option>
                      <option value="FolderOpen">Folder Icon</option>
                    </select>
                    <select className="w-1/2 p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white [&>option]:bg-white dark:[&>option]:bg-gray-900 [&>option]:text-gray-900 dark:[&>option]:text-white" value={newItemData.color} onChange={e => setNewItemData({...newItemData, color: e.target.value})} required>
                      <option value="var(--primary)">Theme Default</option>
                      <option value="var(--secondary)">Theme Secondary</option>
                      <option value="var(--accent)">Theme Accent</option>
                      <option value="var(--success)">Theme Success</option>
                      <option value="#ef4444">Red</option>
                      <option value="#f97316">Orange</option>
                      <option value="#eab308">Yellow</option>
                      <option value="#22c55e">Green</option>
                      <option value="#3b82f6">Blue</option>
                      <option value="#a855f7">Purple</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold ml-1 text-gray-700 dark:text-gray-300">Links</label>
                    {(newItemData.links || []).map((link: any, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input className="w-1/3 p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white" value={link.label || ''} onChange={e => {
                          const newLinks = [...newItemData.links];
                          newLinks[i].label = e.target.value;
                          setNewItemData({...newItemData, links: newLinks});
                        }} placeholder="Label" required />
                        <div className="flex-1 flex gap-1 items-center">
                          <input className="flex-1 p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white" value={link.url?.startsWith('data:') ? 'Local File Uploaded' : (link.url || '')} onChange={e => {
                            const newLinks = [...newItemData.links];
                            newLinks[i].url = e.target.value;
                            setNewItemData({...newItemData, links: newLinks});
                          }} placeholder="URL" required={!link.url} disabled={link.url?.startsWith('data:')} />
                          
                          {link.url?.startsWith('data:') ? (
                            <button type="button" onClick={() => {
                              const newLinks = [...newItemData.links];
                              newLinks[i].url = '';
                              setNewItemData({...newItemData, links: newLinks});
                            }} className="px-3 py-3 text-xs bg-red-500/20 text-red-500 rounded-xl font-bold">Clear</button>
                          ) : (
                            <label className="flex items-center justify-center px-3 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-xl cursor-pointer transition-colors">
                              <span className="text-xs font-bold text-gray-900 dark:text-white">File</span>
                              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url, name) => {
                                const newLinks = [...newItemData.links];
                                newLinks[i].url = url;
                                if (!newLinks[i].label) newLinks[i].label = name;
                                setNewItemData({...newItemData, links: newLinks});
                              })} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                            </label>
                          )}
                        </div>
                        <button type="button" onClick={() => {
                          const newLinks = newItemData.links.filter((_: any, index: number) => index !== i);
                          setNewItemData({...newItemData, links: newLinks});
                        }} className="px-3 bg-red-500/20 text-red-500 rounded-xl font-bold">X</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const newLinks = [...(newItemData.links || []), { label: '', url: '', icon: 'Download' }];
                      setNewItemData({...newItemData, links: newLinks});
                    }} className="text-xs bg-[var(--primary)] text-white px-3 py-2 rounded-xl mt-1 font-bold">+ Add Link</button>
                  </div>
                </>
              )}
              {modalType === 'fees' && (
                <>
                  <input className="w-full p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" value={newItemData.subject} onChange={e => setNewItemData({...newItemData, subject: e.target.value})} placeholder="Subject Name" required />
                  <input className="w-full p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white" value={newItemData.amount} onChange={e => setNewItemData({...newItemData, amount: e.target.value})} placeholder="Amount (e.g. ₹1000/mo)" required />
                </>
              )}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-bold">Cancel</button>
                <button type="submit" className="flex-1 p-3 rounded-xl bg-[var(--primary)] text-white font-bold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
