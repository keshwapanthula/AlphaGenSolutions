# AlphaGen Solutions Frontend

React + Vite frontend for the AlphaGen Solutions website.

## Free Public URL (recommended)

You build locally on `http://localhost:5173`, then publish for a public URL using Vercel or Netlify.

### Option 1: Vercel (free)

1. Push this project to GitHub.
2. Go to Vercel and click `Add New -> Project`.
3. Import the repo and set root directory to `alphagensolutions-website/frontend`.
4. Build settings:
	- Build command: `npm run build`
	- Output directory: `dist`
5. Deploy.

You will get a URL like `https://your-project.vercel.app`.

### Option 2: Netlify (free)

1. Push this project to GitHub.
2. In Netlify, click `Add new site -> Import an existing project`.
3. Select the repo and set base directory to `alphagensolutions-website/frontend`.
4. Build settings:
	- Build command: `npm run build`
	- Publish directory: `dist`
5. Deploy.

You will get a URL like `https://your-project.netlify.app`.

### Notes

- `localhost:5173` is local-only and not public.
- This project already includes SPA routing config files for both platforms:
  - `vercel.json`
  - `netlify.toml`
  - `public/_redirects`

## API configuration

Create a local `.env` file for deployment targets when the frontend and backend are not on the same origin:

```env
VITE_API_BASE_URL=http://localhost:5000
```

If `VITE_API_BASE_URL` is not set, the app uses the current origin. In local development, the Vite proxy forwards `/api/*` requests to the backend on port 5000.

## Development

```bash
npm install
npm run dev
```
