import { pageMeta, JsonLd, faqLd, crumbsLd } from "@/lib/seo";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Section, Shell } from "@/components/marketing/Section";
import Link from "next/link";
import { PricingCards } from "@/components/marketing/Pricing";
export const metadata: Metadata = pageMeta("/pricing", "Pricing: Trial, Starter $79, Growth $249", "Waylo pricing: free Trial with 500 AI messages, Starter at $79/month with 3,000 messages and CRM webhooks, Growth at $249/month with 3 sites and Audiences.");
const rows: [string, string, string, string][] = [["Websites", "1", "1", "3"], ["AI messages", "500 total", "3,000 / mo", "15,000 / mo"], ["Members", "1", "5", "Unlimited"], ["Cited answers from crawled pages", "✓", "✓", "✓"], ["Intent signals & journeys", "✓", "✓", "✓"], ["Embed modes (launcher, sidebar, track)", "✓", "✓", "✓"], ["Contact form & leads", "✓", "✓", "✓"], ["Guidance (facts, rules, skills)", "—", "✓", "✓"], ["Contact / demo handoff", "—", "✓", "✓"], ["Slack + CRM webhooks", "—", "✓", "✓"], ["Roles & permissions", "—", "✓", "✓"], ["Audiences", "—", "—", "✓"], ["Setup call", "—", "—", "✓"], ["Support", "Email", "Email", "Priority"]];
const faqs = [["What counts as an AI message?", "Each answer Waylo sends to a visitor."], ["What happens if I hit my limit?", "We’ll warn you before you get there and work with you on the right plan — no surprise overages."], ["Can I change plans?", "Yes, move up or down at any time."], ["Is there a contract?", "No long-term contract during early access."], ["How do I pay?", "Online checkout isn’t live yet. We set you up and invoice directly."]];
const ACCESS = "mailto:hello@waylo.ai?subject=Waylo%20early%20access";
export default function Pricing() {
  return <Shell><Header /><main>
    <Section eyebrow="Early access pricing" title="Plans that grow with your site" sub="Start with a trial, then pick the plan that fits. Request access and we’ll set up your site with you." className="w-mesh"><PricingCards /></Section>
    <Section title="Compare plans" className="bg-white"><div className="w-card-lg overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead className="bg-stone-50"><tr><th className="w-th">Feature</th><th className="w-th">Trial</th><th className="w-th text-teal-800">Starter</th><th className="w-th">Growth</th></tr></thead><tbody className="divide-y divide-stone-100">{rows.map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`px-5 py-3 ${i ? (c === "✓" ? "text-teal-700" : "text-stone-600") : "font-medium"} ${i === 2 ? "bg-teal-50/40" : ""}`}>{c}</td>)}</tr>)}</tbody></table></div>
      <div className="mt-10 flex flex-col items-center justify-between gap-4 w-gradient w-glow rounded-2xl p-6 text-white sm:flex-row"><div><p className="font-semibold">Need more?</p><p className="text-sm text-teal-50">More sites, higher volume, or a security review? We’ll put together a plan.</p></div><a href={ACCESS} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-900">Email hello@waylo.ai</a></div></Section>
    <JsonLd data={[faqLd(faqs as [string, string][]), crumbsLd([["Pricing", "/pricing"]])]} />
    <Section eyebrow="FAQ" title="Pricing questions"><div className="mx-auto max-w-3xl divide-y divide-stone-200 border-y border-stone-200">{faqs.map(([q, a]) => <div key={q} className="py-5"><p className="font-medium">{q}</p><p className="mt-2 text-sm text-stone-600">{a}</p></div>)}</div>
      <p className="mt-10 text-center"><Link href="/demo" className="w-btn-grad px-5 py-2.5">Try the live demo first →</Link></p></Section>
  </main><Footer /></Shell>;
}
