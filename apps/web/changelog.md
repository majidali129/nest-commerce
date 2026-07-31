# Web Changelog

Progress log for `@repo/web` (storefront + admin UI). Newest entries first.

---

## 2026-07-31 — UI & design complete (mock data)

Storefront and admin UIs are in place. Screens are presentational and driven by mock data — real API wiring, auth, cart persistence, and business logic are still pending.

### Storefront

- Layout, navigation, home, categories, product listing, product detail
- Cart, checkout (shipping), order confirmation
- Sign in / sign up screens
- Profile area (account + orders views)
- Shared product UI (cards, price display with product-level discount %)
- Design system: Tailwind CSS v4, shadcn/ui (Base UI), Geist, shared tokens

### Admin (`/admin`)

- Admin shell (sidebar, top bar, account menu)
- Dashboard with chart placeholders
- Products list + create/edit forms (includes product `discount_percent`)
- Categories list + create/edit
- Orders list + detail
- Customers list + detail
- Settings page
- Shared admin table / form patterns on mock data

### Notable product decisions

- No separate admin Discounts module — discount is a field on the product
- Storefront/admin logic intentionally kept light for architecture planning (mock-first)

### Still pending

- Connect to `@repo/api` (fetch, mutations, React Query usage for real data)
- Real auth / session / protected routes
- Real cart and checkout flow
- Server-driven search, filters, pagination
- Media uploads and env-based config
- Error boundaries / production hardening as needed
