"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AudienceRule } from "@/lib/store";
const FIELDS: [AudienceRule["field"], string][] = [["signal", "Signal"], ["path", "Visited page path"], ["referrer", "Referrer"], ["pageviews", "Pageviews"], ["visitorType", "Visitor type"]];
const blank = (): AudienceRule => ({ field: "signal", op: "contains", value: "" });
export function AudienceForm({ canEdit }: { canEdit: boolean }) {
  const [name, setName] = useState(""); const [match, setMatch] = useState<"all" | "any">("all"); const [rules, setRules] = useState<AudienceRule[]>([blank()]); const [err, setErr] = useState(""); const r = useRouter();
  const set = (i: number, p: Partial<AudienceRule>) => setRules(rules.map((x, j) => j === i ? { ...x, ...p, ...(p.field === "pageviews" ? { op: "gte" as const } : p.field ? { op: "contains" as const } : {}) } : x));
  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const res = await fetch("/api/audiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, match, rules }) });
    if (!res.ok) return setErr((await res.json()).error); setName(""); setRules([blank()]); r.refresh();
  }
  if (!canEdit) return null;
  return <form onSubmit={save} className="w-card space-y-4 p-5">
    <div className="flex flex-wrap items-end gap-3"><div className="min-w-[14rem] flex-1"><label className="w-label">Audience name</label><input className="w-input" placeholder="e.g. Pricing-curious" value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div><label className="w-label">Match</label><select className="w-input w-auto" value={match} onChange={(e) => setMatch(e.target.value as "all" | "any")}><option value="all">All rules</option><option value="any">Any rule</option></select></div></div>
    <div className="space-y-2">{rules.map((x, i) => <div key={i} className="flex flex-wrap items-center gap-2">
      <select className="w-input w-auto" value={x.field} onChange={(e) => set(i, { field: e.target.value as AudienceRule["field"] })}>{FIELDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      <select className="w-input w-auto" value={x.op} onChange={(e) => set(i, { op: e.target.value as AudienceRule["op"] })}>{x.field === "pageviews" ? <><option value="gte">at least</option><option value="equals">exactly</option></> : <><option value="contains">contains</option><option value="equals">equals</option></>}</select>
      <input className="w-input max-w-[14rem]" placeholder={x.field === "pageviews" ? "3" : x.field === "path" ? "/pricing" : x.field === "signal" ? "pricing" : ""} value={x.value} onChange={(e) => set(i, { value: e.target.value })} />
      {rules.length > 1 && <button type="button" onClick={() => setRules(rules.filter((_, j) => j !== i))} className="text-xs text-warm-400 hover:text-rose-600">Remove</button>}
    </div>)}
      <button type="button" onClick={() => setRules([...rules, blank()])} className="text-xs font-medium text-navy-700 hover:underline">+ Add rule</button></div>
    <div className="flex items-center gap-3"><button className="w-btn">Create audience</button>{err && <span className="text-sm text-rose-600">{err}</span>}</div>
  </form>;
}
