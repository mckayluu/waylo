import type { Audience, AudienceRule, Conversation, Visitor } from "./store";
export type Profile = { key: string; label: string; signals: string[]; paths: string[]; referrers: string[]; pageviews: number; visitorType?: string };
export function profiles(visitors: Visitor[], convs: Conversation[]): Profile[] {
  const byVid = new Map<string, Conversation[]>(); convs.forEach((c) => c.visitorId && byVid.set(c.visitorId, [...(byVid.get(c.visitorId) || []), c]));
  const pv = visitors.map((v) => { const cs = byVid.get(v.id) || []; const real = v.pageviews.filter((p) => p.path !== "(chat)");
    return { key: v.id, label: cs.find((c) => c.visitorName)?.visitorName || cs.find((c) => c.visitorEmail)?.visitorEmail || `Visitor ${v.id.slice(2, 8)}`, signals: [...new Set(cs.flatMap((c) => c.signals))], paths: real.map((p) => p.path), referrers: real.map((p) => p.referrer || "").filter(Boolean), pageviews: real.length, visitorType: cs[0]?.visitorType }; });
  const orphan = convs.filter((c) => !c.visitorId).map((c) => ({ key: c.id, label: c.visitorName || c.visitorEmail || "Anonymous visitor", signals: c.signals, paths: [], referrers: [], pageviews: 0, visitorType: c.visitorType }));
  return [...pv, ...orphan];
}
function test(r: AudienceRule, p: Profile) {
  const v = r.value.toLowerCase();
  const list = r.field === "signal" ? p.signals : r.field === "path" ? p.paths : r.field === "referrer" ? p.referrers : r.field === "visitorType" ? [p.visitorType || ""] : [];
  if (r.field === "pageviews") return r.op === "equals" ? p.pageviews === Number(r.value) : p.pageviews >= Number(r.value);
  return list.some((x) => (r.op === "equals" ? x.toLowerCase() === v : x.toLowerCase().includes(v)));
}
export const matches = (a: Audience, p: Profile) => (a.match === "all" ? a.rules.every((r) => test(r, p)) : a.rules.some((r) => test(r, p)));
