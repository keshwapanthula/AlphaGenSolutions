# AlphaGen Solutions Publish Checklist

Use this checklist to take the app from local to public.

## Goal

- Frontend public URL on Vercel (free)
- Backend public API on Render (free)
- Database on MongoDB Atlas M0 (free)

## 1. Preflight (local)

1. Confirm frontend build works:
   - `cd frontend`
   - `npm run build`
2. Confirm backend starts:
   - `cd ../backend`
   - `npm start`
3. Ensure code is in GitHub repository:
   - https://github.com/keshwapanthula/AlphaGenSolutions

## 2. MongoDB Atlas (free)

1. Create Atlas account and M0 cluster.
2. Create database user.
3. Add network access rule:
   - During setup: `0.0.0.0/0` (temporary)
   - After backend deploy: restrict to backend egress IP if available.
4. Copy connection string (SRV) and set DB name to `alphagen`.

## 3. Deploy Backend on Render

Service settings:

1. New Web Service from GitHub repo.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Runtime: Node

Set environment variables (Render dashboard):

- `PORT=5000`
- `NODE_ENV=production`
- `FRONTEND_URLS=https://<your-vercel-domain>.vercel.app`
- `MONGODB_URI=mongodb+srv://<dbUser>:<dbPassword>@<cluster-host>/alphagen?retryWrites=true&w=majority`
- `EMAIL_SERVICE=gmail`
- `EMAIL_USER=<your-email>`
- `EMAIL_PASS=<gmail-app-password>`
- `EMAIL_FROM=noreply@alphagensolutions.com`
- `EMAIL_TO=info@alphagensolutions.com`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX_REQUESTS=5`

After deploy, verify:

- `https://<your-backend-domain>/api/health`
- `https://<your-backend-domain>/api/readiness`
- `https://<your-backend-domain>/api/status`

Expected:

- health returns 200
- status returns 200
- readiness returns 200 when DB or email path is available

## 4. Deploy Frontend on Vercel

Project settings:

1. Import GitHub repository.
2. Root directory: `frontend`
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`

Set environment variable:

- `VITE_API_BASE_URL=https://<your-backend-domain>`

Deploy and copy your Vercel URL.

## 5. Final CORS hardening (important)

1. Update backend `FRONTEND_URLS` to include only real frontend domains:
   - `https://<your-vercel-domain>.vercel.app`
   - Optional custom domain
2. Redeploy backend.

## 6. End-to-end test

1. Open frontend public URL.
2. Submit contact form.
3. Confirm backend logs show request.
4. Confirm contact saved (if DB connected) and/or email delivered.

## 7. Post-launch maintenance

Daily:

- Check `/api/readiness`
- Check `/api/status`
- Review backend logs for repeated failures

Weekly:

- Review DB usage/alerts in Atlas
- Check contact flow success rate

Monthly:

- Rotate DB and email credentials
- Update dependencies
- Retest contact form

## 8. Common fixes

- CORS error:
  - Ensure `FRONTEND_URLS` exactly matches Vercel domain
- Contact not saving:
  - Verify `MONGODB_URI` and Atlas network access
- Email not sending:
  - Verify `EMAIL_USER`, `EMAIL_PASS`, and Gmail app password
- Frontend cannot reach API:
  - Verify `VITE_API_BASE_URL` points to backend domain

## 9. Quick handoff values to share

When you are ready, share these and final env values can be generated for you:

1. Vercel frontend URL
2. Render backend URL
3. MongoDB Atlas cluster host
