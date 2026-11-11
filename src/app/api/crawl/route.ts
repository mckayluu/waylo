import { NextResponse } from "next/server";
import { currentWs, getLastCrawl, getSettings, setLastCrawl, setSettings, listPages, deletePage } from "@/lib/store";
import { runCrawl, pageBudget, STALE_MS } from "@/lib/crawljob";
import { entitlement } from "@/lib/entitlement";
import { assertPublicUrl } from "@/lib/netguard";
import { siteKey, siteList } from "@/lib/sites";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
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
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const st = await getSettings();
  let url = String(b.url || st.siteUrl || "").trim();
  if (!url) return NextResponse.json({ error: "Add a website URL first (Settings → General)." }, { status: 400 });
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { url = (await assertPublicUrl(url)).toString(); } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 400 }); }
  const last = await getLastCrawl();
  if (last?.status === "running" && Date.now() - +new Date(last.startedAt) < STALE_MS) return NextResponse.json({ error: "A crawl is already running.", run: last }, { status: 409 });
  // Sites: the first URL becomes the primary site; more sites only within the plan (Growth: 3).
  const e = await entitlement(); const sites = siteList(st); const k = siteKey(url);
  if (!sites.length) await setSettings({ siteUrl: url });
  else if (!sites.some((s) => siteKey(s) === k)) {
    if (sites.length >= e.plan.sites) return NextResponse.json({ error: `Your ${e.plan.name} plan includes ${e.plan.sites} site${e.plan.sites > 1 ? "s" : ""}. ${e.plan.sites < 3 ? "Upgrade to Growth for 3 sites, or re-crawl your current site." : "Remove a site first."}`, upgrade: e.plan.sites < 3 }, { status: 402 });
    if (b.replaceSite === true && sites.length === 1) await setSettings({ siteUrl: url }); // single-site plans can switch their site
    else await setSettings({ extraSites: [...(st.extraSites || []), url] });
  }
  const { cap, planPages } = await pageBudget(url);
  if (cap <= 0) return NextResponse.json({ error: `You've indexed your plan's ${planPages} pages. Remove pages or upgrade for more.`, upgrade: true }, { status: 402 });
  const max = Math.min(Math.max(Number(b.max) || cap, 1), cap);
  const ws = await currentWs(); // keep the background crawl bound to this workspace after the response returns
  const job = runCrawl(ws, url, max, { replace: b.replace !== false });
  if (b.wait || process.env.VERCEL) { const r = await job; return NextResponse.json(r, { status: r.status === "error" ? 500 : 200 }); }
  return NextResponse.json({ startUrl: url, startedAt: new Date().toISOString(), pages: 0, errors: 0, status: "running", max }, { status: 202 });
}
// Remove an extra site (and its indexed pages). Owner-only via middleware (DELETE).
export async function DELETE(req: Request) {
  const site = new URL(req.url).searchParams.get("site") || ""; const k = siteKey(site);
  const st = await getSettings(); if (!k) return NextResponse.json({ error: "site required" }, { status: 400 });
  if (siteKey(st.siteUrl) === k) return NextResponse.json({ error: "That's your primary site. Change it in Settings instead." }, { status: 400 });
  await setSettings({ extraSites: (st.extraSites || []).filter((s) => siteKey(s) !== k) });
  let removed = 0; for (const p of await listPages()) if (siteKey(p.url) === k) { await deletePage(p.id); removed++; }
  return NextResponse.json({ ok: true, removed });
}
