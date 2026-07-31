# API Changelog

Progress log for `@repo/api` (NestJS backend). Newest entries first.

---

## 2026-07-31 — Project setup

- Scaffolded the NestJS API package inside the monorepo (`apps/api`).
- Installed baseline dependencies for the planned stack (NestJS, TypeORM, PostgreSQL driver, validation, Socket.IO, Cloudinary, Multer, Config).
- No domain modules, entities, auth, or business logic yet — scaffolding only.

### Still pending

- Database schema / TypeORM entities
- Auth and authorization
- Product, category, order, customer, and related services
- REST (and any realtime) endpoints
- File upload / media wiring
- Env, migrations, and integration with the web app
