#!/usr/bin/env bash
# Creates a meaningful, step-by-step commit history. Run once in an empty git repo:  bash make-commits.sh
set -e
[ -d .git ] || git init -b main
c() { msg="$1"; shift; git add -- "$@" 2>/dev/null || true; git diff --cached --quiet || git commit -q -m "$msg"; }
c "chore: initialize Next.js app with Tailwind and project config" package.json package-lock.json next.config.mjs postcss.config.js tailwind.config.js jsconfig.json .gitignore
c "chore: add environment variable template" .env.example
c "style: add global styles, design tokens and shared button and input classes" app/globals.css app/icon.svg
c "feat: add logo, avatar and X social icon components" components/Logo.js components/Avatar.js components/XIcon.js
c "feat: build sticky responsive navbar with role-aware account menu" components/Navbar.js
c "feat: build footer with categories, contact info and X logo" components/Footer.js
c "feat: set up MongoDB connection and BetterAuth with role fields and sign-up role hook" lib/mongodb.js lib/auth.js lib/auth-client.js app/api/auth
c "feat: add JWT token endpoint and route protection middleware" app/api/token middleware.js
c "feat: add API helper with automatic token handling, utilities and hooks" lib/api.js lib/server-api.js lib/utils.js lib/constants.js hooks
c "feat: add root layout, loading, error and custom 404 pages" app/layout.js app/loading.js app/error.js app/not-found.js components/Providers.js
c "feat: add service card, status badge, empty state, modal, table and pagination components" components/ServiceCard.js components/StatusBadge.js components/EmptyState.js components/Modal.js components/ResponsiveTable.js components/Pagination.js components/StatsCard.js
c "feat: build home page with hero ticket, latest services, how it works and categories" "app/(public)/layout.js" "app/(public)/loading.js" "app/(public)/page.js" components/HeroTicket.js public
c "feat: add How It Works page" "app/(public)/about"
c "feat: add sign-up page with role selection and password rules" "app/(public)/sign-up"
c "feat: add sign-in page with redirect back after login" "app/(public)/sign-in"
c "feat: add services page with server-side search, filter, sort and pagination" "app/(public)/services/page.js" "app/(public)/services/ServicesBrowser.js"
c "feat: add service details page and role-restricted repair request form" "app/(public)/services/[id]"
c "feat: add dashboard layout with role-based sidebar and guards" app/dashboard/layout.js app/dashboard/loading.js app/dashboard/page.js app/dashboard/PageHeader.js components/RoleGuard.js
c "feat: add charts and customer dashboard overview" components/Charts.js app/dashboard/customer/layout.js app/dashboard/customer/page.js
c "feat: add customer bookings with cancel, tracking and Pay Now" components/JobTimeline.js app/dashboard/customer/bookings
c "feat: add Stripe success and cancel pages and payment history" "app/(public)/payment" app/dashboard/customer/payments
c "feat: add technician overview and add-service form with ImgBB upload" components/ImageUploader.js components/ServiceForm.js app/dashboard/technician/layout.js app/dashboard/technician/page.js app/dashboard/technician/add-service
c "feat: add technician my-services CRUD and availability switch" app/dashboard/technician/my-services
c "feat: add technician request management with status pipeline and final amount" app/dashboard/technician/requests
c "feat: add admin overview and user role management" app/dashboard/admin/layout.js app/dashboard/admin/page.js app/dashboard/admin/users
c "feat: add admin service approval, bookings and transactions" app/dashboard/admin/services app/dashboard/admin/bookings app/dashboard/admin/transactions
c "feat: add shared profile update page" app/dashboard/profile
c "feat: add seed script with demo accounts and data" scripts/seed.mjs
c "docs: add README with demo credentials and setup" README.md make-commits.sh
git log --oneline | cat
