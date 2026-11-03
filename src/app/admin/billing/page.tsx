import { getBilling, stripeConfigured } from "@/lib/stripe";
import { PageHeader, Card, Badge } from "../ui";
import { BillingActions } from "./BillingActions";
export const dynamic = "force-dynamic";
const NAMES = { trial: "Trial", starter: "Starter", growth: "Growth" } as const;
export default async function BillingPage({ searchParams }: { searchParams: { checkout?: string } }) {
  const b = await getBilling(); const configured = stripeConfigured();
  const live = b.status === "active" || b.status === "trialing";
  return (<>
    <PageHeader title="Billing" sub="Your Waylo plan, payment method and invoices." />
    <div className="-mt-3 mb-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-teal-600 via-indigo-600 to-amber-500" />
    {searchParams.checkout === "success" && <div className="mb-4 rounded-xl bg-teal-50 px-3.5 py-2.5 text-sm text-teal-800 ring-1 ring-teal-200">Thanks! Checkout complete — your plan updates here as soon as Stripe confirms (usually a few seconds; refresh if needed).</div>}
    {searchParams.checkout === "canceled" && <div className="mb-4 rounded-xl bg-stone-50 px-3.5 py-2.5 text-sm text-stone-700 ring-1 ring-stone-200">Checkout canceled — no charge was made.</div>}
    {!configured && <div className="mb-4 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">Stripe isn’t configured on this server (STRIPE_SECRET_KEY missing). Billing is disabled and publishing is not gated.</div>}
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Current plan">
        <dl className="divide-y divide-stone-100 text-sm">
          <div className="flex items-center justify-between py-2 first:pt-0 last:pb-0"><dt className="text-stone-500">Plan</dt><dd className="font-medium">{b.tier ? NAMES[b.tier] : "No plan"}</dd></div>
          <div className="flex items-center justify-between py-2 first:pt-0 last:pb-0"><dt className="text-stone-500">Status</dt><dd className="flex items-center gap-1.5"><Badge tone={live ? "teal" : b.status === "past_due" ? "rose" : b.status === "canceled" ? "amber" : "stone"}>{b.status}</Badge>{b.cancelAtPeriodEnd && <span className="text-xs text-amber-700">cancels at period end</span>}</dd></div>
          {b.currentPeriodEnd && <div className="flex items-center justify-between py-2 first:pt-0 last:pb-0"><dt className="text-stone-500">{b.status === "trialing" || b.cancelAtPeriodEnd ? "Ends" : "Renews"}</dt><dd>{new Date(b.currentPeriodEnd).toLocaleDateString()}</dd></div>}
          {b.email && <div className="flex items-center justify-between py-2 first:pt-0 last:pb-0"><dt className="text-stone-500">Billing email</dt><dd>{b.email}</dd></div>}
        </dl>
        {!live && configured && <p className="mt-3 rounded-lg bg-amber-50/60 px-2.5 py-1.5 text-xs text-amber-800">Publishing the sidebar on your site requires an active plan or trial.</p>}
      </Card>
      <Card title={live ? "Manage" : "Choose a plan"}><BillingActions hasCustomer={!!b.stripeCustomerId} live={live} configured={configured} /></Card>
    </div>
  </>);
}
