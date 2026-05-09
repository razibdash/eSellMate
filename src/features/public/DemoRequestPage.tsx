import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { PublicShell } from "./PublicShell";

export function DemoRequestPage() {
  return (
    <PublicShell>
      <main className="page-container max-w-3xl py-14">
        <PageHeader title="Request a free demo" description="This form is frontend-ready. Connect it to Laravel later or use it as a demo lead form." />
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Your name" />
            <Input placeholder="Phone / WhatsApp" />
            <Input placeholder="Business name" />
            <Input placeholder="Facebook page link" />
          </div>
          <Textarea className="mt-4" placeholder="Tell us what you sell and your main order problem." />
          <div className="mt-5 flex gap-3">
            <Button>Submit demo request</Button>
            <Link href="/login"><Button variant="outline">Open demo dashboard</Button></Link>
          </div>
        </Card>
      </main>
    </PublicShell>
  );
}
