import { NextResponse } from "next/server";
import { getIntegrations, setIntegrations, listDeliveries } from "@/lib/store";
export const dynamic = "force-dynamic";
// TODO(auth): admin-only.
const okUrl = (u: string) => { try { const x = new URL(u); return /^https?:$/.test(x.protocol); } catch { return false; } };
export async function GET() { return NextResponse.json({ ...(await getIntegrations()), deliveries: (await listDeliveries()) }); }
export async function PUT(req: Request) {
  const b = await req.json().catch(() => ({})); const p: Record<string, unknown> = {};
  for (const k of ["slackWebhook", "crmWebhook"] as const) if (typeof b[k] === "string") {
    const v = b[k].trim(); if (v && !okUrl(v)) return NextResponse.json({ error: `${k === "slackWebhook" ? "Slack" : "CRM"} URL must start with http(s)://` }, { status: 400 }); p[k] = v; }
  for (const k of ["notifyLeads", "notifyHighIntent", "notifyHandoffs"] as const) if (typeof b[k] === "boolean") p[k] = b[k];
  return NextResponse.json((await setIntegrations(p)));
}
