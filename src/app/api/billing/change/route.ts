import { NextResponse } from "next/server";
import { stripe, stripeConfigured, priceForTier, getBilling, syncSubscription } from "@/lib/stripe";
import { getSettings, type Tier } from "@/lib/store";
import { PLANS, PAID_TIERS } from "@/lib/plans";
import { siteList } from "@/lib/sites";
export const dynamic = "force-dynamic";
// In-app plan switch between paid tiers (Editor+ via middleware). Prorated by Stripe; no sales contact.
// Trials and canceled workspaces upgrade through Checkout instead (needs a card).
export async function POST(req: Request) {
  if (!stripeConfigured()) return NextResponse.json({ error: "Stripe isn't configured" }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  const tier = String(b.tier || "") as Tier;
  if (!PAID_TIERS.includes(tier)) return NextResponse.json({ error: "Choose Starter or Growth" }, { status: 400 });
  let bill = await getBilling();
  if (!bill.stripeSubscriptionId) return NextResponse.json({ error: "No plan yet", checkout: true }, { status: 409 });
  bill = await syncSubscription(bill.stripeSubscriptionId);
  const paidLive = (bill.status === "active" || bill.status === "past_due" || bill.status === "trialing") && bill.tier && bill.tier !== "trial";
  if (!paidLive) return NextResponse.json({ error: "Upgrade from a trial goes through checkout", checkout: true }, { status: 409 });
  if (bill.tier === tier) return NextResponse.json({ ok: true, unchanged: true });
  const sites = siteList(await getSettings()).length;
  if (sites > PLANS[tier].sites) return NextResponse.json({ error: `${PLANS[tier].name} includes ${PLANS[tier].sites} site. Remove ${sites - PLANS[tier].sites} site(s) under Content first.` }, { status: 409 });
  try {
    const sub = await stripe().subscriptions.retrieve(bill.stripeSubscriptionId!);
    const item = sub.items.data[0];
    const updated = await stripe().subscriptions.update(sub.id, {
      items: [{ id: item.id, price: await priceForTier(tier) }], proration_behavior: "create_prorations",
      cancel_at_period_end: false, metadata: { ...sub.metadata, tier },
    });
    const saved = await syncSubscription(updated);
    return NextResponse.json({ ok: true, tier: saved.tier });
  } catch (e: any) { console.error("[billing] change", e?.message); return NextResponse.json({ error: "Couldn't change plan — try again or use Manage billing" }, { status: 500 }); }
}
