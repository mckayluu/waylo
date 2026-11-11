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
      <p className="mt-3 text-xs text-stone-500">Use ← → to move between steps. Every image is a screenshot of the real app, captured from a fresh test workspace (“Northwind Analytics”), so counts are small. The account email is blurred.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent px-5 py-2.5">Start free trial</Link><Link href="/demo" className="w-btn-ghost px-5 py-2.5">Try the live demo</Link></div>
      <p className="mt-3 text-sm text-stone-600">Want to see it on your own pages first? <Link href="/try" className="font-medium text-teal-700 underline">Try it on your site</Link> with no signup. It reads up to 20 pages and answers up to 12 questions.</p></Section>
    {video && <Section eyebrow="24-second loop" title="The whole flow, start to finish" sub="The same eight real screens, three seconds each. No sound." className="bg-white"><video src={video.src} poster={video.poster} autoPlay muted loop playsInline preload="metadata" aria-label="Silent loop of the eight Waylo setup screens with captions" className="mx-auto w-full max-w-4xl rounded-2xl ring-1 ring-stone-200" /></Section>}
    <Blocks d={{ ...HOW, hero: undefined }} />
  </MarketingPage>;
}
