import React, { useState } from 'react'
import api from '../services/api.js'

export default function Home() {
  const [asin, setAsin] = useState('')
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')

  const fetchProduct = async () => {
    setLoading(true); setError('')
    try {
      const res = await api.get(`/product/${asin}`)
      setProduct(res.data)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to fetch product')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={asin} onChange={e=>setAsin(e.target.value)} placeholder="Enter ASIN"
               className="border rounded px-3 py-2 w-80" />
        <button onClick={fetchProduct} disabled={!asin||loading}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">Fetch</button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && <div>Loading…</div>}
      {product && (
        <div className="bg-white rounded border p-4">
          <div className="font-semibold mb-2">{product.title}</div>
          <ul className="list-disc pl-6 mb-2">
            {(product.bullets||[]).map((b,i)=>(<li key={i}>{b}</li>))}
          </ul>
          <p className="text-sm text-gray-700">{product.description}</p>
        </div>
      )}
    </div>
  )
}



