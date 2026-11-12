import { getIntegrations, listDeliveries } from "@/lib/store";
import { PageHeader, Card, Badge, ago } from "../ui";
import { IntegrationsForm } from "./IntegrationsForm";
export const dynamic = "force-dynamic";
export default async function Integrations() {
  const d = (await listDeliveries());
  return (<>
    <PageHeader title="Integrations" sub="Send leads, hot visitors and handoff requests to Slack or your CRM." />
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3"><IntegrationsForm initial={(await getIntegrations())} /></div>
      <div className="lg:col-span-2"><Card title="Recent deliveries" pad={false}>
        {d.length === 0 ? <p className="px-5 py-10 text-center text-sm text-warm-500">Nothing sent yet. Use “Send test” or submit the Contact tab.</p> :
        <ul className="divide-y divide-warm-100 text-sm">{d.slice(0, 20).map((x) => <li key={x.id} className="flex items-center gap-3 px-5 py-2.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${x.ok ? "bg-navy-600" : "bg-rose-500"}`} />
          <div className="min-w-0 flex-1"><p className="truncate text-warm-800"><span className="font-medium capitalize">{x.target}</span> · <code className="text-xs">{x.event}</code>{x.test && <span className="ml-1"><Badge>test</Badge></span>}</p>
            {!x.ok && <p className="truncate text-xs text-rose-600">{x.error || `HTTP ${x.status}`}</p>}</div>
          <span className="whitespace-nowrap text-xs text-warm-500">{x.status ? `${x.status} · ` : ""}{ago(x.at)}</span></li>)}</ul>}
      </Card></div>
    </div>
  </>);
}
