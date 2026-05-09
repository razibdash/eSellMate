"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { AuthCard } from "./AuthCard";

export function LoginView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [email, setEmail] = useState("owner@shopbotbd.test");
  const [password, setPassword] = useState("password");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await login({ email, password }).unwrap();
    dispatch(setCredentials(result));
    router.push("/dashboard");
  }

  return (
    <AuthCard title="Welcome back" subtitle="Use the demo account now. Later connect Laravel Sanctum or token auth.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Email</label>
        <div className="relative"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-11" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <label className="block text-sm font-semibold text-slate-700">Password</label>
        <div className="relative"><Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-11" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">Login failed. Please check API mode or credentials.</p> : null}
        <Button className="w-full" disabled={isLoading}>{isLoading ? <LoadingSpinner className="border-white/50 border-t-white" /> : null}Login to dashboard</Button>
      </form>
      <div className="mt-5 flex justify-between text-sm">
        <Link className="font-semibold text-brand-700" href="/forgot-password">Forgot password?</Link>
        <Link className="font-semibold text-brand-700" href="/register">Create account</Link>
      </div>
    </AuthCard>
  );
}
