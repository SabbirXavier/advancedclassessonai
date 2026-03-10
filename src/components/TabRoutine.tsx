import React, { useState, useEffect } from 'react';

export default function TabRoutine() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/routines');
        setRoutines(await res.json());
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-10 opacity-50 font-bold">Loading...</div>;

  return (
    <div className="space-y-5">
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Master Routine</h2>
      </div>

      <div className="glass-card overflow-x-auto !p-3">
        <table className="w-full min-w-[500px] border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2.5 text-xs text-[var(--primary)] border-b-2 border-[var(--border-color)]">TIME</th>
              <th className="text-left p-2.5 text-xs text-[var(--primary)] border-b-2 border-[var(--border-color)]">MON</th>
              <th className="text-left p-2.5 text-xs text-[var(--primary)] border-b-2 border-[var(--border-color)]">TUE</th>
              <th className="text-left p-2.5 text-xs text-[var(--primary)] border-b-2 border-[var(--border-color)]">WED</th>
              <th className="text-left p-2.5 text-xs text-[var(--primary)] border-b-2 border-[var(--border-color)]">THU</th>
              <th className="text-left p-2.5 text-xs text-[var(--primary)] border-b-2 border-[var(--border-color)]">FRI</th>
              <th className="text-left p-2.5 text-xs text-[var(--primary)] border-b-2 border-[var(--border-color)]">SAT</th>
              <th className="text-left p-2.5 text-xs text-[var(--primary)] border-b-2 border-[var(--border-color)]">SUN</th>
            </tr>
          </thead>
          <tbody>
            {routines.map(routine => (
              <tr key={routine.id}>
                <td className="p-2.5 border-b border-[var(--border-color)] text-sm">{routine.time}</td>
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                  const val = routine[day];
                  const isMath = val?.includes('Math');
                  const isChem = val?.includes('Chem');
                  let className = "p-2.5 border-b border-[var(--border-color)] text-sm ";
                  if (isMath) className += "text-[var(--primary)] font-semibold bg-[#4f46e5]/5 border-l-[3px] border-l-[var(--primary)]";
                  else if (isChem) className += "text-[var(--accent)] font-semibold bg-[#f59e0b]/5 border-l-[3px] border-l-[var(--accent)]";
                  else className += "opacity-50";
                  
                  return <td key={day} className={className}>{val}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card">
        <p className="mb-2 opacity-90">🔴 <b className="font-bold">Sunday:</b> 9AM - 2PM Weekly Exams.</p>
        <p className="opacity-90">🔵 <b className="font-bold">Math:</b> 2.5 Hour Sessions.</p>
      </div>
    </div>
  );
}
