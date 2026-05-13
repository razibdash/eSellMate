import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Page() {
  return (
    <Card className="mx-auto mt-12 max-w-xl text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
      <h1 className="mt-4 text-2xl font-black text-slate-950">Payment successful</h1>
      <p className="mt-2 text-sm text-slate-500">
        Your subscription is active. You can continue using your workspace.
      </p>
      <Link href="/dashboard">
        <Button className="mt-6">Go to dashboard</Button>
      </Link>
    </Card>
  );
}
