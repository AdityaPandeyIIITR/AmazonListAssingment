import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
});

export async function scrape(asin) {
  const { data } = await api.post(`/api/products/${encodeURIComponent(asin)}/scrape`);
  return data;
}

export async function optimize(asin) {
  const { data } = await api.post(`/api/products/${encodeURIComponent(asin)}/optimize`);
  return data;
}

export async function history(asin, params = {}) {
  const { data } = await api.get(`/api/products/${encodeURIComponent(asin)}/history`, { params });
  return data;
}



