import { getBilling, stripeConfigured } from "@/lib/stripe";
import { PageHeader, Card } from "../ui";
import { BillingActions } from "./BillingActions";
export const dynamic = "force-dynamic";
const NAMES = { trial: "Trial", starter: "Starter", growth: "Growth" } as const;
export default async function BillingPage({ searchParams }: { searchParams: { checkout?: string } }) {
  const b = await getBilling(); const configured = stripeConfigured();
  const live = b.status === "active" || b.status === "trialing";
  return (<>
    <PageHeader title="Billing" sub="Your Waylo plan, payment method and invoices." />
    {searchParams.checkout === "success" && <div className="mb-4 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">Thanks! Checkout complete — your plan updates here as soon as Stripe confirms (usually a few seconds; refresh if needed).</div>}
    {searchParams.checkout === "canceled" && <div className="mb-4 rounded-lg bg-stone-100 p-3 text-sm text-stone-700">Checkout canceled — no charge was made.</div>}
    {!configured && <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Stripe isn’t configured on this server (STRIPE_SECRET_KEY missing). Billing is disabled and publishing is not gated.</div>}
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Current plan">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-stone-500">Plan</dt><dd className="font-medium">{b.tier ? NAMES[b.tier] : "No plan"}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-500">Status</dt><dd className={`font-medium ${live ? "text-teal-700" : b.status === "past_due" ? "text-red-700" : "text-stone-700"}`}>{b.status}{b.cancelAtPeriodEnd ? " (cancels at period end)" : ""}</dd></div>
          {b.currentPeriodEnd && <div className="flex justify-between"><dt className="text-stone-500">{b.cancelAtPeriodEnd ? "Ends" : "Renews"}</dt><dd>{new Date(b.currentPeriodEnd).toLocaleDateString()}</dd></div>}
          {b.email && <div className="flex justify-between"><dt className="text-stone-500">Billing email</dt><dd>{b.email}</dd></div>}
        </dl>
        {!live && configured && <p className="mt-4 text-xs text-stone-500">Publishing the sidebar on your site requires an active plan or trial.</p>}
      </Card>
      <Card title={live ? "Manage" : "Choose a plan"}><BillingActions hasCustomer={!!b.stripeCustomerId} live={live} configured={configured} /></Card>
    </div>
  </>);
}
