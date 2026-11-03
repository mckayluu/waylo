import { NextResponse } from "next/server";
import { crawl } from "@/lib/crawler";
import { getLastCrawl, getSettings, setLastCrawl, setSettings, upsertPages, clearPages } from "@/lib/store";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
export async function GET() { return NextResponse.json((await getLastCrawl()) || null); }
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  let url = String(b.url || (await getSettings()).siteUrl || "").trim();
  if (!url) return NextResponse.json({ error: "Set a site URL in Settings first." }, { status: 400 });
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { new URL(url); } catch { return NextResponse.json({ error: "Invalid URL" }, { status: 400 }); }
  if ((await getLastCrawl())?.status === "running" && Date.now() - +new Date((await getLastCrawl())!.startedAt) < 5 * 60_000) return NextResponse.json({ error: "A crawl is already running." }, { status: 409 });
  if (b.url && b.url !== (await getSettings()).siteUrl) (await setSettings({ siteUrl: url }));
  const max = Math.min(Math.max(Number(b.max) || 50, 1), 100);
  const run = { startUrl: url, startedAt: new Date().toISOString(), pages: 0, errors: 0, status: "running" as const };
  (await setLastCrawl(run));
  try {
    const { pages, errors } = await crawl(url, { max });
    if (b.replace !== false) (await clearPages());
    (await upsertPages(pages));
    const done = { ...run, pages: pages.length, errors, status: "done" as const, finishedAt: new Date().toISOString(), message: pages.length ? undefined : "No readable HTML pages found." };
    (await setLastCrawl(done)); return NextResponse.json(done);
  } catch (e) {
    const err = { ...run, status: "error" as const, finishedAt: new Date().toISOString(), message: (e as Error).message };
    (await setLastCrawl(err)); return NextResponse.json(err, { status: 500 });
  }
}
