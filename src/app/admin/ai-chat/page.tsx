import { snippet } from "@/lib/embed";
import Link from "next/link";
import { stats, getBranding, getGuidance, getSettings, listVisitors, DEFAULT_BRANDING } from "@/lib/store";
import { PageHeader, Card } from "../ui";
import { PublishToggle } from "../PublishToggle";
import { CopyButton } from "../settings/CopyButton";
export const dynamic = "force-dynamic";
const SNIPPET = snippet();
export default async function AiChat() {
  const s = (await stats()), b = (await getBranding()), g = (await getGuidance()), st = (await getSettings());
  const steps = [
    { n: 1, label: "Try it", desc: "Ask Waylo a question on the demo site.", ok: s.totalConversations > 0, action: <Link href="/demo" target="_blank" className="w-btn-ghost">Open demo ↗</Link> },
    { n: 2, label: "Preview & tune", desc: "Brand it and add guidance so answers sound like you.", ok: (b.botName !== DEFAULT_BRANDING.botName || b.accent !== DEFAULT_BRANDING.accent || b.greeting !== DEFAULT_BRANDING.greeting) || g.facts.length > 0 || !!st.companyProfile, action: <Link href="/admin/settings" className="w-btn-ghost">Settings</Link> },
    { n: 3, label: "Install", desc: "Paste the embed snippet before </body> on your site.", ok: (await listVisitors()).length > 0, action: <CopyButton text={SNIPPET} /> },
    { n: 4, label: "Publish", desc: "Turn off the “Preview only” banner for visitors.", ok: st.published, action: <PublishToggle initial={st.published} /> },
  ];
  return (<>
    <PageHeader title="AI Chat" sub="Set up, preview and publish the Waylo sidebar." />
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-3 lg:col-span-3">
        {steps.map((x) => <div key={x.n} className={`w-card flex items-center gap-4 p-4 ${x.ok ? "" : ""}`}>
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${x.ok ? "bg-teal-700 text-white" : "border border-stone-300 text-stone-500"}`}>{x.ok ? "✓" : x.n}</span>
          <div className="min-w-0 flex-1"><p className="font-medium text-stone-800">{x.label}</p><p className="text-sm text-stone-500">{x.desc}</p></div>{x.action}</div>)}
        <Card title="Embed snippet"><pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[#0d1b1e] p-4 text-[11px] leading-relaxed text-teal-100">{SNIPPET}</pre></Card>
      </div>
      <div className="lg:col-span-2"><Card title="Live preview" pad={false} actions={<Link href="/widget" target="_blank" className="text-xs font-medium text-teal-700 hover:underline">Open ↗</Link>}>
        <iframe src="/widget" title="Waylo preview" className="h-[620px] w-full rounded-b-xl border-0" /></Card></div>
    </div>
  </>);
}
