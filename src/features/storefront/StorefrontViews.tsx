"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Globe,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { formatCurrency, formatDateTime, titleCase } from "@/lib/formatters";
import { withStorefrontQuery } from "@/lib/storefront";
import {
  useCheckoutPublicStorefrontMutation,
  useGetPublicPaymentStatusQuery,
  useGetPublicProductQuery,
  useGetPublicProductsQuery,
  useGetPublicStorefrontQuery,
  useGetStorefrontSettingsQuery,
  useUpdateStorefrontSettingsMutation,
  useUploadStorefrontBannerMutation,
  useUploadStorefrontLogoMutation,
} from "@/store/api/storefrontApi";
import { useGetProductsQuery } from "@/store/api/productApi";
import type { Product } from "@/types/product";
import type {
  PublicCheckoutPayload,
  StorefrontContentSettings,
  StorefrontProduct,
  StorefrontSectionSettings,
  StorefrontSettingsJson,
  StorefrontSettingsPayload,
} from "@/types/storefront";
import { useStorefrontCart } from "./useStorefrontCart";

type NormalizedStorefrontSettings = {
  sections: Required<StorefrontSectionSettings>;
  content: Required<StorefrontContentSettings>;
};

const defaultStorefrontSettings: NormalizedStorefrontSettings = {
  sections: {
    show_announcement_bar: true,
    show_header: true,
    show_hero: true,
    show_filters: true,
    show_categories_strip: true,
    show_featured_products: true,
    show_product_grid: true,
    show_footer: true,
  },
  content: {
    announcement_text: "New arrivals and best-sellers updated daily.",
    nav_label: "Shop now",
    hero_badge: "Simple online storefront",
    hero_title: "Sell your products with a clean, mobile-friendly storefront.",
    hero_description:
      "Highlight products, collect orders, and let customers browse by category with a familiar e-commerce flow.",
    hero_primary_cta_label: "Browse products",
    hero_secondary_cta_label: "Go to checkout",
    hero_stat_label: "Delivery starting at",
    featured_section_eyebrow: "Featured picks",
    featured_section_title: "Popular products",
    featured_section_description:
      "Showcase the items you want customers to notice first.",
    products_section_eyebrow: "Product catalog",
    products_section_title: "Shop all products",
    products_section_description:
      "Search, filter, and add products to cart from a simple catalog view.",
    filters_section_title: "Find the right product fast",
    filters_section_description:
      "Let customers search by keyword and narrow results by category.",
    footer_title: "Need help with your order?",
    footer_description:
      "Reach out directly for delivery, payment, or product questions.",
    footer_note: "Powered by your storefront settings and live product catalog.",
  },
};

function productPrice(product: StorefrontProduct | Product) {
  return Number(product.discount_price || product.price || 0);
}

function imageUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base =
    process.env.NEXT_PUBLIC_LARAVEL_ASSET_URL || "http://localhost:8000/storage";
  return `${base}/${path.replace(/^\/+/, "")}`;
}

function normalizeStorefrontSettings(
  settings?: StorefrontSettingsJson | null,
): NormalizedStorefrontSettings {
  return {
    sections: {
      ...defaultStorefrontSettings.sections,
      ...(settings?.sections || {}),
    },
    content: {
      ...defaultStorefrontSettings.content,
      ...(settings?.content || {}),
    },
  };
}

function storefrontLink(path: string) {
  return withStorefrontQuery(path);
}

function FieldToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
      <span className="font-medium">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
      />
    </label>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: StorefrontProduct;
  onAdd: (product: StorefrontProduct) => void;
}) {
  return (
    <Card className="overflow-hidden border border-orange-100 p-0">
      <div className="aspect-square bg-slate-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-slate-300">
            <Store className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
            {product.category?.name || "General"}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {product.description || "Available for public checkout from this storefront."}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-black text-slate-950">
              {formatCurrency(productPrice(product))}
            </p>
            <p className="text-xs text-slate-500">
              {product.stock_quantity > 0
                ? `${product.stock_quantity} in stock`
                : "Out of stock"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={storefrontLink(`/shop/products/${product.slug}`)}>
              <Button variant="outline">Details</Button>
            </Link>
            <Button
              onClick={() => onAdd(product)}
              disabled={product.stock_quantity <= 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function StorefrontLanding() {
  const { data, isLoading } = useGetPublicStorefrontQuery();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const { data: products = [] } = useGetPublicProductsQuery(
    query || categoryId
      ? {
          q: query || undefined,
          category_id: categoryId || undefined,
        }
      : undefined,
    { skip: !data },
  );
  const cart = useStorefrontCart();

  if (isLoading || !data) {
    return (
      <div className="page-container py-20 text-center text-slate-500">
        Loading storefront...
      </div>
    );
  }

  const settings = normalizeStorefrontSettings(data.storefront.settings_json);
  const { sections, content } = settings;
  const activeProducts = query || categoryId ? products : products;
  const socialLinks = Object.entries(data.storefront.social_links || {}).filter(
    ([, value]) => Boolean(value),
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1e5_0%,#fff8f1_35%,#ffffff_100%)] text-slate-900">
      {sections.show_announcement_bar ? (
        <div className="border-b border-orange-200 bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white">
          {content.announcement_text}
        </div>
      ) : null}

      {sections.show_header ? (
        <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href={storefrontLink("/shop")} className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
                style={{ color: data.storefront.theme_color }}
              >
                {data.storefront.logo_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl(data.storefront.logo_path)}
                    alt={data.storefront.store_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                  {content.nav_label}
                </p>
                <h1 className="text-lg font-black text-slate-950">
                  {data.storefront.store_name}
                </h1>
              </div>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <a href="#featured" className="hover:text-slate-950">
                Featured
              </a>
              <a href="#catalog" className="hover:text-slate-950">
                Products
              </a>
              <a href="#footer" className="hover:text-slate-950">
                Contact
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2 text-sm text-slate-700 sm:block">
                <span className="font-semibold">
                  {data.storefront.contact_number || data.business.phone || "Contact seller"}
                </span>
              </div>
              <Link href={storefrontLink("/shop/cart")}>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <ShoppingBag className="h-4 w-4" /> Cart ({cart.totals.quantity})
                </Button>
              </Link>
            </div>
          </div>
        </header>
      ) : null}

      {sections.show_hero ? (
        <section
          className="relative overflow-hidden border-b border-orange-100"
          style={{
            backgroundImage: data.storefront.banner_path
              ? `linear-gradient(120deg, rgba(255,246,237,0.93), rgba(255,255,255,0.97)), url(${imageUrl(data.storefront.banner_path)})`
              : "linear-gradient(120deg, rgba(255,246,237,1), rgba(255,255,255,1))",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600">
                <Sparkles className="h-4 w-4" />
                {content.hero_badge}
              </div>
              <div className="space-y-4">
                <h2 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                  {content.hero_title || data.storefront.store_name}
                </h2>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {content.hero_description || data.storefront.store_description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#catalog">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    {content.hero_primary_cta_label}
                  </Button>
                </a>
                <Link href={storefrontLink("/shop/checkout")}>
                  <Button variant="outline">
                    {content.hero_secondary_cta_label}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-white/80 bg-white/85">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                  {content.hero_stat_label}
                </p>
                <p className="mt-3 text-3xl font-black text-slate-950">
                  {formatCurrency(Number(data.storefront.delivery_charge || 0))}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Set by the store owner from storefront settings.
                </p>
              </Card>
              <Card className="border border-white/80 bg-slate-950 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">
                  Public catalog
                </p>
                <p className="mt-3 text-3xl font-black">
                  {products.length || data.featured_products.length}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Live products available for browsing and checkout.
                </p>
              </Card>
              <Card className="border border-white/80 bg-white/85 sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                      Store contact
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-950">
                      {data.storefront.contact_number || data.business.phone || "Contact seller"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {data.business.address || "Fast communication helps close orders."}
                    </p>
                  </div>
                  <Link href={storefrontLink("/shop/cart")}>
                    <Button variant="outline">Review cart</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>
      ) : null}

      {sections.show_categories_strip && data.categories.length ? (
        <section className="border-b border-orange-100 bg-white">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
            {data.categories.map((category) => (
              <button
                key={String(category.id)}
                type="button"
                onClick={() => setCategoryId(String(category.id))}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  categoryId === String(category.id)
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:text-slate-950"
                }`}
              >
                {category.name}
              </button>
            ))}
            {categoryId ? (
              <button
                type="button"
                onClick={() => setCategoryId("")}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Clear filter
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {sections.show_filters ? (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="grid gap-4 border border-orange-100 bg-white/90 md:grid-cols-[1fr_240px_auto]">
            <div className="md:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                Filter section
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">
                {content.filters_section_title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {content.filters_section_description}
              </p>
            </div>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, SKU or description"
                className="pl-11"
              />
            </label>
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">All categories</option>
              {data.categories.map((category) => (
                <option key={String(category.id)} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Link href={storefrontLink("/shop/checkout")}>
              <Button className="w-full bg-slate-950 hover:bg-slate-800">
                Checkout now
              </Button>
            </Link>
          </Card>
        </section>
      ) : null}

      {sections.show_featured_products && data.featured_products.length ? (
        <section id="featured" className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                {content.featured_section_eyebrow}
              </p>
              <h2 className="mt-1 text-3xl font-black text-slate-950">
                {content.featured_section_title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                {content.featured_section_description}
              </p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-slate-600">
              Delivery charge {formatCurrency(Number(data.storefront.delivery_charge || 0))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {data.featured_products.map((product) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                onAdd={cart.addItem}
              />
            ))}
          </div>
        </section>
      ) : null}

      {sections.show_product_grid ? (
        <section id="catalog" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                {content.products_section_eyebrow}
              </p>
              <h2 className="mt-1 text-3xl font-black text-slate-950">
                {content.products_section_title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                {content.products_section_description}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              {activeProducts.length} products visible
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {activeProducts.length ? (
              activeProducts.map((product) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  onAdd={cart.addItem}
                />
              ))
            ) : (
              <Card className="sm:col-span-2 xl:col-span-4">
                <p className="text-lg font-bold text-slate-950">No matching products found.</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different search or clear the current category filter.
                </p>
              </Card>
            )}
          </div>
        </section>
      ) : null}

      {sections.show_footer ? (
        <footer id="footer" className="border-t border-orange-100 bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
                {content.footer_title}
              </p>
              <h3 className="mt-3 text-3xl font-black">{data.storefront.store_name}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {content.footer_description}
              </p>
              <p className="mt-4 text-sm text-slate-400">{content.footer_note}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-white/10 bg-white/5 text-white">
                <div className="flex items-center gap-2 text-orange-300">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-semibold uppercase tracking-[0.14em]">
                    Contact
                  </span>
                </div>
                <p className="mt-3 text-lg font-bold">
                  {data.storefront.contact_number || data.business.phone || "Contact seller"}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {data.business.email || "Reach the owner directly for order support."}
                </p>
              </Card>
              <Card className="border border-white/10 bg-white/5 text-white">
                <div className="flex items-center gap-2 text-orange-300">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-semibold uppercase tracking-[0.14em]">
                    Social links
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {socialLinks.length ? (
                    socialLinks.map(([key, value]) => (
                      <a
                        key={key}
                        href={String(value)}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-slate-200 hover:text-white"
                      >
                        {titleCase(key)}
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-slate-300">
                      Social links can be added by the owner from storefront settings.
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}

export function StorefrontProductDetails({ slug }: { slug: string }) {
  const { data: product, isLoading } = useGetPublicProductQuery(slug);
  const cart = useStorefrontCart();

  if (isLoading || !product) {
    return (
      <div className="page-container py-16 text-center text-slate-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="page-container py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden p-0">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl(product.image)}
              alt={product.name}
              className="h-full min-h-[420px] w-full object-cover"
            />
          ) : (
            <div className="grid min-h-[420px] place-items-center bg-slate-100 text-slate-400">
              <Store className="h-14 w-14" />
            </div>
          )}
        </Card>
        <Card className="space-y-6 border border-orange-100">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              {product.category?.name || "Catalog item"}
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">{product.name}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {product.description || "This product is available for public checkout from the storefront."}
            </p>
          </div>
          <div className="rounded-3xl bg-orange-50 p-5">
            <p className="text-3xl font-black text-slate-950">
              {formatCurrency(productPrice(product))}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Stock status: {product.stock_quantity > 0 ? "Available" : "Out of stock"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => cart.addItem(product)}
              disabled={product.stock_quantity <= 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Add to cart
            </Button>
            <Link href={storefrontLink("/shop/cart")}>
              <Button variant="outline">View cart</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function StorefrontCartView() {
  const cart = useStorefrontCart();
  const { data: overview } = useGetPublicStorefrontQuery();
  const deliveryCharge = Number(overview?.storefront.delivery_charge || 0);
  const total = cart.totals.subtotal + deliveryCharge;

  return (
    <div className="page-container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
            Cart
          </p>
          <h1 className="text-3xl font-black text-slate-950">Review your order</h1>
        </div>
        <Link href={storefrontLink("/shop")}>
          <Button variant="outline">Continue shopping</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="space-y-4">
          {cart.items.length ? (
            cart.items.map((item) => (
              <div
                key={String(item.product_id)}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 p-4"
              >
                <div>
                  <p className="font-bold text-slate-950">{item.name}</p>
                  <p className="text-sm text-slate-500">{formatCurrency(item.price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={item.stock_quantity}
                    value={item.quantity}
                    onChange={(e) =>
                      cart.updateQuantity(item.product_id, Number(e.target.value))
                    }
                    className="w-24"
                  />
                  <p className="w-24 text-right font-semibold text-slate-900">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => cart.removeItem(item.product_id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500">Your cart is empty.</p>
          )}
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>{formatCurrency(cart.totals.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Delivery</span>
            <span>{formatCurrency(deliveryCharge)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-black text-slate-950">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Link href={storefrontLink("/shop/checkout")}>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={!cart.items.length}
            >
              Proceed to checkout
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export function StorefrontCheckoutView() {
  const cart = useStorefrontCart();
  const { data: overview } = useGetPublicStorefrontQuery();
  const [checkout, { isLoading, isSuccess, data: result }] =
    useCheckoutPublicStorefrontMutation();
  const [form, setForm] = useState<PublicCheckoutPayload>({
    customer: {
      name: "",
      phone: "",
      delivery_address: "",
      delivery_note: "",
    },
    payment_method: "cod",
    delivery_charge: 0,
    items: [],
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      delivery_charge: Number(overview?.storefront.delivery_charge || 0),
      items: cart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    }));
  }, [cart.items, overview?.storefront.delivery_charge]);

  const orderTotal = useMemo(
    () => cart.totals.subtotal + Number(form.delivery_charge || 0),
    [cart.totals.subtotal, form.delivery_charge],
  );

  async function submitCheckout() {
    const response = await checkout(form).unwrap();
    if (response.redirect_url) {
      window.location.href = response.redirect_url;
      return;
    }
    if (response.payment_status_url) {
      cart.clearCart();
      window.location.href = withStorefrontQuery(response.payment_status_url);
    }
  }

  return (
    <div className="page-container py-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
          Checkout
        </p>
        <h1 className="text-3xl font-black text-slate-950">Complete your order</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <Input
            placeholder="Full name"
            value={form.customer.name}
            onChange={(e) =>
              setForm({
                ...form,
                customer: { ...form.customer, name: e.target.value },
              })
            }
          />
          <Input
            placeholder="Phone number"
            value={form.customer.phone}
            onChange={(e) =>
              setForm({
                ...form,
                customer: { ...form.customer, phone: e.target.value },
              })
            }
          />
          <Textarea
            placeholder="Delivery address"
            value={form.customer.delivery_address}
            onChange={(e) =>
              setForm({
                ...form,
                customer: { ...form.customer, delivery_address: e.target.value },
              })
            }
          />
          <Textarea
            placeholder="Delivery note"
            value={form.customer.delivery_note}
            onChange={(e) =>
              setForm({
                ...form,
                customer: { ...form.customer, delivery_note: e.target.value },
              })
            }
          />
          <Select
            value={form.payment_method}
            onChange={(e) =>
              setForm({
                ...form,
                payment_method: e.target.value as PublicCheckoutPayload["payment_method"],
              })
            }
          >
            <option value="cod">Cash on delivery</option>
            <option value="bkash">bKash</option>
          </Select>
          <Button
            onClick={submitCheckout}
            disabled={!cart.items.length || isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? "Processing..." : "Place order"}
          </Button>
          {isSuccess && result?.payment_status_url ? (
            <p className="text-sm text-emerald-700">
              Order created. Redirecting to payment status...
            </p>
          ) : null}
        </Card>
        <Card className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={String(item.product_id)}
              className="flex items-center justify-between text-sm"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.quantity * item.price)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Delivery charge</span>
            <span>{formatCurrency(Number(form.delivery_charge || 0))}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-black text-slate-950">
            <span>Total</span>
            <span>{formatCurrency(orderTotal)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function StorefrontPaymentStatusView({ reference }: { reference: string }) {
  const { data, isLoading } = useGetPublicPaymentStatusQuery(reference);

  if (isLoading || !data) {
    return (
      <div className="page-container py-16 text-center text-slate-500">
        Loading payment status...
      </div>
    );
  }

  return (
    <div className="page-container py-12">
      <Card className="mx-auto max-w-3xl border border-orange-100">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-orange-100 text-orange-700">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              Payment status
            </p>
            <h1 className="text-3xl font-black text-slate-950">
              {titleCase(data.payment_status)} / {titleCase(data.order_status)}
            </h1>
          </div>
        </div>
        <div className="grid gap-4 rounded-3xl bg-slate-50 p-5 md:grid-cols-2">
          <p>
            <strong>Reference:</strong> {data.public_reference}
          </p>
          <p>
            <strong>Invoice:</strong> {data.invoice_number}
          </p>
          <p>
            <strong>Total:</strong> {formatCurrency(Number(data.total_amount || 0))}
          </p>
          <p>
            <strong>Updated:</strong> {formatDateTime(data.updated_at)}
          </p>
          <p className="md:col-span-2">
            <strong>Delivery:</strong> <MapPin className="mr-1 inline h-4 w-4" />
            {data.delivery_address_snapshot}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={storefrontLink("/shop")}>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Back to storefront
            </Button>
          </Link>
          <Link href={storefrontLink("/shop/cart")}>
            <Button variant="outline">Open cart</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export function StorefrontSettingsView() {
  const { data } = useGetStorefrontSettingsQuery();
  const { data: products = [] } = useGetProductsQuery();
  const [save, { isLoading }] = useUpdateStorefrontSettingsMutation();
  const [uploadLogo, { isLoading: isUploadingLogo }] =
    useUploadStorefrontLogoMutation();
  const [uploadBanner, { isLoading: isUploadingBanner }] =
    useUploadStorefrontBannerMutation();
  const [form, setForm] = useState<StorefrontSettingsPayload>({
    subdomain: "",
    store_name: "",
    store_description: "",
    theme_color: "#f97316",
    delivery_charge: 0,
    contact_number: "",
    social_links: {},
    settings_json: defaultStorefrontSettings,
    featured_product_ids: [],
    hidden_product_ids: [],
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      subdomain: data.subdomain,
      store_name: data.store_name,
      store_description: data.store_description || "",
      theme_color: data.theme_color,
      delivery_charge: Number(data.delivery_charge || 0),
      contact_number: data.contact_number || "",
      social_links: data.social_links || {},
      settings_json: normalizeStorefrontSettings(data.settings_json),
      status: data.status,
      featured_product_ids: products
        .filter((product) => product.is_featured)
        .map((product) => product.id),
      hidden_product_ids: products
        .filter((product) => product.is_published === false)
        .map((product) => product.id),
    });
  }, [data, products]);

  function updateSection<K extends keyof StorefrontSectionSettings>(
    key: K,
    value: boolean,
  ) {
    setForm((current) => {
      const settings = normalizeStorefrontSettings(current.settings_json);
      return {
        ...current,
        settings_json: {
          ...settings,
          sections: {
            ...settings.sections,
            [key]: value,
          },
        },
      };
    });
  }

  function updateContent<K extends keyof StorefrontContentSettings>(
    key: K,
    value: string,
  ) {
    setForm((current) => {
      const settings = normalizeStorefrontSettings(current.settings_json);
      return {
        ...current,
        settings_json: {
          ...settings,
          content: {
            ...settings.content,
            [key]: value,
          },
        },
      };
    });
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "banner",
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append(type, file);

    if (type === "logo") {
      await uploadLogo(body).unwrap();
    } else {
      await uploadBanner(body).unwrap();
    }
  }

  async function handleSubmit() {
    await save(form).unwrap();
  }

  const settings = normalizeStorefrontSettings(form.settings_json);

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
            Public storefront
          </p>
          <h1 className="text-2xl font-black text-slate-950">Customize your shop</h1>
          <p className="mt-2 text-sm text-slate-500">
            Control the simple e-commerce layout, dynamic content, and which
            storefront sections appear for customers.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Input
            value={form.store_name || ""}
            onChange={(e) => setForm({ ...form, store_name: e.target.value })}
            placeholder="Store name"
          />
          <Input
            value={form.subdomain || ""}
            onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
            placeholder="Subdomain"
          />
          <Input
            value={form.contact_number || ""}
            onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
            placeholder="Contact number"
          />
          <Input
            type="color"
            value={form.theme_color || "#f97316"}
            onChange={(e) => setForm({ ...form, theme_color: e.target.value })}
          />
          <Input
            type="number"
            value={Number(form.delivery_charge || 0)}
            onChange={(e) =>
              setForm({ ...form, delivery_charge: Number(e.target.value) })
            }
            placeholder="Delivery charge"
          />
          <Select
            value={form.status || "active"}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as "active" | "inactive" | "suspended",
              })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </Select>
          <Textarea
            className="lg:col-span-2"
            value={form.store_description || ""}
            onChange={(e) =>
              setForm({ ...form, store_description: e.target.value })
            }
            placeholder="Store description"
          />
          <Input
            value={(form.social_links?.facebook as string) || ""}
            onChange={(e) =>
              setForm({
                ...form,
                social_links: { ...form.social_links, facebook: e.target.value },
              })
            }
            placeholder="Facebook URL"
          />
          <Input
            value={(form.social_links?.instagram as string) || ""}
            onChange={(e) =>
              setForm({
                ...form,
                social_links: { ...form.social_links, instagram: e.target.value },
              })
            }
            placeholder="Instagram URL"
          />
          <Input
            value={(form.social_links?.whatsapp as string) || ""}
            onChange={(e) =>
              setForm({
                ...form,
                social_links: { ...form.social_links, whatsapp: e.target.value },
              })
            }
            placeholder="WhatsApp number or link"
          />
          <Input
            value={(form.social_links?.youtube as string) || ""}
            onChange={(e) =>
              setForm({
                ...form,
                social_links: { ...form.social_links, youtube: e.target.value },
              })
            }
            placeholder="YouTube URL"
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-950">Brand assets</h2>
          <p className="mt-2 text-sm text-slate-500">
            Logo appears in the storefront header. Banner is used behind the hero section.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-slate-100 p-4">
            <p className="font-semibold text-slate-950">Store logo</p>
            {data?.logo_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl(data.logo_path)}
                alt="Store logo preview"
                className="h-28 w-28 rounded-3xl object-cover"
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-3xl bg-slate-100 text-slate-400">
                <Store className="h-8 w-8" />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "logo")}
            />
            <p className="text-xs text-slate-500">
              {isUploadingLogo ? "Uploading logo..." : "Upload a square brand mark or icon."}
            </p>
          </div>
          <div className="space-y-3 rounded-3xl border border-slate-100 p-4">
            <p className="font-semibold text-slate-950">Hero banner</p>
            {data?.banner_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl(data.banner_path)}
                alt="Store banner preview"
                className="h-28 w-full rounded-3xl object-cover"
              />
            ) : (
              <div className="grid h-28 w-full place-items-center rounded-3xl bg-slate-100 text-slate-400">
                <Store className="h-8 w-8" />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "banner")}
            />
            <p className="text-xs text-slate-500">
              {isUploadingBanner ? "Uploading banner..." : "Upload a wide storefront hero image."}
            </p>
          </div>
        </div>
      </Card>

      <Card className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-950">Section visibility</h2>
          <p className="mt-2 text-sm text-slate-500">
            Turn core e-commerce sections on or off without editing code.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <FieldToggle
            label="Announcement bar"
            checked={settings.sections.show_announcement_bar}
            onChange={(value) => updateSection("show_announcement_bar", value)}
          />
          <FieldToggle
            label="Header"
            checked={settings.sections.show_header}
            onChange={(value) => updateSection("show_header", value)}
          />
          <FieldToggle
            label="Hero section"
            checked={settings.sections.show_hero}
            onChange={(value) => updateSection("show_hero", value)}
          />
          <FieldToggle
            label="Filter section"
            checked={settings.sections.show_filters}
            onChange={(value) => updateSection("show_filters", value)}
          />
          <FieldToggle
            label="Category strip"
            checked={settings.sections.show_categories_strip}
            onChange={(value) => updateSection("show_categories_strip", value)}
          />
          <FieldToggle
            label="Featured products"
            checked={settings.sections.show_featured_products}
            onChange={(value) => updateSection("show_featured_products", value)}
          />
          <FieldToggle
            label="Product grid"
            checked={settings.sections.show_product_grid}
            onChange={(value) => updateSection("show_product_grid", value)}
          />
          <FieldToggle
            label="Footer"
            checked={settings.sections.show_footer}
            onChange={(value) => updateSection("show_footer", value)}
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-950">Storefront content</h2>
          <p className="mt-2 text-sm text-slate-500">
            Update the header text, hero message, section titles, and footer copy dynamically.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input
            value={settings.content.announcement_text}
            onChange={(e) => updateContent("announcement_text", e.target.value)}
            placeholder="Announcement text"
          />
          <Input
            value={settings.content.nav_label}
            onChange={(e) => updateContent("nav_label", e.target.value)}
            placeholder="Header label"
          />
          <Input
            value={settings.content.hero_badge}
            onChange={(e) => updateContent("hero_badge", e.target.value)}
            placeholder="Hero badge"
          />
          <Input
            value={settings.content.hero_stat_label}
            onChange={(e) => updateContent("hero_stat_label", e.target.value)}
            placeholder="Hero stat label"
          />
          <Input
            className="lg:col-span-2"
            value={settings.content.hero_title}
            onChange={(e) => updateContent("hero_title", e.target.value)}
            placeholder="Hero title"
          />
          <Textarea
            className="lg:col-span-2"
            value={settings.content.hero_description}
            onChange={(e) => updateContent("hero_description", e.target.value)}
            placeholder="Hero description"
          />
          <Input
            value={settings.content.hero_primary_cta_label}
            onChange={(e) =>
              updateContent("hero_primary_cta_label", e.target.value)
            }
            placeholder="Primary CTA label"
          />
          <Input
            value={settings.content.hero_secondary_cta_label}
            onChange={(e) =>
              updateContent("hero_secondary_cta_label", e.target.value)
            }
            placeholder="Secondary CTA label"
          />
          <Input
            value={settings.content.filters_section_title}
            onChange={(e) =>
              updateContent("filters_section_title", e.target.value)
            }
            placeholder="Filter section title"
          />
          <Input
            value={settings.content.filters_section_description}
            onChange={(e) =>
              updateContent("filters_section_description", e.target.value)
            }
            placeholder="Filter section description"
          />
          <Input
            value={settings.content.featured_section_eyebrow}
            onChange={(e) =>
              updateContent("featured_section_eyebrow", e.target.value)
            }
            placeholder="Featured eyebrow"
          />
          <Input
            value={settings.content.featured_section_title}
            onChange={(e) =>
              updateContent("featured_section_title", e.target.value)
            }
            placeholder="Featured title"
          />
          <Textarea
            value={settings.content.featured_section_description}
            onChange={(e) =>
              updateContent("featured_section_description", e.target.value)
            }
            placeholder="Featured section description"
          />
          <Textarea
            value={settings.content.products_section_description}
            onChange={(e) =>
              updateContent("products_section_description", e.target.value)
            }
            placeholder="Product section description"
          />
          <Input
            value={settings.content.products_section_eyebrow}
            onChange={(e) =>
              updateContent("products_section_eyebrow", e.target.value)
            }
            placeholder="Products eyebrow"
          />
          <Input
            value={settings.content.products_section_title}
            onChange={(e) =>
              updateContent("products_section_title", e.target.value)
            }
            placeholder="Products title"
          />
          <Input
            value={settings.content.footer_title}
            onChange={(e) => updateContent("footer_title", e.target.value)}
            placeholder="Footer title"
          />
          <Input
            value={settings.content.footer_note}
            onChange={(e) => updateContent("footer_note", e.target.value)}
            placeholder="Footer note"
          />
          <Textarea
            className="lg:col-span-2"
            value={settings.content.footer_description}
            onChange={(e) => updateContent("footer_description", e.target.value)}
            placeholder="Footer description"
          />
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save storefront settings"}
        </Button>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-xl font-black text-slate-950">Featured and hidden products</h2>
        <div className="space-y-3">
          {products.map((product) => {
            const featured = form.featured_product_ids?.includes(product.id);
            const hidden = form.hidden_product_ids?.includes(product.id);

            return (
              <div
                key={String(product.id)}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-100 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-950">{product.name}</p>
                  <p className="text-sm text-slate-500">
                    {formatCurrency(productPrice(product))}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant={featured ? "primary" : "outline"}
                    onClick={() =>
                      setForm({
                        ...form,
                        featured_product_ids: featured
                          ? form.featured_product_ids?.filter((id) => id !== product.id)
                          : [...(form.featured_product_ids || []), product.id],
                      })
                    }
                  >
                    {featured ? "Featured" : "Mark featured"}
                  </Button>
                  <Button
                    variant={hidden ? "danger" : "outline"}
                    onClick={() =>
                      setForm({
                        ...form,
                        hidden_product_ids: hidden
                          ? form.hidden_product_ids?.filter((id) => id !== product.id)
                          : [...(form.hidden_product_ids || []), product.id],
                      })
                    }
                  >
                    {hidden ? "Hidden" : "Hide"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
