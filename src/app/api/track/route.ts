import { NextResponse } from "next/server";
import { trackPageview } from "@/lib/store";
export const dynamic = "force-dynamic";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
const VID = /^[a-zA-Z0-9_-]{6,64}$/;
export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }
export async function POST(req: Request) {
  // Accept JSON or text/plain (sendBeacon) bodies.
  const b = await req.text().then((t) => { try { return JSON.parse(t); } catch { return {}; } });
  const visitorId = String(b.visitorId || ""), path = String(b.path || "").slice(0, 500);
  if (!VID.test(visitorId) || !path) return NextResponse.json({ error: "visitorId and path required" }, { status: 400, headers: CORS });
  const v = (await trackPageview(visitorId, { path, title: b.title ? String(b.title).slice(0, 200) : undefined, referrer: b.referrer ? String(b.referrer).slice(0, 500) : undefined }, req.headers.get("user-agent")?.slice(0, 300)));
  return NextResponse.json({ ok: true, pageviews: v.pageviews.length }, { headers: CORS });
}
