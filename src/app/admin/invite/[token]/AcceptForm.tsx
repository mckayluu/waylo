"use client";
import { useState } from "react";
export function AcceptForm({ token }: { token: string }) {
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault(); if (pw !== pw2) return setErr("Passwords don't match"); setBusy(true); setErr("");
    const r = await fetch(`/api/invites/${token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { location.href = "/admin"; return; } setErr((await r.json()).error); setBusy(false);
  }
  return <form onSubmit={go} className="space-y-4">
    <div><label className="w-label">New password (8+ characters)</label><input className="w-input" type="password" autoComplete="new-password" minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} required /><p className="mt-1 text-xs text-warm-500">Use at least 8 characters.</p></div>
    <div><label className="w-label">Confirm</label><input className="w-input" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} required /></div>
    {err && <p className="text-sm text-rose-600">{err}</p>}
    <button disabled={busy} className="w-btn w-full">{busy ? "Joining…" : "Join workspace"}</button>
  </form>;
}
