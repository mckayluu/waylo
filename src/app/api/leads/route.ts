import { NextResponse } from "next/server";
import { guard } from "@/lib/guard";
import { addLead, listLeads, updateConversation, getConversation } from "@/lib/store";
import { notify } from "@/lib/notify";
import { EMAIL_RE } from "@/lib/signals";
export async function POST(req: Request) {
  { const g = await guard(req, "leads"); if (g) return g; }
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim(), email = String(b.email || "").trim(), message = String(b.message || "").trim();
  if (!name || !EMAIL_RE.test(email) || !message) return NextResponse.json({ error: "name, valid email and message required" }, { status: 400 });
  if (!b.consent) return NextResponse.json({ error: "consent required" }, { status: 400 });
  const intent = b.intent === "demo" ? "demo" : "message";
  const lead = (await addLead({ name, email, message, intent, consent: true, conversationId: b.conversationId || undefined }));
  if (b.conversationId) (await updateConversation(b.conversationId, { visitorName: name, visitorEmail: email }));
  await notify("lead.created", { lead, conversation: b.conversationId ? (await getConversation(b.conversationId)) : undefined }).catch(() => {});
  return NextResponse.json({ ok: true, id: lead.id });
}
export async function GET() { return NextResponse.json((await listLeads())); }
