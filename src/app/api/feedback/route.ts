import { NextResponse } from "next/server";
import { guard } from "@/lib/guard";
import { withSite, siteParam, isDemo } from "@/lib/site";
import { setFeedback } from "@/lib/store";
export async function POST(req: Request) {
  const site = siteParam(req);
  if (isDemo(site)) return NextResponse.json({ ok: true, demo: true }); // /demo: nothing stored
  return withSite(site, async () => { const g = await guard(req, "feedback"); return g || post(req); });
}
async function post(req: Request) {
  const { conversationId, messageId, feedback } = await req.json().catch(() => ({}));
  if (!conversationId || !messageId || !["up", "down", null].includes(feedback)) return NextResponse.json({ error: "bad request" }, { status: 400 });
  return (await setFeedback(conversationId, messageId, feedback)) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
