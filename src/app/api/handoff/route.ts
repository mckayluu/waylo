import { NextResponse } from "next/server";
import { addHandoff, getConversation, listHandoffs, updateConversation } from "@/lib/store";
import { EMAIL_RE } from "@/lib/signals";
import { notify } from "@/lib/notify";
import { guard } from "@/lib/guard";
import { withSite, siteParam, isDemo } from "@/lib/site";
export const dynamic = "force-dynamic";
// Visitor-facing: request a human.
export async function POST(req: Request) {
  const site = siteParam(req);
  if (isDemo(site)) return NextResponse.json({ ok: true, demo: true }); // /demo: nothing stored
  return withSite(site, async () => { const g = await guard(req, "handoff"); return g || post(req); });
}
async function post(req: Request) {
  const b = await req.json().catch(() => ({}));
  const conversationId = typeof b.conversationId === "string" ? b.conversationId : undefined;
  const c = conversationId ? (await getConversation(conversationId)) : undefined;
  const email = typeof b.email === "string" && EMAIL_RE.test(b.email) ? b.email.trim() : c?.visitorEmail;
  const existing = (await listHandoffs()).find((h) => h.status === "open" && ((conversationId && h.conversationId === conversationId) || (b.visitorId && h.visitorId === b.visitorId)));
  if (existing) return NextResponse.json({ ok: true, id: existing.id, duplicate: true });
  const h = (await addHandoff({ conversationId: c?.id, visitorId: typeof b.visitorId === "string" ? b.visitorId.slice(0, 64) : undefined, email, name: typeof b.name === "string" ? b.name.slice(0, 80) : c?.visitorName, note: typeof b.note === "string" ? b.note.slice(0, 1000) : undefined }));
  if (c) (await updateConversation(c.id, { signals: [...new Set([...c.signals, "handoff"])], ...(email && !c.visitorEmail ? { visitorEmail: email } : {}) }));
  await notify("handoff.requested", { handoff: h, conversation: c ? (await getConversation(c.id)) : undefined }).catch(() => {});
  return NextResponse.json({ ok: true, id: h.id });
}
