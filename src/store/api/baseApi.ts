import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { getStorefrontSubdomain } from "@/lib/storefront";

const realBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    headers.set("Accept", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const subdomain = getStorefrontSubdomain();
    if (subdomain) headers.set("X-Store-Subdomain", subdomain);
    return headers;
  },
});

type LaravelEnvelope<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

type LaravelPaginator<T = unknown> = {
  data: T[];
  current_page?: number;
  per_page?: number;
  total?: number;
};

function unwrapLaravelResponse(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("data" in payload))
    return payload;

  const envelope = payload as LaravelEnvelope;
  const data = envelope.data;

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as LaravelPaginator).data)
  ) {
    return (data as LaravelPaginator).data;
  }

  return data;
}

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await realBaseQuery(args, api, extraOptions);

  if (result.error) return result;

  return {
    ...result,
    data: unwrapLaravelResponse(result.data),
  };
};

export const baseApi = createApi({
  reducerPath: "shopbotApi",
  baseQuery,
  tagTypes: [
    "Auth",
    "Business",
    "Product",
    "Category",
    "Customer",
    "Order",
    "Invoice",
    "Stock",
    "Report",
    "AI",
    "Staff",
    "Subscription",
    "MessageTemplate",
    "Notification",
    "SuperAdmin",
    "Storefront",
    "StorefrontPublic",
    "Coupon",
    "FlashSale",
    "Review",
    "Chat",
  ],
  endpoints: () => ({}),
});
