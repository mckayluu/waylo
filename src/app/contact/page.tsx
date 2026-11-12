import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Shell, Section } from "@/components/marketing/Section";
import { JsonLd, crumbsLd, pageMeta } from "@/lib/seo";
import { ContactForm } from "./ContactForm";
export const metadata = pageMeta("/contact", "Help & support", "Waylo help: the product tour, install guide, troubleshooting, embed modes, FAQ, and a support form for when something isn’t working.");
const paths: [string, string, string, string][] = [
  ["Setting up", "Product tour", "/how-it-works", "Every screen from signup to a live, cited answer."],
  ["Setting up", "Install guide", "/docs/install", "Snippet, allowed origins, CMS and GTM notes."],
  ["Setting up", "Install checklist", "/docs/install#checklist", "The go-live steps in order."],
  ["Something’s off", "Troubleshooting", "/docs/install#troubleshooting", "Widget not showing, domain not allowed, slow first load."],
  ["Something’s off", "Why an answer was wrong", "/product/citations", "Check the cited page, then fix it or add a Fact."],
  ["Something’s off", "Crawl limits", "/product/ai-chat", "JavaScript-only pages and page caps by plan."],
  ["Reference", "Embed modes", "/docs/embed-modes", "Launcher, sidebar, track."],
  ["Reference", "Slack & webhook events", "/product/slack-routing", "What posts, when, and the JSON payload."],
  ["Reference", "FAQ", "/faq", "Pricing, data, limits, install."],
  ["Account", "Billing & plans", "/pricing", "Change or cancel from Admin → Billing."],
  ["Account", "Security & data", "/security", "What’s stored and who processes it."],
  ["Account", "Changelog", "/changelog", "What shipped recently."],
];
export default function Help() {
  const groups = [...new Set(paths.map(p => p[0]))];
  return <Shell><Header /><main>
    <JsonLd data={[crumbsLd([["Help & support", "/contact"]])]} />
    <section className="w-gradient relative overflow-hidden px-5 pb-16 pt-10 text-white sm:pt-12"><div className="w-grid-bg absolute inset-0 opacity-60" aria-hidden /><div className="relative mx-auto max-w-6xl">
      <nav aria-label="Breadcrumb" className="text-xs text-white/70"><Link href="/" className="hover:text-white">Home</Link> / <span>Help & support</span></nav>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-rasp-300">Help & support</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Help and support</h1>
      <p className="mt-4 max-w-2xl text-lg text-white/85">Waylo is self-serve. The tour, the install guide, and the FAQ answer most questions. If something is broken, use the support form below.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/how-it-works" className="w-btn-accent px-5 py-2.5">See how it works</Link><Link href="/signup" className="w-btn-glass px-5 py-2.5">Start free trial</Link></div>
    </div></section>
    <Section className="w-band-paper py-16"><div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">{groups.map(g => <div key={g}><p className="w-pill">{g}</p><ul className="mt-3 divide-y divide-warm-200 border-y border-warm-200">{paths.filter(p => p[0] === g).map(([, l, h, d]) => <li key={h}><Link href={h} className="block py-3 hover:text-navy-800"><span className="font-semibold text-warm-900">{l} →</span><span className="mt-0.5 block text-sm leading-6 text-warm-600">{d}</span></Link></li>)}</ul></div>)}</div></Section>
    <Section id="support" eyebrow="Support form" title="Something not working?" sub="For bugs and account problems only. Tell us the page, what you expected, and what happened. Replies come by email." className="bg-card py-16 sm:py-20">
      <div className="max-w-xl"><ContactForm /></div></Section>
  </main><Footer /></Shell>;
}
