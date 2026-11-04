"use client";
import { useState } from "react";
export function ForgotForm() {
  const [email, setEmail] = useState(""); const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(""); setMsg("");
    const r = await fetch("/api/auth/forgot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const j = await r.json().catch(() => ({})); if (r.ok) setMsg(j.message); else setErr(j.error || "Something went wrong"); setBusy(false);
  }
  return <form onSubmit={go} className="space-y-4">
    <div>
      <label className="w-label" htmlFor="waylo-forgot-email">Email</label>
      <input id="waylo-forgot-email" name="email" className="w-input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus aria-required="true" />
    </div>
    {msg && <p role="status" className="rounded-md bg-teal-50 p-3 text-sm text-teal-800">{msg}</p>}
    {err && <p role="alert" className="text-sm text-rose-600">{err}</p>}
    <button disabled={busy} className="w-btn w-full" aria-busy={busy}>{busy ? "Sending…" : "Send reset link"}</button>
    <p className="text-center text-sm"><a href="/admin/login" className="text-teal-700 hover:underline">Back to sign in</a></p>
  </form>;
}
