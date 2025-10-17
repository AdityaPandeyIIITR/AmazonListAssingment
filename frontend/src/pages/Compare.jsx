import React, { useState } from 'react'
import api from '../services/api.js'

export default function Compare() {
  const [asin, setAsin] = useState('')
  const [original, setOriginal] = useState(null)
  const [optimized, setOptimized] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFetch = async () => {
    setLoading(true); setError('')
    try {
      const res = await api.get(`/product/${asin}`)
      setOriginal(res.data)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to fetch product')
    } finally { setLoading(false) }
  }

  const handleOptimize = async () => {
    if (!original) return
    setLoading(true); setError('')
    try {
      const res = await api.post(`/optimize`, {
        asin,
        title: original.title,
        bullets: original.bullets,
        description: original.description
      })
      setOptimized(res.data)
    } catch (e) {
      setError(e?.response?.data?.error || 'Optimization failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={asin} onChange={e=>setAsin(e.target.value)} placeholder="Enter ASIN"
               className="border rounded px-3 py-2 w-80" />
        <button onClick={handleFetch} disabled={!asin||loading}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">Fetch</button>
        <button onClick={handleOptimize} disabled={!original||loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Optimize</button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && <div>Working…</div>}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded border p-4">
          <div className="font-semibold mb-2">Original</div>
          {original ? (
            <div>
              <div className="mb-2">{original.title}</div>
              <ul className="list-disc pl-6 mb-2">
                {(original.bullets||[]).map((b,i)=>(<li key={i}>{b}</li>))}
              </ul>
              <p className="text-sm text-gray-700">{original.description}</p>
            </div>
          ) : <div className="text-sm text-gray-500">No data</div>}
        </div>
        <div className="bg-white rounded border p-4">
          <div className="font-semibold mb-2">Optimized</div>
          {optimized ? (
            <div>
              <div className="mb-2">{optimized.title}</div>
              <ul className="list-disc pl-6 mb-2">
                {(optimized.bullets||[]).map((b,i)=>(<li key={i}>{b}</li>))}
              </ul>
              <p className="text-sm text-gray-700 mb-2">{optimized.description}</p>
              <div className="text-sm"><span className="font-medium">Keywords:</span> {(optimized.keywords||[]).join(', ')}</div>
            </div>
          ) : <div className="text-sm text-gray-500">Run optimization to see results</div>}
        </div>
      </div>
    </div>
  )
}



