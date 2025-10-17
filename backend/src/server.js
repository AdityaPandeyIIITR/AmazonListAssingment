import app from './app.js';
import { logger } from './utils/logger.js';
import { connectDb } from './models/index.js';

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      logger.info({ port: PORT }, 'Backend server listening');
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();


