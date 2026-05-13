import type { Business, BusinessSettings } from "@/types/business";
import { baseApi } from "./baseApi";

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusiness: builder.query<Business, void>({
      query: () => "/business",
      providesTags: ["Business"],
    }),
    updateBusiness: builder.mutation<Business, Partial<BusinessSettings>>({
      query: (body) => ({ url: "/business", method: "PUT", body }),
      invalidatesTags: ["Business"],
    }),
    getBusinessSettings: builder.query<Business, void>({
      query: () => "/business/settings",
      providesTags: ["Business"],
    }),
    uploadBusinessLogo: builder.mutation<{ logo: string }, FormData>({
      query: (body) => ({ url: "/business/logo", method: "POST", body }),
    }),
  }),
});

export const {
  useGetBusinessQuery,
  useUpdateBusinessMutation,
  useGetBusinessSettingsQuery,
  useUploadBusinessLogoMutation,
} = businessApi;
