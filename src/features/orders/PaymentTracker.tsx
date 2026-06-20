"use client";

import { useState } from "react";
import { Wallet, CircleCheck, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { formatCurrency, formatDateTime, titleCase } from "@/lib/formatters";
import { paymentMethods } from "@/lib/constants";
import { useAddPaymentMutation, useGetOrderQuery } from "@/store/api/orderApi";
import type { PaymentMethod } from "@/types/order";

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "default" | "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-50 text-slate-900";

  return (
    <Card className="flex items-center gap-4">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${toneClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
      </div>
    </Card>
  );
}

export function PaymentTracker({ orderId }: { orderId: string | number }) {
  const { data: order, isLoading } = useGetOrderQuery(orderId);
  const [addPayment, { isLoading: isSaving }] = useAddPaymentMutation();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<{ amount: string; payment_method: PaymentMethod }>({
    amount: "",
    payment_method: "cash",
  });

  if (isLoading || !order) return <PageLoader />;

  const due = Number(order.due_amount);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (amount > due) {
      setError(`Amount cannot exceed the due amount of ${formatCurrency(due)}.`);
      return;
    }

    try {
      await addPayment({
        id: orderId,
        body: { amount, payment_method: form.payment_method },
      }).unwrap();
      setForm({ amount: "", payment_method: "cash" });
      setOpen(false);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message || "Could not save this payment";
      setError(message);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Wallet className="h-6 w-6" />}
          label="Total"
          value={formatCurrency(order.total_amount)}
          tone="default"
        />
        <SummaryCard
          icon={<CircleCheck className="h-6 w-6" />}
          label="Paid"
          value={formatCurrency(order.paid_amount)}
          tone="success"
        />
        <SummaryCard
          icon={<CircleDollarSign className="h-6 w-6" />}
          label="Due"
          value={formatCurrency(due)}
          tone="warning"
        />
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-950">Payment history</h3>
          <Button onClick={() => setOpen(true)} disabled={due <= 0}>
            Add payment
          </Button>
        </div>

        {order.payments?.length ? (
          <div className="space-y-2">
            {order.payments.map((item) => (
              <div
                key={String(item.id)}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(item.paid_at)}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                  {titleCase(item.payment_method)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No payments recorded yet.</p>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add payment"
        description={`Due amount: ${formatCurrency(due)}`}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-700">Amount</label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              max={due}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Payment method</label>
            <Select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value as PaymentMethod })}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {titleCase(method)}
                </option>
              ))}
            </Select>
          </div>
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <Button className="w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save payment"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
