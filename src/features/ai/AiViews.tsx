"use client";

import { useState } from "react";
import { Bot, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { copyToClipboard } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";
import {
  useGenerateCaptionMutation,
  useGenerateReplyMutation,
  useGetAiHistoryQuery,
  useGetAiInsightsQuery,
} from "@/store/api/aiApi";
import type { AiGeneration } from "@/types/ai";

export function AiCaptionView() {
  const [form, setForm] = useState({
    product_name: "Garlic Pickle",
    product_type: "Homemade achar",
    price: 250,
    offer: "10% discount",
    tone: "friendly" as const,
    language: "bn" as const,
  });
  const [generate, { data, isLoading }] = useGenerateCaptionMutation();
  return (
    <div>
      <PageHeader
        title="AI caption generator"
        description="Generate Bangla, English or Banglish product captions, hashtags and short ad copy."
      />
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              generate(form);
            }}
          >
            <Input
              value={form.product_name}
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
            />
            <Input
              value={form.product_type}
              onChange={(e) =>
                setForm({ ...form, product_type: e.target.value })
              }
            />
            <Input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
            <Input
              value={form.offer}
              onChange={(e) => setForm({ ...form, offer: e.target.value })}
            />
            <Select
              value={form.tone}
              onChange={(e) =>
                setForm({ ...form, tone: e.target.value as never })
              }
            >
              <option value="friendly">Friendly</option>
              <option value="premium">Premium</option>
              <option value="funny">Funny</option>
              <option value="emotional">Emotional</option>
              <option value="short">Short</option>
            </Select>
            <Select
              value={form.language}
              onChange={(e) =>
                setForm({ ...form, language: e.target.value as never })
              }
            >
              <option value="bn">Bangla</option>
              <option value="en">English</option>
              <option value="banglish">Banglish</option>
            </Select>
            <Button disabled={isLoading}>
              <Sparkles className="h-4 w-4" />
              Generate caption
            </Button>
          </form>
        </Card>
        <Card>
          <p className="mb-3 flex items-center gap-2 font-bold">
            <Bot className="h-5 w-5 text-brand-600" />
            Output
          </p>
          <div className="min-h-52 rounded-3xl bg-slate-50 p-5 text-slate-700">
            {data?.result || "Your generated caption will appear here."}
          </div>
          {data?.hashtags ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.hashtags.map((tag) => (
                <Badge key={tag} value={tag} />
              ))}
            </div>
          ) : null}
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => data?.result && copyToClipboard(data.result)}
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function AiReplyView() {
  const [form, setForm] = useState({
    customer_question: "Price koto?",
    product_info: "Garlic Pickle 250 taka",
    business_tone: "friendly" as const,
    language: "bn" as const,
  });
  const [generate, { data, isLoading }] = useGenerateReplyMutation();
  return (
    <div>
      <PageHeader
        title="AI reply suggestion"
        description="Reply faster to common customer questions from Facebook or WhatsApp."
      />
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              generate(form);
            }}
          >
            <Textarea
              value={form.customer_question}
              onChange={(e) =>
                setForm({ ...form, customer_question: e.target.value })
              }
            />
            <Input
              value={form.product_info}
              onChange={(e) =>
                setForm({ ...form, product_info: e.target.value })
              }
            />
            <Select
              value={form.language}
              onChange={(e) =>
                setForm({ ...form, language: e.target.value as never })
              }
            >
              <option value="bn">Bangla</option>
              <option value="en">English</option>
              <option value="banglish">Banglish</option>
            </Select>
            <Button disabled={isLoading}>Generate reply</Button>
          </form>
        </Card>
        <Card>
          <p className="font-bold">Suggested reply</p>
          <div className="mt-4 min-h-52 rounded-3xl bg-slate-50 p-5">
            {data?.result || "AI reply will appear here."}
          </div>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => data?.result && copyToClipboard(data.result)}
          >
            Copy reply
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function AiInsightsView() {
  const { data = [] } = useGetAiInsightsQuery();
  return (
    <>
      <PageHeader
        title="AI insights"
        description="Best-seller, low-stock prediction, repeat customer and cancellation alerts."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {data.map((i) => (
          <Card key={i.id}>
            <Badge value={i.severity} />
            <h3 className="mt-4 text-lg font-bold">{i.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{i.message}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
export function AiHistoryView() {
  const { data = [] } = useGetAiHistoryQuery();
  return (
    <>
      <PageHeader
        title="AI history"
        description="Track AI caption, reply, insight and summary usage logs."
      />
      <DataTable<AiGeneration & Record<string, unknown>>
        data={data as (AiGeneration & Record<string, unknown>)[]}
        columns={[
          {
            key: "type",
            header: "Type",
            render: (row) => <Badge value={row.type} />,
          },
          { key: "input_text", header: "Input" },
          { key: "output_text", header: "Output" },
          { key: "tokens_used", header: "Tokens" },
          {
            key: "created_at",
            header: "Date",
            render: (row) => formatDateTime(row.created_at),
          },
        ]}
      />
    </>
  );
}
