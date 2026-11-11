import Link from "next/link";
import { MarketingPage } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Blocks } from "@/components/marketing/Blocks";
import { ProductTour } from "@/components/marketing/ProductTour";
import { HOW } from "@/lib/pages/site";
import { metaFor } from "@/lib/pages/render";
import { tourSteps, tourVideo } from "@/lib/tour";
import { JsonLd, crumbsLd, faqLd } from "@/lib/seo";
export const metadata = metaFor(HOW);
export default function HowItWorks() {
  const steps = tourSteps(); const video = tourVideo();
  const howTo = { "@context": "https://schema.org", "@type": "HowTo", name: "Set up Waylo on your website", step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.caption })) };
  const faqs = HOW.blocks.flatMap(b => (b.t === "faq" ? b.items : []));
  return <MarketingPage eyebrow={HOW.eyebrow} crumb={HOW.crumb} title={HOW.title} sub={HOW.sub} answer={HOW.answer}>
    <JsonLd data={[crumbsLd([[HOW.crumb, HOW.path]]), howTo, faqLd(faqs)]} />
    <Section id="tour" className="pt-8"><ProductTour steps={steps} />
      <p className="mt-3 text-xs text-stone-500">Use ← → to move between steps. Every image is a screenshot of the real app; steps marked “sample data” use a local build with test visitors.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent px-5 py-2.5">Start free trial</Link><Link href="/demo" className="w-btn-ghost px-5 py-2.5">Try the live demo</Link></div></Section>
    {video && <Section eyebrow="Watch it" title="The whole flow in one take" className="bg-white"><video src={video} controls preload="metadata" playsInline className="w-full rounded-2xl ring-1 ring-stone-200" /></Section>}
    <Blocks d={{ ...HOW, hero: undefined }} />
  </MarketingPage>;
}
