import { Router } from 'express';
import { scrapeProduct, optimizeProduct, getHistory } from '../controllers/productController.js';

const router = Router();

router.post('/products/:asin/scrape', scrapeProduct);
router.post('/products/:asin/optimize', optimizeProduct);
router.get('/products/:asin/history', getHistory);

export default router;



