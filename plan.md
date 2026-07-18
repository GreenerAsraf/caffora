# Caffora — E-Commerce Portfolio Implementation Plan

> **Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (base-nova) · Lucide React · Express · Prisma · PostgreSQL

---

## Project Context

**"Caffora"** is a premium full-stack e-commerce platform built as a portfolio-grade project. It will showcase modern web development practices across a 7-phase roadmap, following the strict design and code quality rules in `project.instruction.md`.

### Key constraints (from project.instruction.md)
- Max **3 primary colors** + optional neutral; support **Light & Dark mode**
- **No lorem ipsum**, no placeholder content
- **Responsive** for mobile, tablet, desktop
- Cards: **same size/radius**, 4-per-row on desktop, skeleton loaders
- Auth: **Google login**, demo button, professional UI
- Dashboard: **role-based** (User / Admin), sidebar nav, charts with real data
- **8+ meaningful sections** on the landing page
- **Clean code**: reusable components, custom hooks, env vars, no console logs

---

## Color & Design System

| Token | Light | Dark | Usage |
|---|---|---|---|
| Primary | Amber-500 `#F59E0B` | Amber-400 `#FBBF24` | CTA, buttons, highlights |
| Secondary | Neutral-900 `#171717` | Neutral-50 `#FAFAFA` | Text, headings |
| Accent | Teal-600 `#0D9488` | Teal-400 `#2DD4BF` | Badges, tags, links |
| Background | White | Neutral-950 | Page bg |
| Surface | Neutral-50 | Neutral-900 | Cards, panels |

**Typography**: `Inter` (body/UI) + `Playfair Display` (headings) — both via `next/font/google`

---

## Route Architecture

```
app/
├── (marketing)/                   # Public pages with Navbar + Footer
│   ├── layout.tsx                 # Navbar + Footer wrapper
│   ├── page.tsx                   # / — Landing Page
│   ├── about/page.tsx             # /about
│   ├── contact/page.tsx           # /contact
│   ├── blog/
│   │   ├── page.tsx               # /blog
│   │   └── [slug]/page.tsx        # /blog/[slug]
│   ├── products/
│   │   ├── page.tsx               # /products — Explore/listing page
│   │   └── [id]/page.tsx          # /products/[id] — Product Detail
│   └── categories/[slug]/page.tsx # /categories/[slug]
│
├── (auth)/                        # Auth pages (no Navbar/Footer)
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (dashboard)/                   # Protected — sidebar layout
│   ├── layout.tsx                 # Sidebar + dashboard navbar
│   ├── dashboard/page.tsx         # /dashboard — overview (redirect by role)
│   ├── dashboard/orders/page.tsx
│   ├── dashboard/wishlist/page.tsx
│   ├── dashboard/profile/page.tsx
│   ├── dashboard/settings/page.tsx
│   ├── dashboard/admin/page.tsx
│   ├── dashboard/admin/products/page.tsx
│   ├── dashboard/admin/categories/page.tsx
│   ├── dashboard/admin/users/page.tsx
│   └── dashboard/admin/analytics/page.tsx
│
├── cart/page.tsx
├── checkout/page.tsx
├── orders/[id]/page.tsx
│
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── products/route.ts
│   ├── products/[id]/route.ts
│   ├── categories/route.ts
│   ├── cart/route.ts
│   ├── orders/route.ts
│   └── upload/route.ts
│
├── not-found.tsx
├── error.tsx
├── loading.tsx
├── layout.tsx
└── globals.css
```

---

## Phase-by-Phase Implementation Plan

---

## Phase 1 — Foundation

**Goal**: Set up the design system, theming, navigation shell, and route structure.

### 1.1 Design System & Globals

#### [MODIFY] [globals.css](file:///c:/Level2B6/project2/caffora-client/app/globals.css)
- Extend existing OKLCH tokens to include Caffora's Amber primary, Teal accent
- Add `Inter` + `Playfair Display` CSS custom properties
- Add custom animation utilities (fade-in, slide-up, shimmer for skeleton)
- Define card, badge, and glass-morphism utility classes

#### [MODIFY] [layout.tsx](file:///c:/Level2B6/project2/caffora-client/app/layout.tsx)
- Import `Inter` and `Playfair Display` via `next/font/google`
- Wrap body with `ThemeProvider` (client component managing `dark` class)
- Add `Toaster` (sonner) for toast notifications
- Set SEO metadata: title template, Open Graph defaults

