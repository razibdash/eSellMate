import type { ApproveReviewPayload, Review, SubmitReviewPayload } from "@/types/review";
import type { ID } from "@/types/common";
import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<Review[], ID>({
      query: (productId) => `/products/${productId}/reviews`,
      providesTags: (_result, _error, productId) => [{ type: "Product", id: `reviews-${productId}` }],
    }),
    submitReview: builder.mutation<Review, SubmitReviewPayload>({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Product", id: `reviews-${arg.product_id}` }],
    }),
    getAdminReviews: builder.query<Review[], void>({
      query: () => "/admin/reviews",
      providesTags: ["Review"],
    }),
    approveReview: builder.mutation<Review, ApproveReviewPayload>({
      query: ({ id, is_approved }) => ({
        url: `/admin/reviews/${id}/approve`,
        method: "PATCH",
        body: { is_approved },
      }),
      invalidatesTags: ["Review", "Product"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useSubmitReviewMutation,
  useGetAdminReviewsQuery,
  useApproveReviewMutation,
} = reviewApi;
