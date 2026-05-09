import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { demoBaseQuery } from "@/data/mockApi";

const realBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    headers.set("Accept", "application/json");
    if (!(headers.get("Content-Type"))) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  }
});

/**
 * Hybrid base query.
 * - mock mode: uses local demo data and works without Laravel backend.
 * - real mode: calls Laravel API using the same endpoint contracts.
 */
const hybridBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const mode = process.env.NEXT_PUBLIC_API_MODE || "mock";
  if (mode === "real") return realBaseQuery(args, api, extraOptions);
  return demoBaseQuery(args, api, extraOptions);
};

export const baseApi = createApi({
  reducerPath: "shopbotApi",
  baseQuery: hybridBaseQuery,
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
    "SuperAdmin"
  ],
  endpoints: () => ({})
});
