export const plans = [
  { name: "Trial", price: "$0", per: "14 days", blurb: "Try Waylo with your real visitors before you pay.", features: ["1 website", "Up to 100 pages", "500 AI messages total", "Every feature included"], cta: "Start free trial", tier: "trial" },
  { name: "Starter", price: "$79", per: "/mo", blurb: "For one website with steady questions.", features: ["1 website", "Up to 500 pages", "3,000 AI messages / mo", "Every feature included"], cta: "Subscribe to Starter", tier: "starter", featured: true },
  { name: "Growth", price: "$249", per: "/mo", blurb: "For teams running up to three websites.", features: ["Up to 3 websites", "Up to 2,000 pages", "15,000 AI messages / mo", "Every feature included"], cta: "Subscribe to Growth", tier: "growth" },
];
export function PricingCards() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`w-tile flex flex-col p-7 shadow-xl shadow-navy-950/10 transition hover:-translate-y-0.5 ${p.featured ? "w-tile-blush ring-2 ring-rasp-600" : "w-tile-card"}`}>
            <div className="flex items-center justify-between gap-2"><h3 className="font-plex text-xs font-medium uppercase tracking-[0.09em] text-warm-700">{p.name}</h3></div>
            <p className="mt-4"><span className="font-display text-5xl font-semibold tracking-tight">{p.price}</span> <span className="text-sm text-warm-500">{p.per}</span></p>
            <p className="mt-2 text-sm text-warm-600">{p.blurb}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-warm-700">{p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-navy-700">✓</span>{f}</li>)}</ul>
            <form action="/api/billing/checkout" method="post" className="mt-8 flex"><input type="hidden" name="tier" value={p.tier} /><button type="submit" className={`w-full ${p.featured ? "w-btn-accent" : "w-btn-ghost"} py-2.5`}>{p.cta}</button></form>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-warm-600">Every plan includes cited answers, buying signals, visitor journeys, Guidance, Audiences, roles, the contact form and handoffs, and Slack and CRM webhooks. Plans differ only in messages, pages and websites.</p>
      <p className="mt-3 text-center text-xs text-warm-500">Checkout runs on Stripe. No overage fees, and you can cancel from Billing at any time. Questions? Read the <a href="/faq" className="underline">FAQ</a> or <a href="/how-it-works" className="underline">see how it works</a>.</p>
    </>
  );
}
