// Same-origin BFS crawler. Server-only. No deps: regex HTML extraction (good enough for v1).
import type { Page } from "./store";
const UA = "WayloBot/0.1 (+https://waylo.local/bot)";
const SKIP_EXT = /\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|gz|mp4|mp3|webm|mov|woff2?|ttf|css|js|json|xml|rss|txt|csv|docx?|xlsx?|pptx?)(\?|$)/i;

export function decodeEntities(s: string) {
  const cp = (n: number) => (n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "");
  return s.replace(/&#x([0-9a-f]+);/gi, (_, h) => cp(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => cp(+n))
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;|&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&hellip;/g, "…").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–");
}
const decode = decodeEntities;

export function extract(html: string) {
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
  const desc = decode(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1] || "");
  let body = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html.match(/<body[\s\S]*<\/body>/i)?.[0] || html;
  body = body.replace(/<(script|style|noscript|svg|template|iframe|nav|footer|header|form)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|li|h[1-6]|section|tr|br|article)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  const text = decode(body).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 1).join("\n");
  return { title, text: (desc && !text.includes(desc) ? desc + "\n" : "") + text };
}
const sameSite = (a: URL, b: URL) => a.protocol.startsWith("http") && a.hostname.replace(/^www\./, "") === b.hostname.replace(/^www\./, "");
// App internals we never index, even if robots.txt is missing or failed to load.
const APP_SKIP = /^\/(admin|api|widget)(\/|$)/i;
/** True when pathname is this robots Disallow prefix (/admin matches /admin and /admin/signup, not /administration). */
export function pathDisallowed(pathname: string, prefix: string) {
  if (!prefix) return false;
  const d = prefix.endsWith("/") && prefix.length > 1 ? prefix.slice(0, -1) : prefix;
  return pathname === d || pathname.startsWith(d.endsWith("/") ? d : d + "/");
}
export function isAppSkipPath(pathname: string) { return APP_SKIP.test(pathname); }
function isNoIndex(html: string, headers?: Headers) {
  if (headers && /\bnoindex\b/i.test(headers.get("x-robots-tag") || "")) return true;
  for (const m of html.matchAll(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi)) {
    const tag = m[0];
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] || "";
    if (/\bnoindex\b/i.test(content)) return true;
  }
  return false;
}
function links(html: string, base: URL, site: URL) {
  const out: string[] = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)/gi)) {
    try { const u = new URL(decode(m[1]), base); if (!sameSite(u, site) || SKIP_EXT.test(u.pathname)) continue; u.hash = ""; out.push(u.toString()); } catch {}
  }
  return out;
}
type Robots = { disallow: string[]; sitemaps: string[] };
async function robots(origin: string): Promise<Robots> {
  const out: Robots = { disallow: [], sitemaps: [] };
  try {
    const r = await fetch(origin + "/robots.txt", { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) return out;
    let applies = false;
    for (const raw of (await r.text()).split("\n")) {
      const l = raw.split("#")[0].trim(); const [k, ...v] = l.split(":"); const val = v.join(":").trim();
      if (/^sitemap$/i.test(k) && val) out.sitemaps.push(val);
      else if (/^user-agent$/i.test(k)) applies = val === "*" || /waylo/i.test(val);
      else if (applies && /^disallow$/i.test(k) && val) out.disallow.push(val);
    }
  } catch {}
  return out;
}
/** URLs listed in sitemap.xml (robots.txt Sitemap: lines first, then /sitemap.xml, /sitemap_index.xml). Follows sitemap indexes; reads .gz. */
export async function sitemapUrls(origin: string, fromRobots: string[], limit: number): Promise<string[]> {
  const queue = [...fromRobots, origin + "/sitemap.xml", origin + "/sitemap_index.xml"]; const seen = new Set<string>(); const urls: string[] = [];
  let fetched = 0;
  while (queue.length && fetched < 25 && urls.length < limit) {
    const sm = queue.shift()!; if (seen.has(sm)) continue; seen.add(sm); fetched++;
    try {
      const r = await fetch(sm, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(8000) });
      if (!r.ok) continue;
      let buf = Buffer.from(await r.arrayBuffer()); if (buf.length > 20_000_000) continue;
      if (buf[0] === 0x1f && buf[1] === 0x8b) { const { gunzipSync } = await import("zlib"); buf = gunzipSync(buf); }
      const xml = buf.toString("utf8"); if (!/<(urlset|sitemapindex)\b/i.test(xml)) continue;
      const locs = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?([^<\]]+?)(?:\]\]>)?\s*<\/loc>/gi)].map((m) => decode(m[1].trim()));
      if (/<sitemapindex\b/i.test(xml)) queue.push(...locs); else for (const u of locs) { urls.push(u); if (urls.length >= limit) break; }
    } catch {}
  }
  return urls;
}
const norm = (u: string) => { const x = new URL(u); x.hash = ""; if (x.pathname !== "/" && x.pathname.endsWith("/")) x.pathname = x.pathname.slice(0, -1); return x.toString(); };

