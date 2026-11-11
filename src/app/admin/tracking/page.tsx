import Link from "next/link";
import { listConversations, listLeads, listVisitors } from "@/lib/store";
import { tier } from "@/lib/analytics";
import { PageHeader, Card, Empty, Badge, ago, initials } from "../ui";
import { Tag } from "../Tag";
export const dynamic = "force-dynamic";
type Row = { key: string; href: string; who: string; sub: string; entry: string; value: "High" | "Medium" | "Low"; signals: string[]; at: string; n: number; pv: number; lastPath?: string };
const rank = { High: 3, Medium: 2, Low: 1 };
export default async function Tracking({ searchParams }: { searchParams: { tier?: string } }) {
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
        entry: [cs.length && "AI Chat", lead && "Contact"].filter(Boolean).join(" + ") || "Browsing", value, signals, at: v.lastSeen, n: cs.reduce((n, x) => n + x.messages.filter((m) => m.role === "visitor").length, 0), pv: real.length, lastPath: real.at(-1)?.path };
    }),
    ...convs.filter((c) => !c.visitorId).map((c) => ({ key: c.id, href: `/admin/c/${c.id}`, who: c.visitorName || c.visitorEmail || "Anonymous visitor", sub: c.visitorEmail && c.visitorName ? c.visitorEmail : c.visitorType || "", entry: leadByConv.has(c.id) ? "AI Chat + Contact" : "AI Chat", value: tier(c), signals: c.signals, at: c.updatedAt, n: c.messages.filter((m) => m.role === "visitor").length, pv: 0 })),
    ...leads.filter((l) => !l.conversationId).map((l) => ({ key: l.id, href: "/admin/leads", who: l.name, sub: l.email, entry: "Contact", value: (l.intent === "demo" ? "High" : "Medium") as Row["value"], signals: l.intent === "demo" ? ["demo"] : [], at: l.createdAt, n: 0, pv: 0 })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  const t = searchParams.tier; const shown = t ? rows.filter((r) => r.value === t) : rows;
  const totalPv = visitors.reduce((n, v) => n + v.pageviews.filter((p) => p.path !== "(chat)").length, 0);
  return (<>
    <PageHeader title="Tracking" sub={`${visitors.length} tracked visitors · ${totalPv} pageviews. Ranked by buying signals.`} actions={<Link href="/admin/leads" className="w-btn-ghost">Contact form leads</Link>} />
    <div className="w-accent-line mb-3" />
    <div className="mb-3 flex w-fit gap-1 rounded-lg border border-stone-200 bg-white p-1 text-sm shadow-sm">
      {["", "High", "Medium", "Low"].map((x) => <Link key={x} href={x ? `?tier=${x}` : "/admin/tracking"} className={`rounded-md px-2.5 py-1 font-medium ${(t || "") === x ? (x === "High" ? "bg-amber-600 text-white" : "bg-teal-700 text-white") : "text-stone-600 hover:bg-stone-100"}`}>{x || "All"} <span className="ml-1 text-xs opacity-70">{x ? rows.filter((r) => r.value === x).length : rows.length}</span></Link>)}
    </div>
    <Card pad={false}>{shown.length === 0 ? (t && rows.length ? <Empty title={`No ${t} value visitors`} body="Nobody in this tier yet." href="/admin/tracking" cta="Show all" /> : <Empty title="No visitors yet" body="Add waylo.js to your site (or browse /demo) — visitors appear here as soon as they load a page." href="/admin/install" cta="Install snippet" secondaryHref="/demo" secondaryCta="Open demo" />) :
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="border-b border-stone-100 bg-stone-50/60"><tr><th className="w-th">Visitor</th><th className="w-th">Value</th><th className="w-th">Entry</th><th className="w-th">Last page</th><th className="w-th">Signals</th><th className="w-th text-right">Pages</th><th className="w-th text-right">Questions</th><th className="w-th text-right">Last seen</th></tr></thead>
        <tbody className="divide-y divide-stone-100">{shown.map((r) => <tr key={r.key} className={`group hover:bg-stone-50 ${r.value === "High" ? "border-l-2 border-l-amber-500" : ""}`}>
          <td className="px-4 py-2"><Link href={r.href} className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-stone-100 text-[11px] font-semibold text-stone-600 group-hover:bg-teal-100 group-hover:text-teal-800">{/^(Anonymous|Visitor )/.test(r.who) ? "—" : initials(r.who)}</span><span className="min-w-0"><span className="block truncate font-medium text-stone-800">{r.who}</span><span className="block truncate text-xs text-stone-500">{r.sub}</span></span></Link></td>
          <td className="px-4 py-2"><Badge tone={r.value === "High" ? "amber" : r.value === "Medium" ? "teal" : "stone"}>{r.value}</Badge></td>
          <td className="whitespace-nowrap px-4 py-2 text-stone-600">{r.entry}</td>
          <td className="max-w-[10rem] truncate px-4 py-2 font-mono text-xs text-stone-500">{r.lastPath || "—"}</td>
          <td className="px-4 py-2"><div className="flex flex-wrap gap-1">{r.signals.slice(0, 3).map((s) => <Tag key={s} s={s} />)}{!r.signals.length && <span className="text-xs text-stone-400">—</span>}</div></td>
          <td className="px-4 py-2 text-right tabular-nums text-stone-500">{r.pv || "—"}</td>
          <td className="px-4 py-2 text-right tabular-nums text-stone-500">{r.n}</td>
          <td className="whitespace-nowrap px-4 py-2 text-right text-xs text-stone-500">{ago(r.at)}</td></tr>)}</tbody></table></div>}
    </Card>
  </>);
}
