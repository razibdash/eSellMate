import { headers } from "next/headers";
import { HomePage } from "@/features/public/HomePage";
import { StorefrontLanding } from "@/features/storefront/StorefrontViews";
import { isStorefrontHost } from "@/lib/storefront";

export default async function Page() {
  const host = (await headers()).get("host");
  return isStorefrontHost(host) ? <StorefrontLanding /> : <HomePage />;
}
