"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import type { CrawlRun } from "@/lib/store";
export function CrawlPanel({ siteUrl, last }: { siteUrl: string; last?: CrawlRun }) {
  const [url, setUrl] = useState(siteUrl); const [max, setMax] = useState(50); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(""); const [fail, setFail] = useState(last?.failures || []); const r = useRouter();
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
    const errBit = (n: number) => n ? ` · ${n} error${n === 1 ? "" : "s"}` : "";
    setMsg(j?.status === "error" ? `Crawl failed — ${j.message || "unknown error"}` : j?.status === "running" ? "Still crawling in the background — check back shortly." : `Indexed ${j.pages} page${j.pages === 1 ? "" : "s"}${errBit(j.errors || 0)}${j.message ? ` — ${j.message}` : ""}`);
    setFail(j?.failures || []);
    r.refresh();
  }
  const run = last;
  const failures = fail.length ? fail : (run?.failures || []);
  const errBit = (n: number) => n ? ` · ${n} error${n === 1 ? "" : "s"}` : "";
  return <form onSubmit={go} className="space-y-3">
    <div className="flex flex-wrap gap-2">
      <input className="w-input min-w-[16rem] flex-1" placeholder="https://yoursite.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
      <select className="w-input w-auto" value={max} onChange={(e) => setMax(+e.target.value)}>{[10, 25, 50, 100].map((n) => <option key={n} value={n}>Up to {n} pages</option>)}</select>
      <button disabled={busy} className="w-btn">{busy ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />Crawling…</> : last ? "Re-crawl site" : "Crawl site"}</button>
    </div>
    <p className="text-xs text-stone-500">{msg || (run ? `Last crawl ${new Date(run.startedAt).toLocaleString()} · ${run.status} · ${run.pages} page${run.pages === 1 ? "" : "s"}${errBit(run.errors || 0)}${run.message ? ` — ${run.message}` : ""}` : "Follows same-site links, respects robots.txt, skips files and images. Re-crawling replaces the index.")}</p>
    {failures.length > 0 && <ul className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">{failures.map((f) => <li key={f.url + f.reason} className="truncate"><span className="font-mono">{f.url}</span> — {f.reason}</li>)}</ul>}
  </form>;
}
