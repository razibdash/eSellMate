# eSellMate Frontend

A production-ready frontend starter for **eSellMate**, an AI-powered web order manager for Facebook and WhatsApp sellers. It uses Next.js App Router, TypeScript, Tailwind CSS, Redux Toolkit, RTK Query, React Hook Form, Zod and Recharts.

## What is included

- Public website: Home, Features, Pricing, Demo request
- Auth: Login, Register, Forgot password
- Onboarding: Business profile, first product, invoice setup, choose plan
- Dashboard: KPIs, charts, low-stock alerts, AI insights, recent orders, top products
- Products: List, create, edit, details, categories, low stock, stock movements
- Customers: List, create, edit/profile, order history
- Orders: List, create, details, status update, payment tracking, invoice preview, WhatsApp share
- Reports: Sales, products, customers, payments, delivery, low-stock
- AI: Caption generator, reply generator, insights, history
- Settings: Business, invoice, WhatsApp templates, staff, roles/permissions, subscription, billing
- Super Admin: Dashboard, businesses, users, plans, subscriptions, logs, AI usage
- Demo data mode by default
- Real Laravel API mode ready through RTK Query

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Demo login:

```txt
Email: owner@shopbotbd.test
Password: password
```

## Switch from demo data to Laravel API

Set this in `.env.local`:

```env
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The RTK Query endpoints are already aligned with the Laravel REST API plan from the documentation. When your backend is ready, keep the same endpoint names or update files inside `src/store/api/`.

## Important folders

```txt
src/app                  Next.js routes
src/features             Feature-level UI and business logic
src/components           Reusable UI, layout, tables, cards, modals
src/store                Redux store, RTK Query APIs, slices
src/lib                  Helpers, constants, formatters, permission utilities
src/types                TypeScript domain types
src/data                 Demo data and mock API adapter
src/docs                 Frontend implementation notes and API integration guide
```

## Real API response recommendation

For easiest integration, return JSON like this from Laravel:

```json
{
  "data": [],
  "meta": {}
}
```

For single resource:

```json
{
  "data": {}
}
```

The current code also works with direct array/object responses, but the `data` wrapper is recommended for Laravel API Resources.

## Notes

This package is frontend only. It contains mock/demo data so the UI can run before backend development. Later, connect your Laravel API by changing environment mode to `real`.
