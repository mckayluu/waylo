import { NextResponse } from "next/server";
import crypto from "crypto";
import { usePostgres, q } from "@/lib/db";
import { runIn } from "@/lib/store";
import { recrawlDue, runCrawl, pageBudget, isRunning } from "@/lib/crawljob";
export const dynamic = "force-dynamic";
// Scheduled re-crawl. Called by Supabase pg_cron (job 'waylo-recrawl') with header x-waylo-cron: $WAYLO_CRON_SECRET.
// Each call re-crawls the single most overdue workspace in the background, so load on the free instance stays small.
const ok = (h: string | null) => { const s = process.env.WAYLO_CRON_SECRET || ""; if (!s || !h) return false; const a = Buffer.from(h), b = Buffer.from(s); return a.length === b.length && crypto.timingSafeEqual(a, b); };
export async function POST(req: Request) {
  if (!ok(req.headers.get("x-waylo-cron"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!usePostgres()) return NextResponse.json({ ok: true, skipped: "no database" });
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const rows = await q<{ id: string }>("SELECT id FROM workspaces WHERE id <> 'default' ORDER BY created_at");
  let pick: { ws: string; sites: string[]; overdueMs: number } | undefined; const due: string[] = [];
  for (const { id } of rows) {
    if (isRunning(id)) continue;
    const d = await runIn(id, () => recrawlDue()).catch(() => null);
    if (d?.due) { due.push(id); if (!pick || d.overdueMs > pick.overdueMs) pick = { ws: id, sites: d.sites, overdueMs: d.overdueMs }; }
  }
  if (!pick || dry) return NextResponse.json({ ok: true, checked: rows.length, due, started: dry ? undefined : null });
  const target = pick;
  (async () => { for (const site of target.sites) { const { cap } = await runIn(target.ws, () => pageBudget(site)); if (cap > 0) await runCrawl(target.ws, site, cap, { trigger: "scheduled" }); } })().catch((e) => console.error("[recrawl]", target.ws, e?.message));
  return NextResponse.json({ ok: true, checked: rows.length, due, started: target.ws, sites: target.sites }, { status: 202 });
}
