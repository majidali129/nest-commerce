# `@repo/web`

React storefront and admin UI for the e-commerce monorepo. Talks to `@repo/api` via Axios + TanStack Query and shared `@repo/contracts` types.

Default port: **3000**.

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Vite dev server (port 3000) |
| `pnpm build` | Typecheck + production build |
| `pnpm lint` | ESLint |
| `pnpm check-types` | `tsc --noEmit` |
| `pnpm preview` | Preview production build |

From repo root: `pnpm dev:web`.

## Local setup

1. Copy [`.env.example`](./.env.example) → `.env` (set `VITE_API_URL`, usually `http://localhost:3001`).
2. Run the API as well so requests succeed.

See [docs/environment.md](../../docs/environment.md).

## More

- Progress: [changelog.md](./changelog.md)
- Routes & architecture: [docs/](../../docs/README.md)
