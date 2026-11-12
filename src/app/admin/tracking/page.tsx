import Link from "next/link";
import { listConversations, listLeads, listVisitors, currentWs } from "@/lib/store";
import { FirstDay } from "../_parts/FirstDay";
import { visitorChannel, engagement } from "@/lib/visitstats";
import { CHANNELS, fmtDur } from "@/lib/channels";
import { tier } from "@/lib/analytics";
import { PageHeader, Card, Empty, Badge, ago, initials } from "../ui";
import { Tag } from "../Tag";
export const dynamic = "force-dynamic";
type Row = { key: string; href: string; who: string; sub: string; entry: string; value: "High" | "Medium" | "Low"; signals: string[]; at: string; n: number; pv: number; lastPath?: string; ch?: string; chName?: string; dur?: number };
const rank = { High: 3, Medium: 2, Low: 1 };
export default async function Tracking({ searchParams }: { searchParams: { tier?: string } }) {
  const ws = await currentWs();
  const leads = (await listLeads()).filter((l) => l.intent !== "support"); const convs = (await listConversations()); const visitors = (await listVisitors());
  const leadByConv = new Map(leads.filter((l) => l.conversationId).map((l) => [l.conversationId!, l]));
  const convsByVid = new Map<string, typeof convs>(); convs.forEach((c) => c.visitorId && convsByVid.set(c.visitorId, [...(convsByVid.get(c.visitorId) || []), c]));
  const pricingSeen = (paths: string[]) => paths.some((p) => /pric|demo|contact/i.test(p));
  const rows: Row[] = [
    ...visitors.map((v) => { const cs = convsByVid.get(v.id) || []; const c = cs[0]; const lead = cs.map((x) => leadByConv.get(x.id)).find(Boolean);
      const signals = [...new Set(cs.flatMap((x) => x.signals))]; const real = v.pageviews.filter((p) => p.path !== "(chat)");
      let value: Row["value"] = cs.length ? cs.map(tier).sort((a, b) => rank[b] - rank[a])[0] : "Low";
      if (value === "Low" && (pricingSeen(real.map((p) => p.path)) || real.length >= 5)) value = "Medium";
      const who = lead?.name || c?.visitorName || c?.visitorEmail || `Visitor ${v.id.slice(2, 8)}`;
      return { key: v.id, href: `/admin/tracking/${v.id}`, who, sub: lead?.email || c?.visitorEmail || `${real.length} page${real.length === 1 ? "" : "s"} · first seen ${ago(v.firstSeen)}`,
        entry: [cs.length && "AI Chat", lead && "Contact"].filter(Boolean).join(" + ") || "Browsing", value, signals, at: v.lastSeen, n: cs.reduce((n, x) => n + x.messages.filter((m) => m.role === "visitor").length, 0), pv: real.length, lastPath: real.at(-1)?.path, ch: (() => { const c = visitorChannel(v.pageviews); return c.source ? `${c.channel} · ${c.source}` : c.channel; })(), chName: visitorChannel(v.pageviews).channel, dur: engagement(v.pageviews).durationMs };
    }),
    ...convs.filter((c) => !c.visitorId).map((c) => ({ key: c.id, href: `/admin/c/${c.id}`, who: c.visitorName || c.visitorEmail || "Anonymous visitor", sub: c.visitorEmail && c.visitorName ? c.visitorEmail : c.visitorType || "", entry: leadByConv.has(c.id) ? "AI Chat + Contact" : "AI Chat", value: tier(c), signals: c.signals, at: c.updatedAt, n: c.messages.filter((m) => m.role === "visitor").length, pv: 0 })),
    ...leads.filter((l) => !l.conversationId).map((l) => ({ key: l.id, href: "/admin/leads", who: l.name, sub: l.email, entry: "Contact", value: (l.intent === "demo" ? "High" : "Medium") as Row["value"], signals: l.intent === "demo" ? ["demo"] : [], at: l.createdAt, n: 0, pv: 0 })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  const t = searchParams.tier; const shown = t ? rows.filter((r) => r.value === t) : rows;
  const totalPv = visitors.reduce((n, v) => n + v.pageviews.filter((p) => p.path !== "(chat)").length, 0);
  return (<>
    <PageHeader title="Tracking" sub={`${visitors.length} tracked visitors · ${totalPv} pageviews. Ranked by buying signals.`} actions={<Link href="/admin/leads" className="w-btn-ghost">Contact form leads</Link>} />
    <div className="w-accent-line mb-3" />
    <div className="mb-3 flex w-fit gap-1 rounded-lg border border-warm-200 bg-card p-1 text-sm shadow-sm">
      {["", "High", "Medium", "Low"].map((x) => <Link key={x} href={x ? `?tier=${x}` : "/admin/tracking"} className={`rounded-md px-2.5 py-1 font-medium ${(t || "") === x ? (x === "High" ? "bg-rasp-600 text-white" : "bg-navy-700 text-white") : "text-warm-600 hover:bg-warm-100"}`}>{x || "All"} <span className="ml-1 text-xs opacity-70">{x ? rows.filter((r) => r.value === x).length : rows.length}</span></Link>)}
    </div>
    {visitors.length > 0 && (() => { const by = new Map<string, number>(); visitors.forEach((v) => { const c = visitorChannel(v.pageviews).channel; by.set(c, (by.get(c) || 0) + 1); }); const max = Math.max(...by.values());
      const eg = visitors.map((v) => engagement(v.pageviews)); const meas = eg.filter((e) => e.measured); const sc = eg.filter((e) => e.avgScroll != null);
      return <div className="mb-3 grid gap-3 lg:grid-cols-3"><div className="lg:col-span-2"><Card title="Visitors by channel">{CHANNELS.filter((c) => by.get(c)).map((c) => <div key={c} className="mb-2 flex items-center gap-3 text-sm last:mb-0"><span className="w-28 shrink-0 text-warm-600">{c}</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-warm-100"><div className="h-full bg-navy-500" style={{ width: `${((by.get(c) || 0) / max) * 100}%` }} /></div><span className="w-8 text-right tabular-nums text-warm-500">{by.get(c)}</span></div>)}</Card></div>
        <Card title="Engagement"><dl className="space-y-2 text-sm"><div className="flex justify-between"><dt className="text-warm-500">Avg time on site</dt><dd className="font-medium tabular-nums">{meas.length ? fmtDur(meas.reduce((n, e) => n + e.durationMs, 0) / meas.length) || "0s" : "—"}</dd></div><div className="flex justify-between"><dt className="text-warm-500">Avg scroll depth</dt><dd className="font-medium tabular-nums">{sc.length ? `${Math.round(sc.reduce((n, e) => n + (e.avgScroll || 0), 0) / sc.length)}%` : "—"}</dd></div><div className="flex justify-between"><dt className="text-warm-500">Key clicks</dt><dd className="font-medium tabular-nums">{eg.reduce((n, e) => n + e.clicks.length, 0)}</dd></div></dl><p className="mt-2 text-[11px] text-warm-400">Measured by waylo.js: visible time, deepest scroll, and clicks on CTAs, buttons, mailto/tel and data-waylo-track elements. No cookies; visitor id lives in localStorage.</p></Card></div>; })()}
    <Card pad={false}>{shown.length === 0 ? (t && rows.length ? <Empty title={`No ${t} value visitors`} body="Nobody in this tier yet." href="/admin/tracking" cta="Show all" /> : <FirstDay ws={ws} title="No visitors yet" body="Visitors and their page journeys appear here as soon as the snippet loads on your site: pages viewed, where they came from, and what they asked." steps={["install", "chat"]}
        example={<div className="space-y-1.5 text-left text-sm">{[["Visitor from Google · 4 pages · 6m", "/ → /pricing → /integrations → /pricing", "High"], ["Visitor from LinkedIn · 2 pages · 1m", "/blog/onboarding → /", "Low"]].map(([a, b, c]) => <div key={a} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 ring-1 ring-warm-200"><div><p className="font-medium">{a}</p><p className="font-mono text-xs text-warm-500">{b}</p></div><span className="text-xs text-warm-500">{c} value</span></div>)}</div>} />) :
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="border-b border-warm-100 bg-warm-50/60"><tr><th className="w-th">Visitor</th><th className="w-th">Value</th><th className="w-th">Entry</th><th className="w-th">Source</th><th className="w-th">Last page</th><th className="w-th">Signals</th><th className="w-th text-right">Pages</th><th className="w-th text-right">Questions</th><th className="w-th text-right">Last seen</th></tr></thead>
        <tbody className="divide-y divide-warm-100">{shown.map((r) => <tr key={r.key} className={`group hover:bg-warm-50 ${r.value === "High" ? "border-l-2 border-l-rasp-600" : ""}`}>
          <td className="px-4 py-2"><Link href={r.href} className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-warm-100 text-[11px] font-semibold text-warm-600 group-hover:bg-navy-100 group-hover:text-navy-800">{/^(Anonymous|Visitor )/.test(r.who) ? "—" : initials(r.who)}</span><span className="min-w-0"><span className="block truncate font-medium text-warm-800">{r.who}</span><span className="block truncate text-xs text-warm-500">{r.sub}</span></span></Link></td>
          <td className="px-4 py-2"><Badge tone={r.value === "High" ? "rasp" : r.value === "Medium" ? "navy" : "neutral"}>{r.value}</Badge></td>
          <td className="whitespace-nowrap px-4 py-2 text-warm-600">{r.entry}</td>
          <td className="max-w-[11rem] truncate whitespace-nowrap px-4 py-2 text-xs text-warm-600" title={r.ch}>{r.ch || "—"}{r.dur ? <span className="block text-[11px] text-warm-400">{fmtDur(r.dur)} on site</span> : null}</td>
          <td className="max-w-[10rem] truncate px-4 py-2 font-mono text-xs text-warm-500">{r.lastPath || "—"}</td>
          <td className="px-4 py-2"><div className="flex flex-wrap gap-1">{r.signals.slice(0, 3).map((s) => <Tag key={s} s={s} />)}{!r.signals.length && <span className="text-xs text-warm-400">—</span>}</div></td>
          <td className="px-4 py-2 text-right tabular-nums text-warm-500">{r.pv || "—"}</td>
          <td className="px-4 py-2 text-right tabular-nums text-warm-500">{r.n}</td>
          <td className="whitespace-nowrap px-4 py-2 text-right text-xs text-warm-500">{ago(r.at)}</td></tr>)}</tbody></table></div>}
    </Card>
  </>);
}
