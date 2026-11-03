// Server-only Stripe client + billing helpers. Keys come from env; never import in client components.
import Stripe from "stripe";
import { getBilling, setBilling, type Billing, type BillingStatus, type Tier } from "@/lib/store";

const g = globalThis as unknown as { __wayloStripe?: Stripe };
export const stripeConfigured = () => !!process.env.STRIPE_SECRET_KEY;
export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  if (!g.__wayloStripe) g.__wayloStripe = new Stripe(process.env.STRIPE_SECRET_KEY, { appInfo: { name: "Waylo" } });
  return g.__wayloStripe;
}

export const TIERS: Tier[] = ["trial", "starter", "growth"];
const LOOKUP: Record<Tier, string> = { trial: "waylo_trial_monthly", starter: "waylo_starter_monthly", growth: "waylo_growth_monthly" };
const ENV: Record<Tier, string | undefined> = { trial: process.env.STRIPE_PRICE_TRIAL, starter: process.env.STRIPE_PRICE_STARTER, growth: process.env.STRIPE_PRICE_GROWTH };

/** Price ID for a tier: env override first, then Stripe lookup_key. */
export async function priceForTier(t: Tier): Promise<string> {
  if (ENV[t]) return ENV[t]!;
  const r = await stripe().prices.list({ lookup_keys: [LOOKUP[t]], active: true, limit: 1 });
  if (!r.data[0]) throw new Error(`No active Stripe price for ${t}`);
  return r.data[0].id;
}
export async function tierForPrice(priceId?: string | null, lookupKey?: string | null): Promise<Tier | undefined> {
  if (lookupKey) { const t = TIERS.find((k) => LOOKUP[k] === lookupKey); if (t) return t; }
  if (!priceId) return undefined;
  const e = TIERS.find((k) => ENV[k] === priceId); if (e) return e;
  return undefined;
}

export const publicUrl = () => (process.env.WAYLO_PUBLIC_URL || (process.env.NODE_ENV === "production" ? "https://waylo-j5hv.onrender.com" : "http://localhost:3000")).replace(/\/$/, "");

const mapStatus = (s: string): BillingStatus =>
  s === "trialing" ? "trialing" : s === "active" ? "active" : s === "past_due" || s === "unpaid" || s === "incomplete" ? "past_due" : s === "canceled" || s === "incomplete_expired" ? "canceled" : "none";

/** Sync local billing state from a Stripe subscription (source of truth). */
export async function syncSubscription(subOrId: string | Stripe.Subscription): Promise<Billing> {
  const sub = typeof subOrId === "string" ? await stripe().subscriptions.retrieve(subOrId) : subOrId;
  const item: any = sub.items?.data?.[0];
  const price = item?.price;
  let end: number | undefined = item?.current_period_end ?? (sub as any).current_period_end;
  if (sub.status === "trialing" && sub.trial_end) end = sub.trial_end;
  const cancelAt = (sub as any).cancel_at as number | null | undefined;
  if (cancelAt && (!end || cancelAt <= end)) end = cancelAt;
  const tier = (sub.metadata?.tier as Tier) || (await tierForPrice(price?.id, price?.lookup_key));
  return setBilling({
    stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    stripeSubscriptionId: sub.id, stripePriceId: price?.id, tier: tier || undefined,
    status: mapStatus(sub.status), cancelAtPeriodEnd: !!sub.cancel_at_period_end || !!cancelAt,
    currentPeriodEnd: end ? new Date(end * 1000).toISOString() : undefined, updatedAt: new Date().toISOString(),
  });
}

/** Publishing / paid features allowed? Open when Stripe isn't configured (self-host / dev). */
export async function billingAllowsPublish(): Promise<boolean> {
  if (!stripeConfigured()) return true;
  const b = await getBilling(); return b.status === "active" || b.status === "trialing";
}
export { getBilling };
