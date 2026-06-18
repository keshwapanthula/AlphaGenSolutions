# Free Deployment Stack (MongoDB Atlas + Render + Vercel)

This guide gives you a free public website URL and keeps sensitive data out of the frontend.

## Architecture

1. Frontend (React/Vite) on Vercel free tier
2. Backend (Node/Express) on Render free tier
3. Database on MongoDB Atlas M0 free tier

## 1) Create MongoDB Atlas (free)

1. Create a free M0 cluster.
2. Create a DB user (save username/password).
3. In Network Access, allow your backend host (or temporarily `0.0.0.0/0` while setting up).
4. Copy the SRV connection string and set database name to `alphagen`.

## 2) Deploy Backend on Render

Service settings:

1. Root directory: `alphagensolutions-website/backend`
2. Build command: `npm install`
3. Start command: `npm start`

Environment variables (copy from backend `.env.production.example`):

1. `PORT=5000`
2. `NODE_ENV=production`
3. `FRONTEND_URLS=https://<your-vercel-domain>.vercel.app`
4. `MONGODB_URI=<your-atlas-uri>`
5. `EMAIL_SERVICE=gmail`
6. `EMAIL_USER=<your-email>`
7. `EMAIL_PASS=<gmail-app-password>`
8. `EMAIL_FROM=<from-email>`
9. `EMAIL_TO=<to-email>`
10. `RATE_LIMIT_WINDOW_MS=900000`
11. `RATE_LIMIT_MAX_REQUESTS=5`

After deploy, verify:

1. `https://<your-backend>/api/health`
2. `https://<your-backend>/api/readiness`
3. `https://<your-backend>/api/status`

## 3) Deploy Frontend on Vercel

Project settings:

1. Root directory: `alphagensolutions-website/frontend`
2. Build command: `npm run build`
3. Output directory: `dist`

Environment variable (from frontend `.env.production.example`):

1. `VITE_API_BASE_URL=https://<your-backend-domain>`

Deploy and open your public URL:

1. `https://<your-project>.vercel.app`

## 4) Final CORS hardening

After frontend domain is final:

1. Update backend `FRONTEND_URLS` to include only real frontend domains.
2. Redeploy backend.

## 5) Ongoing maintenance

1. Monitor `/api/readiness` and `/api/status`.
2. Rotate email and DB credentials every 60-90 days.
3. Keep dependencies updated.
