import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Page() {
  return (
    <Card className="mx-auto mt-12 max-w-xl text-center">
      <XCircle className="mx-auto h-12 w-12 text-rose-600" />
      <h1 className="mt-4 text-2xl font-black text-slate-950">Payment failed</h1>
      <p className="mt-2 text-sm text-slate-500">
        We could not verify the payment from the gateway. Please try again or choose bank payment.
      </p>
      <Link href="/subscription/checkout">
        <Button className="mt-6">Try again</Button>
      </Link>
    </Card>
  );
}
