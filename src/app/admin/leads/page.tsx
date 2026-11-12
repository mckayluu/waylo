import Link from "next/link";
import { listLeads, currentWs } from "@/lib/store";
import { FirstDay } from "../_parts/FirstDay";
import { PageHeader, Card, Empty, Badge, ago, initials } from "../ui";
export const dynamic = "force-dynamic";
export default async function Leads() {
  const all = (await listLeads()); const ws = await currentWs();
  const support = all.filter((l) => l.intent === "support").length; const leads = all.filter((l) => l.intent !== "support").concat(all.filter((l) => l.intent === "support")); const demos = all.filter((l) => l.intent === "demo").length;
  return (<>
    <PageHeader title="Leads" sub={`${all.length - support} sales leads · ${demos} demo requests${support ? ` · ${support} support` : ""} · from the widget's Contact tab`} actions={<a href="/api/leads" className="w-btn-ghost">Export JSON</a>} />
    {leads.length > 0 && <div className="mb-4 flex flex-wrap gap-2 text-sm">{[["Sales leads", all.length - support], ["Demo requests", demos], ["Messages", all.length - support - demos], ...(support ? [["Support", support]] : [])].map(([k, v]) => <span key={k} className="rounded-lg border border-warm-200 bg-card px-3 py-1.5 shadow-sm"><span className="text-warm-500">{k}</span> <span className="ml-1 font-semibold tabular-nums text-warm-800">{v}</span></span>)}</div>}
    <Card pad={false}>
      {leads.length === 0 ? <FirstDay ws={ws} title="No leads yet" body="When a visitor leaves their details in your widget's Contact tab (or the AI is paused and they leave a message), they land here with the conversation attached." steps={["install", "contact"]}
        example={<table className="w-full text-left text-sm"><tbody><tr><td className="py-1.5 pr-4"><p className="font-medium text-warm-800">Jordan Lee</p><p className="text-xs text-warm-500">jordan@example.com</p></td><td className="pr-4"><Badge tone="rasp">Demo request</Badge></td><td className="text-warm-600">“We have 12 techs. Does Pro include QuickBooks sync?”</td><td className="text-right text-xs text-warm-500">2m ago</td></tr></tbody></table>} /> :
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="border-b border-warm-100 bg-warm-50/60"><tr><th className="w-th">Contact</th><th className="w-th">Type</th><th className="w-th">Message</th><th className="w-th text-right">Received</th></tr></thead>
        <tbody className="divide-y divide-warm-100">{leads.map((l) => <tr key={l.id} className="align-top hover:bg-warm-50">
          <td className="px-4 py-2.5"><div className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-100 text-[11px] font-semibold text-navy-800">{initials(l.name)}</span><div><p className="font-medium text-warm-800">{l.name}</p><a href={`mailto:${l.email}`} className="text-xs text-warm-500 hover:text-navy-700">{l.email}</a></div></div></td>
          <td className="px-4 py-2.5"><Badge tone={l.intent === "demo" ? "rasp" : l.intent === "support" ? "info" : "neutral"}>{l.intent === "demo" ? "Demo request" : l.intent === "support" ? "Support" : "Message"}</Badge></td>
          <td className="max-w-md px-4 py-2.5"><p className="line-clamp-2 text-warm-600">{l.message}</p>{l.conversationId && <Link href={`/admin/c/${l.conversationId}`} className="mt-1 inline-block text-xs font-medium text-navy-700 hover:underline">View conversation →</Link>}</td>
          <td className="whitespace-nowrap px-4 py-2.5 text-right text-xs text-warm-500">{ago(l.createdAt)}</td>
        </tr>)}</tbody></table></div>}
    </Card>
  </>);
}
