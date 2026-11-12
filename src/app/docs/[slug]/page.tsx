import { notFound } from "next/navigation";
import { KNOWLEDGE } from "@/lib/knowledge";
// Dedicated routes under /docs/* must not also be emitted by this dynamic segment (Next can serve the stub instead of the real page).
const RESERVED = new Set(["install", "embed-modes"]);
export function generateStaticParams() {
  return KNOWLEDGE.map((k) => k.url.split("/").pop()!).filter((slug) => slug && !RESERVED.has(slug)).map((slug) => ({ slug }));
}
export default function Doc({ params }: { params: { slug: string } }) {
  if (RESERVED.has(params.slug)) notFound();
  const k = KNOWLEDGE.find((x) => x.url === `/docs/${params.slug}`); if (!k) notFound();
  return <main className="mk mx-auto max-w-2xl px-6 py-16"><h1 className="mt-1 text-2xl font-bold">{k.title}</h1><p className="mt-4 text-warm-700">{k.summary.replace(/\*\*|`/g, "")}</p></main>;
}
