import { StorefrontPaymentStatusView } from "@/features/storefront/StorefrontViews";

export default async function PaymentStatusPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  return <StorefrontPaymentStatusView reference={reference} />;
}
