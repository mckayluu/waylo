"use client";
import { useState } from "react";
import Link from "next/link";
export function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", company: "", message: "", intent: "message", consent: false, companySite: "" });
  const [err, setErr] = useState(""); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value } as typeof f);
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { setDone(true); return; }
    setErr(j.error || "Couldn’t send. Please try again."); setBusy(false);
  }
  if (done) return <div className="w-card-lg p-6 sm:p-8"><p className="text-lg font-semibold text-stone-900">Thanks. We’ll reply by email.</p><p className="mt-2 text-sm text-stone-600">Your report is logged. Meanwhile, <Link href="/docs/install#troubleshooting" className="font-medium text-teal-700 hover:underline">troubleshooting</Link> and the <Link href="/faq" className="font-medium text-teal-700 hover:underline">FAQ</Link> cover the common fixes.</p></div>;
  return <form onSubmit={go} className="w-card-lg space-y-4 p-6 sm:p-8" noValidate>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className="w-label" htmlFor="c-name">Name</label><input id="c-name" className="w-input" value={f.name} onChange={set("name")} autoComplete="name" required /></div>
      <div><label className="w-label" htmlFor="c-email">Work email</label><input id="c-email" className="w-input" type="email" value={f.email} onChange={set("email")} autoComplete="email" required /></div>
    </div>
    <div><label className="w-label" htmlFor="c-company">Workspace or site URL (optional)</label><input id="c-company" className="w-input" value={f.company} onChange={set("company")} autoComplete="organization" /></div>
    <div className="hidden" aria-hidden><label htmlFor="c-site">Company site</label><input id="c-site" tabIndex={-1} autoComplete="off" value={f.companySite} onChange={set("companySite")} /></div>
    <div><label className="w-label" htmlFor="c-intent">What’s it about?</label>
      <select id="c-intent" className="w-input" value={f.intent} onChange={set("intent")}>
        <option value="message">Something isn’t working</option>
        <option value="demo">Install or setup problem</option>
      </select>
    </div>
    <div><label className="w-label" htmlFor="c-message">Message</label><textarea id="c-message" className="w-input min-h-[8rem]" value={f.message} onChange={set("message")} required /></div>
    <label className="flex items-start gap-2 text-sm text-stone-600"><input type="checkbox" className="mt-1" checked={f.consent} onChange={set("consent")} required />I agree to be contacted about this support request. We’ll only use your details to reply.</label>
    {err && <p role="alert" className="text-sm text-rose-600">{err}</p>}
    <button disabled={busy} className="w-btn" aria-busy={busy}>{busy ? "Sending…" : "Send support request"}</button>
    <p className="text-xs text-stone-500">Not set up yet? <Link href="/how-it-works" className="text-teal-700 hover:underline">The product tour</Link> walks through every step.</p>
  </form>;
}
