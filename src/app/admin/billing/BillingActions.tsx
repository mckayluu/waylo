"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
type P = { tier: "starter" | "growth"; name: string; price: number; replies: string; sites: number; pages: string };
// mode: "checkout" (no plan, trial, or ended → Stripe Checkout) | "switch" (paid plan live → in-app prorated switch).
export function BillingActions({ hasCustomer, configured, plans, current, mode, canTrial, plan }: { hasCustomer: boolean; configured: boolean; plans: P[]; current?: string; mode: "checkout" | "switch"; canTrial: boolean; plan?: string }) {
  const [busy, setBusy] = useState(""); const [err, setErr] = useState(""); const [ok, setOk] = useState(""); const r = useRouter();
  async function go(path: string, json: object, key: string) {
    setBusy(key); setErr(""); setOk("");
    const res = await api<{ url?: string; ok?: boolean; tier?: string }>(path, { method: "POST", json });
    if (res.ok && res.data.url) { window.location.href = res.data.url; return; }
    setBusy("");
    if (!res.ok) return setErr(res.error);
    if (res.data.ok) { setOk(`Switched to ${res.data.tier ? res.data.tier[0].toUpperCase() + res.data.tier.slice(1) : "the new plan"}. Stripe prorates the difference on your next invoice.`); r.refresh(); }
  }
  return <div className="space-y-3">
    <div className="grid gap-3 sm:grid-cols-2">{plans.map((p) => {
      const isCur = current === p.tier; const pick = plan === p.tier;
      return <div key={p.tier} className={`rounded-xl border p-3.5 ${isCur ? "border-navy-400 bg-navy-50/40" : pick ? "border-rasp-300" : "border-warm-200"}`}>
        <div className="flex items-baseline justify-between"><p className="font-semibold text-warm-900">{p.name}</p><p className="text-sm"><span className="text-lg font-bold">${p.price}</span><span className="text-warm-500">/mo</span></p></div>
        <ul className="mt-2 space-y-0.5 text-xs text-warm-600"><li>{p.replies} AI replies / month</li><li>{p.sites} site{p.sites > 1 ? "s" : ""} · {p.pages} indexed pages</li><li>Unlimited seats · daily re-crawl</li></ul>
        {isCur ? <p className="mt-3 text-center text-xs font-medium text-navy-800">Current plan</p> :
          <button disabled={!configured || !!busy} onClick={() => mode === "switch" ? go("/api/billing/change", { tier: p.tier }, p.tier) : go("/api/billing/checkout", { tier: p.tier }, p.tier)} className={`${pick || mode === "checkout" ? "w-btn-accent" : "w-btn-ghost"} mt-3 w-full py-2`}>
            {busy === p.tier ? "Working…" : mode === "switch" ? `Switch to ${p.name}` : `Upgrade to ${p.name}`}</button>}
      </div>; })}</div>
    {canTrial && <button disabled={!configured || !!busy} onClick={() => go("/api/billing/checkout", { tier: "trial" }, "trial")} className="w-btn-ghost w-full py-2">{busy === "trial" ? "Working…" : "Start the 14-day free trial (no card)"}</button>}
    {hasCustomer && <button disabled={!configured || !!busy} onClick={() => go("/api/billing/portal", {}, "portal")} className="w-btn-ghost w-full py-2">{busy === "portal" ? "Opening…" : "Manage billing · card, invoices, cancel"}</button>}
    {mode === "checkout" && !canTrial && <p className="text-xs text-warm-500">Upgrading during your trial keeps the days you have left. You won&apos;t be charged until the trial would have ended.</p>}
    {ok && <p className="text-sm text-navy-800">✓ {ok}</p>}
    {err && <p className="text-sm text-red-700">✗ {err}</p>}
  </div>;
}
