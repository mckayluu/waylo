import { notFound } from "next/navigation";
import { KNOWLEDGE } from "@/lib/knowledge";
export function generateStaticParams() { return KNOWLEDGE.map((k) => ({ slug: k.url.split("/").pop()! })); }
export default function Doc({ params }: { params: { slug: string } }) {
  const k = KNOWLEDGE.find((x) => x.url === `/docs/${params.slug}`); if (!k) notFound();
  return <main className="mx-auto max-w-2xl px-6 py-16"><p className="text-sm text-teal-700">Waylo docs (mock knowledge page)</p><h1 className="mt-1 text-2xl font-bold">{k.title}</h1><p className="mt-4 text-stone-700">{k.summary.replace(/\*\*|`/g, "")}</p></main>;
}
