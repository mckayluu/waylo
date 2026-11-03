// Same-origin BFS crawler. Server-only. No deps: regex HTML extraction (good enough for v1).
import type { Page } from "./store";
const UA = "WayloBot/0.1 (+https://waylo.local/bot)";
const SKIP_EXT = /\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|gz|mp4|mp3|webm|mov|woff2?|ttf|css|js|json|xml|rss|txt|csv|docx?|xlsx?|pptx?)(\?|$)/i;

const decode = (s: string) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&hellip;/g, "…").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

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
function links(html: string, base: URL) {
  const out: string[] = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)/gi)) {
    try { const u = new URL(decode(m[1]), base); if (u.origin !== base.origin || SKIP_EXT.test(u.pathname)) continue; u.hash = ""; out.push(u.toString()); } catch {}
  }
  return out;
}
async function robots(origin: string): Promise<string[]> {
  try {
    const r = await fetch(origin + "/robots.txt", { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) return [];
    const dis: string[] = []; let applies = false;
    for (const raw of (await r.text()).split("\n")) {
      const l = raw.split("#")[0].trim(); const [k, ...v] = l.split(":"); const val = v.join(":").trim();
      if (/^user-agent$/i.test(k)) applies = val === "*" || /waylo/i.test(val);
      else if (applies && /^disallow$/i.test(k) && val) dis.push(val);
    }
    return dis;
  } catch { return []; }
}
const norm = (u: string) => { const x = new URL(u); x.hash = ""; if (x.pathname !== "/" && x.pathname.endsWith("/")) x.pathname = x.pathname.slice(0, -1); return x.toString(); };

export async function crawl(start: string, opts: { max?: number; concurrency?: number; onProgress?: (n: number) => void } = {}) {
  const max = opts.max ?? 50, conc = opts.concurrency ?? 4;
  const base = new URL(start); if (!/^https?:$/.test(base.protocol)) throw new Error("URL must be http(s)");
  const disallow = await robots(base.origin);
  const blocked = (u: URL) => disallow.some((d) => u.pathname.startsWith(d));
  const seen = new Set<string>([norm(base.toString())]); const queue = [norm(base.toString())];
  const pages: Omit<Page, "id">[] = []; let errors = 0;
  let inflight = 0;
  async function worker() {
    while (pages.length < max && (queue.length || inflight)) {
      if (!queue.length) { await new Promise((r) => setTimeout(r, 50)); continue; }
      const url = queue.shift()!; const u = new URL(url); if (blocked(u)) continue;
      inflight++;
      try {
        const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(10000) });
        const ct = r.headers.get("content-type") || "";
        if (!r.ok || !ct.includes("html")) { if (!r.ok) errors++; continue; }
        const finalUrl = new URL(r.url || url); if (finalUrl.origin !== base.origin) continue;
        const html = (await r.text()).slice(0, 2_000_000);
        const { title, text } = extract(html);
        if (text.length > 80 && pages.length < max) { pages.push({ url: norm(finalUrl.toString()), title: title || finalUrl.pathname, text: text.slice(0, 40000), updatedAt: new Date().toISOString() }); opts.onProgress?.(pages.length); }
        for (const l of links(html, finalUrl)) { const n = norm(l); if (!seen.has(n) && seen.size < max * 6) { seen.add(n); queue.push(n); } }
      } catch { errors++; } finally { inflight--; }
    }
  }
  await Promise.all(Array.from({ length: conc }, worker));
  return { pages: dedupe(pages), errors };
}
function dedupe(ps: Omit<Page, "id">[]) { const m = new Map<string, Omit<Page, "id">>(); for (const p of ps) if (!m.has(p.url)) m.set(p.url, p); return [...m.values()]; }
