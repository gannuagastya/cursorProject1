## Saree Catalog + Order Manager (Next.js 14 + Tailwind + Supabase)

A single-seller catalog and order capture MVP. Public catalog, product detail with Buy/Reserve, admin to add products and view orders. Orders do not decrement stock automatically.

### Prerequisites
- Node.js 18+
- Supabase project

### 1) Create tables in Supabase
- Sign in to Supabase
- Open SQL Editor and run the SQL in `supabase/schema.sql`

### 2) Install and test
```bash
npm i
npm run test
```
All tests should pass.

### 3) Run dev server
```bash
npm run dev
```
Open `http://localhost:3000/s/yourbrand`

### 4) Admin
- Go to `/admin` and enter `ADMIN_PASSWORD`
- Add a product (paste image URLs, one per line)

### 5) Deploy
- Deploy to Vercel
- Copy env vars from `.env.local` into Vercel project settings

### 6) Share
- Put `https://YOURAPP/s/yourbrand` in your Instagram bio and stories

### Important behaviors
- Do not decrement stock automatically on order; only show “Sold out” when `stock = 0`.
- After a successful order, user is redirected to `/order/success` with a WhatsApp button containing a pre-filled message: “Hi <brand>, I just placed an order…”.

### Tech Details
- Next.js App Router, TypeScript, Tailwind CSS
- Supabase (`@supabase/supabase-js`) using public anon key
- Admin is password-gated via a server route that sets an httpOnly cookie; the password is never exposed to the client bundle

### Environment Variables
- `.env.example` shows all required keys
- `.env.local` is pre-filled for local use

### Tests
- `tests/config.test.ts`: validates `next.config.mjs` and `images.remotePatterns`
- `tests/env.test.ts`: asserts required `NEXT_PUBLIC_*` env vars are present 
