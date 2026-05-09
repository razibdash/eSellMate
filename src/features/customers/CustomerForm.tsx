"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { useCreateCustomerMutation, useGetCustomerQuery, useUpdateCustomerMutation } from "@/store/api/customerApi";
import type { CustomerPayload } from "@/types/customer";

const blank: CustomerPayload = { name: "", phone: "", email: "", address: "", area: "", city: "Dhaka", note: "", status: "active" };

export function CustomerForm({ id }: { id?: string }) {
  const router = useRouter();
  const { data } = useGetCustomerQuery(id!, { skip: !id });
  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [form, setForm] = useState<CustomerPayload>(blank);
  useEffect(() => { if (data) setForm({ name: data.name, phone: data.phone, email: data.email, address: data.address, area: data.area, city: data.city, note: data.note, status: data.status }); }, [data]);
  async function submit(e: React.FormEvent) { e.preventDefault(); if (id) await updateCustomer({ id, body: form }).unwrap(); else await createCustomer(form).unwrap(); router.push("/customers"); }
  return <><PageHeader title={id ? "Edit customer" : "Add customer"} description="Customer database helps identify repeat buyers and follow-up opportunities." /><Card><form onSubmit={submit} className="grid gap-4 lg:grid-cols-2"><Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /><Input placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /><Input placeholder="Area" value={form.area || ""} onChange={(e) => setForm({ ...form, area: e.target.value })} /><Input placeholder="City" value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} /><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CustomerPayload["status"] })}><option value="active">Active</option><option value="blocked">Blocked</option></Select><Textarea className="lg:col-span-2" placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /><Textarea className="lg:col-span-2" placeholder="Customer note" value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} /><Button>Save customer</Button></form></Card></>;
}
