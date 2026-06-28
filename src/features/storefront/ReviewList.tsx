"use client";

import { Star } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { useGetProductReviewsQuery } from "@/store/api/reviewApi";
import type { ID } from "@/types/common";

export function StarRating({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${className} ${
            rating >= star ? "fill-orange-500 text-orange-500" : "fill-transparent text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewList({ productId }: { productId: ID }) {
  const { data: reviews = [], isLoading } = useGetProductReviewsQuery(productId);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading reviews...</p>;
  }

  if (!reviews.length) {
    return (
      <p className="rounded-3xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500">
        No reviews yet. Be the first to share your experience with this product.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={String(review.id)} className="rounded-3xl border border-slate-100 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-slate-950">{review.customer?.name || "Verified customer"}</p>
            <p className="text-xs text-slate-400">{formatDate(review.created_at)}</p>
          </div>
          <div className="mt-2">
            <StarRating rating={review.rating} />
          </div>
          {review.comment ? (
            <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
