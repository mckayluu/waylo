import { MarketingPage } from "@/components/marketing/Page";
import { Blocks } from "@/components/marketing/Blocks";
import { JsonLd, crumbsLd, faqLd, pageMeta } from "@/lib/seo";
import type { InfoDef } from "./types";
import type { HeroArt } from "@/components/marketing/PageArt";
// Hero photo + code-drawn card per page (the people are stock photos, not customers).
export const ART: Record<string, HeroArt> = {
  "/product/ai-chat": { photo: "cafe", overlay: "chat", chat: "pricing" }, "/product/citations": { photo: "twoWomen", overlay: "chat", chat: "seats" }, "/product/lead-capture": { photo: "salesTeam", overlay: "slack" },
  "/product/slack-routing": { photo: "laughing", overlay: "slack" }, "/product/analytics": { photo: "desk", overlay: "session" }, "/product/branding": { photo: "crafts", overlay: "chat", chat: "free" },
  "/product/install": { photo: "pair", overlay: "chat", chat: "setup" }, "/compare/generic-chatbots": { photo: "cafe", overlay: "chat", chat: "switch" }, "/compare/live-chat": { photo: "headsets", overlay: "chat", chat: "hours" },
  "/use-cases/agencies": { photo: "pair", overlay: "chat", chat: "walkthrough" }, "/use-cases/ecommerce": { photo: "crafts", overlay: "chat", chat: "annual" }, "/use-cases/b2b-services": { photo: "salesTeam", overlay: "slack" },
  "/use-cases/support-deflection": { photo: "headsets", overlay: "chat", chat: "offline" }, "/integrations": { photo: "salesTeam", overlay: "slack" }, "/how-it-works": { photo: "desk", overlay: "chat", chat: "walkthrough" },
};
export const metaFor = (d: InfoDef) => pageMeta(d.path, d.metaTitle, d.metaDesc);
export function InfoPage({ d }: { d: InfoDef }) {
  const crumbs: [string, string][] = d.parent ? [d.parent, [d.crumb, d.path]] : [[d.crumb, d.path]];
  const faqs = d.blocks.flatMap(b => (b.t === "faq" ? b.items : []));
  return <MarketingPage eyebrow={d.eyebrow} crumb={d.parent ? `${d.parent[0]} / ${d.crumb}` : d.crumb} title={d.title} sub={d.sub} answer={d.answer} art={ART[d.path]}>
    <JsonLd data={[crumbsLd(crumbs), ...(faqs.length ? [faqLd(faqs)] : [])]} />
    <Blocks d={d} />
  </MarketingPage>;
}