### 1.2 Providers & Theme

#### [NEW] `components/providers/theme-provider.tsx`
- `'use client'` — manages `dark` class on `<html>` using `localStorage`
- Expose `useTheme()` hook

#### [NEW] `components/providers/index.tsx`
- Compose all providers: `ThemeProvider`, future `AuthProvider`, `CartProvider`

### 1.3 Shadcn Components (install via CLI)

```bash
npx shadcn@latest add button card badge input label select sheet dialog dropdown-menu avatar separator skeleton toast tabs accordion
```

### 1.4 Shared Layout Components

#### [NEW] `components/layout/navbar.tsx`
- Server Component shell, `NavbarClient.tsx` for mobile menu (`'use client'`)
- **Logged out** (3+ links): Home, Products, About, Blog, Login
- **Logged in** (5+ links): Home, Products, Blog, Cart (icon + count), Profile Dropdown
- Sticky, full-width, glassmorphism on scroll, dark mode aware
- Responsive hamburger menu via shadcn `Sheet`

#### [NEW] `components/layout/footer.tsx`
- 4-column grid: Logo+tagline, Quick Links, Categories, Contact+Social
- Working links only, dark mode compliant

#### [NEW] `components/layout/page-wrapper.tsx`
- Consistent `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` container

### 1.5 Route Groups & Layouts

#### [NEW] `app/(marketing)/layout.tsx` — Navbar + Footer wrapping
#### [NEW] `app/(auth)/layout.tsx` — Centered card layout, no nav
#### [NEW] `app/(dashboard)/layout.tsx` — Sidebar + dashboard topbar
#### [NEW] `app/not-found.tsx` — Branded 404 with CTA
#### [NEW] `app/error.tsx` — Error boundary with retry button

---

## Phase 2 — Landing Page

**Goal**: Build an impressive 8+ section landing page that serves as the showpiece of the portfolio.

### Sections (all in `app/(marketing)/page.tsx`, composed from `components/sections/`)

| # | Section | Component | Key Features |
|---|---|---|---|
| 1 | **Hero** | `HeroSection` | Full-screen (60-70vh), animated text reveal, product image carousel, 2 CTAs |
| 2 | **Stats Bar** | `StatsBar` | Animated counters: products, customers, orders, satisfaction % |
| 3 | **Categories** | `CategoriesSection` | Horizontal scroll cards with icons |
| 4 | **Featured Products** | `FeaturedProducts` | 4-per-row grid, product cards with skeleton loading |
| 5 | **Special Offers** | `OffersSection` | Countdown timer cards, gradient banners |
| 6 | **Why Choose Us** | `FeaturesSection` | Icon grid: free shipping, secure payment, easy returns, 24/7 support |
| 7 | **Testimonials** | `TestimonialsSection` | Auto-scrolling carousel, star ratings, avatar |
| 8 | **Blog Preview** | `BlogPreviewSection` | Latest 3 blog posts, card grid |
| 9 | **Newsletter** | `NewsletterSection` | Email input with validation, success state |

#### [NEW] `components/sections/hero-section.tsx` — `'use client'` (animation, slider)
#### [NEW] `components/sections/stats-bar.tsx` — `'use client'` (counter animation)
#### [NEW] `components/sections/categories-section.tsx` — Server Component
#### [NEW] `components/sections/featured-products.tsx` — Server Component + Suspense
#### [NEW] `components/sections/offers-section.tsx` — `'use client'` (countdown timer)
#### [NEW] `components/sections/features-section.tsx` — Server Component
#### [NEW] `components/sections/testimonials-section.tsx` — `'use client'` (carousel)
#### [NEW] `components/sections/blog-preview-section.tsx` — Server Component
#### [NEW] `components/sections/newsletter-section.tsx` — `'use client'` (form)

### Product Card

#### [NEW] `components/cards/product-card.tsx`
- Fixed height, same border-radius (`rounded-2xl`)
- Image, Title, Short description, Price, Rating (stars), "View Details" button
- Hover: scale + shadow lift animation
- Wishlist heart toggle

#### [NEW] `components/cards/product-card-skeleton.tsx`

---

## Phase 3 — Backend

