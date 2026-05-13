# Frontend Architecture

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Redux Toolkit
- RTK Query
- React Hook Form ready
- Zod ready
- Recharts
- Laravel API-ready structure

## Core principles

1. Routes stay in `src/app`.
2. Feature UI stays in `src/features`.
3. Reusable components stay in `src/components`.
4. Server data is handled by RTK Query in `src/store/api`.
5. Global client state is handled by Redux slices in `src/store/slices`.
6. Laravel API response handling is centralized in `src/store/api/baseApi.ts`.
7. Business constants and helpers stay in `src/lib`.
8. TypeScript domain models stay in `src/types`.

## Feature mapping

| Documentation module | Frontend location |
|---|---|
| Auth | `src/features/auth` |
| Business setup | `src/features/onboarding`, `src/features/settings` |
| Dashboard | `src/features/dashboard` |
| Products | `src/features/products` |
| Categories | `src/features/products/CategoriesView.tsx` |
| Customers | `src/features/customers` |
| Orders | `src/features/orders` |
| Invoice | `src/features/orders/InvoiceView.tsx` |
| Payment status | `src/features/orders/OrderDetails.tsx` |
| Delivery status | `src/features/orders/OrderDetails.tsx` |
| Stock | `src/features/products/StockViews.tsx` |
| WhatsApp templates | `src/features/settings/SettingsViews.tsx` |
| AI caption/reply/insights | `src/features/ai` |
| Reports | `src/features/reports` |
| Subscription | `src/features/settings/SettingsViews.tsx` |
| Staff/roles | `src/features/settings/SettingsViews.tsx` |
| Super Admin | `src/features/super-admin` |

## Production notes

- Add form-level Zod validation in feature forms before launch.
- Add toast notifications after mutation success or error.
- Add pagination controls where table views need page navigation.
- Add file upload support for product images and business logo using `FormData`.
- Add route-level permission guards for restricted pages.
