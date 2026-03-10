import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Layers, Calendar, Download, UserPlus, Moon, Sun, Settings } from 'lucide-react';
import TabHome from './components/TabHome';
import TabAbout from './components/TabAbout';
import TabBatches from './components/TabBatches';
import TabRoutine from './components/TabRoutine';
import TabDownloads from './components/TabDownloads';
import TabJoin from './components/TabJoin';
import TabAdmin from './components/TabAdmin';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <TabHome onNavigate={setActiveTab} />;
      case 'about': return <TabAbout onNavigate={setActiveTab} />;
      case 'batches': return <TabBatches />;
      case 'routine': return <TabRoutine />;
      case 'downloads': return <TabDownloads />;
      case 'join': return <TabJoin />;
      case 'admin': return <TabAdmin />;
      default: return <TabHome onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5 pt-2">
      {/* Theme Toggle & Admin */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full glass-card !mb-0 !p-3 flex items-center justify-center text-[var(--text-color)] hover:text-[var(--primary)] transition-colors shadow-md"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button 
          onClick={() => setActiveTab('admin')}
          className="p-3 rounded-full glass-card !mb-0 !p-3 flex items-center justify-center text-[var(--text-color)] hover:text-[var(--primary)] transition-colors shadow-md"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Main Content */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-[#1e1e1e]/80 backdrop-blur-xl w-[90%] max-w-[400px] rounded-2xl flex justify-between p-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-[1000] border border-white/10">
        <NavItem icon={<Home />} label="Home" isActive={activeTab === 'home' || activeTab === 'about'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<Layers />} label="Batches" isActive={activeTab === 'batches'} onClick={() => setActiveTab('batches')} />
        <NavItem icon={<Calendar />} label="Routine" isActive={activeTab === 'routine'} onClick={() => setActiveTab('routine')} />
        <NavItem icon={<Download />} label="PDFs" isActive={activeTab === 'downloads'} onClick={() => setActiveTab('downloads')} />
        <NavItem icon={<UserPlus />} label="Join" isActive={activeTab === 'join'} onClick={() => setActiveTab('join')} />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'opacity-100 text-white dark:text-[var(--primary)] -translate-y-1 bg-white/20 dark:bg-[#4f46e5]/10' : 'opacity-50 text-white dark:text-[var(--text-color)] hover:opacity-100 hover:bg-white/10 dark:hover:bg-[#4f46e5]/10 hover:-translate-y-0.5'}`}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'hover:scale-110'}`}>
        {icon}
      </div>
      <span className="text-[0.7rem] font-medium">{label}</span>
    </div>
  );
}
