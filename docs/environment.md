# Environment setup

## Quick start

```bash
# Root
pnpm install

# API
cp apps/api/.env.example apps/api/.env
# edit apps/api/.env

# Web
cp apps/web/.env.example apps/web/.env

pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:3001`

PostgreSQL must be running and match `POSTGRES_*` / `POSTGRES_URL` in the API env.

---

## Web (`apps/web/.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Nest API base URL (e.g. `http://localhost:3001`) |

---

## API (`apps/api/.env`)

### Server

| Variable | Purpose |
|----------|---------|
| `PORT` | API listen port (default `3001`) |
| `FRONTEND_URL` | Storefront origin — CORS, Stripe redirects, Slack admin links |
| `CORS_ORIGINS` | Optional extra allowed origins (comma-separated) |
| `TYPEORM_SYNC` | `true` once on a fresh DB to create tables; then `false` |

### PostgreSQL

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Preferred on Railway / hosted Postgres (SSL on) |
| `POSTGRES_HOST` | Local DB host (used when `DATABASE_URL` is empty) |
| `POSTGRES_PORT` | Local DB port |
| `POSTGRES_USER` | Local DB user |
| `POSTGRES_PASSWORD` | Local DB password |
| `POSTGRES_DATABASE` | Local database name |
| `POSTGRES_URL` | Optional local URL helper |

### Auth

| Variable | Purpose |
|----------|---------|
| `BCRYPT_SALT_ROUNDS` | Password hash cost |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `ACCESS_TOKEN_EXPIRY` | Access token TTL (e.g. `1d`) |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `REFRESH_TOKEN_EXPIRY` | Refresh token TTL (e.g. `7d`) |

### Cloudinary

| Variable | Purpose |
|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloud name |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret |
| `CLOUDINARY_UPLOAD_URL` | Upload endpoint URL |

### Stripe

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Server secret key |
| `STRIPE_PUBLISHABLE_KEY` | Publishable key (if needed by tooling) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |

**Local webhooks:**

```bash
stripe listen --forward-to http://localhost:3001/webhook
```

Copy the `whsec_…` value from the CLI into `STRIPE_WEBHOOK_SECRET`.

### Slack

| Variable | Purpose |
|----------|---------|
| `SLACK_WEBHOOK_URL` | Incoming webhook URL (required for notifications) |

Optional (unused by the current webhook-based sender):

| Variable | Purpose |
|----------|---------|
| `SLACK_OAUTH_TOKEN` | Bot/user OAuth token |
| `SLACK_API_URL` | Slack Web API endpoint |
| `SLACK_CHANNEL` | Channel name/id |

If `SLACK_WEBHOOK_URL` is empty, Slack sends are skipped with a warning.

---

## Deploy (Railway + Vercel)

Set live URLs in platform env (not committed):

| Platform | Key vars |
|----------|----------|
| **Railway (API)** | `DATABASE_URL`, `FRONTEND_URL` (Vercel URL), JWT/Cloudinary/Stripe/Slack secrets. First boot: `TYPEORM_SYNC=true`, then turn off. Stripe webhook → `https://<api>/webhook`. |
| **Vercel (Web)** | Root/dir `apps/web` (or monorepo install). `VITE_API_URL=https://<railway-api>`. SPA rewrites via `apps/web/vercel.json`. |

Root [`railway.toml`](../railway.toml) builds contracts + API and starts `start:prod`.

## Secrets

- Never commit real `.env` files.
- Use `.env.example` placeholders only in git.
