# DevWrapped

A GitHub-only "Spotify Wrapped"-style stat-card generator for developers.

## Stack
- **Frontend**: React (Vite) + framer-motion (slide animations) + html2canvas (share-as-image)
- **Backend**: Express
- **Database**: MongoDB (search/email logging only — everything else is fetched live)

## What's in here

```
devwrapped/
  server/    Express API — GitHub data endpoints
  client/    React app — GitHub username input -> GitHub wrapped slide deck -> share
```

### Backend routes
- `GET /api/github/user/:username` — profile (bio, followers, account age, etc.)
- `GET /api/github/user/:username/repos` — total stars/forks, top languages, top repo
- `GET /api/github/user/:username/calendar?year=YYYY` — scrapes the public contribution
  graph (no token needed) and computes total contributions, longest/current streak,
  best day, and favorite weekday.
- `POST /api/log/search`, `POST /api/log/email` — stores wrapped searches and email capture
  in a single `SearchLog` Mongo collection.

### Frontend flow
`Landing` → `Loading` → `GithubWrapped` slide deck → summary slide with email capture and a
"share as image" button.

## Running it locally

**1. Backend**
```bash
cd server
cp .env.example .env      # fill in MONGO_URI if you want search/email logging
npm install
npm run dev                # http://localhost:5000
```
Without `MONGO_URI` set, the server still runs fine — search/email logging just no-ops.

**2. Frontend**
```bash
cd client
cp .env.example .env       # defaults are fine for local dev (uses the Vite proxy)
npm install
npm run dev                 # http://localhost:5173
```

Open `http://localhost:5173`, enter a GitHub username, and generate your wrapped card.

## Notes / things to tune before shipping

- **GitHub rate limits**: unauthenticated REST calls are capped at 60/hr per IP. Set
  `GITHUB_TOKEN` in `server/.env` (a plain fine-grained PAT with no special scopes works)
  to raise that to 5,000/hr.
- **GitHub logo for the share image**: `ShareButton.jsx` looks for `/github-wrapped.png`
  in `client/public/` when generating a GitHub share card — drop one in if you want a
  logo on the exported image (it's optional; it just skips drawing it if missing).
- **Email sending**: the original repo sent the wrapped-summary email via a Firebase
  Firestore-triggered Cloud Function. That's removed — emails are now just saved to
  Mongo (`SearchLog.email`) for your own follow-up/outreach, nothing gets auto-sent.
  Wire up Nodemailer/Resend/etc. in `server/routes/log.js` if you want that back.
- **Deploying separately** (e.g. frontend on Vercel, backend on Render/Railway): set
  `VITE_API_URL` on the client to the backend's public URL, and `CLIENT_ORIGIN` on the
  server to the frontend's public URL (for CORS).
