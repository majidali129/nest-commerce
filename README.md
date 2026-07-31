# E-commerce Site

Monorepo for a full-stack e-commerce app: a React storefront + admin panel (`apps/web`) and a NestJS API (`apps/api`).

**Current status**

| Area | Status |
|------|--------|
| Web UI & design (shop + admin) | Done (mock data) |
| Web ↔ API integration | Pending |
| API / backend beyond project setup | Pending |

Package manager: **pnpm** (`pnpm@9.0.0`). Orchestration: **Turborepo**. Node **≥ 18**.

```bash
# From repo root
pnpm install

# Run everything Turbo knows how to start
pnpm dev

# Or one app at a time
pnpm dev:web
pnpm --filter @repo/api start:dev
```

More detail per app is below. Deeper docs (database, services, architecture, flows, credentials) will live under a future `docs/` folder — see [Future documentation](#future-documentation).

---

## Web (`apps/web`)

Customer-facing shop and `/admin` back office. UI and visual design for both sides are complete; data is mocked locally so we can lock structure and UX before wiring the API.

### What this app is

- **Storefront** — browse categories/products, cart & checkout screens, auth screens, profile/orders
- **Admin** — dashboard, products, categories, orders, customers, settings
- **Discount model** — product-level `discount_percent` (no separate discounts CRUD)

Progress notes: [`apps/web/changelog.md`](./apps/web/changelog.md)

### Tech stack

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS v4 + shadcn/ui (Base UI) + Lucide
- TanStack Query + Axios (ready for API; not fully wired yet)
- Recharts (admin charts)
- Sonner, next-themes

### Setup

```bash
# From repo root (preferred)
pnpm install
pnpm dev:web
# → http://localhost:3000

# Or from the package
cd apps/web
pnpm dev
```

Useful scripts (`@repo/web`):

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Vite dev server (port 3000) |
| `pnpm build` | Typecheck + production build |
| `pnpm lint` | ESLint |
| `pnpm check-types` | `tsc --noEmit` |
| `pnpm preview` | Preview production build |

Path aliases are defined in `apps/web/package.json` (`#components/*`, `#pages/*`, `#lib/*`, etc.).

### Guide for future web work

1. Keep UI presentational until endpoints exist; prefer React Query + Axios against `@repo/api`.
2. Replace mock modules under `src/lib/mock-data` incrementally — don’t big-bang rewrite screens.
3. Admin and shop share `components/ui` and design tokens; extend those before inventing one-off styles.
4. Product discount stays on the product model; don’t reintroduce a standalone discounts admin section unless requirements change.
5. Log meaningful milestones in [`apps/web/changelog.md`](./apps/web/changelog.md).

---

## API / backend (`apps/api`)

NestJS service that will own auth, catalog, orders, customers, uploads, and related domain logic. **Only project setup is done** so far — no domain modules or persistence wired yet.

Progress notes: [`apps/api/changelog.md`](./apps/api/changelog.md)

### Planned tech stack

- NestJS 11 + TypeScript
- TypeORM + PostgreSQL (`pg`)
- class-validator / class-transformer
- Socket.IO (Nest websockets)
- Cloudinary + Multer (media)
- `@nestjs/config` for environment

### Setup

```bash
# From repo root
pnpm install
pnpm --filter @repo/api start:dev

# Or from the package
cd apps/api
pnpm start:dev
```

Useful scripts (`@repo/api`):

| Script | Purpose |
|--------|---------|
| `pnpm start:dev` | Nest watch mode (local development) |
| `pnpm start` | Nest start (no watch) |
| `pnpm start:prod` | Run compiled `dist/main` |
| `pnpm build` | `nest build` |
| `pnpm lint` | ESLint |
| `pnpm test` / `test:e2e` | Unit / e2e tests |

> Note: root `pnpm dev:api` expects a `dev` script on `@repo/api`. Until that alias exists, use `start:dev` as above (or add `"dev": "nest start --watch"` to `apps/api/package.json`).

Env, DB URL, Cloudinary keys, and similar secrets will be documented later — do not commit real credentials.

### Guide for future API work

1. Add modules by domain (products, categories, orders, auth, …) rather than dumping logic into `AppModule`.
2. Introduce TypeORM entities + migrations before shipping endpoints that mutate data.
3. Validate DTOs at the boundary; keep controllers thin.
4. Align response shapes with what the web app already models in `apps/web/src/lib/types`.
5. Log milestones in [`apps/api/changelog.md`](./apps/api/changelog.md).

---

## Monorepo layout

```
e-commerce-site/
├── apps/
│   ├── web/          # Storefront + admin UI
│   └── api/          # NestJS API
├── packages/
│   ├── eslint-config/
│   └── typescript-config/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

Root scripts:

| Script | Purpose |
|--------|---------|
| `pnpm install` | Install all workspace deps |
| `pnpm dev` | Turbo `dev` across packages that define it |
| `pnpm dev:web` | Web only |
| `pnpm build` / `lint` / `check-types` | Turbo task runners |
| `pnpm format` | Prettier on `ts` / `tsx` / `md` |

---

## Future documentation

We will add dedicated docs (likely under `docs/`) for:

- Database schema and migrations
- Services and module boundaries
- Architecture overview
- Request / domain flows
- Credentials and environment setup (templates only in git; secrets elsewhere)

Until those exist, use this README plus each app’s `changelog.md` as the source of truth for status and day-to-day setup.
