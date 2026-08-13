# Web Changelog

Progress log for `@repo/web` (storefront + admin UI). Newest entries first.

---

## 2026-08-13 — Admin routing

- Dashboard route commented out; `/admin` redirects to `/admin/products`.
- Products nav highlights correctly as the admin home.
---

## 2026-08-12 — Orders integration

- Profile orders list and detail loaded from the API.
- Admin orders list, detail, and status update UI.
- Order confirmation and checkout success/cancel pages wired to API.
- Shared `@repo/contracts` order types and `order-utils` helpers.

---

## 2026-08 — Checkout & payments UI

- Checkout page creates shipping address and Stripe Checkout session.
- Success page resolves order by session; cancel restores cart via cancel-checkout.

---

## 2026-08 — API integration (catalog + auth)

- Axios client with bearer token and `{ success, data }` response envelope.
- React Query hooks for products, categories, cart, addresses, and auth.
- Admin product and category CRUD with Cloudinary uploads.
- Role-based protected routes for shop and admin.

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
