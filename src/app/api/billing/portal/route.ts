import { NextResponse } from "next/server";
import { stripe, stripeConfigured, publicUrl, getBilling } from "@/lib/stripe";
export const dynamic = "force-dynamic";
// Customer Portal for the Stripe customer linked to this install (Editor+ via middleware).
export async function POST() {
  if (!stripeConfigured()) return NextResponse.json({ error: "Stripe isn't configured" }, { status: 503 });
  const b = await getBilling();
  if (!b.stripeCustomerId) return NextResponse.json({ error: "No subscription yet — choose a plan first" }, { status: 400 });
  try {
    const s = await stripe().billingPortal.sessions.create({ customer: b.stripeCustomerId, return_url: `${publicUrl()}/admin/billing` });
    return NextResponse.json({ url: s.url });
  } catch (e: any) { console.error("[billing] portal", e?.message); return NextResponse.json({ error: "Couldn't open billing portal" }, { status: 500 }); }
}
