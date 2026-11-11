import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/guard";
import { addLead, runIn, DEFAULT_WS } from "@/lib/store";
import { notify } from "@/lib/notify";
import { EMAIL_RE } from "@/lib/signals";
export const dynamic = "force-dynamic";
// Marketing contact / early-access form. Stores the lead on the default (Waylo) workspace
// so it shows up under Admin → Leads. There is no waylo.ai inbox.
export async function POST(req: Request) {
  const limited = rateLimit(req, "contact"); if (limited) return limited;
  const b = await req.json().catch(() => ({}));
  if (String(b.companySite || b.website || "").trim()) return NextResponse.json({ ok: true }); // honeypot
  const name = String(b.name || "").trim(), email = String(b.email || "").trim().toLowerCase();
  const company = String(b.company || "").trim(), message = String(b.message || "").trim();
  if (!name || !EMAIL_RE.test(email) || !message) return NextResponse.json({ error: "name, valid email and message required" }, { status: 400 });
  if (!b.consent) return NextResponse.json({ error: "consent required" }, { status: 400 });
  const intent = b.intent === "demo" ? "demo" : "message";
  const text = company ? `${message}\n\nCompany: ${company}` : message;
  const lead = await runIn(DEFAULT_WS, async () => {
    const lead = await addLead({ name, email, message: text, intent, consent: true });
    await notify("lead.created", { lead }).catch(() => {});
    return lead;
  });
  return NextResponse.json({ ok: true, id: lead.id });
}
