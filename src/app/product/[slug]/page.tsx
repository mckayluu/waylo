import { notFound } from "next/navigation";
import { PRODUCT } from "@/lib/pages/product";
import { InfoPage, metaFor } from "@/lib/pages/render";
const find = (s: string) => PRODUCT.find(p => p.path === `/product/${s}`);
export const dynamicParams = false;
export function generateStaticParams() { return PRODUCT.map(p => ({ slug: p.path.split("/").pop()! })); }
export function generateMetadata({ params }: { params: { slug: string } }) { const d = find(params.slug); return d ? metaFor(d) : {}; }
export default function Product({ params }: { params: { slug: string } }) { const d = find(params.slug); if (!d) notFound(); return <InfoPage d={d} />; }
