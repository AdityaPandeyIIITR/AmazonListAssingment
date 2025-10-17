import { Router } from 'express';
import productRoutes from './productRoutes.js';

const router = Router();

router.use('/', productRoutes);

export default router;


