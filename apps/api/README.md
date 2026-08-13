# `@repo/api`

NestJS API for the e-commerce monorepo — auth, catalog, cart, checkout, Stripe payments, orders, Cloudinary, and Slack notifications.

Default port: **3001**.

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Nest watch mode |
| `pnpm build` | Compile to `dist/` |
| `pnpm start:prod` | Run compiled `dist/main` |
| `pnpm lint` | ESLint |

From repo root: `pnpm dev:api` or `pnpm --filter @repo/api dev`.

## Local setup

1. Copy [`.env.example`](./.env.example) → `.env` and fill in values. See [docs/environment.md](../../docs/environment.md).
2. PostgreSQL must be running with the database from your env.
3. For Stripe webhooks locally:

```bash
stripe listen --forward-to http://localhost:3001/webhook
```

Use the CLI webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

## More

- Progress: [changelog.md](./changelog.md)
- Architecture & flows: [docs/](../../docs/README.md)
