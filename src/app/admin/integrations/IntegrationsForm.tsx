"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Integrations } from "@/lib/store";
export function IntegrationsForm({ initial }: { initial: Integrations }) {
  const [v, setV] = useState(initial); const [msg, setMsg] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(""); const r = useRouter();
  const flash = (k: string, m: string) => { setMsg((x) => ({ ...x, [k]: m })); setTimeout(() => setMsg((x) => ({ ...x, [k]: "" })), 4000); };
  async function save(k = "save") {
    setBusy(k); const res = await fetch("/api/integrations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
    const j = await res.json().catch(() => ({})); setBusy(""); if (!res.ok) { flash(k, `✗ ${j.error || `HTTP ${res.status}`}`); return false; } setV(j); flash("save", "Saved"); r.refresh(); return true;
  }
  async function test(target: "slack" | "crm") {
    if (!(await save(target))) return; setBusy(target);
    const res = await fetch("/api/integrations/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target }) });
    const j = await res.json().catch(() => ({ ok: false, status: res.status })); setBusy(""); flash(target, j.ok ? `✓ Delivered (HTTP ${j.status})` : `✗ ${j.error || `HTTP ${j.status}`}`); r.refresh();
  }
  const Block = ({ k, title, desc, ph, help }: { k: "slackWebhook" | "crmWebhook"; title: string; desc: string; ph: string; help: React.ReactNode }) => {
    const t = k === "slackWebhook" ? "slack" : "crm";
    return <div className="w-card p-5">
      <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-stone-900">{title}</p><p className="text-sm text-stone-500">{desc}</p></div>
        <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${v[k] ? "bg-teal-50 text-teal-800 ring-teal-200" : "bg-stone-100 text-stone-500 ring-stone-200"}`}>{v[k] ? "Connected" : "Not connected"}</span></div>
      <label className="w-label mt-4">Webhook URL</label>
      <div className="flex gap-2"><input className="w-input font-mono text-xs" placeholder={ph} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
        <button type="button" disabled={!!busy || !v[k]} onClick={() => test(t)} className="w-btn-ghost whitespace-nowrap">{busy === t ? "Sending…" : "Send test"}</button></div>
      <p className={`mt-1.5 text-xs ${msg[t]?.startsWith("✗") ? "text-rose-600" : msg[t] ? "text-teal-700" : "text-stone-500"}`}>{msg[t] || help}</p>
    </div>;
  };
  return <div className="space-y-4">
    {Block({ k: "slackWebhook", title: "Slack", desc: "Post alerts to a channel with an incoming webhook.", ph: "https://hooks.slack.com/services/…", help: <>Create one in Slack → Apps → Incoming Webhooks. Payload: <code>{"{ text }"}</code>.</> })}
    {Block({ k: "crmWebhook", title: "CRM / outbound webhook", desc: "POST a JSON summary to any CRM, Zapier, Make or your own endpoint.", ph: "https://your-crm.example.com/waylo", help: <>Payload: <code>{"{ event, site, sentAt, data: { lead, handoff, conversation } }"}</code>.</> })}
    <div className="w-card p-5"><p className="font-semibold text-stone-900">Send notifications for</p>
      <div className="mt-3 space-y-2.5">{([["notifyLeads", "New Contact-form leads", "lead.created"], ["notifyHighIntent", "Visitors becoming high-intent", "conversation.high_intent"], ["notifyHandoffs", "“Talk to a person” requests", "handoff.requested"]] as const).map(([k, l, ev]) =>
        <label key={k} className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-4 w-4 accent-teal-700" checked={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.checked })} /><span className="text-stone-800">{l}</span><code className="ml-auto text-[11px] text-stone-400">{ev}</code></label>)}</div>
      <div className="mt-4 flex items-center gap-3"><button type="button" disabled={!!busy} onClick={() => save()} className="w-btn">{busy === "save" ? "Saving…" : "Save integrations"}</button>{msg.save && <span className={`text-sm ${msg.save === "Saved" ? "text-teal-700" : "text-rose-600"}`}>{msg.save}</span>}</div>
    </div>
  </div>;
}
