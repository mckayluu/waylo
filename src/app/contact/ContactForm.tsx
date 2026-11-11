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
    setErr(j.error || "Couldn't send — please try again."); setBusy(false);
  }
  if (done) return <div className="w-card-lg p-6 sm:p-8"><p className="text-lg font-semibold text-stone-900">Thanks — McKay will get back to you.</p><p className="mt-2 text-sm text-stone-600">Your note is in the Waylo inbox. If you’d rather start exploring now, you can also <Link href="/signup" className="font-medium text-teal-700 hover:underline">start a free trial</Link> (no card) or <Link href="/demo" className="font-medium text-teal-700 hover:underline">try the live demo</Link>.</p></div>;
  return <form onSubmit={go} className="w-card-lg space-y-4 p-6 sm:p-8" noValidate>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className="w-label" htmlFor="c-name">Name</label><input id="c-name" className="w-input" value={f.name} onChange={set("name")} autoComplete="name" required /></div>
      <div><label className="w-label" htmlFor="c-email">Work email</label><input id="c-email" className="w-input" type="email" value={f.email} onChange={set("email")} autoComplete="email" required /></div>
    </div>
    <div><label className="w-label" htmlFor="c-company">Company (optional)</label><input id="c-company" className="w-input" value={f.company} onChange={set("company")} autoComplete="organization" /></div>
    <div className="hidden" aria-hidden><label htmlFor="c-site">Company site</label><input id="c-site" tabIndex={-1} autoComplete="off" value={f.companySite} onChange={set("companySite")} /></div>
    <div><label className="w-label" htmlFor="c-intent">How can we help?</label>
      <select id="c-intent" className="w-input" value={f.intent} onChange={set("intent")}>
        <option value="message">A question about Waylo</option>
        <option value="demo">Help setting up my site</option>
      </select>
    </div>
    <div><label className="w-label" htmlFor="c-message">Message</label><textarea id="c-message" className="w-input min-h-[8rem]" value={f.message} onChange={set("message")} required /></div>
    <label className="flex items-start gap-2 text-sm text-stone-600"><input type="checkbox" className="mt-1" checked={f.consent} onChange={set("consent")} required />I agree to be contacted about this message. We’ll only use your details to reply.</label>
    {err && <p role="alert" className="text-sm text-rose-600">{err}</p>}
    <button disabled={busy} className="w-btn" aria-busy={busy}>{busy ? "Sending…" : "Send message"}</button>
    <p className="text-xs text-stone-500">Prefer to jump in yourself? <Link href="/signup" className="text-teal-700 hover:underline">Start a free trial</Link> — no card required.</p>
  </form>;
}