**Goal**: Build the Express + Prisma + PostgreSQL API server.

> **Note**: This phase creates a separate backend at `c:\Level2B6\project2\caffora-server\`.

### 3.1 Express Server Setup

```
caffora-server/
├── src/
│   ├── index.ts
│   ├── middleware/
│   │   ├── auth.ts         # JWT verify middleware
│   │   └── role.ts         # Role-based access
│   ├── routes/
│   │   ├── auth.ts         # POST /auth/register, /auth/login, /auth/refresh
│   │   ├── products.ts     # GET/POST/PUT/DELETE /products
│   │   ├── categories.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── reviews.ts
│   │   └── users.ts        # Admin: manage users
│   ├── controllers/
│   ├── prisma/
│   │   └── schema.prisma
│   └── lib/
│       ├── prisma.ts
│       └── jwt.ts
```

### 3.2 Prisma Schema Models

```prisma
model User       { id, name, email, password, role (USER|ADMIN), avatar, createdAt }
model Category   { id, name, slug, image, description, products[] }
model Product    { id, title, slug, description, price, comparePrice, images[], stock, category, reviews[], createdAt }
model Cart       { id, userId, items: CartItem[] }
model CartItem   { id, cartId, productId, quantity }
model Order      { id, userId, items: OrderItem[], total, status, paymentId, address, createdAt }
model OrderItem  { id, orderId, productId, quantity, price }
model Review     { id, userId, productId, rating, comment, createdAt }
model Wishlist   { id, userId, products[] }
```

### 3.3 Authentication

- **JWT** access tokens (15 min) + refresh tokens (7 days) in httpOnly cookies
- **bcryptjs** for password hashing
- **Google OAuth** via `passport-google-oauth20`
- Demo login button: auto-fills test credentials

### 3.4 Role-Based Authorization

- Roles: `USER` (default) and `ADMIN`
- Middleware chain: `requireAuth` → `requireRole('ADMIN')`
- Admin-only: user management, product/category CRUD with delete

---

## Phase 4 — Core Features

**Goal**: Functional product browsing with search, filter, sort, pagination; cart and wishlist.

### 4.1 Products Listing Page (`/products`)

#### [NEW] `app/(marketing)/products/page.tsx`
- Server Component: reads `searchParams` (q, category, minPrice, maxPrice, rating, sort, page)
- Renders `<ProductsClient>` with initial data

#### [NEW] `components/features/products/products-client.tsx` — `'use client'`
- Search bar with debounce
- Filter panel: Category dropdown, Price range slider, Rating filter (2+ fields)
- Sort: Price asc/desc, Rating, Newest
- Pagination: numbered pages
- Updates URL via `useRouter` / `useSearchParams`

#### [NEW] `hooks/use-debounce.ts`
#### [NEW] `hooks/use-products.ts`

### 4.2 Product Detail Page (`/products/[id]`)

#### [NEW] `app/(marketing)/products/[id]/page.tsx`
- Server Component; generates SEO metadata
- Image gallery (multiple images, thumbnail selector)
- Sections: Overview, Specifications table, Reviews, Related Products

#### [NEW] `components/features/products/product-gallery.tsx` — `'use client'`
#### [NEW] `components/features/products/product-reviews.tsx`
#### [NEW] `components/features/products/related-products.tsx`

### 4.3 Cart

#### [NEW] `components/providers/cart-provider.tsx` — `'use client'`
- React Context + `useReducer`
- Sync with localStorage + backend when logged in
- Actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QTY`, `CLEAR`

#### [NEW] `app/cart/page.tsx`
#### [NEW] `hooks/use-cart.ts`

### 4.4 Wishlist

#### [NEW] `hooks/use-wishlist.ts`
- Persists to localStorage (guest) or backend (authenticated)
- Toggled from product cards and detail pages

---

## Phase 5 — Order Flow

**Goal**: Checkout, payment, order confirmation, and reviews.

### 5.1 Checkout (`/checkout`)

#### [NEW] `app/checkout/page.tsx` — Protected route
- **3-step wizard**: Shipping Address → Payment → Review & Place Order
- Form validation with `react-hook-form` + `zod`

### 5.2 Payment Integration

- **Stripe**: `@stripe/stripe-js` + `@stripe/react-stripe-js`
- `app/api/payment/create-intent/route.ts` — creates Stripe PaymentIntent
- `app/api/payment/webhook/route.ts` — updates order status

