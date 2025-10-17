import React, { useState } from 'react'
import api from '../services/api.js'

export default function History() {
  const [asin, setAsin] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const res = await api.get(`/history/${asin}`)
      setItems(res.data)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load history')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={asin} onChange={e=>setAsin(e.target.value)} placeholder="Enter ASIN"
               className="border rounded px-3 py-2 w-80" />
        <button onClick={load} disabled={!asin||loading}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">Load</button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && <div>Loading…</div>}
      <div className="grid gap-3">
        {items.map(it => (
          <div key={it.id} className="bg-white border rounded p-4">
            <div className="text-sm text-gray-600">{new Date(it.createdAt).toLocaleString()}</div>
            <div className="font-semibold">{it.optimized_title}</div>
            <div className="text-sm">Keywords: {(it.keywords||[]).join(', ')}</div>
          </div>
        ))}
        {items.length===0 && <div className="text-sm text-gray-500">No history yet</div>}
      </div>
    </div>
  )
}



