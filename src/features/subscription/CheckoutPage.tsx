"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  useCheckoutSubscriptionMutation,
  useGetPlansQuery,
  useGetSubscriptionQuery,
} from "@/store/api/settingsApi";
import type { CheckoutPayload } from "@/types/subscription";

export function SubscriptionCheckoutPage() {
  const searchParams = useSearchParams();
  const { data: plans = [] } = useGetPlansQuery();
  const { data: subscription } = useGetSubscriptionQuery();
  const [checkout, { isLoading }] = useCheckoutSubscriptionMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(searchParams.get("plan"));
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [method, setMethod] = useState<CheckoutPayload["payment_method"]>("bkash");
  const [bankForm, setBankForm] = useState({
    transaction_id: "",
    bank_name: "",
    bank_account_name: "",
    bank_deposit_date: "",
    note: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const selectedPlan = useMemo(() => {
    return plans.find((plan) => String(plan.id) === selectedPlanId) || subscription?.plan || plans[0];
  }, [plans, selectedPlanId, subscription]);

  const amount =
    billingCycle === "yearly" && selectedPlan?.price_yearly
      ? selectedPlan.price_yearly
      : selectedPlan?.price_monthly || 0;

  async function submitPayment() {
    if (!selectedPlan) return;
    setMessage(null);
    const result = await checkout({
      plan_id: selectedPlan.id,
      billing_cycle: billingCycle,
      payment_method: method,
      ...(method === "bank" ? bankForm : {}),
    }).unwrap();

    if (result.redirect_url) {
      window.location.href = result.redirect_url;
      return;
    }

    setMessage("Bank payment submitted. Your subscription will activate after admin approval.");
  }

  return (
    <>
      <PageHeader
        title="Subscription checkout"
        description="Choose a plan, pay securely, and keep your ShopBot BD workspace active."
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlanId(String(plan.id));
                    window.history.replaceState(null, "", `/subscription/checkout?plan=${plan.id}`);
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedPlan?.id === plan.id
                      ? "border-brand-400 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="font-black text-slate-950">{plan.name}</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {formatCurrency(plan.price_monthly)}
                  </p>
                  <p className="text-xs text-slate-500">per month</p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Billing cycle</span>
                <Select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as "monthly" | "yearly")}>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Payment method</span>
                <Select value={method} onChange={(e) => setMethod(e.target.value as CheckoutPayload["payment_method"])}>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="bank">Manual bank payment</option>
                </Select>
              </label>
            </div>

            {method === "bank" ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input placeholder="Bank name" value={bankForm.bank_name} onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })} />
                <Input placeholder="Sender account name" value={bankForm.bank_account_name} onChange={(e) => setBankForm({ ...bankForm, bank_account_name: e.target.value })} />
                <Input placeholder="Transaction/reference ID" value={bankForm.transaction_id} onChange={(e) => setBankForm({ ...bankForm, transaction_id: e.target.value })} required />
                <Input type="date" value={bankForm.bank_deposit_date} onChange={(e) => setBankForm({ ...bankForm, bank_deposit_date: e.target.value })} />
                <Textarea className="md:col-span-2" placeholder="Note for admin" value={bankForm.note} onChange={(e) => setBankForm({ ...bankForm, note: e.target.value })} />
              </div>
            ) : null}

            {message ? <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{message}</p> : null}

            <Button className="mt-5" onClick={submitPayment} disabled={!selectedPlan || isLoading}>
              {method === "bank" ? <Building2 className="h-4 w-4" /> : method === "bkash" ? <CreditCard className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              {isLoading ? "Processing..." : method === "bank" ? "Submit bank payment" : `Pay ${formatCurrency(amount)}`}
            </Button>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-black text-slate-950">Subscription status</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Current plan: <span className="font-semibold text-slate-950">{subscription?.plan?.name || "None"}</span></p>
            <p>Status: <span className="font-semibold text-slate-950">{subscription?.status || "none"}</span></p>
            <p>Expires: <span className="font-semibold text-slate-950">{formatDate(subscription?.ends_at || subscription?.trial_ends_at)}</span></p>
            <p>Selected plan: <span className="font-semibold text-slate-950">{selectedPlan?.name}</span></p>
            <p>Amount: <span className="font-semibold text-slate-950">{formatCurrency(amount)}</span></p>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-500">
            Active renewals extend from the current expiry date. Expired subscriptions restart from today.
          </div>
        </Card>
      </div>
    </>
  );
}
