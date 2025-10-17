import React, { useState } from 'react';
import { history } from '../services/api.js';

export default function HistoryPage() {
  const [asin, setAsin] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await history(asin.trim());
      setItems(res.history || []);
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
      <div className="space-y-3">
        {items.map(run => (
          <div key={run.id} className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-600 mb-2">{new Date(run.createdAt).toLocaleString()}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <pre className="bg-gray-50 p-3 rounded overflow-auto text-xs">{JSON.stringify(run.original, null, 2)}</pre>
              <pre className="bg-gray-50 p-3 rounded overflow-auto text-xs">{JSON.stringify(run.optimized, null, 2)}</pre>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {run.keywords?.map((k, i) => <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{k}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



