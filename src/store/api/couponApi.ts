import type { ApplyCouponPayload, ApplyCouponResult, Coupon, CouponPayload } from "@/types/coupon";
import { baseApi } from "./baseApi";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], void>({
      query: () => "/coupons",
      providesTags: ["Coupon"],
    }),
    createCoupon: builder.mutation<Coupon, CouponPayload>({
      query: (body) => ({ url: "/coupons", method: "POST", body }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: builder.mutation<Coupon, { id: string | number; body: Partial<CouponPayload> }>({
      query: ({ id, body }) => ({ url: `/coupons/${id}`, method: "PUT", body }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation<Coupon, string | number>({
      query: (id) => ({ url: `/coupons/${id}`, method: "DELETE" }),
      invalidatesTags: ["Coupon"],
    }),
    applyCoupon: builder.mutation<ApplyCouponResult, ApplyCouponPayload>({
      query: (body) => ({ url: "/apply-coupon", method: "POST", body }),
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
} = couponApi;
