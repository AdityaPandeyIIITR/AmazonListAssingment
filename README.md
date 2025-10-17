## Amazon Optimizer

Full-stack app to scrape an Amazon ASIN, optimize the listing with Google Gemini, and store history in MySQL.

### Stack
- Backend: Node.js + Express + Sequelize (MySQL)
- Frontend: React (Vite) + TailwindCSS
- AI: Google Gemini (`@google/generative-ai`)
- Database: MySQL

### Environment Variables
Create a `.env` in `backend/` with:

```
PORT=4000
LOG_LEVEL=info
DATABASE_URL=mysql://root:root@mysql:3306/amazon_optimizer
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-pro
```

For the frontend (optional), you can set `VITE_API_BASE_URL`, defaults to `http://localhost:4000/api` when running locally.

### Local Development
1. MySQL: create DB and run `database/schema.sql`.
2. Backend:
   - `cd backend`
   - `npm i`
   - `npm run dev`
3. Frontend:
   - `cd frontend`
   - `npm i`
   - `npm run dev`

Frontend dev server: http://localhost:5173
Backend health: http://localhost:4000/health

### Endpoints
- GET `/api/product/:asin` — scrape product details (title, bullets, description). Fallback to mock data on failure.
- POST `/api/optimize` — body: `{ asin, title, bullets, description }`. Calls Gemini and stores result.
- GET `/api/history/:asin` — list of past optimizations for an ASIN.

### Testing with Postman
- GET `http://localhost:4000/api/product/B0BXXXXXXX`
- POST `http://localhost:4000/api/optimize`
  Body (JSON):
  ```
  {"asin":"B0BXXXXXXX","title":"Sample","bullets":["a","b"],"description":"desc"}
  ```
- GET `http://localhost:4000/api/history/B0BXXXXXXX`

### Deployment
- Backend: Railway recommended for free-tier MySQL + Node.
- Frontend: Vercel is recommended for static hosting.
- Set the appropriate environment variables in your platforms.


