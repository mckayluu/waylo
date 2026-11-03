import { NextResponse } from "next/server";
import { getIntegrations } from "@/lib/store";
import { notify } from "@/lib/notify";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const { target } = await req.json().catch(() => ({}));
  if (!["slack", "crm"].includes(target)) return NextResponse.json({ error: "target must be slack or crm" }, { status: 400 });
  const cfg = (await getIntegrations()); if (!(target === "slack" ? cfg.slackWebhook : cfg.crmWebhook)) return NextResponse.json({ error: "Save a URL first." }, { status: 400 });
  const now = new Date().toISOString();
  const sample = { id: "test-lead", name: "Sample Visitor", email: "sample@example.com", message: "This is a Waylo test lead.", intent: "demo" as const, consent: true, createdAt: now };
  const r = await notify(target === "crm" ? "lead.created" : "test", { lead: target === "crm" ? sample : undefined }, { only: target, test: true });
  const res = (r as Record<string, { ok: boolean; status?: number; error?: string }>)[target];
  return NextResponse.json(res || { ok: false, error: "Not sent" }, { status: res?.ok ? 200 : 502 });
}
