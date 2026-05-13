"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, KeyRound, Mail, Phone, Save, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/common/PageHeader";
import {
  useChangePasswordMutation,
  useMeQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

type Notice = { type: "success" | "error"; text: string } | null;

export function ProfileView() {
  const dispatch = useAppDispatch();
  const storedUser = useAppSelector((state) => state.auth.user);
  const { data: refreshedUser } = useMeQuery();
  const user = refreshedUser || storedUser;
  const [updateProfile, profileState] = useUpdateProfileMutation();
  const [uploadAvatar, avatarState] = useUploadAvatarMutation();
  const [changePassword, passwordState] = useChangePasswordMutation();
  const [profileNotice, setProfileNotice] = useState<Notice>(null);
  const [passwordNotice, setPasswordNotice] = useState<Notice>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user]);

  const initials = useMemo(() => {
    return (user?.name || "SB")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  async function submitProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileNotice(null);
    try {
      const updated = await updateProfile({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
      }).unwrap();
      dispatch(setUser(updated));
      setProfileNotice({ type: "success", text: "Profile updated successfully." });
    } catch {
      setProfileNotice({ type: "error", text: "Could not update profile. Check email or phone uniqueness." });
    }
  }

  async function submitAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileNotice(null);
    const body = new FormData();
    body.append("avatar", file);
    try {
      const updated = await uploadAvatar(body).unwrap();
      dispatch(setUser(updated));
      setProfileNotice({ type: "success", text: "Profile picture updated." });
    } catch {
      setProfileNotice({ type: "error", text: "Could not upload picture. Use an image under 2 MB." });
    } finally {
      e.target.value = "";
    }
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordNotice(null);
    try {
      await changePassword(passwords).unwrap();
      setPasswords({ current_password: "", password: "", password_confirmation: "" });
      setPasswordNotice({ type: "success", text: "Password changed successfully." });
    } catch {
      setPasswordNotice({ type: "error", text: "Could not change password. Check your current password and confirmation." });
    }
  }

  if (!user) return null;

  return (
    <>
      <PageHeader title="Profile" description="View your account details, profile picture and password settings." />

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <div className="flex flex-col items-center text-center">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-soft" />
            ) : (
              <div className="grid h-32 w-32 place-items-center rounded-full bg-slate-950 text-4xl font-black text-white shadow-soft">
                {initials}
              </div>
            )}
            <h2 className="mt-4 text-xl font-black text-slate-950">{user.name}</h2>
            <p className="mt-1 text-sm capitalize text-slate-500">{user.role.replace("_", " ")}</p>
            <label className="mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Camera className="h-4 w-4" />
              {avatarState.isLoading ? "Uploading..." : "Change picture"}
              <input type="file" accept="image/*" className="sr-only" onChange={submitAvatar} disabled={avatarState.isLoading} />
            </label>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
            <ProfileFact icon={<Mail className="h-4 w-4" />} label="Email" value={user.email || "Not set"} />
            <ProfileFact icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone || "Not set"} />
            <ProfileFact icon={<ShieldCheck className="h-4 w-4" />} label="Status" value={user.status} />
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-800">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">Account details</h3>
                <p className="text-sm text-slate-500">Keep your contact information current.</p>
              </div>
            </div>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={submitProfile}>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Phone</span>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <NoticeView notice={profileNotice} />
              <div className="md:col-span-2">
                <Button disabled={profileState.isLoading}>
                  <Save className="h-4 w-4" />
                  {profileState.isLoading ? "Saving..." : "Save profile"}
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">Password</h3>
                <p className="text-sm text-slate-500">Use at least 8 characters for your new password.</p>
              </div>
            </div>
            <form className="grid gap-4 md:grid-cols-3" onSubmit={submitPassword}>
              <Input type="password" placeholder="Current password" value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} required />
              <Input type="password" placeholder="New password" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} required />
              <Input type="password" placeholder="Confirm new password" value={passwords.password_confirmation} onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })} required />
              <NoticeView notice={passwordNotice} />
              <div className="md:col-span-3">
                <Button disabled={passwordState.isLoading}>
                  <KeyRound className="h-4 w-4" />
                  {passwordState.isLoading ? "Changing..." : "Change password"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}

function ProfileFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-slate-400">{icon}</span>
      <div className="min-w-0 text-left">
        <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
        <p className="truncate font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function NoticeView({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p className={`md:col-span-full rounded-2xl px-4 py-3 text-sm font-semibold ${notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      {notice.text}
    </p>
  );
}
