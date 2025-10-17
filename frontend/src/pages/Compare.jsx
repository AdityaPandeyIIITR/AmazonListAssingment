import React, { useState } from 'react';
import { optimize } from '../services/api.js';

export default function Compare() {
  const [asin, setAsin] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await optimize(asin.trim());
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input className="border px-3 py-2 flex-1" placeholder="ASIN" value={asin} onChange={e => setAsin(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2" onClick={load} disabled={!asin || loading}>{loading ? 'Loading...' : 'Load'}</button>
      </div>
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <pre className="bg-white p-4 rounded shadow overflow-auto text-sm">{JSON.stringify(data.original, null, 2)}</pre>
          <pre className="bg-white p-4 rounded shadow overflow-auto text-sm">{JSON.stringify({ title: data.optimized.title, bullets: data.optimized.bullets, description: data.optimized.description, keywords: data.keywords }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}



