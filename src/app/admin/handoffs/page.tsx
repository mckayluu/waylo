import Link from "next/link";
import { listHandoffs, getConversation } from "@/lib/store";
import { PageHeader, Card, Empty, Badge, ago, initials } from "../ui";
import { ResolveButton } from "./ResolveButton";
export const dynamic = "force-dynamic";
export default async function Handoffs({ searchParams }: { searchParams: { status?: string } }) {
  const all = (await listHandoffs()); const st = searchParams.status === "resolved" ? "resolved" : searchParams.status === "all" ? "all" : "open";
  const rows = st === "all" ? all : all.filter((h) => h.status === st);
  return (<>
    <PageHeader title="Handoffs" sub="Visitors who asked to talk to a person." />
    <div className="mb-4 flex w-fit gap-1 rounded-lg border border-stone-200 bg-white p-1 text-sm shadow-sm">
      {(["open", "resolved", "all"] as const).map((x) => <Link key={x} href={`?status=${x}`} className={`rounded-md px-3 py-1.5 font-medium capitalize ${st === x ? "bg-teal-700 text-white" : "text-stone-600 hover:bg-stone-100"}`}>{x} <span className="ml-1 text-xs opacity-70">{x === "all" ? all.length : all.filter((h) => h.status === x).length}</span></Link>)}
    </div>
    <Card pad={false}>{rows.length === 0 ? <Empty title={st === "open" ? "No open handoffs" : "Nothing here"} body="When a visitor taps “Talk to a person” in the sidebar, the request lands here and in Slack (if connected)." tip="Connect Slack under Integrations to get pinged instantly." secondaryHref="/admin/integrations" secondaryCta="Integrations" /> :
      <ul className="divide-y divide-stone-100">{rows.map(async (h) => { const c = h.conversationId ? (await getConversation(h.conversationId)) : undefined; const who = h.name || h.email || c?.visitorName || c?.visitorEmail || "Anonymous visitor";
        const last = c?.messages.filter((m) => m.role === "visitor").at(-1)?.text;
        return <li key={h.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">{who.startsWith("Anonymous") ? "?" : initials(who)}</span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-stone-800">{who} {h.email && h.email !== who && <span className="font-normal text-stone-500">· {h.email}</span>} <span className="ml-1"><Badge tone={h.status === "open" ? "amber" : "stone"}>{h.status}</Badge></span></p>
            {(h.note || last) && <p className="mt-0.5 truncate text-sm text-stone-600">{h.note ? `“${h.note}”` : `Last question: ${last}`}</p>}
            <p className="mt-0.5 text-xs text-stone-500">Requested {ago(h.createdAt)}{h.resolvedAt && ` · resolved ${ago(h.resolvedAt)}`}
              {c && <> · <Link href={`/admin/c/${c.id}`} className="font-medium text-teal-700 hover:underline">Conversation</Link></>}
              {h.visitorId && <> · <Link href={`/admin/tracking/${h.visitorId}`} className="font-medium text-teal-700 hover:underline">Journey</Link></>}
              {h.email && <> · <a href={`mailto:${h.email}`} className="font-medium text-teal-700 hover:underline">Email</a></>}</p>
          </div>
          <ResolveButton id={h.id} status={h.status} />
        </li>; })}</ul>}
    </Card>
  </>);
}
