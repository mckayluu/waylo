import Link from "next/link";
import Image from "next/image";
import { MarketingPage, CTA, FactsBlock } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Chip } from "@/components/marketing/Visuals";
import { JsonLd, crumbsLd, faqLd, pageMeta } from "@/lib/seo";
import { SOLUTIONS } from "@/lib/solutions";
export const metadata = pageMeta("/resources", "Resources: docs, install guide, embed modes, and FAQ", "Docs, guides, and answers: documentation, the one-line install guide, embed modes, the JavaScript API, FAQ, and guides by team.");
type R = { h: string; d: string; href: string; t: "teal" | "amber" | "indigo"; i: string; tag: string };
const res: R[] = [
  { h: "Documentation", d: "How Waylo crawls, answers, signals, and hands off — with setup for every feature.", href: "/docs", t: "teal", i: "📘", tag: "Docs" },
  { h: "Install guide", d: "Add the one-line script tag, allow your domain, and verify it’s live in minutes.", href: "/docs/install", t: "amber", i: "⚡", tag: "Setup" },
  { h: "Install checklist", d: "Script tag, data-site, mode, crawl check, a test question, and the Slack webhook — in order.", href: "/docs/install#checklist", t: "teal", i: "✓", tag: "Setup" },
  { h: "Embed modes", d: "Launcher, sidebar, or track-only — choose the right mode per page.", href: "/docs/embed-modes", t: "indigo", i: "🧩", tag: "Setup" },
  { h: "JavaScript API", d: "Open the chat, pass context, and trigger Waylo from your own buttons.", href: "/docs/install#api", t: "teal", i: "</>", tag: "Developers" },
  { h: "CMS & platform notes", d: "Webflow, WordPress, Shopify, Squarespace, Wix, and Google Tag Manager.", href: "/docs/install#cms", t: "amber", i: "🛠", tag: "Setup" },
  { h: "Troubleshooting", d: "Widget not showing? Domain not allowed? Fixes for the common cases.", href: "/docs/install#troubleshooting", t: "indigo", i: "🩺", tag: "Support" },
  { h: "FAQ", d: "Answers on accuracy, sources, data, pricing, integrations, and rollout.", href: "/faq", t: "teal", i: "❓", tag: "Evaluate" },
  { h: "Pricing", d: "Trial, Starter, and Growth — what’s included and how messages are counted.", href: "/pricing", t: "amber", i: "💳", tag: "Evaluate" },
  { h: "Live demo", d: "Talk to Waylo on a real page and watch citations and signals appear.", href: "/demo", t: "indigo", i: "▶", tag: "Evaluate" },
];
const qa: [string, string][] = [
  ["Where do I start with Waylo?", "Start with the install guide: add one script tag before </body>, allow your domain in the dashboard, and verify the widget loads. Then review crawled pages and add facts and rules."],
  ["Is there developer documentation?", "Yes. The docs cover embed attributes, embed modes, the JavaScript API for opening the chat from your own buttons, and CMS-specific install notes."],
  ["Can I try Waylo before installing?", "Yes. The live demo page runs Waylo on a real page so you can see cited answers and signals before adding it to your site."],
];
export default function Resources() {
  return <MarketingPage eyebrow="Resources" crumb="Resources" title="Docs, guides, and answers" sub="Install steps, embed reference, the JavaScript API, troubleshooting, and the FAQ." answer="Waylo resources include product documentation, a one-line install guide, embed mode reference, the JavaScript API, an FAQ, pricing details, a live demo, and solution guides for marketing, sales, SaaS, and agency teams.">
    <JsonLd data={[crumbsLd([["Resources", "/resources"]]), faqLd(qa)]} />
    <Section className="w-mesh" eyebrow="Library" title="Start where you are">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div><Link href={res[1].href} className="group grid overflow-hidden rounded-2xl bg-stone-950 text-white sm:grid-cols-[1fr_200px]"><div className="p-6"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-300">Start here</p><p className="mt-1.5 text-2xl font-semibold tracking-tight">{res[1].h}</p><p className="mt-2 text-sm leading-6 text-stone-300">{res[1].d}</p><span className="mt-4 inline-block text-sm font-medium text-amber-300 group-hover:underline">Open the guide →</span></div><Image src="/marketing/laptop.webp" alt="" width={1400} height={934} sizes="200px" className="hidden h-full w-full object-cover opacity-80 sm:block" /></Link>
          <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200">{res.filter((r, i) => i !== 1 && ["Docs", "Setup", "Developers", "Support"].includes(r.tag)).map(r => <li key={r.h}><Link href={r.href} className="grid gap-1 py-3.5 hover:text-teal-800 sm:grid-cols-[180px_1fr] sm:gap-6"><span className="font-semibold text-stone-900">{r.h}</span><span className="text-sm text-stone-600">{r.d}</span></Link></li>)}</ul></div>
        <div><p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Evaluating Waylo</p><ul className="mt-3 space-y-4">{res.filter(r => r.tag === "Evaluate").map(r => <li key={r.h}><Link href={r.href} className="group block"><span className="font-semibold text-stone-900 group-hover:text-teal-800">{r.h} →</span><span className="mt-0.5 block text-sm leading-6 text-stone-600">{r.d}</span></Link></li>)}</ul></div>
      </div>
    </Section>
    <Section className="bg-white" eyebrow="Playbooks by team" title="How teams roll out Waylo">
      <div className="grid gap-4 md:grid-cols-2">{SOLUTIONS.map(s => <Link key={s.id} href={`/solutions/${s.id}`} className="w-card-lg group flex overflow-hidden transition hover:border-amber-300"><Image src={s.img} alt="" width={1400} height={934} sizes="160px" className="h-auto w-36 shrink-0 object-cover" /><div className="p-5"><Chip t={s.t}>{s.who}</Chip><p className="mt-2 font-semibold text-stone-900">{s.short}</p><p className="mt-1 text-sm text-stone-600">{s.setup.map(x => x[0]).join(" → ")}</p></div></Link>)}</div>
    </Section>
    <Section className="w-mesh"><FactsBlock /></Section>
    <Section className="bg-white" eyebrow="Common questions" title="Before you install">
      <div className="max-w-4xl divide-y divide-stone-200 border-y border-stone-200">{qa.map(([q, a]) => <div key={q} className="py-4"><h3 className="font-semibold text-stone-900">{q}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{a}</p></div>)}</div>
    </Section>
    <Section><CTA /></Section>
  </MarketingPage>;
}
