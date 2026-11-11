// Crawl jobs shared by the admin Content page and the scheduled re-crawl: plan caps, multi-site, per-site replace.
import { crawl } from "./crawler";
import { runIn, getLastCrawl, setLastCrawl, getSettings, listPages, upsertPages, deletePage, type CrawlRun } from "./store";
import { entitlement } from "./entitlement";
import { siteKey, siteList } from "./sites";
export const STALE_MS = 30 * 60_000;
const running = new Set<string>();
export const isRunning = (ws: string) => running.has(ws);
/** How many pages a crawl of `url` may index: plan cap minus pages already indexed from the workspace's other sites. */
export async function pageBudget(url: string): Promise<{ cap: number; planPages: number; others: number }> {
  const e = await entitlement(); const k = siteKey(url);
  const others = (await listPages()).filter((p) => siteKey(p.url) !== k).length;
  return { cap: Math.max(0, e.plan.pages - others), planPages: e.plan.pages, others };
}
export async function runCrawl(ws: string, url: string, max: number, opts: { replace?: boolean; trigger?: "manual" | "scheduled" } = {}): Promise<CrawlRun> {
  return runIn(ws, async () => {
    const base: CrawlRun = { startUrl: url, startedAt: new Date().toISOString(), pages: 0, errors: 0, status: "running", ...(opts.trigger === "scheduled" ? { message: "Scheduled re-crawl" } : {}) };
    running.add(ws); await setLastCrawl(base);
    let lastWrite = 0; let finished = false; let pending: Promise<unknown> = Promise.resolve();
    // Progress writes must never land after the final "done" write (that left the admin stuck on "running").
    const progress = (n: number) => { if (finished || Date.now() - lastWrite < 1500) return; lastWrite = Date.now(); pending = pending.then(() => finished ? null : setLastCrawl({ ...base, pages: n })).catch(() => {}); };
    try {
      const res = await crawl(url, { max, onProgress: progress });
      finished = true; await pending;
      const { pages, errors, failures, fromSitemap } = res;
      let removed = 0;
      if (pages.length) {
        if (opts.replace !== false) {
          // Replace only this site's pages: other sites in the workspace keep their index.
          const k = siteKey(url); const keep = new Set(pages.map((p) => p.url));
          for (const p of await listPages()) if (siteKey(p.url) === k && !keep.has(p.url)) { await deletePage(p.id); removed++; }
        }
        await upsertPages(pages);
      }
      const done: CrawlRun = { ...base, pages: pages.length, errors, failures: failures?.length ? failures.slice(0, 50) : undefined, status: "done", finishedAt: new Date().toISOString(),
        message: pages.length ? [opts.trigger === "scheduled" && "Scheduled re-crawl", fromSitemap ? `${fromSitemap} URLs found in sitemap` : "No sitemap found; followed links", removed && `${removed} removed pages dropped`, pages.length >= max && `stopped at your ${max}-page limit`].filter(Boolean).join(" · ") : "No readable pages found (existing index kept)." };
      await setLastCrawl(done); return done;
    } catch (e) {
      finished = true; await pending;
      const err: CrawlRun = { ...base, status: "error", finishedAt: new Date().toISOString(), message: (e as Error).message };
      await setLastCrawl(err); return err;
    } finally { running.delete(ws); }
  });
}
/** Is a scheduled re-crawl due for the current workspace? */
export async function recrawlDue(): Promise<{ due: boolean; sites: string[]; overdueMs: number }> {
  const st = await getSettings(); const sites = siteList(st);
  if (!sites.length || st.autoRecrawl === false) return { due: false, sites, overdueMs: 0 };
  const e = await entitlement(); if (!e.chatOpen || e.state === "preview") return { due: false, sites, overdueMs: 0 };
  const last = await getLastCrawl(); if (!last) return { due: false, sites, overdueMs: 0 }; // never crawled manually: onboarding owns the first crawl
  if (last.status === "running" && Date.now() - +new Date(last.startedAt) < STALE_MS) return { due: false, sites, overdueMs: 0 };
  const at = +new Date(last.finishedAt || last.startedAt); const every = e.plan.recrawlDays * 86_400_000 - 3_600_000;
  return { due: Date.now() - at > every, sites, overdueMs: Date.now() - at - every };
}
