# Routes & API surface

## Shop (web)

| Path | Auth | Notes |
|------|------|-------|
| `/` | Public | Home — featured categories/products |
| `/categories` | Public | Category grid |
| `/products` | Public | Product listing |
| `/products/:productId` | Public | Product detail |
| `/auth/sign-in` | Guest only | Sign in |
| `/auth/sign-up` | Guest only | Sign up |
| `/cart` | User/Admin | Cart |
| `/checkout/shipping` | User/Admin | Address + start Stripe checkout |
| `/success` | User/Admin | Post-payment; resolve by `session_id` |
| `/cancel` | User/Admin | Cancel checkout / restore cart |
| `/order-confirmation/:orderId` | User/Admin | Confirmation view |
| `/profile` | User/Admin | Account |
| `/profile/orders` | User/Admin | Order list |
| `/profile/orders/:orderId` | User/Admin | Order detail |
| `/profile/addresses` | User/Admin | Saved addresses |

## Admin (web)

Admin shell requires `UserRole.ADMIN`. Index `/admin` redirects to `/admin/products`.

| Path | Notes |
|------|-------|
| `/admin/products` | Product list (admin home) |
| `/admin/products/new` | Create product |
| `/admin/products/:productId/edit` | Edit product + variants |
| `/admin/categories` | Category list |
| `/admin/categories/new` | Create category |
| `/admin/categories/:categoryId/edit` | Edit category |
| `/admin/orders` | Order list |
| `/admin/orders/:orderId` | Order detail + status update |

## API endpoints

Base URL: `VITE_API_URL` (default `http://localhost:3001`).

### Auth

| Method | Path | Notes |
|--------|------|-------|
| `POST` | `/auth/sign-up` | Create user |
| `POST` | `/auth/sign-in` | Login |
| `POST` | `/auth/sign-out` | Logout |
| `POST` | `/auth/refresh-token` | Refresh |

### Catalog

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/products` | List / filter |
| `GET` | `/products/:id` | Detail |
| `POST` / `PATCH` / `DELETE` | `/products…` | Admin mutations |
| `GET` | `/product-categories` | List |
| `GET` | `/product-categories/:id` | Detail |
| `POST` / `PATCH` / `DELETE` | `/product-categories…` | Admin mutations |
| `GET` / `POST` / `PATCH` / `DELETE` | `/product-variants…` | Variant CRUD |

### Cart & addresses

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/cart` | Current cart |
| `POST` | `/cart/items` | Add line |
| `PATCH` | `/cart/items/:itemId` | Update qty |
| `DELETE` | `/cart/items/:itemId` | Remove line |
| `POST` | `/cart/items/remove` | Bulk remove |
| `DELETE` | `/cart` | Clear cart |
| `GET` / `POST` / `PATCH` / `DELETE` | `/addresses…` | Address CRUD |
| `POST` | `/addresses/:id/default` | Set default |

### Payments, webhooks, orders

| Method | Path | Notes |
|--------|------|-------|
| `POST` | `/payments/create-checkout-session` | Begin checkout + Stripe session |
| `POST` | `/webhook` | Stripe webhooks (raw body) |
| `GET` | `/orders` | Current user orders |
| `GET` | `/orders/:id` | User order detail |
| `GET` | `/orders/by-session` | Lookup by `session_id` |
| `POST` | `/orders/:id/cancel-checkout` | Cancel pending checkout |
| `GET` | `/orders/admin` | Admin list |
| `GET` | `/orders/admin/:id` | Admin detail |
| `PATCH` | `/orders/admin/:id/status` | Admin status change |

### Media

| Method | Path | Notes |
|--------|------|-------|
| `POST` | `/cloudinary/upload` | Upload file |
| `GET` | `/cloudinary/generate-signature` | Signed upload params |
