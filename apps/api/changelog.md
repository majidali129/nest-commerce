# API Changelog

Progress log for `@repo/api` (NestJS backend). Newest entries first.

---

## 2026-08-13 — Notifications (Slack)

- Added `notifications` module with `SlackService` and `NotificationsService`.
- Order confirmation posts a Slack Block Kit message after successful payment finalize.
- User signup posts a Slack message on account creation.
- Slack failures are logged and do not fail the checkout transaction.

---

## 2026-08-12 — Orders (shop + admin)

- User order list and detail endpoints.
- Admin order list, detail, and status update with validated transitions.
- Cancel-checkout endpoint for abandoned Stripe sessions.
- Lookup order by Stripe checkout session id.

---

## 2026-08 — Checkout & payments

- Two-phase checkout: `beginCheckout` creates pending order + reservations, then Stripe Checkout session.
- Webhook handler for `checkout.session.completed` with idempotency via `webhook_events`.
- Inventory reservations with TTL and expiry sweeper.
- Payment records and stock fulfillment on successful payment.
- Order lock uses pessimistic write without joins (Postgres `FOR UPDATE` constraint).

---

## 2026-08 — Catalog, cart, media

- Products, categories, and variants CRUD (admin-guarded mutations).
- Cart CRUD with stock checks.
- Addresses CRUD for shipping.
- Cloudinary upload and signed upload support.

---

## 2026-08 — Auth & foundation

- JWT auth (access + refresh cookies/tokens), role guards, `@Admin()` decorator.
- TypeORM + PostgreSQL, shared types via `@repo/contracts`.
- Global validation pipe, response transform interceptor, exception filter.

---

## 2026-07-31 — Project setup

- Scaffolded the NestJS API package inside the monorepo (`apps/api`).
- Installed baseline dependencies for the planned stack (NestJS, TypeORM, PostgreSQL driver, validation, Socket.IO, Cloudinary, Multer, Config).
- No domain modules, entities, auth, or business logic yet — scaffolding only.