### 5.3 Orders (`/orders/[id]`)

#### [NEW] `app/orders/[id]/page.tsx`
- Order summary, items, shipping info, status badge, "Continue Shopping" CTA

### 5.4 Reviews
- Star rating form on product detail page (authenticated only)
- Average rating displayed on cards and detail pages

---

## Phase 6 — Dashboard

**Goal**: Role-based dashboards with real data charts, tables, and profile management.

### 6.1 Dashboard Layout

#### [MODIFY] `app/(dashboard)/layout.tsx`
- Sidebar (collapses to Sheet on mobile)
- Topbar: breadcrumb, user avatar dropdown (Profile, Logout)

### 6.2 User Dashboard

| Route | Content |
|---|---|
| `/dashboard` | Welcome card, recent orders, wishlist count, stats |
| `/dashboard/orders` | Paginated table: order ID, date, total, status |
| `/dashboard/wishlist` | Wishlist product grid |
| `/dashboard/profile` | Editable: name, avatar upload, address |
| `/dashboard/settings` | Password change, notification prefs |

### 6.3 Admin Dashboard

| Route | Content |
|---|---|
| `/dashboard/admin` | Revenue card, user count, order count, product count + Charts |
| `/dashboard/admin/products` | CRUD table: add/edit (modal)/delete, image upload |
| `/dashboard/admin/categories` | CRUD table |
| `/dashboard/admin/users` | User list with role toggle |
| `/dashboard/admin/analytics` | Bar (revenue), Line (orders over time), Pie (categories) |

### 6.4 Charts — `recharts`

#### [NEW] `components/charts/revenue-bar-chart.tsx` — `'use client'`
#### [NEW] `components/charts/orders-line-chart.tsx` — `'use client'`
#### [NEW] `components/charts/category-pie-chart.tsx` — `'use client'`
- All use real backend data, responsive, dark-mode aware

### 6.5 Data Tables — shadcn DataTable (TanStack Table v8)
- Sortable, filterable columns
- Per-table pagination (10/25/50 rows)
- Row actions via dropdown menu

---

## Phase 7 — Production Polish

**Goal**: Performance, accessibility, SEO, UX polish.

### 7.1 Skeleton Loaders
- `components/skeletons/product-card-skeleton.tsx`
- `components/skeletons/product-grid-skeleton.tsx`
- `components/skeletons/dashboard-skeleton.tsx`
- All data-fetching pages have `loading.tsx` with skeletons

### 7.2 Error Boundaries
- `app/error.tsx` (global)
- `app/(marketing)/products/error.tsx`
- `app/(dashboard)/error.tsx`

### 7.3 Empty States
- `components/ui/empty-state.tsx` — Icon + title + description + optional CTA
- Used in: empty cart, empty wishlist, no products found, no orders

### 7.4 SEO
- `metadataBase`, Open Graph defaults in root layout
- `generateMetadata()` per dynamic page
- `app/sitemap.ts` — products + blog URLs
- `app/robots.ts`

### 7.5 Image Optimization
- All images: `next/image` with proper `width`, `height`, `priority`
- `next.config.ts`: `remotePatterns` for external domains
- Responsive `sizes` prop on grid images

### 7.6 Form Validation — `react-hook-form` + `zod`
- All forms: inline errors, success states, loading spinners

### 7.7 Toast Notifications — `sonner`
- Add to cart, order placed, auth errors, form results

### 7.8 Accessibility
- `aria-label`, `role`, `tabIndex` on all interactive elements
- Keyboard navigation: focus traps, skip-to-content link
- WCAG AA color contrast in both modes
- Proper `<label>` + `aria-describedby` on all form inputs

### 7.9 Performance
- `React.Suspense` + `loading.tsx` for streaming
- `next/dynamic` for heavy client components (charts, carousel)
- Font preloading via `next/font/google`

---

## Folder Structure (Final)

