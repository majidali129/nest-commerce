# E-commerce Site

Monorepo for a full-stack e-commerce app: React storefront + admin (`apps/web`) and NestJS API (`apps/api`).

**Current status**

| Area | Status |
|------|--------|
| Auth (JWT, roles) | Done |
| Catalog (products, categories, variants) | Done |
| Cart, addresses, checkout | Done |
| Stripe payments + webhooks | Done |
| Orders (shop + admin status) | Done |
| Slack notifications | Done |
| Cloudinary media uploads | Done |
| Web ↔ API integration | Done |

Package manager: **pnpm**. Orchestration: **Turborepo**. Node **≥ 18**.

```bash
# From repo root
pnpm install
pnpm dev
# web → http://localhost:3000
# api → http://localhost:3001
```

- Docs: [`docs/`](./docs/README.md)
- API changelog: [`apps/api/changelog.md`](./apps/api/changelog.md)
- Web changelog: [`apps/web/changelog.md`](./apps/web/changelog.md)

---

## Apps

### Web (`apps/web`)

Storefront and `/admin` back office. Wired to the API via TanStack Query, Axios, and `@repo/contracts`.

See [`apps/web/README.md`](./apps/web/README.md).

### API (`apps/api`)

NestJS service for auth, catalog, cart, checkout, payments, orders, media, and notifications.

See [`apps/api/README.md`](./apps/api/README.md).

---

## Monorepo layout

```
e-commerce-site/
├── apps/
│   ├── web/                 # Storefront + admin UI
│   └── api/                 # NestJS API
├── packages/
│   ├── contracts/           # Shared TypeScript types
│   ├── eslint-config/
│   └── typescript-config/
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

| Script | Purpose |
|--------|---------|
| `pnpm install` | Install all workspace deps |
| `pnpm dev` | Start web + api via Turbo |
| `pnpm dev:web` / `pnpm dev:api` | One app at a time |
| `pnpm build` / `lint` / `check-types` | Turbo task runners |
