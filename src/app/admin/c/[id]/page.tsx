import Link from "next/link";
import { notFound } from "next/navigation";
import { getConversation, listLeads, getVisitor } from "@/lib/store";
import { Journey } from "../../_parts/Journey";
import TagEditor from "./TagEditor";
import { Card, Badge, PageHeader, initials } from "../../ui";
export const dynamic = "force-dynamic";
export default async function Detail({ params }: { params: { id: string } }) {
  const c = (await getConversation(params.id)); if (!c) notFound();
  const lead = (await listLeads()).find((l) => l.conversationId === c.id);
  const who = c.visitorName || c.visitorEmail || "Anonymous visitor";
  const fb = c.messages.filter((m) => m.feedback);
  const visitor = c.visitorId ? (await getVisitor(c.visitorId)) : undefined;
  return (<>
    <Link href="/admin" className="text-sm text-stone-500 hover:text-teal-700">← Conversations</Link>
    <div className="mt-2"><PageHeader title={who} sub={`Started ${new Date(c.createdAt).toLocaleString()} · ${c.messages.length} messages`} actions={lead && <Badge tone="teal">Lead · {lead.intent === "demo" ? "demo request" : "message"}</Badge>} /></div>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2"><Card title="Transcript">
        <div className="space-y-4">{c.messages.map((m) => m.role === "visitor" ? (
          <div key={m.id} className="flex justify-end"><div className="max-w-[80%]"><div className="rounded-2xl rounded-br-sm bg-teal-700 px-3.5 py-2 text-sm text-white">{m.text}</div><p className="mt-1 text-right text-[10px] text-stone-400">{new Date(m.at).toLocaleTimeString()}</p></div></div>
        ) : (
          <div key={m.id} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0d1b1e] text-[11px] font-bold text-teal-300">W</span>
            <div className="max-w-[85%]"><div className="whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-700">{m.text}</div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{m.citations?.map((x, i) => <a key={i} href={x.url} target="_blank" className="rounded-md border border-stone-200 bg-white px-1.5 py-0.5 text-[11px] text-stone-600 hover:border-teal-300"><span className="mr-1 font-mono font-semibold text-teal-700">{i + 1}</span>{x.title}</a>)}
                {m.feedback && <Badge tone={m.feedback === "up" ? "teal" : "rose"}>{m.feedback === "up" ? "👍 helpful" : "👎 not helpful"}</Badge>}
                <span className="text-[10px] text-stone-400">{new Date(m.at).toLocaleTimeString()}</span></div></div></div>))}</div>
      </Card></div>
      <aside className="space-y-4">
        <Card title="Visitor">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800">{initials(who)}</span><div><p className="font-medium">{who}</p><p className="text-xs text-stone-500">{c.visitorType}</p></div></div>
          <dl className="mt-4 space-y-2 text-sm">{[["Email", c.visitorEmail], ["Themes", c.themes.join(", ")], ["Feedback", fb.length ? `${fb.filter((m) => m.feedback === "up").length} up · ${fb.filter((m) => m.feedback === "down").length} down` : ""], ["CRM", "Not connected"]].map(([k, v]) =>
            <div key={k} className="flex justify-between gap-4"><dt className="text-stone-500">{k}</dt><dd className="truncate text-right text-stone-800">{v || "—"}</dd></div>)}</dl>
        </Card>
        {lead && <Card title="Contact form"><p className="whitespace-pre-wrap text-sm text-stone-700">{lead.message}</p><p className="mt-2 text-xs text-stone-500">{lead.email}</p></Card>}
        {visitor && <Card title="Journey" actions={<Link href={`/admin/tracking/${visitor.id}`} className="text-xs font-medium text-teal-700 hover:underline">Visitor →</Link>}><Journey pageviews={visitor.pageviews.slice(-15)} /></Card>}
        <TagEditor id={c.id} initial={c.signals} />
      </aside>
    </div>
  </>);
}
