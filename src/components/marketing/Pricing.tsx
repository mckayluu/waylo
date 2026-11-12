export const plans = [
  { name: "Trial", price: "$0", per: "14 days", blurb: "For trying Waylo on your own site with real visitors.", features: ["1 website", "500 AI messages total", "Invite your whole team", "Site crawl and cited answers", "Visitor journeys and signals", "Contact form and leads", "Slack and CRM alerts start on Starter"], cta: "Start free trial", tier: "trial" },
  { name: "Starter", price: "$79", per: "/mo", blurb: "For one site that wants ready buyers sent to Slack or a CRM.", features: ["1 website", "3,000 AI messages / mo", "Owner, Editor, and Viewer roles", "Slack and CRM webhooks", "Contact and demo handoff", "Guidance with facts, rules, and skills"], cta: "Subscribe to Starter", tier: "starter", featured: true, tag: "Adds Slack alerts" },
  { name: "Growth", price: "$249", per: "/mo", blurb: "For teams with up to three sites who want Audiences.", features: ["Everything in Starter", "Up to 3 websites", "15,000 AI messages / mo", "Audiences", "Priority support"], cta: "Subscribe to Growth", tier: "growth" },
];
export function PricingCards() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`w-tile flex flex-col p-7 shadow-xl shadow-navy-950/10 transition hover:-translate-y-0.5 ${p.featured ? "w-tile-blush ring-2 ring-rasp-600" : "w-tile-card"}`}>
            <div className="flex items-center justify-between gap-2"><h3 className="font-plex text-xs font-medium uppercase tracking-[0.09em] text-warm-700">{p.name}</h3>{"tag" in p && p.tag && <span className="rounded-full bg-rasp-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">{p.tag}</span>}</div>
            <p className="mt-4"><span className="font-display text-5xl font-semibold tracking-tight">{p.price}</span> <span className="text-sm text-warm-500">{p.per}</span></p>
            <p className="mt-1 text-xs font-medium text-navy-700">Early access rate</p>
            <p className="mt-2 text-sm text-warm-600">{p.blurb}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-warm-700">{p.features.map((f) => <li key={f} className={`flex gap-2 ${f.startsWith("Slack and CRM alerts start") ? "text-warm-500" : ""}`}><span className={f.startsWith("Slack and CRM alerts start") ? "text-warm-400" : "text-navy-700"}>{f.startsWith("Slack and CRM alerts start") ? "–" : "✓"}</span>{f}</li>)}</ul>
            <form action="/api/billing/checkout" method="post" className="mt-8 flex"><input type="hidden" name="tier" value={p.tier} /><button type="submit" className={`w-full ${p.featured ? "w-btn-accent" : "w-btn-ghost"} py-2.5`}>{p.cta}</button></form>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-warm-500">Checkout runs on Stripe. No overage fees, and you can cancel from Billing at any time. Questions? Read the <a href="/faq" className="underline">FAQ</a> or <a href="/how-it-works" className="underline">see how it works</a>.</p>
    </>
  );
}
