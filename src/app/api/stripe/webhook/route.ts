import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, syncSubscription } from "@/lib/stripe";
import { setBilling, getBilling } from "@/lib/store";
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
  try {
    const o: any = event.data.object;
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
        // Single-install app: follow the newest subscription, ignore stale ones for other subs once linked.
        if (!cur.stripeSubscriptionId || cur.stripeSubscriptionId === o.id || event.type !== "customer.subscription.deleted") await syncSubscription(o as Stripe.Subscription);
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
