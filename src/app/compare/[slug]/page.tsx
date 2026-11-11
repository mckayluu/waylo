import { notFound } from "next/navigation";
import { COMPARE } from "@/lib/pages/compare";
import { InfoPage, metaFor } from "@/lib/pages/render";
const find = (s: string) => COMPARE.find(p => p.path === `/compare/${s}`);
export const dynamicParams = false;
export function generateStaticParams() { return COMPARE.map(p => ({ slug: p.path.split("/").pop()! })); }
export function generateMetadata({ params }: { params: { slug: string } }) { const d = find(params.slug); return d ? metaFor(d) : {}; }
export default function Compare({ params }: { params: { slug: string } }) { const d = find(params.slug); if (!d) notFound(); return <InfoPage d={d} />; }
