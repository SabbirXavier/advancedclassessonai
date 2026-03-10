import React, { useState } from 'react';

export default function TabJoin() {
  const [formData, setFormData] = useState({
    sName: '',
    gName: '',
    phone: '',
    batch: 'Class XII (Starts Apr 15)',
    subs: 'Math + Chemistry'
  });

  const sendWA = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sName || !formData.phone) {
      console.error("Please enter Student Name and Contact Number");
      return;
    }

    const msg = `*ADMISSION REQUEST*
👤 Student: ${formData.sName}
🏠 Guardian: ${formData.gName || "-"}
📱 Contact: ${formData.phone}
📚 Batch: ${formData.batch}
📝 Subjects: ${formData.subs}`;

    window.open(
      "https://wa.me/916001539070?text=" + encodeURIComponent(msg),
      "_blank"
    );
  };

  return (
    <div className="space-y-5">
      <div className="glass-card">
        <h2 className="text-center text-[var(--danger)] font-bold text-2xl tracking-wide">SECURE YOUR SEAT</h2>
        <p className="text-center text-sm opacity-70 mt-1 mb-6">One tap registration via WhatsApp</p>

        <form onSubmit={sendWA} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 opacity-90">Student Name</label>
            <input 
              type="text" 
              className="w-full p-4 bg-white/10 dark:bg-black/10 border border-[var(--border-color)] text-[var(--text-color)] rounded-xl text-base font-sans transition-all focus:outline-none focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--primary)]/10" 
              placeholder="Enter Full Name" 
              required 
              value={formData.sName}
              onChange={e => setFormData({...formData, sName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 opacity-90">Guardian Name</label>
            <input 
              type="text" 
              className="w-full p-4 bg-white/10 dark:bg-black/10 border border-[var(--border-color)] text-[var(--text-color)] rounded-xl text-base font-sans transition-all focus:outline-none focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--primary)]/10" 
              placeholder="Father/Mother Name" 
              value={formData.gName}
              onChange={e => setFormData({...formData, gName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 opacity-90">Contact Number</label>
            <input 
              type="tel" 
              className="w-full p-4 bg-white/10 dark:bg-black/10 border border-[var(--border-color)] text-[var(--text-color)] rounded-xl text-base font-sans transition-all focus:outline-none focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--primary)]/10" 
              placeholder="WhatsApp Number" 
              required 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 opacity-90">Select Batch</label>
            <select 
              className="w-full p-4 bg-white/10 dark:bg-black/10 border border-[var(--border-color)] text-[var(--text-color)] rounded-xl text-base font-sans transition-all focus:outline-none focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--primary)]/10 appearance-none"
              value={formData.batch}
              onChange={e => setFormData({...formData, batch: e.target.value})}
            >
              <option className="text-black dark:text-white bg-white dark:bg-gray-800">Class XII (Starts Apr 15)</option>
              <option className="text-black dark:text-white bg-white dark:bg-gray-800">Class X (Starts May 01)</option>
              <option className="text-black dark:text-white bg-white dark:bg-gray-800">Class XI (Starts Jun 01)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 opacity-90">Subjects</label>
            <select 
              className="w-full p-4 bg-white/10 dark:bg-black/10 border border-[var(--border-color)] text-[var(--text-color)] rounded-xl text-base font-sans transition-all focus:outline-none focus:border-[var(--primary)] focus:ring-[3px] focus:ring-[var(--primary)]/10 appearance-none"
              value={formData.subs}
              onChange={e => setFormData({...formData, subs: e.target.value})}
            >
              <option className="text-black dark:text-white bg-white dark:bg-gray-800">Math + Chemistry</option>
              <option className="text-black dark:text-white bg-white dark:bg-gray-800">Math Only</option>
              <option className="text-black dark:text-white bg-white dark:bg-gray-800">Chemistry Only</option>
              <option className="text-black dark:text-white bg-white dark:bg-gray-800">All Subjects</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full p-4 rounded-2xl bg-gradient-to-br from-[#0f172a] to-black dark:from-[var(--primary)] dark:to-[var(--secondary)] text-white font-bold text-base mt-5 shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="fill-current"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.462-2.406-1.478-.886-.788-1.482-1.761-1.658-2.059-.173-.301-.018-.461.13-.611.134-.133.301-.347.451-.523.151-.174.202-.298.304-.497.101-.198.05-.371-.025-.521-.075-.148-.673-1.611-.922-2.206-.24-.579-.481-.501-.672-.51l-.573-.008c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            CONFIRM ADMISSION
          </button>

          <p className="text-xs text-center mt-4 opacity-60">Strictly No Late Admissions.</p>
        </form>
      </div>
    </div>
  );
}
