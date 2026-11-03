"use client";
import { useState } from "react";
import type { Branding } from "@/lib/store";
const SWATCH = ["#0f766e", "#0e7490", "#1d4ed8", "#4d7c0f", "#b45309", "#1c1917"];
export function BrandingForm({ initial }: { initial: Branding }) {
  const [b, setB] = useState(initial); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); const r = await fetch("/api/branding", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
    setB(await r.json()); setBusy(false); setMsg("Saved"); setTimeout(() => setMsg(""), 1500);
  }
  return (<form onSubmit={save} className="grid gap-6 md:grid-cols-2">
    <div className="space-y-4">
      <div><label className="w-label">Assistant name</label><input className="w-input" value={b.botName} onChange={(e) => setB({ ...b, botName: e.target.value })} /></div>
      <div><label className="w-label">Accent color</label>
        <div className="flex items-center gap-2">{SWATCH.map((c) => <button type="button" key={c} onClick={() => setB({ ...b, accent: c })} className={`h-7 w-7 rounded-full ring-offset-2 ${b.accent.toLowerCase() === c ? "ring-2 ring-stone-400" : ""}`} style={{ background: c }} aria-label={c} />)}
          <input type="color" value={b.accent} onChange={(e) => setB({ ...b, accent: e.target.value })} className="h-7 w-9 cursor-pointer rounded border border-stone-300" /></div>
        <input className="w-input mt-2 font-mono" value={b.accent} onChange={(e) => setB({ ...b, accent: e.target.value })} /></div>
      <div><label className="w-label">Greeting</label><textarea rows={3} className="w-input" value={b.greeting} onChange={(e) => setB({ ...b, greeting: e.target.value })} /></div>
      <div className="flex items-center gap-3"><button disabled={busy} className="w-btn">{busy ? "Saving…" : "Save changes"}</button>{msg && <span className="text-sm text-teal-700">✓ {msg}</span>}</div>
    </div>
    <div><p className="w-label">Preview</p>
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-4 py-3"><span className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white" style={{ background: b.accent }}>{(b.botName || "W")[0]}</span><span className="text-sm font-semibold">{b.botName || "Waylo"}</span></div>
        <div className="space-y-3 p-4 text-sm"><p className="border-l-2 pl-3 text-stone-700" style={{ borderColor: b.accent }}>{b.greeting}</p>
          <div className="flex justify-end"><span className="rounded-2xl rounded-br-sm px-3 py-1.5 text-white" style={{ background: b.accent }}>How do I install it?</span></div></div>
      </div></div>
  </form>);
}
