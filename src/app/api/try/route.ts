import { NextResponse } from "next/server";
import { clientIp } from "@/lib/guard";
import { allow, getTry, startTry, suggestions, TRY_PAGES, TRY_REPLIES, TRY_TTL_MS } from "@/lib/trysession";
export const dynamic = "force-dynamic";
// POST { url } → start an instant try (no account). GET ?id= → progress + what was found.
export async function POST(req: Request) {
  const ip = clientIp(req);
  const b = await req.json().catch(() => ({}));
  const url = String(b.url || "").trim().slice(0, 300);
  if (!url) return NextResponse.json({ error: "Paste your website address" }, { status: 400 });
  if (!allow(`try:ip:${ip}`, 4, 3_600_000)) return NextResponse.json({ error: "You've tried a few sites already this hour. Start a free trial to crawl your whole site." }, { status: 429 });
  if (!allow("try:global", 60, 3_600_000)) return NextResponse.json({ error: "Lots of people are trying Waylo right now. Give it a few minutes, or start a free trial." }, { status: 429 });
  try { const s = await startTry(url, ip); return NextResponse.json({ id: s.id, host: s.host, status: s.status, limits: { pages: TRY_PAGES, replies: TRY_REPLIES, minutes: TRY_TTL_MS / 60_000 } }, { status: 202 }); }
  catch (e: any) { return NextResponse.json({ error: e?.message || "Couldn't start" }, { status: e?.status || 400 }); }
}
export async function GET(req: Request) {
  const s = getTry(new URL(req.url).searchParams.get("id"));
  if (!s) return NextResponse.json({ error: "This preview expired. Paste your URL again." }, { status: 404 });
  return NextResponse.json({ id: s.id, host: s.host, url: s.url, siteName: s.siteName, status: s.status, found: s.found, message: s.message,
    pages: s.pages.slice(0, 12).map((p) => ({ title: p.title, url: p.url })), total: s.pages.length, suggestions: s.status === "done" ? suggestions(s) : [],
    repliesLeft: Math.max(0, TRY_REPLIES - s.replies), expiresAt: new Date(s.createdAt + TRY_TTL_MS).toISOString() });
}
