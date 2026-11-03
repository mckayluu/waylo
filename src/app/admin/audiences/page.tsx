import Link from "next/link";
import { listAudiences, listVisitors, listConversations } from "@/lib/store";
import { profiles, matches } from "@/lib/audiences";
import { currentSession } from "@/lib/auth";
import { rank } from "@/lib/session";
import { PageHeader, Card, Empty, Badge } from "../ui";
import { AudienceForm } from "./AudienceForm";
import { DeleteAudience } from "./DeleteAudience";
export const dynamic = "force-dynamic";
const label = { signal: "signal", path: "page path", referrer: "referrer", pageviews: "pageviews", visitorType: "visitor type" };
const op = { contains: "contains", equals: "is", gte: "≥" };
export default async function Audiences() {
  const s = await currentSession(); const auds = (await listAudiences()); const ps = profiles((await listVisitors()), (await listConversations()));
  return (<>
    <PageHeader title="Audiences" sub="Segment visitors by what they do. Coming next: target the sidebar (greeting, prompts) per audience." />
    <div className="space-y-6">
      <AudienceForm canEdit={!!s && rank[s.role] >= rank.Editor} />
      <Card title={`Audiences · ${auds.length}`} pad={false}>{auds.length === 0 ? <Empty title="No audiences yet" body="Try “Signal contains pricing” or “Visited page path contains /pricing”." /> :
        <ul className="divide-y divide-stone-100">{auds.map((a) => { const hit = ps.filter((p) => matches(a, p));
          return <li key={a.id} className="flex flex-wrap items-start gap-4 px-5 py-4">
            <div className="min-w-0 flex-1"><p className="font-medium text-stone-900">{a.name} <span className="ml-1"><Badge tone="stone">match {a.match}</Badge></span> <span className="ml-1"><Badge tone="amber">Targeting · soon</Badge></span></p>
              <p className="mt-1 flex flex-wrap gap-1.5 text-xs">{a.rules.map((r, i) => <span key={i} className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-stone-600">{label[r.field]} {op[r.op]} “{r.value}”</span>)}</p>
              {hit.length > 0 && <p className="mt-2 truncate text-xs text-stone-500">{hit.slice(0, 5).map((p, i) => <span key={p.key}>{i > 0 && ", "}<Link href={p.key.startsWith("v_") ? `/admin/tracking/${p.key}` : `/admin/c/${p.key}`} className="hover:text-teal-700">{p.label}</Link></span>)}{hit.length > 5 && ` +${hit.length - 5}`}</p>}</div>
            <div className="text-right"><p className="text-2xl font-semibold tabular-nums">{hit.length}</p><p className="text-[11px] text-stone-500">of {ps.length} visitors</p></div>
            {s?.role === "Owner" && <DeleteAudience id={a.id} />}
          </li>; })}</ul>}</Card>
    </div>
  </>);
}
