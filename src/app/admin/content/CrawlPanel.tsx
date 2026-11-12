"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import type { CrawlRun } from "@/lib/store";
type Props = { siteUrl: string; last?: CrawlRun; sites: string[]; planSites: number; planPages: number; planName: string; indexed: number };
export function CrawlPanel({ siteUrl, last, sites, planSites, planPages, planName, indexed }: Props) {
  const [url, setUrl] = useState(siteUrl); const [busy, setBusy] = useState(last?.status === "running"); const [msg, setMsg] = useState(""); const [fail, setFail] = useState(last?.failures || []);
  const [upgrade, setUpgrade] = useState(false); const r = useRouter(); const polling = useRef(false);
  const errBit = (n: number) => n ? ` · ${n} error${n === 1 ? "" : "s"}` : "";
  // Poll progress and refresh the page table as pages land, so results show without a manual reload.
  async function poll(first?: any) {
    if (polling.current) return; polling.current = true; setBusy(true);
    let j = first; let seen = -1;
    for (let i = 0; i < 600; i++) {
      if (j && j.status !== "running") break;
      setMsg(`Crawling… ${j?.pages || 0} page${j?.pages === 1 ? "" : "s"} indexed so far. You can leave this page.`);
      await new Promise((ok) => setTimeout(ok, 2000));
      const p = await api("/api/crawl"); if (p.ok && p.data) j = p.data;
      if (j?.pages !== seen) { seen = j?.pages; r.refresh(); }
    }
    polling.current = false; setBusy(false);
    setMsg(j?.status === "error" ? `Crawl failed — ${j.message || "unknown error"}` : j?.status === "running" ? "Still crawling in the background — check back shortly." : `Indexed ${j?.pages} page${j?.pages === 1 ? "" : "s"}${errBit(j?.errors || 0)}${j?.message ? ` — ${j.message}` : ""}`);
    setFail(j?.failures || []); r.refresh();
  }
  useEffect(() => { if (last?.status === "running") poll(last); }, []); // resume after navigation
  async function go(e: React.FormEvent) {
    e.preventDefault(); const u = url.trim(); setUpgrade(false);
    if (!u) { setMsg("Add a website URL first (or set it under Settings → General)."); return; }
    setBusy(true); setMsg("Starting crawl… reading robots.txt and sitemap.xml");
    const res = await api("/api/crawl", { method: "POST", json: { url: u } });
    if (!res.ok) { setBusy(false); setMsg(`Crawl failed — ${res.error}`); setUpgrade(!!(res.data as any)?.upgrade); return; }
    poll(res.data);
  }
  async function remove(site: string) { if (!confirm(`Remove ${site} and its indexed pages?`)) return; const res = await api(`/api/crawl?site=${encodeURIComponent(site)}`, { method: "DELETE" }); setMsg(res.ok ? `Removed ${site}.` : res.error); r.refresh(); }
  const run = last; const failures = fail.length ? fail : (run?.failures || []);
  return <form onSubmit={go} className="space-y-3">
    <div className="flex flex-wrap gap-2">
      <input className="w-input min-w-[16rem] flex-1" placeholder="https://yoursite.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
      <button disabled={busy} className="w-btn">{busy ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />Crawling…</> : last ? "Re-crawl site" : "Crawl site"}</button>
    </div>
    <p className="text-xs text-warm-500">{msg || (run ? `Last crawl ${new Date(run.startedAt).toLocaleString()} · ${run.status} · ${run.pages} page${run.pages === 1 ? "" : "s"}${errBit(run.errors || 0)}${run.message ? ` — ${run.message}` : ""}` : "Reads your sitemap.xml first, then follows links. Respects robots.txt. Indexes web pages, PDFs and Word (.docx) files.")}</p>
    {upgrade && <a href="/admin/billing" className="inline-block rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">Upgrade plan →</a>}
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-warm-100 pt-2 text-xs text-warm-500">
      <span>{planName}: <strong className="text-warm-700">{indexed.toLocaleString()}</strong> / {planPages.toLocaleString()} pages · {sites.length} / {planSites} site{planSites > 1 ? "s" : ""}</span>
      <span>Re-crawls automatically on a schedule, so answers stay current.</span>
    </div>
    {sites.length > 1 && <ul className="flex flex-wrap gap-2 text-xs">{sites.map((s, i) => <li key={s} className="flex items-center gap-1.5 rounded-md bg-warm-100 px-2 py-1"><button type="button" className="font-mono text-warm-700 hover:text-navy-700" onClick={() => setUrl(s)}>{s}</button>{i > 0 && <button type="button" onClick={() => remove(s)} className="text-warm-400 hover:text-rose-600" aria-label={`Remove ${s}`}>×</button>}</li>)}</ul>}
    {failures.length > 0 && <ul className="max-h-40 overflow-y-auto rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">{failures.map((f) => <li key={f.url + f.reason} className="truncate"><span className="font-mono">{f.url}</span> — {f.reason}</li>)}</ul>}
  </form>;
}
