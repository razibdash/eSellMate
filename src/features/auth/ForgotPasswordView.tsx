"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { AuthCard } from "./AuthCard";

export function ForgotPasswordView() {
  const [email, setEmail] = useState("owner@shopbotbd.test");
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await forgotPassword({ email }).unwrap();
    setSent(true);
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Frontend is ready for Laravel reset-password flow."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
        {sent ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Reset instruction sent.
          </p>
        ) : null}
        <Button className="w-full" disabled={isLoading}>
          Send reset link
        </Button>
      </form>
      <Link
        className="mt-5 block text-center text-sm font-semibold text-brand-700"
        href="/login"
      >
        Back to login
      </Link>
    </AuthCard>
  );
}
