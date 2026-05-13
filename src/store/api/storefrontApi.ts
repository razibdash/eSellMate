import type {
  PublicCheckoutPayload,
  PublicCheckoutResponse,
  Storefront,
  StorefrontOverview,
  StorefrontProduct,
  StorefrontSettingsPayload,
} from "@/types/storefront";
import { baseApi } from "./baseApi";

export const storefrontApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStorefrontSettings: builder.query<Storefront, void>({
      query: () => "/storefront",
      providesTags: ["Storefront"],
    }),
    updateStorefrontSettings: builder.mutation<
      Storefront,
      StorefrontSettingsPayload
    >({
      query: (body) => ({ url: "/storefront", method: "PUT", body }),
      invalidatesTags: ["Storefront", "StorefrontPublic", "Product"],
    }),
    uploadStorefrontLogo: builder.mutation<{ logo_path: string }, FormData>({
      query: (body) => ({ url: "/storefront/logo", method: "POST", body }),
      invalidatesTags: ["Storefront", "StorefrontPublic"],
    }),
    uploadStorefrontBanner: builder.mutation<{ banner_path: string }, FormData>({
      query: (body) => ({ url: "/storefront/banner", method: "POST", body }),
      invalidatesTags: ["Storefront", "StorefrontPublic"],
    }),
    getPublicStorefront: builder.query<StorefrontOverview, void>({
      query: () => "/public/storefront",
      providesTags: ["StorefrontPublic"],
    }),
    getPublicProducts: builder.query<
      StorefrontProduct[],
      { q?: string; category_id?: string | number; featured?: boolean } | void
    >({
      query: (params) =>
        params ? { url: "/public/products", params } : "/public/products",
      providesTags: ["StorefrontPublic"],
    }),
    getPublicProduct: builder.query<StorefrontProduct, string>({
      query: (slug) => `/public/products/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "StorefrontPublic", id: slug }],
    }),
    checkoutPublicStorefront: builder.mutation<
      PublicCheckoutResponse,
      PublicCheckoutPayload
    >({
      query: (body) => ({ url: "/public/checkout", method: "POST", body }),
    }),
    getPublicPaymentStatus: builder.query<any, string>({
      query: (reference) => `/public/payment-status/${reference}`,
      providesTags: (_result, _error, reference) => [
        { type: "StorefrontPublic", id: reference },
      ],
    }),
  }),
});

export const {
  useGetStorefrontSettingsQuery,
  useUpdateStorefrontSettingsMutation,
  useUploadStorefrontLogoMutation,
  useUploadStorefrontBannerMutation,
  useGetPublicStorefrontQuery,
  useGetPublicProductsQuery,
  useGetPublicProductQuery,
  useCheckoutPublicStorefrontMutation,
  useGetPublicPaymentStatusQuery,
} = storefrontApi;
