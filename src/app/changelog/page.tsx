import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { JsonLd, crumbsLd, pageMeta } from "@/lib/seo";
export const metadata = pageMeta("/changelog", "Changelog", "What’s shipped in Waylo, by date: workspaces and self-serve signup, Stripe billing, cited answers, Slack and webhook alerts, embed modes, and more.");
type E = { date: string; title: string; tag: "Product" | "Billing" | "Security" | "Site"; items: string[] };
// Written from the git history. Only shipped work goes here.
const LOG: E[] = [
  { date: "Nov 11, 2026", title: "Plan limits and upgrades in the app", tag: "Billing", items: ["Each plan’s AI reply limit is now enforced, with a usage meter in the admin", "At the limit the chat pauses and shows your contact form, with no overage fees", "Upgrade from the Trial or switch plans from Billing"] },
  { date: "Nov 11, 2026", title: "A smarter crawl", tag: "Product", items: ["The crawl starts from your sitemap, then follows links", "Linked PDF and .docx files are read when they contain text", "Page caps follow your plan: 100 on the Trial, 500 on Starter, 2,000 on Growth"] },
  { date: "Nov 11, 2026", title: "Set it up yourself", tag: "Product", items: ["A setup checklist in the admin, with a test chat and a real install check", "A product tour of the eight setup screens at /how-it-works", "The help page is support only, and the assistant points people to the trial and docs"] },
  { date: "Nov 11, 2026", title: "Demo company renamed to Northpoint Ops", tag: "Site", items: ["The fictional /demo company is now Northpoint Ops (previously Acme Co)", "Existing embeds with data-site=\"acme-demo\" keep working and show the new name"] },
  { date: "Nov 11, 2026", title: "A bigger, more honest website", tag: "Site", items: ["New pages for each part of the product, use cases, comparisons, security, integrations, and guides", "Real product screenshots replace illustrations", "Copy fixed where it promised too much. Slack alerts link to the conversation, and the CRM connection is a JSON webhook.", "“Start free trial” goes straight to signup"] },
  { date: "Nov 4, 2026", title: "Workspaces and self-serve signup", tag: "Product", items: ["Create a workspace at /signup and you’re the Owner", "Each workspace’s pages, guidance, conversations, and settings are isolated", "Billing is per workspace, with stricter Stripe routing and checks", "The /demo site has its own company branding and answers only from that company’s pages"] },
  { date: "Nov 4, 2026", title: "SaaS pre-sales page and install checklist", tag: "Site", items: ["New use case page for SaaS pre-sales to Slack", "Step-by-step install checklist in the docs", "Early access notes about free hosting with cold starts and Stripe in test mode"] },
  { date: "Nov 3, 2026", title: "Better answers", tag: "Product", items: ["Source chips always use full links to your pages", "Generic “check our website” and “contact us directly” filler is stripped from answers", "When the chat doesn’t know an answer, it points to the Contact tab"] },
  { date: "Nov 3, 2026", title: "Billing", tag: "Billing", items: ["Stripe Checkout for Starter and Growth, plus the Stripe Customer Portal", "14-day Trial", "Publishing the widget requires an active Trial or plan", "Billing status re-syncs when you open the admin"] },
  { date: "Nov 3, 2026", title: "Install and embed", tag: "Product", items: ["Floating launcher embed, plus sidebar and data-mode=\"track\" modes", "Admin → Install page with your copy-paste snippet and checks", "“Open chat on page load” toggle", "Launcher hides while the site’s mobile menu is open"] },
  { date: "Nov 3, 2026", title: "Crawl and admin", tag: "Product", items: ["Background crawl with progress and a health check endpoint", "Members with Owner, Editor, and Viewer roles; invite emails and password reset", "Clearer admin navigation, checklist, and empty states"] },
  { date: "Nov 3, 2026", title: "Security basics", tag: "Security", items: ["Per-IP rate limits on public endpoints", "Allowed embed origins, so other sites can’t use your workspace"] },
  { date: "Nov 3, 2026", title: "First version", tag: "Product", items: ["Website chat with cited answers, Contact tab, and 👍/👎", "Guidance: facts, rules, skills", "Signals, visitor journeys, leads, handoffs, audiences", "Slack incoming webhook and JSON webhook alerts"] },
];
const tone = { Product: "bg-navy-50 text-navy-800 ring-navy-200", Billing: "bg-rasp-50 text-rasp-800 ring-rasp-200", Security: "bg-navy-50 text-navy-800 ring-navy-200", Site: "bg-warm-100 text-warm-700 ring-warm-200" };
export default function Changelog() {
  return <MarketingPage eyebrow="Changelog" crumb="Changelog" title="What’s shipped" sub="Dated entries from the commit history. Things change fast in early access, so check here." answer="Waylo’s first version shipped on November 3, 2026 with cited answers, guidance, signals, and Slack alerts. Workspaces and self-serve signup followed on November 4.">
    <JsonLd data={[crumbsLd([["Changelog", "/changelog"]])]} />
    <Section className="pt-10"><ol className="relative max-w-3xl border-l-2 border-warm-200 pl-6">{LOG.map(e => <li key={e.date + e.title} className="relative pb-9 last:pb-0"><span className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-br from-navy-600 to-navy-600 ring-1 ring-warm-200" />
      <div className="flex flex-wrap items-center gap-2"><time className="font-mono text-xs text-warm-500">{e.date}</time><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${tone[e.tag]}`}>{e.tag}</span></div>
      <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-warm-900">{e.title}</h2><ul className="mt-2 space-y-1.5 text-sm leading-6 text-warm-600">{e.items.map(x => <li key={x} className="flex gap-2"><span className="text-navy-700">·</span>{x}</li>)}</ul></li>)}</ol></Section>
    <Section><CTA /></Section>
  </MarketingPage>;
}
