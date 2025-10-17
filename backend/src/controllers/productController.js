import { scrapeAmazonByAsin } from '../services/scrapeService.js';
import { optimizeWithGemini } from '../services/aiService.js';
import { ProductOptimization } from '../models/ProductOptimization.js';
import { connectDb } from '../models/index.js';

// GET /api/product/:asin
export async function getProductByAsin(req, res, next) {
  try {
    const { asin } = req.params;
    if (!asin || asin.length < 5) return res.status(400).json({ error: 'Invalid ASIN' });
    const data = await scrapeAmazonByAsin(asin);
    res.json({ asin, ...data });
  } catch (err) { next(err); }
}

// POST /api/optimize
export async function optimizeContent(req, res, next) {
  try {
    const { asin, title, bullets, description } = req.body || {};
    if (!asin || !title) return res.status(400).json({ error: 'asin and title are required' });

    const optimized = await optimizeWithGemini({ title, bullets, description });

    await connectDb();
    const record = await ProductOptimization.create({
      asin,
      original_title: title,
      optimized_title: optimized.title,
      original_bullets: JSON.stringify(bullets || []),
      optimized_bullets: JSON.stringify(optimized.bullets || []),
      original_description: description || '',
      optimized_description: optimized.description || '',
      keywords: JSON.stringify(optimized.keywords || [])
    });

    res.json({ id: record.id, asin, ...optimized });
  } catch (err) { next(err); }
}

// GET /api/history/:asin
export async function getHistory(req, res, next) {
  try {
    const { asin } = req.params;
    if (!asin) return res.status(400).json({ error: 'asin required' });
    await connectDb();
    const rows = await ProductOptimization.findAll({ where: { asin }, order: [['createdAt', 'DESC']] });
    const formatted = rows.map(r => ({
      id: r.id,
      asin: r.asin,
      original_title: r.original_title,
      optimized_title: r.optimized_title,
      original_bullets: safeParse(r.original_bullets),
      optimized_bullets: safeParse(r.optimized_bullets),
      original_description: r.original_description,
      optimized_description: r.optimized_description,
      keywords: safeParse(r.keywords),
      createdAt: r.createdAt
    }));
    res.json(formatted);
  } catch (err) { next(err); }
}

function safeParse(s) {
  try { return JSON.parse(s || '[]'); } catch { return []; }
}



