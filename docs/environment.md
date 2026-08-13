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
| `FRONTEND_URL` | Storefront origin (Stripe redirects, Slack admin links) |

### PostgreSQL

| Variable | Purpose |
|----------|---------|
| `POSTGRES_HOST` | DB host |
| `POSTGRES_PORT` | DB port |
| `POSTGRES_USER` | DB user |
| `POSTGRES_PASSWORD` | DB password |
| `POSTGRES_DATABASE` | Database name |
| `POSTGRES_URL` | Full connection string (used by TypeORM) |

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

## Secrets

- Never commit real `.env` files.
- Use `.env.example` placeholders only in git.
