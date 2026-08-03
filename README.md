# Teksage Admin

Internal admin dashboard for **Teksage** (AstroPrompt Admin): users, subscriptions, payments, astrologers, content, and operational tools.

Stack: **React 18 + TypeScript + Vite + MUI + Redux Toolkit**.  
Backend: FastAPI ([Teksage-backend-latest](../Teksage-backend-latest)).

---

## Prerequisites

- Node.js **20+** recommended (Docker image uses Node 20)
- npm
- Teksage backend running (default **http://localhost:8000**)

---

## Quick start

```bash
cd Teksage-admin
npm install
npm run dev
```

Open **http://localhost:5173** (Vite default).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local Vite server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

---

## API base URL

The Axios client base URL is set in [`src/api/axiosInstance.ts`](src/api/axiosInstance.ts):

```ts
const API_BASE_URL = "http://localhost:8000";
```

For a remote backend, change that constant (or introduce a `VITE_*` env and read `import.meta.env` — currently only `VITE_GOOGLE_API_KEY` is referenced for Places).

Ensure the backend CORS / network allows the admin origin (`http://localhost:5173`).

---

## Environment

There is no committed `.env.example`. Optional:

```env
VITE_GOOGLE_API_KEY=your-google-places-key
```

Most configuration is the API base URL above plus admin credentials from your team.

---

## Project structure

```
src/
  main.tsx              # Entry
  App.tsx / Routes.tsx  # React Router
  api/                  # axiosInstance, CRUD helpers
  components/
    Auth/               # Login
    Dashboard/          # Feature screens
    Elements/           # Shared UI pieces
    Profile/
  layouts/dashboard/    # Shell / nav
  redux/                # Store & slices
  Hooks/, utils/, theme/, styles/, assets/
```

---

## Development notes

- Login uses the same backend auth as other Teksage products; you need an **admin** (or allowed) user.
- After changing models or admin APIs on the backend, restart / refresh and check network calls in DevTools.
- Docker: see `Dockerfile` + `docker-compose.yml` (serves built assets on port **80** via nginx).

```bash
docker compose up --build
```

---

## Troubleshooting

| Issue | Check |
|-------|--------|
| Network / CORS errors | Backend running? `API_BASE_URL` correct? |
| 401 after login | Token refresh path in `axiosInstance.ts`; backend JWT secrets |
| Blank page after build | Run `npm run build` and inspect TypeScript errors |

---

## License

Proprietary — Teksage / Venzo. All rights reserved.
