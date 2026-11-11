import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { JsonLd, crumbsLd, pageMeta } from "@/lib/seo";
export const metadata = pageMeta("/changelog", "Changelog", "What’s shipped in Waylo, by date: workspaces and self-serve signup, Stripe billing, cited answers, Slack and webhook alerts, embed modes, and more.");
type E = { date: string; title: string; tag: "Product" | "Billing" | "Security" | "Site"; items: string[] };
// Written from the git history. Only shipped work goes here.
const LOG: E[] = [
  { date: "Nov 11, 2026", title: "Demo company renamed to Northpoint Ops", tag: "Site", items: ["The fictional /demo company is now Northpoint Ops (previously Acme Co)", "Existing embeds with data-site=\"acme-demo\" keep working and show the new name"] },
  { date: "Nov 11, 2026", title: "A bigger, more honest website", tag: "Site", items: ["New pages for each part of the product, use cases, comparisons, security, integrations, and guides", "Real product screenshots replace illustrations", "Copy corrected where it over-promised (Slack alerts link to the transcript rather than include it; CRM is via JSON webhook)", "“Start free trial” goes straight to signup"] },
  { date: "Nov 4, 2026", title: "Workspaces and self-serve signup", tag: "Product", items: ["Create a workspace at /signup; you’re the Owner", "Each workspace’s pages, guidance, conversations, and settings are isolated", "Billing is per workspace, with stricter Stripe routing and checks", "The /demo site has its own company branding and answers only from that company’s pages"] },
  { date: "Nov 4, 2026", title: "SaaS pre-sales page and install checklist", tag: "Site", items: ["New SaaS pre-sales → Slack use case", "Step-by-step install checklist in the docs", "Early-access notes: free hosting with cold starts, Stripe in test mode"] },
  { date: "Nov 3, 2026", title: "Better answers", tag: "Product", items: ["Source chips always use full links to your pages", "Generic “check our website” and “contact us directly” filler is stripped from answers", "When an answer is unknown, the chat points to the Contact tab instead"] },
  { date: "Nov 3, 2026", title: "Billing", tag: "Billing", items: ["Stripe Checkout for Starter and Growth, plus the Stripe Customer Portal", "14-day Trial", "Publishing the widget requires an active Trial or plan", "Billing status re-syncs when you open the admin"] },
  { date: "Nov 3, 2026", title: "Install and embed", tag: "Product", items: ["Floating launcher embed, plus sidebar and track-only modes", "Admin → Install page with your copy-paste snippet and checks", "“Open chat on page load” toggle", "Launcher hides while the site’s mobile menu is open"] },
  { date: "Nov 3, 2026", title: "Crawl and admin", tag: "Product", items: ["Background crawl with progress and a health check endpoint", "Members with Owner, Editor, and Viewer roles; invite emails and password reset", "Clearer admin navigation, checklist, and empty states"] },
  { date: "Nov 3, 2026", title: "Security basics", tag: "Security", items: ["Per-IP rate limits on public endpoints", "Allowed embed origins, so other sites can’t use your workspace"] },
  { date: "Nov 3, 2026", title: "First version", tag: "Product", items: ["Website chat with cited answers, Contact tab, and 👍/👎", "Guidance: facts, rules, skills", "Signals, visitor journeys, leads, handoffs, audiences", "Slack incoming webhook and JSON webhook alerts"] },
];
const tone = { Product: "bg-teal-50 text-teal-800 ring-teal-200", Billing: "bg-amber-50 text-amber-800 ring-amber-200", Security: "bg-indigo-50 text-indigo-800 ring-indigo-200", Site: "bg-stone-100 text-stone-700 ring-stone-200" };
export default function Changelog() {
  return <MarketingPage eyebrow="Changelog" crumb="Changelog" title="What’s shipped" sub="Dated, from the commit history. Early access moves fast; this is where to check." answer="Waylo’s first version shipped on November 3, 2026 with cited answers, guidance, signals, and Slack alerts. Workspaces and self-serve signup followed on November 4.">
    <JsonLd data={[crumbsLd([["Changelog", "/changelog"]])]} />
    <Section className="pt-10"><ol className="relative max-w-3xl border-l-2 border-stone-200 pl-6">{LOG.map(e => <li key={e.date + e.title} className="relative pb-9 last:pb-0"><span className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-br from-teal-600 to-indigo-600 ring-1 ring-stone-200" />
      <div className="flex flex-wrap items-center gap-2"><time className="font-mono text-xs text-stone-500">{e.date}</time><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${tone[e.tag]}`}>{e.tag}</span></div>
      <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-stone-900">{e.title}</h2><ul className="mt-2 space-y-1.5 text-sm leading-6 text-stone-600">{e.items.map(x => <li key={x} className="flex gap-2"><span className="text-teal-700">·</span>{x}</li>)}</ul></li>)}</ol></Section>
    <Section><CTA /></Section>
  </MarketingPage>;
}
