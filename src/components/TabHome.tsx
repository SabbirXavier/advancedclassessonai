import { GraduationCap, MapPin, CalendarCheck, ArrowRight } from 'lucide-react';

export default function TabHome({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-5">
      <header className="glass-card !p-8 flex flex-col items-center justify-center text-center relative z-10 bg-white/30 dark:bg-[#111928]/70">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="text-[var(--primary)] bg-[#4f46e5]/10 w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(79,70,229,0.2)]">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent uppercase drop-shadow-sm">
            Advanced Classes
          </h1>
        </div>

        <div className="flex gap-2.5 mb-4 flex-wrap justify-center">
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 bg-red-500/10 text-[var(--danger)] border border-red-500/20">
            <MapPin size={14} /> Sonai
          </span>
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 bg-emerald-500/10 text-[var(--success)] border border-emerald-500/20">
            <CalendarCheck size={14} /> Session 2026-27
          </span>
        </div>

        <div className="text-sm text-[var(--text-color)] font-bold tracking-widest uppercase opacity-80 mb-5 border-y border-[var(--border-color)] py-1.5 px-5 inline-block">
          Phase 2 Restart
        </div>

        <a 
          href="https://chat.whatsapp.com/DTdhZ56STusGNLu8I72Vne" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white w-full max-w-[300px] py-3.5 px-6 rounded-2xl font-bold shadow-[0_4px_15px_rgba(37,211,102,0.3)] mt-1 transition-all duration-200 border border-white/20 text-lg hover:scale-105"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="fill-current"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.462-2.406-1.478-.886-.788-1.482-1.761-1.658-2.059-.173-.301-.018-.461.13-.611.134-.133.301-.347.451-.523.151-.174.202-.298.304-.497.101-.198.05-.371-.025-.521-.075-.148-.673-1.611-.922-2.206-.24-.579-.481-.501-.672-.51l-.573-.008c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Join WhatsApp Group
        </a>
      </header>

      <div className="glass-card relative z-20 pt-8">
        <h3 className="text-center uppercase text-[var(--primary)] mb-5 font-bold tracking-wide">The Sonai Story</h3>
        <div className="border-l-2 border-[var(--border-color)] ml-2.5 pl-5">
          <div className="relative mb-6">
            <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--danger)]"></div>
            <div className="font-bold mb-1 text-[var(--danger)]">The Struggle</div>
            <p className="text-sm opacity-90">Rush to Silchar. 60-80 students. 1.5 hrs travel. Exhaustion.</p>
          </div>
          <div className="relative mb-6">
            <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--secondary)]"></div>
            <div className="font-bold mb-1 text-[var(--secondary)]">The Reality</div>
            <p className="text-sm opacity-90">Crowded classes. Unsolved doubts. Lost Confidence.</p>
          </div>
          <div className="relative mb-6">
            <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--success)]"></div>
            <div className="font-bold mb-1 text-[var(--success)]">The Solution</div>
            <p className="text-sm opacity-90"><b>Advanced Classes.</b> Small batches. Smart Boards. No Travel. <b>Result? Growth.</b></p>
          </div>
        </div>

        <div className="mt-5 text-center border-t border-dashed border-[var(--border-color)] pt-4">
          <button 
            onClick={() => onNavigate('about')}
            className="bg-transparent border-none text-[var(--primary)] font-bold cursor-pointer text-sm flex items-center justify-center gap-2 mx-auto hover:opacity-80 transition-opacity"
          >
            Read Full About Us <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-center gap-2.5 mb-1.5 text-lg">
          <MapPin className="text-[var(--danger)]" size={20} />
          <b className="tracking-wide">LOCATE US</b>
        </div>
        <p className="opacity-90 mb-4">Sonai, Cachar</p>
        <a 
          href="https://maps.app.goo.gl/4R49EfUuGHfvTQw58" 
          target="_blank" 
          rel="noreferrer"
          className="block w-full p-3 text-center border border-[var(--border-color)] rounded-xl no-underline text-[var(--text-color)] font-semibold bg-white/10 transition-all duration-200 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(79,70,229,0.2)]"
        >
          Open Google Maps
        </a>
      </div>
    </div>
  );
}
