import { NextResponse } from "next/server";
import { clientIp } from "@/lib/guard";
import { allow, getTry, TRY_REPLIES } from "@/lib/trysession";
import { respond } from "@/lib/ai";
import { runIn } from "@/lib/tenant";
import { runWithTry } from "@/lib/trycontext";
import type { Message } from "@/lib/store-types";
export const dynamic = "force-dynamic";
// Chat with an instant-try session. Nothing is stored; history comes from the client (last 6 turns).
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const s = getTry(b.id);
  if (!s || s.status !== "done") return NextResponse.json({ error: "This preview expired. Paste your URL again." }, { status: 404 });
  const text = String(b.text || "").trim().slice(0, 500);
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  if (s.replies >= TRY_REPLIES) return NextResponse.json({ error: `That's the ${TRY_REPLIES}-question preview. Start your free trial to keep going: we'll bring this site with you.`, limit: true }, { status: 429 });
  if (!allow(`trychat:ip:${clientIp(req)}`, 40, 3_600_000)) return NextResponse.json({ error: "Too many questions this hour. Start a free trial to keep going." }, { status: 429 });
  s.replies++;
  const now = new Date().toISOString();
  const hist: Message[] = (Array.isArray(b.history) ? b.history : []).slice(-6)
    .filter((m: any) => m && (m.role === "visitor" || m.role === "bot") && typeof m.text === "string")
    .map((m: any, i: number) => ({ id: `h${i}`, role: m.role, text: String(m.text).slice(0, 1500), at: now }));
  hist.push({ id: "q", role: "visitor", text, at: now });
  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(ctl) {
      const send = (e: string, d: unknown) => ctl.enqueue(enc.encode(`event: ${e}\ndata: ${JSON.stringify(d)}\n\n`));
      send("meta", { repliesLeft: TRY_REPLIES - s.replies });
      try {
        // "__try__" is not a workspace: no guidance, settings or pages from any real workspace can leak in.
        const ans = await runIn("__try__", () => runWithTry({ id: s.id, siteName: s.siteName, pages: s.pages }, () => respond(hist, text, [], false, (t) => { send("delta", { t }); })));
        send("done", { reply: ans.text, citations: ans.citations, repliesLeft: TRY_REPLIES - s.replies });
      } catch { send("done", { reply: "Sorry, something went wrong. Try again.", citations: [] }); }
      ctl.close();
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" } });
}
