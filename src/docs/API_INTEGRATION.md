# Laravel API Integration Guide

This frontend uses RTK Query and calls the Laravel API directly.

## 1. Configure API URL

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Restart Next.js:

```bash
npm run dev
```

## 2. Endpoint contracts

The frontend already calls these Laravel endpoints:

### Auth

```txt
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
POST /auth/forgot-password
POST /auth/reset-password
```

### Business

```txt
GET  /business
PUT  /business
POST /business/logo
GET  /business/settings
PUT  /business/settings
```

### Product and category

```txt
GET    /categories
POST   /categories
PUT    /categories/{id}
DELETE /categories/{id}
GET    /products
POST   /products
GET    /products/{id}
PUT    /products/{id}
DELETE /products/{id}
POST   /products/{id}/image
GET    /products/low-stock
GET    /stock/movements
GET    /stock/low-stock
```

### Customer

```txt
GET    /customers
POST   /customers
GET    /customers/{id}
PUT    /customers/{id}
DELETE /customers/{id}
GET    /customers/{id}/orders
```

### Order

```txt
GET    /orders
POST   /orders
GET    /orders/{id}
PUT    /orders/{id}
DELETE /orders/{id}
PUT    /orders/{id}/status
PUT    /orders/{id}/payment-status
PUT    /orders/{id}/delivery-status
POST   /orders/{id}/payments
GET    /orders/{id}/invoice
POST   /orders/{id}/invoice/generate
```

### Reports

```txt
GET /reports/dashboard
GET /reports/sales
GET /reports/products
GET /reports/customers
GET /reports/payments
GET /reports/delivery
GET /reports/low-stock
```

### AI

```txt
POST /ai/caption
POST /ai/reply
GET  /ai/insights
POST /ai/insights/generate
GET  /ai/history
```

### Subscription

```txt
GET  /plans
GET  /subscription
POST /subscription/change
POST /subscription/payment
GET  /subscription/invoices
```

## 3. Laravel response format

Expected:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

For list:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [],
    "total": 100,
    "current_page": 1,
    "per_page": 20
  }
}
```

The base API unwraps this response shape for feature views.

## 4. Auth

The frontend sends token in this header when `auth.token` exists:

```txt
Authorization: Bearer {token}
```

Laravel Sanctum token login can return:

```json
{
  "user": {
    "id": 1,
    "name": "Owner",
    "email": "owner@example.com",
    "role": "owner",
    "permissions": ["view_dashboard", "manage_products"]
  },
  "token": "plain-text-token"
}
```

## 5. Where to edit API integration

```txt
src/store/api/baseApi.ts
src/store/api/authApi.ts
src/store/api/productApi.ts
src/store/api/customerApi.ts
src/store/api/orderApi.ts
src/store/api/reportApi.ts
src/store/api/aiApi.ts
src/store/api/settingsApi.ts
src/store/api/superAdminApi.ts
```
