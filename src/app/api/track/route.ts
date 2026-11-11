import { NextResponse } from "next/server";
import { trackPageview, getInstall, setInstall, engagePageview } from "@/lib/store";
import { classify } from "@/lib/channels";
import { WAYLO_URL } from "@/lib/embed";
import { guard } from "@/lib/guard";
import { withSite, isDemo } from "@/lib/site";
export const dynamic = "force-dynamic";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
const VID = /^[a-zA-Z0-9_-]{6,64}$/;
export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }
export async function POST(req: Request) {
  // Accept JSON or text/plain (sendBeacon) bodies.
  const b = await req.text().then((t) => { try { return JSON.parse(t); } catch { return {}; } });
  const site = b.site ?? new URL(req.url).searchParams.get("site");
  if (isDemo(site)) return NextResponse.json({ ok: true, demo: true }, { headers: CORS });
  return withSite(site, async () => { const g = await guard(req, "track"); return g || track(req, b); }, CORS);
}
const PVK = /^[a-zA-Z0-9_-]{4,40}$/;
const str = (v: unknown, n: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : undefined);
async function track(req: Request, b: any) {
  const visitorId = String(b.visitorId || "");
  if (!VID.test(visitorId)) return NextResponse.json({ error: "visitorId and path required" }, { status: 400, headers: CORS });
  if (b.type === "engage") {
    // Time on page / scroll depth / key clicks for one pageview, sent on tab hide, page exit or SPA navigation.
    const pvKey = String(b.pv || ""); if (!PVK.test(pvKey)) return NextResponse.json({ error: "pv required" }, { status: 400, headers: CORS });
    const clicks = (Array.isArray(b.clicks) ? b.clicks : []).slice(0, 20).map((c: any) => ({ label: str(c?.label, 80) || "(click)", href: str(c?.href, 300), at: Number.isFinite(c?.at) ? Math.max(0, Math.min(86_400_000, Math.round(c.at))) : undefined }));
    const ok = await engagePageview(visitorId, pvKey, { durationMs: Math.max(0, Math.min(4 * 3_600_000, Math.round(Number(b.duration) || 0))), scrollPct: Math.max(0, Math.min(100, Math.round(Number(b.scroll) || 0))), clicks });
    return NextResponse.json({ ok }, { headers: CORS });
  }
  const path = String(b.path || "").slice(0, 500);
  if (!path) return NextResponse.json({ error: "visitorId and path required" }, { status: 400, headers: CORS });
  const referrer = str(b.referrer, 500);
  let qs: URLSearchParams | undefined; try { qs = new URL(path, "https://x.invalid").searchParams; } catch {}
  const utm = { source: str(b.utm?.source ?? qs?.get("utm_source"), 100), medium: str(b.utm?.medium ?? qs?.get("utm_medium"), 100), campaign: str(b.utm?.campaign ?? qs?.get("utm_campaign"), 150) };
  if (!utm.source && qs?.get("gclid")) { utm.source = "google"; utm.medium = "cpc"; } else if (!utm.source && qs?.get("fbclid")) { utm.source = "facebook"; utm.medium ||= "social"; } else if (!utm.source && qs?.get("msclkid")) { utm.source = "bing"; utm.medium = "cpc"; }
  let pageHost = str(b.host, 200) || ""; if (!pageHost) { try { pageHost = new URL(req.headers.get("origin") || "").hostname; } catch {} }
  const ch = classify(referrer, utm, pageHost);
  const v = (await trackPageview(visitorId, { path, title: str(b.title, 200), referrer, pvKey: PVK.test(String(b.pv || "")) ? String(b.pv) : undefined, channel: ch.channel, source: ch.source?.slice(0, 100), utmSource: utm.source, utmMedium: utm.medium, utmCampaign: utm.campaign }, req.headers.get("user-agent")?.slice(0, 300)));
  await noteInstall(req, b).catch(() => {});
  return NextResponse.json({ ok: true, pageviews: v.pageviews.length }, { headers: CORS });
}
const OWN = new Set([new URL(WAYLO_URL).host, process.env.RENDER_EXTERNAL_HOSTNAME || ""].filter(Boolean));
/** The snippet reporting from a customer domain is the real "installed" signal (our own preview/demo pages don't count). */
async function noteInstall(req: Request, b: any) {
  const src = req.headers.get("origin") || req.headers.get("referer") || ""; let host = "";
  try { host = new URL(src).host; } catch { return; }
  if (!host || OWN.has(host) || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(host)) return;
  const cur = await getInstall(); const now = new Date().toISOString();
  if (cur.host === host && cur.lastSeen && Date.now() - +new Date(cur.lastSeen) < 10 * 60_000) return; // throttle writes
  await setInstall({ host, url: `${new URL(src).origin}${String(b.path || "/").slice(0, 300)}`, firstSeen: cur.firstSeen || now, lastSeen: now });
}
