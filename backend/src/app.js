import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Amazon Listing Optimizer API' });
});

app.use('/api', productRoutes);

app.use(errorHandler);

export default app;



