"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useRegisterMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { AuthCard } from "./AuthCard";

export function RegisterView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    business_name: "",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await registerUser(form).unwrap();
    dispatch(setCredentials(result));
    router.push("/onboarding/business-profile");
  }

  return (
    <AuthCard
      title="Create your seller account"
      subtitle="Register user and business together, matching the Laravel API plan."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          placeholder="Business name"
          value={form.business_name}
          onChange={(e) => setForm({ ...form, business_name: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? (
            <LoadingSpinner className="border-white/50 border-t-white" />
          ) : null}
          Create account
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link className="font-semibold text-brand-700" href="/login">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
