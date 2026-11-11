import { NextResponse } from "next/server";
import { trackPageview, getInstall, setInstall } from "@/lib/store";
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
async function track(req: Request, b: any) {
  const visitorId = String(b.visitorId || ""), path = String(b.path || "").slice(0, 500);
  if (!VID.test(visitorId) || !path) return NextResponse.json({ error: "visitorId and path required" }, { status: 400, headers: CORS });
  const v = (await trackPageview(visitorId, { path, title: b.title ? String(b.title).slice(0, 200) : undefined, referrer: b.referrer ? String(b.referrer).slice(0, 500) : undefined }, req.headers.get("user-agent")?.slice(0, 300)));
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