```
caffora-client/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── cart/
│   ├── checkout/
│   ├── orders/[id]/
│   ├── api/
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── sitemap.ts / robots.ts
│
├── components/
│   ├── ui/          # shadcn base components
│   ├── layout/      # Navbar, Footer, PageWrapper, Sidebar
│   ├── sections/    # Landing page sections
│   ├── cards/       # ProductCard, BlogCard, CategoryCard
│   ├── features/    # Product gallery, filters, cart, checkout UI
│   ├── dashboard/   # Dashboard-specific components
│   ├── charts/      # Recharts wrappers
│   ├── skeletons/   # Loading skeletons
│   └── providers/   # Context providers
│
├── hooks/
│   ├── use-cart.ts
│   ├── use-wishlist.ts
│   ├── use-debounce.ts
│   ├── use-theme.ts
│   └── use-products.ts
│
├── lib/
│   ├── utils.ts         # cn(), formatPrice(), etc.
│   ├── api.ts           # Typed fetch wrapper for Express backend
│   ├── validations/     # Zod schemas
│   └── constants.ts     # Nav links, categories, etc.
│
├── types/
│   └── index.ts         # Shared TypeScript types
│
└── public/
    └── images/
```

---

## Dependencies to Install

### Client
```bash
npm install react-hook-form zod @hookform/resolvers
npm install sonner
npm install recharts
npm install @tanstack/react-table
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install embla-carousel-react
npm install next-themes
```

### Backend (caffora-server)
```bash
npm install express prisma @prisma/client bcryptjs jsonwebtoken passport passport-google-oauth20 cors cookie-parser
npm install -D typescript @types/express @types/bcryptjs @types/jsonwebtoken ts-node-dev
```

---

## Environment Variables

```env
# .env.local (client)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# .env (server)
DATABASE_URL=postgresql://user:password@localhost:5432/caffora
JWT_SECRET=...
JWT_REFRESH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Verification Plan

### Per Phase
- **Phase 1**: `npm run dev` — Navbar, Footer, theme toggle work on all breakpoints
- **Phase 2**: All 9 landing sections render; no stuck skeleton states
- **Phase 3**: All API endpoints tested via Postman/Thunder Client
- **Phase 4**: Full search → filter → sort → paginate → add to cart flow
- **Phase 5**: End-to-end checkout with Stripe test card `4242 4242 4242 4242`
- **Phase 6**: Admin CRUD works; user sees only own data
- **Phase 7**: Lighthouse ≥ 90 performance; 0 axe-core accessibility errors

### Final Checklist
- [ ] All Navbar/Footer links are functional (no dead `#` hrefs)
- [ ] Dark mode contrast passes WCAG AA
- [ ] 4 cards/row on desktop, stacks on mobile
- [ ] Every form: validation errors, success state, loading spinner
- [ ] Admin cannot access user-only routes and vice versa
- [ ] No `console.log` in production (`npm run build` clean)
- [ ] Open Graph image appears on link unfurl
- [ ] Skeleton loaders appear before data loads

---

## Open Questions

> [!IMPORTANT]
> **Backend location**: Separate `caffora-server/` folder (current plan) or monorepo? Recommend separate for clean portfolio presentation.

> [!IMPORTANT]
> **Database**: Local PostgreSQL or hosted (Supabase / Neon.tech)? Planning **Neon.tech** free tier by default.

> [!IMPORTANT]
> **Payment**: Real Stripe test-key integration or simulated/mock payment flow for portfolio?

> [!NOTE]
> **Auth strategy**: Use **NextAuth.js v5** on the client (Google OAuth + session) communicating with Express, OR handle all auth purely in Express? Which do you prefer?

> [!NOTE]
> **Image uploads**: **Cloudinary** (free tier) or local `/public` folder for admin product images?


plan from claude sonnet
# Frontend ↔ Backend Integration Plan

## Background

Both the backend (Express + Prisma + PostgreSQL on Neon) and frontend (Next.js 16) are already substantially built. The backend has **all API routes** fully implemented (`/auth`, `/products`, `/categories`, `/cart`, `/orders`, `/reviews`, `/users`, `/dashboard`). The frontend has the UI, providers, and hooks — but is **wired to mock data** instead of the real API. This plan wires everything together.

## What Is Already Done ✅
- Backend: all REST routes, Prisma schema, JWT auth, CORS, cookie-based sessions
- Frontend: `AuthProvider`, `CartProvider`, `apiRequest` fetch wrapper, types, all page UI shells
- `lib/api.ts`: base `apiRequest` + `authApi` (login/register/me/logout)

## What Needs to Be Done

