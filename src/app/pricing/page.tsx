import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Section, Shell } from "@/components/marketing/Section";
import { PricingCards } from "@/components/marketing/Pricing";
export const metadata: Metadata = { title: "Pricing — Waylo" };
const rows: [string, string, string, string][] = [["Websites", "1", "1", "3"], ["AI messages", "500 total", "3,000 / mo", "15,000 / mo"], ["Members", "1", "5", "Unlimited"], ["Cited answers & crawl", "✓", "✓", "✓"], ["Journeys & signals", "✓", "✓", "✓"], ["Handoff to a person", "—", "✓", "✓"], ["Slack + CRM webhooks", "—", "✓", "✓"], ["Audiences", "—", "—", "✓"], ["Support", "Email", "Email", "Priority"]];
export default function Pricing() {
  return <Shell><Header /><main>
    <Section eyebrow="Pricing" title="Plans that grow with your traffic" sub="Start with the demo, then we’ll set up your site. Need more? Email hello@waylo.ai for custom volume."><PricingCards /></Section>
    <Section title="Compare plans" className="bg-white"><div className="w-card overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead className="bg-stone-50"><tr><th className="w-th">Feature</th><th className="w-th">Trial</th><th className="w-th">Starter</th><th className="w-th">Growth</th></tr></thead><tbody className="divide-y divide-stone-100">{rows.map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`px-5 py-3 ${i ? "text-stone-600" : "font-medium"}`}>{c}</td>)}</tr>)}</tbody></table></div></Section>
  </main><Footer /></Shell>;
}
