import { MarketingPage } from "@/components/marketing/Page";
import { Blocks } from "@/components/marketing/Blocks";
import { JsonLd, crumbsLd, faqLd, pageMeta } from "@/lib/seo";
import type { InfoDef } from "./types";
export const metaFor = (d: InfoDef) => pageMeta(d.path, d.metaTitle, d.metaDesc);
export function InfoPage({ d }: { d: InfoDef }) {
  const crumbs: [string, string][] = d.parent ? [d.parent, [d.crumb, d.path]] : [[d.crumb, d.path]];
  const faqs = d.blocks.flatMap(b => (b.t === "faq" ? b.items : []));
  return <MarketingPage eyebrow={d.eyebrow} crumb={d.parent ? `${d.parent[0]} / ${d.crumb}` : d.crumb} title={d.title} sub={d.sub} answer={d.answer}>
    <JsonLd data={[crumbsLd(crumbs), ...(faqs.length ? [faqLd(faqs)] : [])]} />
    <Blocks d={d} />
  </MarketingPage>;
}
