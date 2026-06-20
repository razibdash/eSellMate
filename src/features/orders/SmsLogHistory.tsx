"use client";

import { useState } from "react";
import { MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime, titleCase } from "@/lib/formatters";
import { useGetOrderQuery, useResendSmsMutation } from "@/store/api/orderApi";

export function SmsLogHistory({ orderId }: { orderId: string | number }) {
  const { data: order, isLoading } = useGetOrderQuery(orderId);
  const [resendSms, { isLoading: isResending }] = useResendSmsMutation();
  const [error, setError] = useState("");

  if (isLoading || !order) return null;

  const logs = order.sms_logs || [];

  async function handleResend() {
    setError("");
    try {
      await resendSms(orderId).unwrap();
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message || "Could not resend SMS";
      setError(message);
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-slate-400" />
          <h3 className="text-base font-bold text-slate-950">SMS log</h3>
        </div>
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResending || !logs.length}
        >
          <RefreshCw className="h-4 w-4" />
          {isResending ? "Resending..." : "Resend SMS"}
        </Button>
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {logs.length ? (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={String(log.id)}
              className="space-y-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-900">{titleCase(log.type)}</span>
                <Badge value={log.status} />
              </div>
              <p className="text-slate-600">{log.message}</p>
              <p className="text-xs text-slate-400">
                {formatDateTime(log.sent_at || log.created_at)} · {log.phone}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No SMS has been sent for this order yet.</p>
      )}
    </Card>
  );
}
