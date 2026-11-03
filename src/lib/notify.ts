// Outbound notifications: Slack incoming webhook + generic CRM JSON webhook.
import { getIntegrations, getSettings, logDelivery, type Conversation, type Lead, type Handoff } from "./store";
export type WayloEvent = "lead.created" | "conversation.high_intent" | "handoff.requested" | "test";
const BASE = () => process.env.WAYLO_PUBLIC_URL || "http://localhost:3000";

export function summarize(c?: Conversation) {
  if (!c) return undefined;
  return { id: c.id, visitorId: c.visitorId, name: c.visitorName, email: c.visitorEmail, visitorType: c.visitorType, signals: c.signals, themes: c.themes,
    messages: c.messages.length, lastQuestion: c.messages.filter((m) => m.role === "visitor").at(-1)?.text, adminUrl: `${BASE()}/admin/c/${c.id}`, updatedAt: c.updatedAt };
}
async function slackText(event: WayloEvent, d: { lead?: Lead; conversation?: ReturnType<typeof summarize>; handoff?: Handoff }) {
  const site = (await getSettings()).siteName; const c = d.conversation;
  const link = c ? ` · <${c.adminUrl}|Open in Waylo>` : "";
  switch (event) {
    case "lead.created": return `:envelope: *New ${d.lead!.intent === "demo" ? "demo request" : "message"}* on ${site} from *${d.lead!.name}* (${d.lead!.email})\n>${d.lead!.message.replace(/\n/g, "\n>")}${link}`;
    case "conversation.high_intent": return `:fire: *High-intent visitor* on ${site}: ${c?.name || c?.email || "Anonymous"} — signals: ${c?.signals.join(", ")}\n>${c?.lastQuestion || ""}${link}`;
    case "handoff.requested": return `:wave: *Visitor wants a person* on ${site}: ${d.handoff?.name || d.handoff?.email || c?.email || "Anonymous"}${d.handoff?.note ? `\n>${d.handoff.note}` : ""}${c?.lastQuestion ? `\n>Last question: ${c.lastQuestion}` : ""}${link}`;
    default: return `:white_check_mark: Waylo test notification from ${site}. Integrations are working.`;
  }
}
async function post(target: "slack" | "crm", url: string, body: unknown, event: string, test = false) {
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Waylo-Webhooks/1.0" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
    (await logDelivery({ target, event, ok: r.ok, status: r.status, test, error: r.ok ? undefined : (await r.text().catch(() => "")).slice(0, 200) }));
    return { ok: r.ok, status: r.status };
  } catch (e) { const error = (e as Error).message; (await logDelivery({ target, event, ok: false, error, test })); return { ok: false, error }; }
}
export async function notify(event: WayloEvent, d: { lead?: Lead; conversation?: Conversation; handoff?: Handoff }, opts: { only?: "slack" | "crm"; test?: boolean } = {}) {
  const cfg = (await getIntegrations());
  const enabled = opts.test || event === "test" || (event === "lead.created" ? cfg.notifyLeads : event === "handoff.requested" ? cfg.notifyHandoffs : cfg.notifyHighIntent);
  if (!enabled) return {};
  const data = { lead: d.lead, handoff: d.handoff, conversation: summarize(d.conversation) };
  const out: Record<string, unknown> = {};
  const jobs: Promise<void>[] = [];
  if (cfg.slackWebhook && opts.only !== "crm") jobs.push(post("slack", cfg.slackWebhook, { text: (await slackText(event, data)) }, event, opts.test).then((r) => { out.slack = r; }));
  if (cfg.crmWebhook && opts.only !== "slack") jobs.push(post("crm", cfg.crmWebhook, { event, site: (await getSettings()).siteName, sentAt: new Date().toISOString(), data }, event, opts.test).then((r) => { out.crm = r; }));
  await Promise.all(jobs); return out;
}
