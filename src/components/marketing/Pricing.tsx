import Link from "next/link";
const ACCESS = "mailto:hello@waylo.ai?subject=Waylo%20early%20access";
export const plans = [
  { name: "Trial", price: "$0", per: "14 days", blurb: "Try Waylo on your own site.", features: ["1 website", "500 AI messages total", "1 member", "Site crawl + cited answers", "Visitor journeys & signals", "Contact form & leads"], cta: "Start with a trial", href: ACCESS },
  { name: "Starter", price: "$79", per: "/mo", blurb: "For teams turning chats into leads.", features: ["1 website", "3,000 AI messages / mo", "Up to 5 members & roles", "Slack + CRM webhooks", "Contact & demo handoff", "Guidance: facts, rules, skills"], cta: "Request access", href: ACCESS, featured: true },
  { name: "Growth", price: "$249", per: "/mo", blurb: "For multiple sites and bigger teams.", features: ["Everything in Starter", "Up to 3 websites", "15,000 AI messages / mo", "Unlimited members", "Audiences", "Priority support", "Done-with-you setup call"], cta: "Request access", href: ACCESS },
];
export function PricingCards() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`w-card-lg flex flex-col p-7 transition hover:-translate-y-0.5 ${p.featured ? "w-glow ring-2 ring-teal-600" : ""}`}>
            <div className="flex items-center justify-between"><h3 className="font-semibold">{p.name}</h3>{p.featured && <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">Most popular</span>}</div>
            <p className="mt-4"><span className="text-4xl font-semibold tracking-tight">{p.price}</span> <span className="text-sm text-stone-500">{p.per}</span></p>
            <p className="mt-1 text-xs font-medium text-teal-700">Early access rate</p>
            <p className="mt-2 text-sm text-stone-600">{p.blurb}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-stone-700">{p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-teal-700">✓</span>{f}</li>)}</ul>
            <Link href={p.href} className={`mt-8 ${p.featured ? "w-btn" : "w-btn-ghost"} py-2.5`}>{p.cta}</Link>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-stone-500">Early access pricing — proposed and subject to change. Online checkout isn’t live yet; we’ll set you up and invoice directly.</p>
    </>
  );
}
