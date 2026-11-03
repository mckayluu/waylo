import type { Conversation, Lead } from "./store";
export const dayKey = (d: Date) => d.toISOString().slice(0, 10);
export function daily(convs: Conversation[], leads: Lead[], days = 14) {
  const out: { day: string; questions: number; conversations: number; leads: number }[] = [];
  for (let i = days - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); out.push({ day: dayKey(d), questions: 0, conversations: 0, leads: 0 }); }
  const idx = new Map(out.map((o, i) => [o.day, i]));
  for (const c of convs) { const i = idx.get(c.createdAt.slice(0, 10)); if (i !== undefined) out[i].conversations++;
    for (const m of c.messages) if (m.role === "visitor") { const j = idx.get(m.at.slice(0, 10)); if (j !== undefined) out[j].questions++; } }
  for (const l of leads) { const i = idx.get(l.createdAt.slice(0, 10)); if (i !== undefined) out[i].leads++; }
  return out;
}
export function tier(c: Conversation): "High" | "Medium" | "Low" {
  if (c.signals.includes("high-intent") || c.signals.includes("ready-to-buy")) return "High";
  if (c.signals.some((s) => ["pricing", "demo", "enterprise", "integration"].includes(s))) return "Medium";
  return "Low";
}
