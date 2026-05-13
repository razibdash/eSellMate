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
- Laravel API integration through RTK Query

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Laravel API

Set this in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

The RTK Query endpoints call the Laravel backend directly and normalize the API envelope returned by `ApiController`.

## Important folders

```txt
src/app                  Next.js routes
src/features             Feature-level UI and business logic
src/components           Reusable UI, layout, tables, cards, modals
src/store                Redux store, RTK Query APIs, slices
src/lib                  Helpers, constants, formatters, permission utilities
src/types                TypeScript domain types
src/docs                 Frontend implementation notes and API integration guide
```

## API Response Shape

The frontend expects Laravel responses like this:

```json
{
  "success": true,
  "message": "Success",
  "data": [],
}
```

For single resource:

```json
{
  "data": {}
}
```

Paginated Laravel responses are unwrapped to the inner `data` array for table views.
