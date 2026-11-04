import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stripe, stripeConfigured, priceForTier, publicUrl, TIERS, getBilling, syncSubscription } from "@/lib/stripe";
import { COOKIE, verify } from "@/lib/session";
import { rateLimit } from "@/lib/guard";
import type { Tier } from "@/lib/store";
export const dynamic = "force-dynamic";

// POST { tier: "trial"|"starter"|"growth", email? } or form post (from pricing page) → Stripe Checkout.
export async function POST(req: Request) {
  const limited = rateLimit(req, "leads"); if (limited) return limited;
  const isForm = (req.headers.get("content-type") || "").includes("form");
  const b: any = isForm ? Object.fromEntries((await req.formData()).entries()) : await req.json().catch(() => ({}));
  const fail = (error: string, status = 400) => isForm ? NextResponse.redirect(`${publicUrl()}/pricing?billing=${encodeURIComponent(error)}`, 303) : NextResponse.json({ error }, { status });
  if (!stripeConfigured()) return fail("Online checkout isn't configured yet", 503);
  const tier = String(b.tier || "").toLowerCase() as Tier;
  if (!TIERS.includes(tier)) return fail("Unknown plan");
  try {
    const price = await priceForTier(tier);
    const s = await verify(cookies().get(COOKIE)?.value);
    let billing = await getBilling();
    if (billing.stripeSubscriptionId && (billing.status === "active" || billing.status === "trialing")) {
      try { billing = await syncSubscription(billing.stripeSubscriptionId); } catch (e: any) { console.error("[billing] checkout sync", e?.message); }
    }
    // One billing record per install: never open a second subscription Checkout while a plan is live.
    if (billing.stripeSubscriptionId && (billing.status === "active" || billing.status === "trialing")) {
      const msg = "You already have an active plan — manage it in Billing";
      if (isForm) return NextResponse.redirect(s ? `${publicUrl()}/admin/billing?billing=${encodeURIComponent(msg)}` : `${publicUrl()}/pricing?billing=${encodeURIComponent(msg)}`, 303);
      return NextResponse.json({ error: msg, manage: `${publicUrl()}/admin/billing` }, { status: 409 });
    }
    const signedIn = !!s;
    const email = typeof b.email === "string" && b.email.includes("@") ? b.email.trim() : s?.email;
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      ...(signedIn && billing.stripeCustomerId ? { customer: billing.stripeCustomerId } : email ? { customer_email: email } : {}),
      client_reference_id: s?.email ? s.email.slice(0, 200) : undefined,
      metadata: { tier, source: signedIn ? "admin" : "pricing", admin_email: s?.email || "" },
      ...(tier === "trial"
        ? {
            payment_method_collection: "if_required" as const,
            subscription_data: { metadata: { tier }, trial_period_days: 14, trial_settings: { end_behavior: { missing_payment_method: "cancel" as const } } },
          }
        : { subscription_data: { metadata: { tier } } }),
      allow_promotion_codes: true,
      success_url: `${publicUrl()}${signedIn ? "/admin/billing" : "/pricing"}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${publicUrl()}${signedIn ? "/admin/billing" : "/pricing"}?checkout=canceled`,
    });
    return isForm ? NextResponse.redirect(session.url!, 303) : NextResponse.json({ url: session.url });
  } catch (e: any) { console.error("[billing] checkout", e?.message); return fail("Couldn't start checkout", 500); }
}
