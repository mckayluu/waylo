import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, syncSubscription } from "@/lib/stripe";
import { setBilling, getBilling, runIn, findWorkspaceByStripe, getWorkspace } from "@/lib/store";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Stripe webhook: raw body + signature verification. Fulfillment happens here, not on the success page.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET; const sig = req.headers.get("stripe-signature");
  if (!secret || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const raw = await req.text();
  let event: Stripe.Event;
  try { event = stripe().webhooks.constructEvent(raw, sig, secret); }
  catch (e: any) { console.warn("[stripe] bad signature", e?.message); return NextResponse.json({ error: "Invalid signature" }, { status: 400 }); }
  const o: any = event.data.object;
  const ws = await workspaceFor(o);
  if (!ws) { console.warn("[stripe] no workspace for", event.type, o.id); return NextResponse.json({ received: true, ignored: true }); }
  return runIn(ws, () => handle(event, o));
}
const id = (x: any) => (typeof x === "string" ? x : x?.id) as string | undefined;
// Which workspace an event belongs to: our metadata/client_reference_id first, then the linked customer/subscription.
async function workspaceFor(o: any): Promise<string | undefined> {
  const subId = o.object === "subscription" ? o.id : id(o.subscription) || id(o.parent?.subscription_details?.subscription);
  let meta = o.metadata?.workspace || o.parent?.subscription_details?.metadata?.workspace || (o.object === "checkout.session" ? o.client_reference_id : undefined);
  if (!meta && subId && o.object !== "subscription") { try { meta = (await stripe().subscriptions.retrieve(subId)).metadata?.workspace; } catch {} }
  if (meta && (await getWorkspace(meta))) return meta;
  // Pre-workspace subs (no metadata) are found via the billing record that links them (backfilled into "default").
  // No blind fallback: an unlinked event must not overwrite some workspace's billing.
  return findWorkspaceByStripe(id(o.customer), subId);
}
async function handle(event: Stripe.Event, o: any) {
  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        if (o.mode === "subscription" && o.subscription && (o.payment_status === "paid" || o.payment_status === "no_payment_required" || event.type.endsWith("succeeded"))) {
          await syncSubscription(typeof o.subscription === "string" ? o.subscription : o.subscription.id);
          await setBilling({ email: o.customer_details?.email || o.customer_email || undefined });
        }
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const cur = await getBilling();
        // Per workspace: follow the newest subscription, ignore stale ones for other subs once linked.
        const curLive = cur.status === "active" || cur.status === "trialing";
        const incomingLive = o.status === "active" || o.status === "trialing";
        // Follow the linked sub; switch to a different sub only if it's live or ours isn't (stale/duplicate subs can't clobber a live plan).
        if (!cur.stripeSubscriptionId || cur.stripeSubscriptionId === o.id || incomingLive || !curLive) await syncSubscription(o as Stripe.Subscription);
        break; }
      case "invoice.paid":
      case "invoice.payment_failed": {
        const subId = o.parent?.subscription_details?.subscription || o.subscription;
        if (subId) await syncSubscription(typeof subId === "string" ? subId : subId.id);
        if (event.type === "invoice.payment_failed") await setBilling({ lastPaymentError: new Date().toISOString() });
        break; }
      case "charge.dispute.created":
      case "charge.refunded":
      case "radar.early_fraud_warning.created":
        console.warn(`[stripe] ${event.type}`, o.id); await setBilling({ lastRiskEvent: `${event.type} ${o.id}` });
        break;
    }
  } catch (e: any) { console.error("[stripe] handler", event.type, e?.message); return NextResponse.json({ error: "Handler failed" }, { status: 500 }); }
  return NextResponse.json({ received: true });
}
