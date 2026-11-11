import { NextResponse } from "next/server";
import { getConversation as getConv, newId, upsertConversation as upsertConv, getVisitor, trackPageview, type Conversation } from "@/lib/store";
import { detectSignals, mergeSignals, inferVisitorType, EMAIL_RE } from "@/lib/signals";
import { respond } from "@/lib/ai";
import { syncConversation } from "@/lib/crm";
import { notify } from "@/lib/notify";
import { guard, rateLimit } from "@/lib/guard";
import { withSite, siteParam, isDemo } from "@/lib/site";
export const dynamic = "force-dynamic";
const VID = /^[a-zA-Z0-9_-]{6,64}$/;

// /demo (site=northpoint-demo, alias acme-demo) is a marketing mini-site: answered from Northpoint Ops knowledge and kept in memory only,
// so demo chats never land in any customer workspace inbox.
const g = globalThis as unknown as { __wayloDemo?: Map<string, Conversation> };
const demoConvs = (g.__wayloDemo ||= new Map());
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const rawSite = b.site ?? siteParam(req);
  if (isDemo(rawSite)) { const l = rateLimit(req, "chat"); return l || handle(req, b, true); }
  return withSite(rawSite, async () => { const g = await guard(req, "chat"); return g || handle(req, b, false); });
}
async function handle(req: Request, b: any, demo: boolean) {
  const { conversationId, text, visitorId, stream } = b;
  if (!text || typeof text !== "string") return NextResponse.json({ error: "text required" }, { status: 400 });
  const site = demo ? "northpoint-demo" : undefined;
  const getConversation = demo ? async (id: string) => demoConvs.get(id) : getConv;
  const upsertConversation = demo ? async (c: Conversation) => { demoConvs.delete(c.id); demoConvs.set(c.id, c); if (demoConvs.size > 500) demoConvs.delete(demoConvs.keys().next().value!); return c; } : upsertConv;
  const now = new Date().toISOString();
  const c: Conversation = (conversationId && (await getConversation(conversationId))) || {
    id: newId(), themes: [], signals: [], messages: [], createdAt: now, updatedAt: now,
  };
  if (!demo && typeof visitorId === "string" && VID.test(visitorId)) {
    c.visitorId = visitorId;
    if (!(await getVisitor(visitorId))) (await trackPageview(visitorId, { path: "(chat)", title: "Started chat" }, req.headers.get("user-agent") || undefined));
  }
  c.messages.push({ id: newId(), role: "visitor", text: text.slice(0, 4000), at: now });
  const email = text.match(EMAIL_RE)?.[0]; if (email) c.visitorEmail = email;
  const name = text.match(/\b(?:i'?m|my name is|this is)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/)?.[1]; if (name) c.visitorName = name;
  const wasHot = c.signals.includes("high-intent");
  const found = detectSignals(text);
  c.signals = mergeSignals(c.signals, found);
  c.themes = [...new Set([...c.themes, ...found])];
  c.visitorType = inferVisitorType(c.signals);
  const botId = newId();
  const finish = async (ans: { text: string; citations: { title: string; url: string }[] }) => {
    c.messages.push({ id: botId, role: "bot", text: ans.text, citations: ans.citations, at: new Date().toISOString() });
    c.updatedAt = new Date().toISOString(); (await upsertConversation(c)); if (demo) return; syncConversation(c).catch(() => {});
    if (!wasHot && c.signals.includes("high-intent")) notify("conversation.high_intent", { conversation: c }).catch(() => {});
  };

  if (!stream) {
    const ans = await respond(c.messages, text, c.signals, !!c.visitorEmail, undefined, site);
    finish(ans);
    return NextResponse.json({ conversationId: c.id, messageId: botId, reply: ans.text, citations: ans.citations });
  }
  // Server-Sent Events: meta → delta* → done
  (await upsertConversation(c)); // persist the visitor message immediately
  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(ctl) {
      const send = (event: string, data: unknown) => ctl.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      send("meta", { conversationId: c.id, messageId: botId });
      let streamed = "";
      try {
        const ans = await respond(c.messages, text, c.signals, !!c.visitorEmail, (t) => { streamed += t; send("delta", { t }); }, site);
        if (!ans.text) ans.text = streamed || "Sorry, something went wrong.";
        finish(ans);
        send("done", { reply: ans.text, citations: ans.citations });
      } catch { finish({ text: streamed || "Sorry, something went wrong.", citations: [] }); send("done", { reply: streamed || "Sorry, something went wrong.", citations: [] }); }
      ctl.close();
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Accel-Buffering": "no" } });
}
