"use client";
import { useState } from "react";
export function LoginForm({ next, askEmail }: { next: string; askEmail: boolean }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: pw }) });
    if (r.ok) { location.href = next.startsWith("/admin") ? next : "/admin"; return; }
    setErr((await r.json()).error || "Sign in failed"); setBusy(false);
  }
  return <form onSubmit={go} className="space-y-4" noValidate>
    <div>
      <label className="w-label" htmlFor="waylo-login-email">Email{!askEmail && " (members only)"}</label>
      <input id="waylo-login-email" name="email" className="w-input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required={askEmail} aria-required={askEmail} />
    </div>
    <div>
      <label className="w-label" htmlFor="waylo-login-password">Password</label>
      <input id="waylo-login-password" name="password" className="w-input" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required autoFocus aria-required="true" />
    </div>
    {err && <p id="waylo-login-error" role="alert" className="text-sm text-rose-600">{err}</p>}
    <button disabled={busy} className="w-btn w-full" aria-busy={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    <p className="text-center text-sm"><a href="/admin/forgot" className="text-teal-700 hover:underline">Forgot password?</a><span className="mx-2 text-stone-300">·</span><a href="/admin/signup" className="text-teal-700 hover:underline">Create a workspace</a></p>
  </form>;
}