const DOC_EXT = /\.(pdf|docx)(\?|$)/i;
/** Text from a PDF or .docx (free libs: unpdf / mammoth). Returns "" when unreadable (e.g. scanned PDFs). */
export async function documentText(buf: Buffer, kind: "pdf" | "docx"): Promise<{ title?: string; text: string }> {
  try {
    if (kind === "pdf") {
      const { extractText, getDocumentProxy, getMeta } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      let title: string | undefined; try { const m: any = await getMeta(pdf); title = m?.info?.Title || undefined; } catch {}
      const { text } = await extractText(pdf, { mergePages: true });
      return { title, text: String(text || "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim() };
    }
    const mammoth = await import("mammoth"); const r = await (mammoth as any).extractRawText({ buffer: buf });
    return { text: String(r.value || "").replace(/\n{3,}/g, "\n\n").trim() };
  } catch (e) { return { text: "" }; }
}

export type CrawlOpts = { max?: number; concurrency?: number; deadlineMs?: number; onProgress?: (n: number) => void; documents?: boolean };
export async function crawl(start: string, opts: CrawlOpts = {}) {
  const max = opts.max ?? 50, conc = opts.concurrency ?? 5, docs = opts.documents !== false;
  const deadline = opts.deadlineMs ? Date.now() + opts.deadlineMs : Infinity;
  let base = new URL(start); if (!/^https?:$/.test(base.protocol)) throw new Error("URL must be http(s)");
  // Follow the start URL's redirect first (http→https, apex→www) so the rest of the crawl uses the real origin.
  try { const r = await fetch(base, { method: "GET", headers: { "User-Agent": UA, Accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(10000) }); if (r.url) { const f = new URL(r.url); if (sameSite(f, base) || f.hostname === base.hostname) base = f; } r.body?.cancel().catch(() => {}); } catch {}
  const site = base;
  const rb = await robots(base.origin);
  const blocked = (u: URL) => isAppSkipPath(u.pathname) || rb.disallow.some((d) => pathDisallowed(u.pathname, d));
  const seen = new Set<string>(); const queue: string[] = [];
  const enqueue = (u: string, fromSm = false) => {
    try { const x = new URL(u); if (!sameSite(x, site) || blocked(x) || (!docs && DOC_EXT.test(x.pathname)) || (SKIP_EXT.test(x.pathname) && !DOC_EXT.test(x.pathname))) return false; const n = norm(x.toString()); if (seen.has(n)) return false; seen.add(n); queue.push(n); return fromSm; } catch { return false; }
  };
  enqueue(base.toString());
  // Sitemap-first: everything the site says it has, then whatever links reveal. Respect robots / app-skip here so blocked URLs don't occupy the queue.
  let fromSitemap = 0;
  for (const u of await sitemapUrls(base.origin, rb.sitemaps, max * 3)) {
    if (enqueue(u, true)) fromSitemap++;
  }
  const pages: Omit<Page, "id">[] = []; let errors = 0;
  const failures: { url: string; reason: string }[] = [];
  let inflight = 0;
  async function worker() {
    while (pages.length < max && (queue.length || inflight) && Date.now() < deadline) {
      if (!queue.length) { await new Promise((r) => setTimeout(r, 50)); continue; }
      const url = queue.shift()!; const u = new URL(url); if (blocked(u)) continue;
      inflight++;
      try {
        const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/pdf;q=0.9,*/*;q=0.5" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
        const ct = (r.headers.get("content-type") || "").toLowerCase();
        const finalUrl = new URL(r.url || url);
        if (!r.ok) { errors++; failures.push({ url, reason: `HTTP ${r.status}` }); continue; }
        if (!sameSite(finalUrl, site)) continue;
        const kind = ct.includes("pdf") || /\.pdf$/i.test(finalUrl.pathname) ? "pdf" : ct.includes("wordprocessingml") || /\.docx$/i.test(finalUrl.pathname) ? "docx" : ct.includes("html") ? "html" : null;
        if (!kind || (kind !== "html" && !docs)) { r.body?.cancel().catch(() => {}); continue; }
        if (kind !== "html") {
          const len = Number(r.headers.get("content-length") || 0); if (len > 15_000_000) { r.body?.cancel().catch(() => {}); continue; }
          const buf = Buffer.from(await r.arrayBuffer()); if (buf.length > 15_000_000) continue;
          const d = await documentText(buf, kind);
          const name = decodeURIComponent(finalUrl.pathname.split("/").pop() || "document");
          if (d.text.length > 80 && pages.length < max) { pages.push({ url: norm(finalUrl.toString()), title: (d.title || name) + (kind === "pdf" ? " (PDF)" : " (DOCX)"), text: d.text.slice(0, 60000), updatedAt: new Date().toISOString() }); opts.onProgress?.(pages.length); }
          else if (!d.text) failures.push({ url, reason: `No readable text in ${kind.toUpperCase()}` });
          continue;
        }
        const html = (await r.text()).slice(0, 2_000_000);
        const { title, text } = extract(html);
        if (isNoIndex(html, r.headers)) { /* honor noindex; still follow on-page links below */ }
        else if (text.length > 80 && pages.length < max) { pages.push({ url: norm(finalUrl.toString()), title: title || finalUrl.pathname, text: text.slice(0, 40000), updatedAt: new Date().toISOString() }); opts.onProgress?.(pages.length); }
        for (const l of links(html, finalUrl, site).concat(docs ? docLinks(html, finalUrl, site) : [])) { if (seen.size < max * 6) enqueue(l); }
      } catch (e) {
        errors++;
        const reason = (e as Error)?.name === "TimeoutError" || /timeout/i.test(String((e as Error)?.message)) ? "Timed out" : ((e as Error)?.message || "Request failed");
        failures.push({ url, reason });
      } finally { inflight--; }
    }
  }
  await Promise.all(Array.from({ length: conc }, worker));
  return { pages: dedupe(pages), errors, failures, fromSitemap, origin: base.origin };
}
function docLinks(html: string, base: URL, site: URL) {
  const out: string[] = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+\.(?:pdf|docx)(?:\?[^"'#]*)?)["']/gi)) { try { const u = new URL(decode(m[1]), base); if (sameSite(u, site)) out.push(u.toString()); } catch {} }
  return out;
}
function dedupe(ps: Omit<Page, "id">[]) { const m = new Map<string, Omit<Page, "id">>(); for (const p of ps) if (!m.has(p.url)) m.set(p.url, p); return [...m.values()]; }
