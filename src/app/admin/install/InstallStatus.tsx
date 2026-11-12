"use client";
import { useState } from "react";
import type { InstallSeen } from "@/lib/store-types";
const ago = (iso?: string) => { if (!iso) return ""; const m = Math.round((Date.now() - +new Date(iso)) / 60000); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
/** Real install check: live ping from the customer's domain, plus an on-demand fetch of their page. */
export function InstallStatus({ initial, siteUrl }: { initial: InstallSeen; siteUrl?: string }) {
  const [s, setS] = useState(initial); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function check() {
    setBusy(true); setErr("");
    const r = await fetch("/api/install/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setErr(j.error || "Check failed"); else { const g = await fetch("/api/install/check").then((x) => x.json()).catch(() => ({})); setS({ ...g, check: j }); }
    setBusy(false);
  }
  const c = s.check;
  return <div className="space-y-2 text-sm">
    {s.host ? <p className="flex items-center gap-2 text-navy-800"><span className="grid h-5 w-5 place-items-center rounded-full bg-navy-700 text-[10px] text-white">✓</span>Installed: the snippet reported in from <strong>{s.host}</strong> {ago(s.lastSeen)}.</p>
      : <p className="text-warm-600">Not detected yet. Once the snippet loads on your site, the first visit marks it installed here automatically.</p>}
    {c && <p className={c.siteMatches ? "text-navy-800" : "text-amber-800"}>Page check of <span className="font-mono text-xs">{c.url}</span> ({ago(c.at)}): {c.detail}</p>}
    {err && <p className="text-rose-700">{err}</p>}
    <button onClick={check} disabled={busy || !siteUrl} className="w-btn-ghost" title={siteUrl ? undefined : "Set your website URL in Settings first"}>{busy ? "Checking…" : `Check ${siteUrl ? new URL(siteUrl).host : "my site"} now`}</button>
  </div>;
}
