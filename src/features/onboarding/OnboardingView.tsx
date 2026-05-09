"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { useGetBusinessQuery, useUpdateBusinessMutation } from "@/store/api/businessApi";

export function BusinessProfileStep(){ const {data}=useGetBusinessQuery(); const [update]=useUpdateBusinessMutation(); return <><PageHeader title="Create business profile" description="Set up logo, phone, address and social links before entering dashboard."/><Card><form className="grid gap-4 lg:grid-cols-2" onSubmit={(e)=>{e.preventDefault();update({})}}><Input defaultValue={data?.name} placeholder="Business name"/><Input defaultValue={data?.phone} placeholder="Phone"/><Input defaultValue={data?.whatsapp_number} placeholder="WhatsApp number"/><Input defaultValue={data?.facebook_page_url} placeholder="Facebook page"/><Textarea className="lg:col-span-2" defaultValue={data?.address} placeholder="Address"/><Link href="/onboarding/first-product"><Button>Save & continue</Button></Link></form></Card></>}
export function FirstProductStep(){ return <><PageHeader title="Add first product" description="Add your first product or skip and import later."/><Card><Input placeholder="Product name" defaultValue="Garlic Pickle"/><div className="mt-4 grid gap-4 md:grid-cols-3"><Input defaultValue="250"/><Input defaultValue="18"/><Input defaultValue="jar"/></div><div className="mt-5 flex gap-3"><Link href="/products/create"><Button>Add product properly</Button></Link><Link href="/onboarding/invoice-setup"><Button variant="outline">Skip</Button></Link></div></Card></>}
export function InvoiceSetupStep(){ return <><PageHeader title="Invoice setup" description="Set invoice prefix and footer."/><Card><Input defaultValue="FAH"/><Textarea className="mt-4" defaultValue="Thank you for shopping with us."/><div className="mt-5"><Link href="/onboarding/choose-plan"><Button>Continue</Button></Link></div></Card></>}
export function ChoosePlanStep(){ return <><PageHeader title="Choose plan" description="Start with Free or Pro demo plan."/><Card><p className="text-slate-600">Demo project starts with Pro plan to show AI, reports and stock modules.</p><Link href="/dashboard"><Button className="mt-5">Go to dashboard</Button></Link></Card></>}
