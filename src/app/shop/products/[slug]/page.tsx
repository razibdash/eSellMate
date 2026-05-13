import { StorefrontProductDetails } from "@/features/storefront/StorefrontViews";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <StorefrontProductDetails slug={slug} />;
}
