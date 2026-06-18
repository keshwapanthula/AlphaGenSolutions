# AlphaGen Backend Deployment Runbook

This runbook covers secure deployment and maintenance for:
- Frontend: Vercel or Netlify
- Backend API: Render/Railway/Fly/VM
- Database: MongoDB Atlas

## 1) Required Environment Variables

Set these on the backend host (never in frontend):

- PORT=5000
- NODE_ENV=production
- FRONTEND_URLS=https://your-frontend.vercel.app,https://your-custom-domain.com
- MONGODB_URI=<atlas-connection-string>
- EMAIL_SERVICE=gmail
- EMAIL_USER=<mailbox>
- EMAIL_PASS=<app-password>
- EMAIL_FROM=noreply@yourdomain.com
- EMAIL_TO=info@yourdomain.com
- RATE_LIMIT_WINDOW_MS=900000
- RATE_LIMIT_MAX_REQUESTS=5

Production-ready examples are available in:

- `backend/.env.production.example`
- `frontend/.env.production.example`

## 2) MongoDB Atlas Checklist

1. Create cluster (M0 free tier is enough to start).
2. Create a dedicated DB user with least privilege.
3. Restrict network access to backend egress IP(s) when possible.
4. Enable backups/snapshots.
5. Store credentials only in platform env variables.

## 3) Deployment Validation

After deploy, verify these routes:

- GET /api/health
- GET /api/readiness
- GET /api/status

Expected behavior:
- /api/health => 200 and service state details.
- /api/readiness => 200 when DB or email is available, 503 if both unavailable.
- /api/status => 200 with runtime and memory metrics.

## 4) Frontend-to-Backend Connection

1. Set frontend VITE_API_BASE_URL to deployed backend URL.
2. Redeploy frontend.
3. Confirm contact form submission in browser and backend logs.

## 5) Security Baseline

1. Keep CORS limited to actual frontend domains in FRONTEND_URLS.
2. Keep rate limiting enabled on /api/contact.
3. Never expose secrets in frontend source or VITE_ variables.
4. Use app passwords and MFA for email account.
5. Rotate EMAIL_PASS and DB user password every 60-90 days.

## 6) Maintenance Cadence

Daily:
- Check backend logs for repeated 4xx/5xx spikes.
- Check /api/readiness and /api/status.

Weekly:
- Review contact failures and response times.
- Check Atlas cluster alerts and storage growth.

Monthly:
- Run dependency updates and security audit.
- Test backup restore workflow.
- Review CORS domain list and remove unused entries.

## 7) Incident Quick Response

If contact submissions fail:
1. Check /api/readiness first.
2. If DB disconnected, verify Atlas availability/network rules.
3. If email missing config, verify EMAIL_USER/EMAIL_PASS.
4. Temporarily keep service live with safe mode while fixing integrations.
5. Redeploy after fix and confirm readiness is 200.
