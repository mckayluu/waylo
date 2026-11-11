import { notFound } from "next/navigation";
import { USECASES } from "@/lib/pages/usecases";
import { InfoPage, metaFor } from "@/lib/pages/render";
const find = (s: string) => USECASES.find(p => p.path === `/use-cases/${s}`);
export const dynamicParams = false;
export function generateStaticParams() { return USECASES.map(p => ({ slug: p.path.split("/").pop()! })); }
export function generateMetadata({ params }: { params: { slug: string } }) { const d = find(params.slug); return d ? metaFor(d) : {}; }
export default function UseCase({ params }: { params: { slug: string } }) { const d = find(params.slug); if (!d) notFound(); return <InfoPage d={d} />; }
