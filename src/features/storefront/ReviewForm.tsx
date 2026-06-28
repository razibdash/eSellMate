"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useSubmitReviewMutation } from "@/store/api/reviewApi";
import type { ID } from "@/types/common";

export function ReviewForm({ productId }: { productId: ID }) {
  const [submitReview, { isLoading }] = useSubmitReviewMutation();
  const [orderReference, setOrderReference] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!orderReference.trim()) {
      setError("Enter the order reference from your delivered order.");
      return;
    }
    if (rating < 1) {
      setError("Select a star rating.");
      return;
    }

    try {
      await submitReview({
        order_reference: orderReference.trim(),
        product_id: productId,
        rating,
        comment: comment.trim() || undefined,
      }).unwrap();
      setSuccess(true);
      setOrderReference("");
      setRating(0);
      setComment("");
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Could not submit your review. Check the order reference and try again.";
      setError(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-orange-100 bg-white p-5">
      <div>
        <h3 className="text-lg font-bold text-slate-950">Write a review</h3>
        <p className="mt-1 text-sm text-slate-500">
          Only customers with a delivered order for this product can leave a review.
        </p>
      </div>

      <Input
        value={orderReference}
        onChange={(e) => setOrderReference(e.target.value)}
        placeholder="Order reference (from your order confirmation)"
        disabled={isLoading}
      />

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <Star
              className={`h-7 w-7 ${
                (hoverRating || rating) >= star
                  ? "fill-orange-500 text-orange-500"
                  : "fill-transparent text-slate-300"
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share details about your experience with this product (optional)"
        disabled={isLoading}
      />

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {success ? (
        <p className="text-sm font-medium text-emerald-700">
          Thanks! Your review has been submitted and is awaiting approval.
        </p>
      ) : null}

      <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700">
        {isLoading ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}
