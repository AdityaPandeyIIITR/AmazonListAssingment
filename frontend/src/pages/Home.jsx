import React, { useState } from 'react';
import { optimize } from '../services/api.js';

export default function Home() {
  const [asin, setAsin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function run() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await optimize(asin.trim());
      setResult(data);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 flex-1"
          placeholder="Enter ASIN (e.g., B07H65KP63)"
          value={asin}
          onChange={e => setAsin(e.target.value)}
        />
        <button onClick={run} disabled={!asin || loading} className="bg-blue-600 text-white px-4 py-2 disabled:opacity-50">
          {loading ? 'Optimizing...' : 'Scrape & Optimize'}
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Original</h2>
            <p className="mb-2"><span className="font-medium">Title:</span> {result.original.title}</p>
            <div className="mb-2">
              <div className="font-medium">Bullets:</div>
              <ul className="list-disc ml-6">
                {result.original.bullets?.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-medium">Description:</div>
              <p className="whitespace-pre-wrap">{result.original.description}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Optimized</h2>
            <p className="mb-2"><span className="font-medium">Title:</span> {result.optimized.title}</p>
            <div className="mb-2">
              <div className="font-medium">Bullets:</div>
              <ul className="list-disc ml-6">
                {result.optimized.bullets?.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
            <div className="mb-2">
              <div className="font-medium">Description:</div>
              <p className="whitespace-pre-wrap">{result.optimized.description}</p>
            </div>
            <div>
              <div className="font-medium">Keywords:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.keywords?.map((k, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



