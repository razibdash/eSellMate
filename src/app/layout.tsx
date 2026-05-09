import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/store/AppProviders";

export const metadata: Metadata = {
  title: "ShopBot BD | Smart Order Manager",
  description: "AI-powered order, stock, invoice and customer management dashboard for online sellers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
