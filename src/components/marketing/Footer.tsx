import Link from "next/link";
import { Wordmark } from "./Header";
export function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Product", [["All features", "/features"], ["AI chat", "/product/ai-chat"], ["Citations", "/product/citations"], ["Lead capture", "/product/lead-capture"], ["Slack routing", "/product/slack-routing"], ["Analytics", "/product/analytics"], ["Branding", "/product/branding"], ["Install", "/product/install"], ["How it works", "/how-it-works"], ["Integrations", "/integrations"], ["Security & data", "/security"], ["Pricing", "/pricing"], ["Live demo", "/demo"]]],
    ["Solutions", [["All use cases", "/use-cases"], ["SaaS pre-sales → Slack", "/use-cases/saas-presales-slack"], ["Agencies", "/use-cases/agencies"], ["E-commerce", "/use-cases/ecommerce"], ["B2B services", "/use-cases/b2b-services"], ["Support deflection", "/use-cases/support-deflection"], ["Marketing teams", "/solutions/marketing"], ["Sales teams", "/solutions/sales"], ["SaaS & docs", "/solutions/saas"], ["Waylo vs chatbots", "/compare/generic-chatbots"], ["Waylo vs live chat", "/compare/live-chat"]]],
    ["Resources", [["Resources hub", "/resources"], ["Documentation", "/docs"], ["Install guide", "/docs/install"], ["JavaScript API", "/docs/install#api"], ["FAQ", "/faq"]]],
    ["Company", [["About", "/about"], ["Changelog", "/changelog"], ["Sign in", "/admin/login"], ["Start free trial", "/signup"], ["Contact", "/contact"], ["Terms", "/terms"], ["Privacy", "/privacy"]]],
  ];
  return (
    <footer className="relative bg-stone-950 text-stone-300"><div className="w-accent-line" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-5">
        <div><Wordmark invert /><p className="mt-3 text-sm text-stone-400">AI website chat with cited answers, intent signals, and lead handoff to Slack and your CRM.</p></div>
        {cols.map(([h, links]) => (
          <div key={h}><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{h}</p>
            <ul className="mt-3 space-y-2 text-sm">{links.map(([l, href]) => <li key={l}><Link href={href} className="text-stone-400 hover:text-amber-300">{l}</Link></li>)}</ul></div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">© {new Date().getFullYear()} Waylo. All rights reserved.</div>
    </footer>
  );
}
