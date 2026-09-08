# AlphaGen Solutions

AlphaGen Solutions is a full-stack company website and portal suite for technology consulting, IT staffing, training programs, and timesheet workflows.

The project includes a public marketing frontend, a Node/Express backend API, an employee portal, and a supervisor portal. It also includes starter AI chatbot/agent support for website visitors, employees, and supervisors.

## Applications

| App | Path | Purpose | Local URL |
| --- | --- | --- | --- |
| Marketing frontend | `frontend` | Public website, services, jobs, trainings, contact form, AI chatbot | `http://localhost:5173` |
| Backend API | `backend` | REST API for auth, contact, users, timesheets, AI agents | `http://localhost:5000` |
| Employee portal | `employee-portal` | Employee login and timesheet submission | `http://localhost:5174` |
| Supervisor portal | `supervisor-portal` | Supervisor login and timesheet review | `http://localhost:5175` |

## Tech Stack

- React + Vite frontends
- Node.js + Express backend
- TypeScript backend source
- MongoDB / MongoDB Atlas
- Docker Compose for local development
- Azure Functions-compatible backend entrypoint
- GitHub Actions deployment workflows

## AI Features

The backend exposes a lightweight AI agent API:

- `GET /api/ai/agents`
- `POST /api/ai/chat`

Included agents:

- AlphaGen Site Concierge
- Employee Portal Copilot
- Supervisor Review Agent

By default, agents use local rules-based replies so the app works without API keys. A real OpenAI-compatible or Azure OpenAI endpoint can be configured later with backend environment variables.

## Local Development

### Prerequisites

- Node.js 20.19+ or 22+
- npm
- Docker Desktop, optional but recommended
- MongoDB local or MongoDB Atlas

### Run Everything With Docker

```powershell
cd alphagensolutions-website
docker compose --profile portals up
```

Open:

- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
- `http://localhost:5000/api/health`

### Run Apps Manually

Backend:

```powershell
cd backend
npm install
npm run dev
```

Marketing frontend:

```powershell
cd frontend
npm install
npm run dev
```

Employee portal:

```powershell
cd employee-portal
npm install
npm run dev -- --port 5174
```

Supervisor portal:

```powershell
cd supervisor-portal
npm install
npm run dev -- --port 5175
```

## Environment Variables

Backend local config starts from `backend/.env.example`.

Important backend values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:5173,http://localhost:5174,http://localhost:5175
MONGODB_URI=mongodb://localhost:27017/alphagen
JWT_SECRET=replace_with_a_long_random_secret_min_32_chars
JWT_REFRESH_SECRET=replace_with_a_different_long_random_secret
AI_PROVIDER=local-rules
AI_MODEL=
AI_ENDPOINT=
AI_API_KEY=
```

Frontend apps use:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Do not put API keys or model secrets in frontend `.env` files.

## Validation

Backend:

```powershell
cd backend
npm run build
npm test
```

Marketing frontend:

```powershell
cd frontend
npm run build
npm test
```

Employee portal:

```powershell
cd employee-portal
npm run build
```

Supervisor portal:

```powershell
cd supervisor-portal
npm run build
```

## Deployment Notes

The repository includes deployment notes and checklist files:

- `DEPLOY_FREE_STACK.md`
- `PUBLISH_CHECKLIST.md`
- `backend/DEPLOYMENT_RUNBOOK.md`

Recommended free stack:

- MongoDB Atlas M0 for database
- Render or Azure for backend hosting
- Vercel or Azure Static Web Apps for frontend hosting

## Security Notes

- Keep backend secrets in server-side environment variables only.
- Do not commit local `.env` files.
- `main` is protected from force pushes and deletion.
- Configure production CORS with only real frontend domains.
