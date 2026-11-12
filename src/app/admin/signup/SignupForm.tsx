"use client";
import { useState } from "react";
export function SignupForm({ plan, tried }: { plan?: string; tried?: { id: string; siteName: string; url: string; host: string; pages: number } }) {
  const [f, setF] = useState({ company: tried?.siteName || "", siteUrl: tried?.url || "", email: "", password: "" }); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, tryId: tried?.id }) });
    if (r.ok) { location.href = plan ? `/admin/billing?plan=${encodeURIComponent(plan)}` : tried ? "/admin?welcome=try" : "/admin/install"; return; }
    setErr((await r.json().catch(() => ({}))).error || "Couldn't create workspace"); setBusy(false);
  }
  const field = (k: keyof typeof f, label: string, type = "text", extra: Record<string, any> = {}) => <div><label className="w-label" htmlFor={`su-${k}`}>{label}</label><input id={`su-${k}`} className="w-input" type={type} value={f[k]} onChange={set(k)} {...extra} /></div>;
  return <form onSubmit={go} className="space-y-4" noValidate>
    {tried && <p className="rounded-lg bg-navy-50 p-3 text-sm text-navy-900">We'll bring the <strong>{tried.pages} pages</strong> we read from <strong>{tried.host}</strong> into your workspace, so your bot works the moment you sign in.</p>}
    {field("company", "Company name", "text", { required: true, autoFocus: true, autoComplete: "organization" })}
    {field("siteUrl", "Website (optional)", "url", { placeholder: "https://yourcompany.com", readOnly: !!tried })}
    {field("email", "Work email", "email", { required: true, autoComplete: "username" })}
    {field("password", "Password (8+ characters)", "password", { required: true, autoComplete: "new-password" })}
    {err && <p role="alert" className="text-sm text-rose-600">{err}</p>}
    <button disabled={busy} className="w-btn w-full" aria-busy={busy}>{busy ? "Creating workspace…" : "Create workspace"}</button>
    <p className="text-center text-sm text-warm-500">Already have an account? <a href="/admin/login" className="text-navy-700 hover:underline">Sign in</a></p>
  </form>;
}