---

## 1. API Client Layer — `lib/api.ts`

**Currently:** Only has `authApi`. Products, cart, orders, categories, reviews, users, dashboard all have no API methods.

**Plan:** Expand `lib/api.ts` with typed API modules for every resource:
- `productsApi` — `list(params)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`
- `categoriesApi` — `list()`, `create(data)`, `update(id, data)`, `delete(id)`
- `cartApi` — `get()`, `addItem(productId, qty)`, `updateItem(itemId, qty)`, `removeItem(itemId)`, `clear()`
- `ordersApi` — `create(address)`, `list(page)`, `getById(id)`, `updateStatus(id, status)`
- `reviewsApi` — `getForProduct(productId)`, `create(productId, data)`, `delete(id)`
- `usersApi` — `list(page)`, `getById(id)`, `updateRole(id, role)`
- `dashboardApi` — `getUser()`, `getAdmin()`, `getAnalytics()`, `getWishlist()`, `toggleWishlist(productId)`

---

## 2. `hooks/use-products.ts` — Replace mock with real API

**Currently:** Uses 24 hardcoded mock products with fake filtering.

**Plan:** Rewrite to call `GET /api/products` with search params (q, category, minPrice, maxPrice, rating, sort, page, limit). Keep the same interface so `products-client.tsx` needs no changes.

---

## 3. `components/providers/cart-provider.tsx` — Sync with backend

**Currently:** localStorage-only, no backend sync. Cart type mismatches the backend response.

**Plan:**
- After login: fetch cart from `/api/cart` and merge with local cart (upsert local items to backend, then pull fresh server state)
- `addItem` → calls `POST /api/cart/items` if authenticated, else stays local
- `removeItem` → calls `DELETE /api/cart/items/:itemId` if authenticated
- `updateQuantity` → calls `PUT /api/cart/items/:itemId` if authenticated
- `clearCart` → calls `DELETE /api/cart` if authenticated
- On logout: clear local cart state

The `use-cart.ts` hook stays the same interface (addItem, removeItem, etc.) so nothing in the UI breaks.

---

## 4. `hooks/use-wishlist.ts` — Wire to backend

**Currently:** localStorage only.

**Plan:** Call `POST /api/dashboard/wishlist/toggle`, `GET /api/dashboard/wishlist`. Sync on auth state change.

---

## 5. `/products` page — Real data

**Currently:** `products-client.tsx` calls the mock `useProducts` hook.

The hook rewrite in step 2 is the only change needed. The `products-client.tsx` UI stays untouched.

---

## 6. `/products/[id]` page — Real product detail

**Currently:** `[id]/page.tsx` likely has mock data (need to verify/fix).

**Plan:**
- Server Component fetches `GET /api/products/:id` 
- `product-reviews.tsx` → calls `GET /api/reviews/product/:id`
- Review submission form calls `POST /api/reviews`

---

## 7. Checkout `placeOrder` — Call real backend

**Currently:** Saves order to `localStorage` as `caffora-order-${orderId}`. Never calls the backend.

**Plan:** Replace `localStorage` write with `POST /api/orders` → `{ address }`. After success, clear local cart, redirect to `/orders/${order.id}`.

---

## 8. `/orders/[id]` page — Fetch real order

**Currently:** Reads from `localStorage.getItem('caffora-order-...')`.

**Plan:** Call `GET /api/orders/:id`. Show item list, total, status badge, shipping address.

---

## 9. Dashboard — User & Admin

### User Dashboard `/dashboard`
**Currently:** Likely shows static/demo data.
**Plan:** Call `GET /api/dashboard` → show real order count, lifetime spend, wishlist count, recent orders.

### User Orders `/dashboard/orders`
**Currently:** Likely static.
**Plan:** Call `GET /api/orders?page=N` → paginated table.

### User Wishlist `/dashboard/wishlist`
**Currently:** Likely static.
**Plan:** Call `GET /api/dashboard/wishlist` → product grid.

### User Profile `/dashboard/profile`
**Plan:** Call `GET /api/auth/me` for current data, `PUT /api/users/profile` to save.

---

## 10. Admin Dashboard

### Admin Overview `/dashboard/admin`
**Plan:** Call `GET /api/dashboard/admin` → stats cards + recent orders table + low-stock alerts.

