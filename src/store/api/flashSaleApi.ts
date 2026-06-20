import type { FlashSale, FlashSalePayload } from "@/types/flashSale";
import { baseApi } from "./baseApi";

export const flashSaleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveFlashSales: builder.query<FlashSale[], void>({
      query: () => "/flash-sales",
      providesTags: ["FlashSale"],
    }),
    getFlashSales: builder.query<FlashSale[], void>({
      query: () => "/flash-sales/manage",
      providesTags: ["FlashSale"],
    }),
    createFlashSale: builder.mutation<FlashSale, FlashSalePayload>({
      query: (body) => ({ url: "/flash-sales", method: "POST", body }),
      invalidatesTags: ["FlashSale"],
    }),
    updateFlashSale: builder.mutation<FlashSale, { id: string | number; body: Partial<FlashSalePayload> }>({
      query: ({ id, body }) => ({ url: `/flash-sales/${id}`, method: "PUT", body }),
      invalidatesTags: ["FlashSale"],
    }),
    deleteFlashSale: builder.mutation<FlashSale, string | number>({
      query: (id) => ({ url: `/flash-sales/${id}`, method: "DELETE" }),
      invalidatesTags: ["FlashSale"],
    }),
  }),
});

export const {
  useGetActiveFlashSalesQuery,
  useGetFlashSalesQuery,
  useCreateFlashSaleMutation,
  useUpdateFlashSaleMutation,
  useDeleteFlashSaleMutation,
} = flashSaleApi;
