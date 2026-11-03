import { NextResponse } from "next/server";
import { guard } from "@/lib/guard";
import { setFeedback } from "@/lib/store";
export async function POST(req: Request) {
  { const g = await guard(req, "feedback"); if (g) return g; }
  const { conversationId, messageId, feedback } = await req.json().catch(() => ({}));
  if (!conversationId || !messageId || !["up", "down", null].includes(feedback)) return NextResponse.json({ error: "bad request" }, { status: 400 });
  return (await setFeedback(conversationId, messageId, feedback)) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
