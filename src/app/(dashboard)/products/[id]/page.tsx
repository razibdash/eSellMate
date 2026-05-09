import { ProductDetails } from "@/features/products/ProductDetails";
export default async function Page({ params }: { params: Promise<{ id: string }> }){ const { id } = await params; return <ProductDetails id={id} /> }
