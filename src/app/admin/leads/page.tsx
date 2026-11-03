import Link from "next/link";
import { listLeads } from "@/lib/store";
import { PageHeader, Card, Empty, Badge, ago, initials } from "../ui";
export const dynamic = "force-dynamic";
export default async function Leads() {
  const leads = (await listLeads()); const demos = leads.filter((l) => l.intent === "demo").length;
  return (<>
    <PageHeader title="Leads" sub={`${leads.length} total · ${demos} demo requests · from the widget's Contact tab`} actions={<a href="/api/leads" className="w-btn-ghost">Export JSON</a>} />
    {leads.length > 0 && <div className="mb-4 flex flex-wrap gap-2 text-sm">{[["Total", leads.length], ["Demo requests", demos], ["Messages", leads.length - demos]].map(([k, v]) => <span key={k} className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 shadow-sm"><span className="text-stone-500">{k}</span> <span className="ml-1 font-semibold tabular-nums text-stone-800">{v}</span></span>)}</div>}
    <Card pad={false}>
      {leads.length === 0 ? <Empty title="No leads yet" body="When a visitor fills in the Contact tab, they land here." href="/demo" cta="Open demo" secondaryHref="/admin/install" secondaryCta="Install on your site" tip="Try submitting the Contact tab on the demo to see a lead appear." /> :
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="border-b border-stone-100 bg-stone-50/60"><tr><th className="w-th">Contact</th><th className="w-th">Type</th><th className="w-th">Message</th><th className="w-th text-right">Received</th></tr></thead>
        <tbody className="divide-y divide-stone-100">{leads.map((l) => <tr key={l.id} className="align-top hover:bg-stone-50">
          <td className="px-5 py-3"><div className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-100 text-[11px] font-semibold text-teal-800">{initials(l.name)}</span><div><p className="font-medium text-stone-800">{l.name}</p><a href={`mailto:${l.email}`} className="text-xs text-stone-500 hover:text-teal-700">{l.email}</a></div></div></td>
          <td className="px-5 py-3"><Badge tone={l.intent === "demo" ? "amber" : "stone"}>{l.intent === "demo" ? "Demo request" : "Message"}</Badge></td>
          <td className="max-w-md px-5 py-3"><p className="line-clamp-2 text-stone-600">{l.message}</p>{l.conversationId && <Link href={`/admin/c/${l.conversationId}`} className="mt-1 inline-block text-xs font-medium text-teal-700 hover:underline">View conversation →</Link>}</td>
          <td className="whitespace-nowrap px-5 py-3 text-right text-xs text-stone-500">{ago(l.createdAt)}</td>
        </tr>)}</tbody></table></div>}
    </Card>
  </>);
}