### Admin Products `/dashboard/admin/products`
**Plan:** Full CRUD table — calls `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`. Modal form for add/edit. Category select dropdown from `GET /api/categories`.

### Admin Categories `/dashboard/admin/categories`
**Plan:** Full CRUD — `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`.

### Admin Users `/dashboard/admin/users`
**Plan:** Paginated table from `GET /api/users`. Role toggle calls `PATCH /api/users/:id/role`.

### Admin Analytics `/dashboard/admin/analytics`
**Plan:** Call `GET /api/dashboard/admin/analytics` → feed into Recharts bar/line/pie charts.

---

## 11. `next.config.ts` — Add image domains

The backend may return Unsplash / pravatar / etc. image URLs. Add missing remote patterns.

---

## Open Questions

> [!IMPORTANT]
> **Cart merge strategy**: When a logged-in user has both local (guest) cart items AND a server cart, should we:
> a) Merge (add guest items to server cart), or
> b) Replace (server cart wins)?
> **Recommended: Merge** — push each local item to the server, then pull fresh.

> [!IMPORTANT]
> **OrderStatus mismatch**: The DB uses `PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED` but `types/index.ts` has `PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED`. Need to align — recommend updating `types/index.ts` to match the DB enum.

> [!NOTE]
> **Stripe keys**: The `.env` has `placeholder_stripe_secret_key`. Checkout will run in **mock/simulated mode** (no real card charge) unless real Stripe keys are added. This is acceptable for portfolio.

> [!NOTE]
> **Image uploads for admin products**: Currently no file upload endpoint. Admin product images will be entered as **URLs** (e.g. Unsplash links). A future enhancement can add Cloudinary upload.

---

## Proposed Changes

### `lib/api.ts` — [MODIFY]
Add all resource API modules.

### `hooks/use-products.ts` — [MODIFY]
Replace mock with real `GET /api/products` call.

### `hooks/use-wishlist.ts` — [MODIFY]
Wire to backend wishlist toggle + fetch.

### `components/providers/cart-provider.tsx` — [MODIFY]
Add backend sync for authenticated users.

### `types/index.ts` — [MODIFY]
Fix `OrderStatus` to match DB enum (`PROCESSING` instead of `CONFIRMED`).

### `next.config.ts` — [MODIFY]
Add `i.pravatar.cc` remote pattern.

### `app/checkout/page.tsx` — [MODIFY]
Replace localStorage order write with `POST /api/orders`.

### `app/orders/[id]/page.tsx` — [MODIFY] or [NEW]
Fetch real order from `GET /api/orders/:id`.

### `app/(marketing)/products/[id]/page.tsx` — [MODIFY]
Fetch product from `GET /api/products/:id`.

### `components/features/products/product-reviews.tsx` — [MODIFY]
Fetch from API + submit review form.

### `app/(dashboard)/dashboard/page.tsx` — [MODIFY]
Real user dashboard data.

### `app/(dashboard)/dashboard/orders/page.tsx` — [MODIFY]
Real paginated orders.

### `app/(dashboard)/dashboard/wishlist/page.tsx` — [MODIFY]
Real wishlist from API.

### `app/(dashboard)/dashboard/profile/page.tsx` — [MODIFY]
Real profile fetch + update.

### `app/(dashboard)/dashboard/admin/page.tsx` — [MODIFY]
Real admin stats.

### `app/(dashboard)/dashboard/admin/products/page.tsx` — [MODIFY]
Full CRUD product management table.

### `app/(dashboard)/dashboard/admin/categories/page.tsx` — [MODIFY]
Full CRUD category management.

### `app/(dashboard)/dashboard/admin/users/page.tsx` — [MODIFY]
User list with role toggle.

### `app/(dashboard)/dashboard/admin/analytics/page.tsx` — [MODIFY]
Charts with real data.

---

## Verification Plan

### Manual
1. Register → login → see user in admin dashboard
2. Admin creates a category → creates a product → product appears on `/products`
3. User browses products, adds to cart → cart persists on refresh
4. User checks out → order created in DB → appears in `/dashboard/orders`
5. Admin updates order status → user sees updated status
6. User leaves a review → review appears on product page
7. Admin analytics charts reflect real order/revenue data

### Build Check
```bash
cd caffora-client && npm run build
```
Must compile with no type errors.
