import { Bot, ChartBar, CreditCard, FileText, MessageSquare, Package, ShieldCheck, ShoppingCart, Users, Warehouse, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/common/PageHeader";
import { PublicShell } from "./PublicShell";

const items: Array<[LucideIcon, string, string]> = [
  [ShoppingCart, "Order management", "Create Facebook, WhatsApp, Instagram, phone and manual orders with status workflow."],
  [Package, "Product management", "Add product image, SKU, category, price, discount price and active/draft status."],
  [Users, "Customer database", "Store phone, address, purchase history, total orders and repeat customer notes."],
  [FileText, "Invoice", "Preview, print, download and share business invoices with customer details."],
  [Warehouse, "Stock", "Low-stock alert, stock movement history and order-based stock adjustment."],
  [MessageSquare, "WhatsApp templates", "Variables, copy message button and pre-filled WhatsApp share link."],
  [Bot, "AI tools", "Caption generator, reply suggestion, sales insight and AI history."],
  [ChartBar, "Reports", "Daily/monthly sales, product, customer, payment, delivery and low-stock reports."],
  [ShieldCheck, "Role access", "Owner, manager, staff, delivery and viewer permission control."],
  [CreditCard, "Subscription", "Free, Basic, Pro, Business and Agency plan-ready architecture."]
];

export function FeaturesPage() {
  return (
    <PublicShell>
      <main className="page-container py-14">
        <PageHeader title="Everything a small seller needs" description="All MVP modules from the documentation are represented in the frontend and ready for Laravel API integration." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(([Icon, title, text]) => (
            <Card key={String(title)} className="transition hover:-translate-y-1 hover:shadow-glow">
              <Icon className="h-7 w-7 text-brand-600" />
              <h3 className="mt-5 font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </Card>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
