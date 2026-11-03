"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import type { CrawlRun } from "@/lib/store";
export function CrawlPanel({ siteUrl, last }: { siteUrl: string; last?: CrawlRun }) {
  const [url, setUrl] = useState(siteUrl); const [max, setMax] = useState(50); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(""); const r = useRouter();
  async function go(e: React.FormEvent) {
    e.preventDefault();
    const u = url.trim();
    if (!u) { setMsg("Add a website URL first (or set it under Settings → General)."); return; }
    setBusy(true); setMsg("Starting crawl…");
    const res = await api("/api/crawl", { method: "POST", json: { url: u, max } });
    if (!res.ok) { setBusy(false); setMsg(`Crawl failed — ${res.error}`); return; }
    let j = res.data;
    for (let i = 0; j?.status === "running" && i < 300; i++) {
      setMsg(`Crawling… ${j.pages || 0} page${j.pages === 1 ? "" : "s"} indexed so far. You can leave this page.`);
      await new Promise((ok) => setTimeout(ok, 2000));
      const p = await api("/api/crawl"); if (p.ok && p.data) j = p.data;
    }
    setBusy(false);
    setMsg(j?.status === "error" ? `Crawl failed — ${j.message || "unknown error"}` : j?.status === "running" ? "Still crawling in the background — check back shortly." : `Indexed ${j.pages} page${j.pages === 1 ? "" : "s"}${j.errors ? ` · ${j.errors} errors` : ""}${j.message ? ` — ${j.message}` : ""}`);
    r.refresh();
  }
  return <form onSubmit={go} className="space-y-3">
    <div className="flex flex-wrap gap-2">
      <input className="w-input min-w-[16rem] flex-1" placeholder="https://yoursite.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
      <select className="w-input w-auto" value={max} onChange={(e) => setMax(+e.target.value)}>{[10, 25, 50, 100].map((n) => <option key={n} value={n}>Up to {n} pages</option>)}</select>
      <button disabled={busy} className="w-btn">{busy ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />Crawling…</> : last ? "Re-crawl site" : "Crawl site"}</button>
    </div>
    <p className="text-xs text-stone-500">{msg || (last ? `Last crawl ${new Date(last.startedAt).toLocaleString()} · ${last.status} · ${last.pages} pages${last.errors ? ` · ${last.errors} errors` : ""}${last.message ? ` — ${last.message}` : ""}` : "Follows same-site links, respects robots.txt, skips files and images. Re-crawling replaces the index.")}</p>
  </form>;
}
