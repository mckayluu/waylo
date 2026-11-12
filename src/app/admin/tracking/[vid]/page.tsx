import Link from "next/link";
import { notFound } from "next/navigation";
import { getVisitor, listConversations, listLeads } from "@/lib/store";
import { PageHeader, Card, Badge, ago } from "../../ui";
import { Tag } from "../../Tag";
import { Journey } from "../../_parts/Journey";
import { visitorChannel, engagement } from "@/lib/visitstats";
import { fmtDur } from "@/lib/channels";
export const dynamic = "force-dynamic";
export default async function VisitorPage({ params }: { params: { vid: string } }) {
  const v = (await getVisitor(params.vid)); if (!v) notFound();
  const convs = (await listConversations()).filter((c) => c.visitorId === v.id);
  const leads = (await listLeads()).filter((l) => convs.some((c) => c.id === l.conversationId));
  const pv = v.pageviews.filter((p) => p.path !== "(chat)");
  const paths = new Map<string, number>(); pv.forEach((p) => paths.set(p.path, (paths.get(p.path) || 0) + 1));
  const who = leads[0]?.name || convs.find((c) => c.visitorName)?.visitorName || convs.find((c) => c.visitorEmail)?.visitorEmail || `Visitor ${v.id.slice(2, 8)}`;
  const signals = [...new Set(convs.flatMap((c) => c.signals))];
  const ch = visitorChannel(v.pageviews); const eg = engagement(v.pageviews);
  return (<>
    <Link href="/admin/tracking" className="text-sm text-warm-500 hover:text-navy-700">← Tracking</Link>
    <div className="mt-2"><PageHeader title={who} sub={`First seen ${new Date(v.firstSeen).toLocaleString()} · last seen ${ago(v.lastSeen)}`} actions={leads[0] && <Badge tone="navy">Lead · {leads[0].email}</Badge>} /></div>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2"><Card title={`Journey · ${pv.length} pageviews`}><Journey pageviews={v.pageviews} convs={convs} /></Card></div>
      <aside className="space-y-4">
        <Card title="Summary"><dl className="space-y-2 text-sm">
          {[["Pageviews", pv.length], ["Unique pages", paths.size], ["Conversations", convs.length], ["Questions", convs.reduce((n, c) => n + c.messages.filter((m) => m.role === "visitor").length, 0)], ["Entry page", pv[0]?.path || "—"], ["Channel", `${ch.channel}${ch.source ? ` · ${ch.source}` : ""}`], ...(ch.campaign ? [["Campaign", ch.campaign]] : []), ["Referrer", pv.find((p) => p.referrer)?.referrer || "None"], ["Time on site", eg.measured ? fmtDur(eg.durationMs) || "0s" : "—"], ["Avg scroll", eg.avgScroll != null ? `${eg.avgScroll}%` : "—"], ["Key clicks", eg.clicks.length]].map(([k, val]) =>
            <div key={k as string} className="flex justify-between gap-4"><dt className="text-warm-500">{k}</dt><dd className="truncate text-right font-medium tabular-nums text-warm-800">{val}</dd></div>)}
        </dl>{signals.length > 0 && <div className="mt-4 flex flex-wrap gap-1">{signals.map((s) => <Tag key={s} s={s} />)}</div>}</Card>
        <Card title="Top pages"><ul className="space-y-1.5 text-sm">{[...paths].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([p, n]) => <li key={p} className="flex justify-between gap-3"><span className="truncate font-mono text-xs text-warm-700">{p}</span><span className="tabular-nums text-warm-500">{n}</span></li>)}{!paths.size && <li className="text-warm-500">—</li>}</ul></Card>
        <Card title="Conversations">{convs.length ? <ul className="space-y-2 text-sm">{convs.map((c) => <li key={c.id}><Link href={`/admin/c/${c.id}`} className="block rounded-lg border border-warm-200 p-3 hover:border-navy-300"><p className="truncate text-warm-800">{c.messages.find((m) => m.role === "visitor")?.text}</p><p className="mt-0.5 text-xs text-warm-500">{c.messages.length} messages · {ago(c.updatedAt)}</p></Link></li>)}</ul> : <p className="text-sm text-warm-500">Hasn&apos;t chatted yet.</p>}</Card>
      </aside>
    </div>
  </>);
}
