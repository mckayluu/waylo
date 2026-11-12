import { getBilling, stripeConfigured, syncSubscription } from "@/lib/stripe";
import { getSettings, listPages } from "@/lib/store";
import { entitlement } from "@/lib/entitlement";
import { PLANS, fmtNum } from "@/lib/plans";
import { siteList } from "@/lib/sites";
import { PageHeader, Card, Badge } from "../ui";
import { BillingActions } from "./BillingActions";
import { UsageMeter } from "../_parts/UsageMeter";
export const dynamic = "force-dynamic";
const NAMES = { trial: "Trial", starter: "Starter", growth: "Growth" } as const;
export default async function BillingPage({ searchParams }: { searchParams: { checkout?: string; billing?: string; plan?: string } }) {
  const configured = stripeConfigured();
  let b = await getBilling();
  // Re-sync from Stripe on load so cancel_at / trial_end / status are current; fall back to last known state.
  if (configured && b.stripeSubscriptionId) { try { b = await syncSubscription(b.stripeSubscriptionId); } catch (e: any) { console.error("[billing] page sync", e?.message); } }
  const live = b.status === "active" || b.status === "trialing" || b.status === "past_due";
  const paidLive = live && !!b.tier && b.tier !== "trial";
  const e = await entitlement(); const st = await getSettings(); const pages = (await listPages()).length; const sites = siteList(st).length;
  const plans = (["starter", "growth"] as const).map((t) => ({ tier: t, name: PLANS[t].name, price: PLANS[t].price, replies: fmtNum(PLANS[t].replies), sites: PLANS[t].sites, pages: fmtNum(PLANS[t].pages) }));
  const row = (k: string, v: React.ReactNode) => <div className="flex items-center justify-between py-2 first:pt-0 last:pb-0"><dt className="text-warm-500">{k}</dt><dd>{v}</dd></div>;
  return (<>
    <PageHeader title="Billing" sub="Your plan, usage and invoices. Upgrade, switch or cancel any time, right here." />
    <div className="-mt-3 mb-5 h-0.5 w-12 rounded-full bg-rasp-600" />
    {searchParams.checkout === "success" && <div className="mb-4 rounded-xl bg-navy-50 px-3.5 py-2.5 text-sm text-navy-800 ring-1 ring-navy-200">Thanks! Checkout complete. Your plan updates here as soon as Stripe confirms (usually a few seconds; refresh if needed).</div>}
    {searchParams.billing && <div className="mb-4 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">{searchParams.billing}</div>}
    {searchParams.checkout === "canceled" && <div className="mb-4 rounded-xl bg-warm-50 px-3.5 py-2.5 text-sm text-warm-700 ring-1 ring-warm-200">Checkout canceled. No charge was made.</div>}
    {!configured && <div className="mb-4 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">Stripe isn’t configured on this server (STRIPE_SECRET_KEY missing). Billing is disabled and limits aren’t enforced.</div>}
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <Card title="Current plan">
          <dl className="divide-y divide-warm-100 text-sm">
            {row("Plan", <span className="font-medium">{b.tier ? NAMES[b.tier] : "No plan yet"}</span>)}
            {row("Status", <span className="flex items-center gap-1.5"><Badge tone={e.state === "ended" || e.state === "over_limit" ? "rose" : live ? "navy" : b.status === "past_due" ? "rose" : "neutral"}>{e.state === "ended" ? "paused" : b.status}</Badge>{b.cancelAtPeriodEnd && <span className="text-xs text-amber-700">cancels at period end</span>}</span>)}
            {b.currentPeriodEnd && row(b.status === "trialing" || b.cancelAtPeriodEnd ? "Ends" : "Renews", new Date(b.currentPeriodEnd).toLocaleDateString())}
            {e.daysLeft !== undefined && row("Trial days left", <span className={e.daysLeft <= 3 ? "font-semibold text-amber-700" : ""}>{e.daysLeft}</span>)}
            {b.email && row("Billing email", b.email)}
          </dl>
        </Card>
        <Card title="Usage">
          <UsageMeter e={e} />
          <dl className="mt-3 divide-y divide-warm-100 border-t border-warm-100 pt-2 text-sm">
            {row("Sites", <span className="tabular-nums">{sites} / {e.plan.sites}</span>)}
            {row("Indexed pages", <span className="tabular-nums">{fmtNum(pages)} / {fmtNum(e.plan.pages)}</span>)}
            {row("Members", "no limit")}
          </dl>
          {!e.chatOpen && <p className="mt-3 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs text-rose-800">{e.reason}. Your widget shows a “leave a message” form instead of AI answers until you upgrade.</p>}
        </Card>
      </div>
      <div className="lg:col-span-3"><Card title={paidLive ? "Change plan" : "Choose a plan"}>
        <BillingActions hasCustomer={!!b.stripeCustomerId} configured={configured} plans={plans} current={paidLive ? b.tier : undefined} mode={paidLive ? "switch" : "checkout"} canTrial={!b.stripeSubscriptionId} plan={searchParams.plan} />
        <p className="mt-3 text-xs text-warm-500">No overage charges: if you hit your reply limit, chat falls back to your contact form until the limit resets or you upgrade. Need more than Growth? Add another workspace.</p>
      </Card></div>
    </div>
  </>);
}
