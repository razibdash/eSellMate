"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { useCreateProductMutation, useGetCategoriesQuery, useGetProductQuery, useUpdateProductMutation } from "@/store/api/productApi";
import { slugify } from "@/lib/utils";
import type { ProductPayload } from "@/types/product";

const blank: ProductPayload = { category_id: 1, name: "", slug: "", sku: "", description: "", price: 0, cost_price: 0, discount_price: 0, stock_quantity: 0, low_stock_alert: 5, unit: "pcs", image: "", status: "active" };

export function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: product } = useGetProductQuery(id!, { skip: !id });
  const [createProduct, createState] = useCreateProductMutation();
  const [updateProduct, updateState] = useUpdateProductMutation();
  const [form, setForm] = useState<ProductPayload>(blank);

  useEffect(() => { if (product) setForm({ ...product, slug: product.slug }); }, [product]);
  const saving = createState.isLoading || updateState.isLoading;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    if (id) await updateProduct({ id, body: payload }).unwrap(); else await createProduct(payload).unwrap();
    router.push("/products");
  }

  return (
    <div>
      <PageHeader title={id ? "Edit product" : "Add product"} description="Product form is compatible with Laravel /products API." />
      <Card>
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <div><label className="text-sm font-semibold">Product name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} required /></div>
          <div><label className="text-sm font-semibold">SKU</label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
          <div><label className="text-sm font-semibold">Category</label><Select value={String(form.category_id || "")} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</Select></div>
          <div><label className="text-sm font-semibold">Status</label><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductPayload["status"] })}><option value="active">Active</option><option value="inactive">Inactive</option><option value="draft">Draft</option></Select></div>
          <div><label className="text-sm font-semibold">Price</label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
          <div><label className="text-sm font-semibold">Discount price</label><Input type="number" value={form.discount_price || 0} onChange={(e) => setForm({ ...form, discount_price: Number(e.target.value) })} /></div>
          <div><label className="text-sm font-semibold">Stock quantity</label><Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })} /></div>
          <div><label className="text-sm font-semibold">Low stock alert</label><Input type="number" value={form.low_stock_alert} onChange={(e) => setForm({ ...form, low_stock_alert: Number(e.target.value) })} /></div>
          <div><label className="text-sm font-semibold">Unit</label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
          <div><label className="text-sm font-semibold">Image URL</label><Input value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          <div className="lg:col-span-2"><label className="text-sm font-semibold">Description</label><Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="lg:col-span-2"><Button disabled={saving}>{saving ? "Saving..." : "Save product"}</Button></div>
        </form>
      </Card>
    </div>
  );
}
