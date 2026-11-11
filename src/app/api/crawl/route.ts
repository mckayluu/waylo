import { NextResponse } from "next/server";
import { crawl } from "@/lib/crawler";
import { currentWs, runIn, getLastCrawl, getSettings, setLastCrawl, setSettings, upsertPages, clearPages, type CrawlRun } from "@/lib/store";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
const STALE_MS = 10 * 60_000;
// Crawls run in the background on the long-lived Node server (Render) so the request returns right away
// and never hits proxy timeouts. Clients poll GET /api/crawl for progress. Pass {wait:true} to block (scripts/tests).
export async function GET() {
  const last = await getLastCrawl();
  if (last?.status === "running" && Date.now() - +new Date(last.startedAt) > STALE_MS) {
    const s = { ...last, status: "error" as const, finishedAt: new Date().toISOString(), message: "Crawl was interrupted (server restarted or timed out). Try again." };
    await setLastCrawl(s); return NextResponse.json(s);
  }
  return NextResponse.json(last || null);
}
async function run(url: string, max: number, replace: boolean, base: CrawlRun) {
  let lastWrite = 0;
  try {
    const { pages, errors, failures } = await crawl(url, { max, onProgress: (n) => { if (Date.now() - lastWrite > 1500) { lastWrite = Date.now(); setLastCrawl({ ...base, pages: n }).catch(() => {}); } } });
    if (pages.length) { if (replace) await clearPages(); await upsertPages(pages); }
    const done = { ...base, pages: pages.length, errors, failures: failures?.length ? failures : undefined, status: "done" as const, finishedAt: new Date().toISOString(), message: pages.length ? undefined : "No readable HTML pages found (existing index kept)." };
    await setLastCrawl(done); return done;
  } catch (e) {
    const err = { ...base, status: "error" as const, finishedAt: new Date().toISOString(), message: (e as Error).message };
    await setLastCrawl(err); return err;
  }
}
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  let url = String(b.url || (await getSettings()).siteUrl || "").trim();
  if (!url) return NextResponse.json({ error: "Add a website URL first (Settings → General)." }, { status: 400 });
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  let parsed: URL; try { parsed = new URL(url); } catch { return NextResponse.json({ error: "Invalid URL" }, { status: 400 }); }
  if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(parsed.hostname)) return NextResponse.json({ error: "Private/local URLs can't be crawled." }, { status: 400 });
  const last = await getLastCrawl();
  if (last?.status === "running" && Date.now() - +new Date(last.startedAt) < STALE_MS) return NextResponse.json({ error: "A crawl is already running.", run: last }, { status: 409 });
  if (b.url && b.url !== (await getSettings()).siteUrl) await setSettings({ siteUrl: url });
  const max = Math.min(Math.max(Number(b.max) || 50, 1), 100);
  const base: CrawlRun = { startUrl: url, startedAt: new Date().toISOString(), pages: 0, errors: 0, status: "running" };
  await setLastCrawl(base);
  const ws = await currentWs(); // keep the background crawl bound to this workspace after the response returns
  const job = runIn(ws, () => run(url, max, b.replace !== false, base));
  if (b.wait || process.env.VERCEL) { const r = await job; return NextResponse.json(r, { status: r.status === "error" ? 500 : 200 }); }
  return NextResponse.json(base, { status: 202 });
}
