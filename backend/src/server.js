import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Backend listening on port ${PORT}`);
  console.log("✈️ use http://localhost:4000 to access the backend");
});



