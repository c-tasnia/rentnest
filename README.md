# RentNest Backend

Rental property marketplace API — Node.js + Express + TypeScript + PostgreSQL (Prisma) + JWT + SSLCommerz.

## 1. Install

```bash
cd rentnest-backend
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:
- `DATABASE_URL` — your Postgres connection string (e.g. from Neon, Supabase, or local Postgres)
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin account the seed script will create
- `SSLCZ_STORE_ID` / `SSLCZ_STORE_PASSWORD` — get a free **sandbox** store at https://developer.sslcommerz.com/registration/ (instant, no approval needed for testing)
- `BACKEND_URL` — your deployed backend URL (or `http://localhost:5000` locally)

## 3. Set up the database

```bash
npm run prisma:migrate    # creates tables from prisma/schema.prisma
npm run seed               # creates admin user + default categories
```

## 4. Run it

```bash
npm run dev     # local dev with auto-reload (http://localhost:5000)
```

Build for production:
```bash
npm run build
npm start
```

## 5. Test the API

Import the endpoints into Postman/Thunder Client. Flow to test:
1. `POST /api/auth/register` (role: TENANT or LANDLORD) → get a token
2. `POST /api/auth/login` with the seeded admin to get an admin token
3. Landlord: `POST /api/landlord/properties` to create a listing
4. Tenant: `POST /api/rentals` to request it
5. Landlord: `PATCH /api/landlord/requests/:id` with `{"status":"APPROVED"}`
6. Tenant: `POST /api/payments/create` with `{"rentalRequestId":"..."}` → returns a `gatewayUrl`, open it in a browser to pay via SSLCommerz sandbox
7. After sandbox payment, SSLCommerz redirects to `/api/payments/confirm`, which marks the payment `COMPLETED` and the rental `ACTIVE`
8. Tenant: `POST /api/reviews` once the rental is active/completed

## Project structure

```
src/
  config/        env config
  lib/           prisma client, sslcommerz wrapper
  middleware/    auth (JWT + roles), validation, error handling
  validations/   zod schemas per resource
  controllers/   request handlers (thin)
  services/      business logic + prisma queries
  routes/        route definitions, mounted under /api
prisma/
  schema.prisma  DB schema
  seed.ts        admin + category seed
```

## Notes

- All errors return `{ success: false, message, errorDetails }` via the global error handler in `src/middleware/errorHandler.ts`.
- All success responses return `{ success: true, message, data }` via `src/utils/ApiResponse.ts`.
- Roles are fixed at registration: `TENANT` or `LANDLORD`. Admin is seeded, not self-registered.
- The `properties`, `landlord`, `rentals`, `payments`, `reviews`, `admin` route files each follow the same controller → service → prisma pattern — copy that pattern for any endpoint you still need to add or tweak.
