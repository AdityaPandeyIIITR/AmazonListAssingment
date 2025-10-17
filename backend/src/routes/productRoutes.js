import { Router } from 'express';
import { getProductByAsin, optimizeContent, getHistory } from '../controllers/productController.js';

const router = Router();

// GET /api/product/:asin - scrape product details
router.get('/product/:asin', getProductByAsin);

// POST /api/optimize - optimize listing with Gemini
router.post('/optimize', optimizeContent);

// GET /api/history/:asin - fetch past optimizations
router.get('/history/:asin', getHistory);

export default router;


