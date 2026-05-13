import type { Product } from "@/types/product";
import type { StockMovement } from "@/types/stock";
import { baseApi } from "./baseApi";

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStockMovements: builder.query<StockMovement[], void>({
      query: () => "/stock/movements",
      transformResponse: (
        response: Array<StockMovement & { product?: Product }>,
      ) =>
        response.map((movement) => ({
          ...movement,
          product_name: movement.product_name ?? movement.product?.name ?? "",
        })),
      providesTags: ["Stock"],
    }),
    getLowStock: builder.query<Product[], void>({
      query: () => "/stock/low-stock",
      providesTags: ["Stock", "Product"],
    }),
  }),
});

export const { useGetStockMovementsQuery, useGetLowStockQuery } = stockApi;
