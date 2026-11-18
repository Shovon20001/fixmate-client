# FixMate

**FixMate** is a role-based platform for booking device and home-appliance repairs. Customers request repairs, technicians list services and move jobs through a status pipeline, admins moderate everything, and the customer **pays only after the job is completed**.

- **Live site:** https://YOUR-CLIENT.vercel.app
- **Server repo:** https://github.com/YOUR-USER/fixmate-server

## Demo accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@fixmate.dev | Admin@123 |
| Technician | rafiq.tech@fixmate.dev | Tech@1234 |
| Technician | nusrat.tech@fixmate.dev | Tech@1234 |
| Customer | customer@fixmate.dev | Customer@123 |
| Customer | maliha@fixmate.dev | Customer@123 |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Features
- BetterAuth (email + password, optional Google) with `role`, `phone`, `area`, `bio`. Sign-up only accepts customer or technician; the server forces anything else to customer.
- Sticky navbar with account menu, footer with the new **X logo**, custom 404 and error pages, skeleton loaders, toasts, empty states, confirmation modals.
- Services page: server-side search, category and mode filters, sorting and pagination, all stored in the URL (`/services?category=AC` works, filters survive reload).
- Service details with a role-restricted repair request form.
- Customer dashboard: bookings (cancel, track, **Pay Now** only when completed and unpaid), payment history, charts.
- Technician dashboard: add and edit services (ImgBB upload), availability switch, request management with the status pipeline and final amount.
- Admin dashboard: users and roles, service approval, all bookings, transactions and total revenue, charts.
- Stripe Checkout with success page verification and webhook, no duplicate payments.
- Optional extras: status timeline tracker, pagination.

## Packages
next, react, better-auth, mongodb, jsonwebtoken, tailwindcss, recharts, lucide-react, sonner

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in the values
npm run seed                 # demo users, 17 services, bookings, payments
npm run dev                  # http://localhost:3000
```
Start the server repo too (`NEXT_PUBLIC_API_URL` points to it). `JWT_SECRET` must match the server.

## Deploy (Vercel)
Add every variable from `.env.example`. Set `BETTER_AUTH_URL` to the deployed site URL and `NEXT_PUBLIC_API_URL` to the deployed server URL. Add the site URL to the server's `CLIENT_URL`, then reload a private route to confirm you stay signed in.
