import Link from "next/link";
import { listConversations, stats, listLeads, getSettings, listPages } from "@/lib/store";
import { KNOWLEDGE } from "@/lib/knowledge";
import { daily, tier } from "@/lib/analytics";
import { PageHeader, MetricCard, Card, Badge } from "./ui";
export const dynamic = "force-dynamic";
export default async function Home() {
  const s = (await stats()); const convs = (await listConversations()); const leads = (await listLeads()); const st = (await getSettings());
  const questions = convs.reduce((n, c) => n + c.messages.filter((m) => m.role === "visitor").length, 0);
  const d = daily(convs, leads); const max = Math.max(1, ...d.map((x) => x.questions));
  const tiers = { High: 0, Medium: 0, Low: 0 }; convs.forEach((c) => tiers[tier(c)]++);
  const topics = new Map<string, number>(); convs.forEach((c) => c.themes.forEach((t) => topics.set(t, (topics.get(t) || 0) + 1)));
  const top = [...topics].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return (<>
    <PageHeader title="Home" sub={`How Waylo is performing on ${st.siteName}.`} actions={<Link href="/admin/ai-chat" className="w-btn-ghost">AI Chat setup</Link>} />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard label="Conversations" value={s.totalConversations} hint="All time" />
      <MetricCard label="Questions" value={questions} hint="Visitor messages" tone="teal" />
      <MetricCard label="Contact forms" value={leads.length} hint={`${leads.filter((l) => l.intent === "demo").length} demo requests`} tone="teal" />
      <MetricCard label="High intent" value={s.highIntent} hint="Ready for follow-up" tone="amber" />
      <MetricCard label="Messages today" value={s.messagesToday} hint="Visitor + Waylo" />
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2"><Card title="Questions · last 14 days" actions={<span className="text-xs text-stone-500">{d.reduce((n, x) => n + x.questions, 0)} total · {d.reduce((n, x) => n + x.leads, 0)} leads</span>}>
        <div className="flex h-44 items-end gap-1.5">{d.map((x) => (
          <div key={x.day} className="group relative flex h-full flex-1 flex-col justify-end" title={`${x.day}: ${x.questions} questions, ${x.leads} leads`}>
            <div className="rounded-t bg-teal-600/85 transition group-hover:bg-teal-700" style={{ height: `${(x.questions / max) * 100}%`, minHeight: x.questions ? 4 : 2, opacity: x.questions ? 1 : 0.15 }} />
            {x.leads > 0 && <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-500" />}
          </div>))}</div>
        <div className="mt-2 flex justify-between text-[10px] text-stone-400"><span>{d[0].day.slice(5)}</span><span>Today</span></div>
      </Card></div>
      <Card title="Site">
        <p className="font-semibold text-stone-900">{st.siteName}</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-stone-500">Status</dt><dd>{st.published ? <Badge tone="teal">Published</Badge> : <Badge tone="amber">Preview only</Badge>}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-500">Indexed pages</dt><dd className="tabular-nums">{(await listPages()).length || `${KNOWLEDGE.length} (sample)`}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-500">Embed</dt><dd className="text-stone-700">Snippet ready</dd></div>
          <div className="flex justify-between"><dt className="text-stone-500">Company profile</dt><dd className="text-stone-700">{st.companyProfile ? "Set" : "—"}</dd></div>
        </dl>
        <div className="mt-4 flex gap-2"><Link href="/admin/content" className="w-btn-ghost flex-1">Content</Link><Link href="/admin/settings" className="w-btn-ghost flex-1">Settings</Link></div>
      </Card>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card title="Visitor value">
        {(["High", "Medium", "Low"] as const).map((t) => { const n = tiers[t]; const pct = convs.length ? (n / convs.length) * 100 : 0;
          return <div key={t} className="mb-3 last:mb-0"><div className="flex justify-between text-sm"><span className="text-stone-700">{t}</span><span className="tabular-nums text-stone-500">{n}</span></div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100"><div className={`h-full ${t === "High" ? "bg-amber-500" : t === "Medium" ? "bg-teal-600" : "bg-stone-400"}`} style={{ width: `${pct}%` }} /></div></div>; })}
        <Link href="/admin/tracking" className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline">View visitors →</Link>
      </Card>
      <Card title="Top topics">
        {top.length === 0 ? <p className="text-sm text-stone-500">Topics show up once visitors start asking questions.</p> :
          <ul className="space-y-2 text-sm">{top.map(([t, n]) => <li key={t} className="flex items-center justify-between"><Link href={`/admin/questions?signal=${t}`} className="text-stone-700 hover:text-teal-700">{t}</Link><span className="tabular-nums text-stone-500">{n}</span></li>)}</ul>}
        <Link href="/admin/questions" className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline">All questions →</Link>
      </Card>
    </div>
  </>);
}
