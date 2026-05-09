"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { useCreateCategoryMutation, useGetCategoriesQuery } from "@/store/api/productApi";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types/product";

export function CategoriesView() {
  const { data = [] } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  async function submit(e: React.FormEvent) { e.preventDefault(); if (!name) return; await createCategory({ name, slug: slugify(name), description, status: "active" }).unwrap(); setName(""); setDescription(""); }
  return (
    <div>
      <PageHeader title="Categories" description="Create, edit and filter products category-wise." />
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card><form onSubmit={submit} className="space-y-4"><Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} /><Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><Button>Create category</Button></form></Card>
        <DataTable<Category & Record<string, unknown>> data={data as (Category & Record<string, unknown>)[]} columns={[{ key: "name", header: "Name" }, { key: "slug", header: "Slug" }, { key: "description", header: "Description" }, { key: "status", header: "Status", render: (row) => <Badge value={row.status} /> }]} />
      </div>
    </div>
  );
}
