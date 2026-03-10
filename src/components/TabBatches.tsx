import React, { useState, useEffect } from 'react';

export default function TabBatches() {
  const [batches, setBatches] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, fRes] = await Promise.all([
          fetch('/api/batches'),
          fetch('/api/fees')
        ]);
        setBatches(await bRes.json());
        setFees(await fRes.json());
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
        <h2 className="text-2xl font-bold">Batch Roadmap</h2>
      </div>

      <div className="grid gap-4">
        {batches.map(batch => (
          <div key={batch.id} className="glass-card !border-l-4 !p-5" style={{ borderLeftColor: batch.color }}>
            <div className="flex justify-between items-center mb-1">
              <b className="tracking-wide" style={{ color: batch.color }}>{batch.name}</b>
              <span className="text-white text-[0.7rem] px-2 py-1 rounded-md font-bold" style={{ backgroundColor: batch.tagColor }}>{batch.tag}</span>
            </div>
            <div className="text-3xl font-extrabold mb-2" style={{ color: batch.color }}>{batch.date}</div>
            <p className="opacity-90">{batch.description}</p>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <div className="text-lg font-bold mb-4 text-[var(--primary)]">Fee Structure</div>
        {fees.map((fee, idx) => (
          <div key={fee.id} className={`flex justify-between py-2.5 ${idx !== fees.length - 1 ? 'border-b border-dashed border-[var(--border-color)]' : ''}`}>
            <span className="opacity-90">{fee.subject}</span>
            <b className="font-bold">{fee.amount}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
