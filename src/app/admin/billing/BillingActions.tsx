"use client";
import { useState } from "react";
import { api } from "@/lib/api-client";
const PLANS = [{ tier: "trial", label: "Trial — $0 / 14 days" }, { tier: "starter", label: "Starter — $79/mo" }, { tier: "growth", label: "Growth — $249/mo" }];
export function BillingActions({ hasCustomer, live, configured, plan }: { hasCustomer: boolean; live: boolean; configured: boolean; plan?: string }) {
  const [busy, setBusy] = useState(""); const [err, setErr] = useState("");
  async function go(path: string, json?: object, key = path) {
    setBusy(key); setErr("");
    const r = await api<{ url: string }>(path, { method: "POST", json: json || {} });
    if (r.ok && r.data.url) { window.location.href = r.data.url; return; }
    setBusy(""); setErr(r.ok ? "No redirect URL" : r.error);
  }
  return <div className="space-y-3">
    {hasCustomer && <button disabled={!configured || !!busy} onClick={() => go("/api/billing/portal")} className="w-btn-accent w-full py-2.5">{busy === "/api/billing/portal" ? "Opening…" : "Manage billing"}</button>}
    {(!live || !hasCustomer) && PLANS.map((p) => <button key={p.tier} disabled={!configured || !!busy} onClick={() => go("/api/billing/checkout", { tier: p.tier }, p.tier)} className={`${p.tier === plan ? "w-btn-accent" : "w-btn-ghost"} w-full py-2.5`}>{busy === p.tier ? "Redirecting…" : `Subscribe: ${p.label}`}{p.tier === plan ? " (selected)" : ""}</button>)}
    {live && <p className="text-xs text-stone-500">Change plan, update card, download invoices or cancel in the Stripe billing portal.</p>}
    {err && <p className="text-sm text-red-700">✗ {err}</p>}
  </div>;
}
