export const plans = [
  { name: "Trial", price: "$0", per: "14 days", blurb: "Crawl your site and see cited answers and signals on real traffic.", features: ["1 website", "500 AI messages total", "1 member", "Site crawl + cited answers", "Visitor journeys & signals", "Contact form & leads"], cta: "Start free trial", tier: "trial" },
  { name: "Starter", price: "$79", per: "/mo", blurb: "For one site that needs leads routed to Slack or a CRM.", features: ["1 website", "3,000 AI messages / mo", "Up to 5 members & roles", "Slack + CRM webhooks", "Contact & demo handoff", "Guidance: facts, rules, skills"], cta: "Subscribe to Starter", tier: "starter", featured: true },
  { name: "Growth", price: "$249", per: "/mo", blurb: "For up to three sites, with audiences and a setup call.", features: ["Everything in Starter", "Up to 3 websites", "15,000 AI messages / mo", "Unlimited members", "Audiences", "Priority support", "Done-with-you setup call"], cta: "Subscribe to Growth", tier: "growth" },
];
export function PricingCards() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`w-card-lg flex flex-col p-7 transition hover:-translate-y-0.5 ${p.featured ? "w-glow ring-2 ring-amber-400 relative before:absolute before:inset-x-0 before:top-0 before:h-1 before:rounded-t-2xl before:bg-[linear-gradient(90deg,#0F766E,#4338CA,#F59E0B)]" : ""}`}>
            <div className="flex items-center justify-between"><h3 className="font-semibold">{p.name}</h3>{p.featured && <span className="w-badge-accent">Most popular</span>}</div>
            <p className="mt-4"><span className="text-4xl font-semibold tracking-tight">{p.price}</span> <span className="text-sm text-stone-500">{p.per}</span></p>
            <p className="mt-1 text-xs font-medium text-indigo-700">Early access rate</p>
            <p className="mt-2 text-sm text-stone-600">{p.blurb}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-stone-700">{p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-teal-700">✓</span>{f}</li>)}</ul>
            <form action="/api/billing/checkout" method="post" className="mt-8 flex"><input type="hidden" name="tier" value={p.tier} /><button type="submit" className={`w-full ${p.featured ? "w-btn-accent" : "w-btn-ghost"} py-2.5`}>{p.cta}</button></form>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-stone-500">Early access pricing. Secure checkout by Stripe — manage or cancel anytime from Billing in your admin. Questions? <a href="/contact" className="underline">Contact us</a></p>
    </>
  );
}
