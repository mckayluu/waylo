import Link from "next/link";
import { MarketingPage } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Blocks } from "@/components/marketing/Blocks";
import { ProductTour } from "@/components/marketing/ProductTour";
import { HOW } from "@/lib/pages/site";
import { metaFor, ART } from "@/lib/pages/render";
import { tourSteps } from "@/lib/tour";
import { JsonLd, crumbsLd, faqLd } from "@/lib/seo";
export const metadata = metaFor(HOW);
export default function HowItWorks() {
  const all = tourSteps();
  // No workspace-setup images (signup, billing) in the visual tour; those steps stay in the HowTo schema and the copy.
  const steps = all.filter(s => s.id !== "01-signup" && s.id !== "08-trial");
  const howTo = { "@context": "https://schema.org", "@type": "HowTo", name: "Set up Waylo on your website", step: all.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.caption })) };
  const faqs = HOW.blocks.flatMap(b => (b.t === "faq" ? b.items : []));
  return <MarketingPage eyebrow={HOW.eyebrow} crumb={HOW.crumb} title={HOW.title} sub={HOW.sub} answer={HOW.answer} art={ART[HOW.path]}>
    <JsonLd data={[crumbsLd([[HOW.crumb, HOW.path]]), howTo, faqLd(faqs)]} />
    <Section id="tour" eyebrow="Product tour" title="Six screens, from crawl to Slack" sub="Sign up with your work email first. The Trial is 14 days with no card. Then it goes like this." className="w-band-paper py-16 sm:py-20"><ProductTour steps={steps} />
      <p className="mt-3 text-xs text-warm-500">Use ← → to move between steps. Admin screens come from a fresh test workspace (“Northwind Analytics”), so counts are small. Step 4 is the live chat on this site.</p>
      <div className="mt-8 flex flex-wrap items-center gap-3"><Link href="/signup" className="w-btn-accent w-btn-lg">Start free trial</Link><Link href="/try" className="w-btn-ghost w-btn-lg bg-card">Try it on your site</Link><span className="text-sm text-warm-600">Try reads up to 20 pages and answers up to 12 questions, with no signup.</span></div></Section>
    <Blocks d={{ ...HOW, hero: undefined }} />
  </MarketingPage>;
}
