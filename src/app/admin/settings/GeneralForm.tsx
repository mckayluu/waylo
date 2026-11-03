"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/store";
export function GeneralForm({ initial }: { initial: SiteSettings }) {
  const [v, setV] = useState(initial); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const r = useRouter();
  async function save(e: React.FormEvent) { e.preventDefault(); setBusy(true);
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
    setV(await res.json()); setBusy(false); setMsg("Saved"); setTimeout(() => setMsg(""), 1500); r.refresh(); }
  return <form onSubmit={save} className="space-y-4">
    <div><label className="w-label">Site name</label><input className="w-input" value={v.siteName} onChange={(e) => setV({ ...v, siteName: e.target.value })} /></div>
    <div><label className="w-label">Website URL</label><input className="w-input" type="url" placeholder="https://yoursite.com" value={v.siteUrl} onChange={(e) => setV({ ...v, siteUrl: e.target.value })} />
      <p className="mt-1 text-xs text-stone-500">Where Content → Crawl starts. Waylo indexes same-site pages from here.</p></div>
    <div><label className="w-label">Company profile</label><textarea rows={5} className="w-input" placeholder="Who you are, what you sell, who it's for. Waylo treats this as authoritative." value={v.companyProfile} onChange={(e) => setV({ ...v, companyProfile: e.target.value })} />
      <p className="mt-1 text-xs text-stone-500">Added to every AI answer, like a fact.</p></div>
    <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-4 w-4 accent-teal-700" checked={v.published} onChange={(e) => setV({ ...v, published: e.target.checked })} /><span><span className="font-medium text-stone-800">Sidebar published</span><span className="block text-xs text-stone-500">When off, the widget shows a “Preview only” banner.</span></span></label>
    <div className="flex items-center gap-3"><button disabled={busy} className="w-btn">{busy ? "Saving…" : "Save changes"}</button>{msg && <span className="text-sm text-teal-700">✓ {msg}</span>}</div>
  </form>;
}
