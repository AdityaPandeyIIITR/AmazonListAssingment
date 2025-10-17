# Amazon Listing Optimizer – Gemini 2.0 Flash (Prisma + Simple Frontend)

This app scrapes Amazon listing content by ASIN, optimizes it using Google's Gemini 2.0 Flash, shows original vs optimized content side-by-side, and stores optimization history in MySQL via Prisma.

## Tech stack
- Backend: Node.js (Express), Prisma (MySQL), Axios, Cheerio, Zod, Helmet, CORS, express-rate-limit, Winston
- AI: @google/generative-ai (model: gemini-2.0-flash)
- Frontend: React + Vite + Tailwind + React Router, Axios (no React Query)

## Monorepo structure
- backend/
  - src/app.js, src/server.js
  - src/routes/productRoutes.js
  - src/controllers/productController.js
  - src/services/scrapeService.js, src/services/aiService.js
  - src/middleware/errorHandler.js
  - src/utils/logger.js
  - prisma/schema.prisma
- frontend/
  - index.html
  - src/main.jsx, src/index.css
  - src/pages/Home.jsx, src/pages/Compare.jsx, src/pages/History.jsx
  - src/services/api.js

## Environment variables
Create two env files:
- Backend: create backend/.env
- Frontend: create frontend/.env

Backend .env:
```
PORT=4000
NODE_ENV=development
# Prisma connection string format:
# mysql://USER:PASSWORD@HOST:PORT/DB_NAME
DATABASE_URL="mysql://root:password@localhost:3306/amazon_optimizer"

# AI
GEMINI_API_KEY="your-gemini-api-key"

# Scraping
SCRAPE_USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
ENABLE_MOCK_SCRAPE=false
```

Frontend .env:
```
VITE_API_BASE_URL=http://localhost:4000
```

## Local setup
1) Requirements
- Node 18+
- MySQL 8+ (local instance)
- Google Gemini API key

2) Install dependencies
```
# from repo root
cd backend && npm i && cd ..
cd frontend && npm i && cd ..
```

3) Initialize database with Prisma
```
cd backend
npx prisma generate
npx prisma migrate dev --name init
# optional: npx prisma studio
```

4) Run the apps
```
# backend (http://localhost:4000)
cd backend
npm run dev

# frontend (http://localhost:5173)
cd frontend
npm run dev
```

## API endpoints
- POST /api/products/:asin/scrape → { asin, title, bullets[], description }
- POST /api/products/:asin/optimize → { asin, runId, original, optimized, keywords }
- GET /api/products/:asin/history?limit=&offset= → { asin, history: [{ id, createdAt, original, optimized, keywords }] }
- GET /health → { status: 'ok' }

## Prompt (skeleton)
```
You are an Amazon listing optimizer. Improve for readability, compliance, and SEO.
Respond ONLY with JSON keys: optimizedTitle, optimizedBullets, optimizedDescription, keywords.
Inputs: title, bullets, description. Avoid claims/superlatives. Bullets <= 200 chars.
```

## Notes
- If scraping is blocked during dev, set ENABLE_MOCK_SCRAPE=true in backend/.env.
- Ensure your Gemini key has access to gemini-2.0-flash.

