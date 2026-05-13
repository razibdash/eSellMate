"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "@/store/api/productApi";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types/product";

export function CategoriesView() {
  const { data = [] } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Category["status"]>("active");
  function resetForm() { setEditingId(null); setName(""); setDescription(""); setStatus("active"); }
  function edit(row: Category) { setEditingId(row.id); setName(row.name); setDescription(row.description || ""); setStatus(row.status); }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    const body = { name, slug: slugify(name), description, status };
    if (editingId) await updateCategory({ id: editingId, body }).unwrap();
    else await createCategory(body).unwrap();
    resetForm();
  }
  async function remove(id: string | number) {
    if (!window.confirm("Delete this category?")) return;
    await deleteCategory(id).unwrap();
    if (editingId === id) resetForm();
  }
  return (
    <div>
      <PageHeader title="Categories" description="Create, edit and filter products category-wise." />
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card><form onSubmit={submit} className="space-y-4"><Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} /><Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><select className="focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm" value={status} onChange={(e) => setStatus(e.target.value as Category["status"])}><option value="active">Active</option><option value="inactive">Inactive</option></select><div className="flex gap-2"><Button>{editingId ? "Update category" : "Create category"}</Button>{editingId ? <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button> : null}</div></form></Card>
        <DataTable<Category & Record<string, unknown>> data={data as (Category & Record<string, unknown>)[]} columns={[{ key: "name", header: "Name" }, { key: "slug", header: "Slug" }, { key: "description", header: "Description" }, { key: "status", header: "Status", render: (row) => <Badge value={row.status} /> }, { key: "actions", header: "Actions", render: (row) => <div className="flex gap-3"><button className="font-semibold text-brand-700" onClick={() => edit(row)}>Edit</button><button className="font-semibold text-rose-600" onClick={() => remove(row.id)}>Delete</button></div> }]} />
      </div>
    </div>
  );
}
