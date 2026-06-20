"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/formatters";
import { useApplyCouponMutation } from "@/store/api/couponApi";
import type { ApplyCouponResult } from "@/types/coupon";

export function CouponInput({
  orderTotal,
  onApplied,
}: {
  orderTotal: number;
  onApplied?: (result: ApplyCouponResult) => void;
}) {
  const [code, setCode] = useState("");
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();
  const [result, setResult] = useState<ApplyCouponResult | null>(null);
  const [error, setError] = useState("");

  async function handleApply() {
    if (!code.trim()) return;
    setError("");
    setResult(null);
    try {
      const response = await applyCoupon({ code: code.trim(), order_total: orderTotal }).unwrap();
      setResult(response);
      onApplied?.(response);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message || "Could not apply this coupon";
      setError(message);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="pl-11"
            disabled={isLoading}
          />
        </div>
        <Button
          type="button"
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isLoading ? "Applying..." : "Apply"}
        </Button>
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {result ? (
        <p className="text-sm font-medium text-emerald-700">
          Coupon &quot;{result.code}&quot; applied — you saved {formatCurrency(result.discount_amount)}.
          New total: {formatCurrency(result.final_total)}
        </p>
      ) : null}
    </div>
  );
}
