/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
type Tone = "teal" | "amber" | "indigo";
const tone: Record<Tone, string> = { teal: "bg-teal-50 text-teal-700 ring-teal-200", amber: "bg-amber-50 text-amber-700 ring-amber-200", indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200" };
export function IconTile({ t = "teal", children }: { t?: Tone; children: React.ReactNode }) {
  return <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ring-1 ${tone[t]}`}>{children}</span>;
}
export function Chip({ t = "teal", children }: { t?: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${tone[t]}`}>{children}</span>;
}
export function Callout({ t = "teal", title, children }: { t?: Tone; title: string; children: React.ReactNode }) {
  const b = { teal: "border-l-teal-600 bg-teal-50/60", amber: "border-l-amber-500 bg-amber-50", indigo: "border-l-indigo-600 bg-indigo-50/70" }[t];
  return <div className={`not-prose mt-6 rounded-xl border border-stone-200 border-l-4 ${b} p-4 text-sm leading-6 text-stone-700`}><p className="font-semibold text-stone-900">{title}</p><div className="mt-1">{children}</div></div>;
}
function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="w-card-lg w-glow overflow-hidden"><div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-50 px-4 py-2.5"><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="ml-3 text-xs text-stone-500">{title}</span></div><div className="p-5 text-sm">{children}</div></div>;
}
export function ChatVisual() {
  return <Frame title="yoursite.com/pricing · Waylo chat">
    <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-teal-700 px-3 py-2 text-white">Does the Starter plan include CRM webhooks?</div>
    <div className="mt-3 max-w-[92%] rounded-2xl rounded-bl-sm bg-stone-100 px-3 py-2 text-stone-800">Yes. Starter ($79/mo) includes Slack and CRM webhooks plus contact and demo handoff.<sup className="ml-0.5 font-semibold text-indigo-700">1</sup></div>
    <div className="mt-2 flex flex-wrap gap-1.5"><Chip t="indigo">1 · Pricing</Chip><Chip t="indigo">2 · Integrations</Chip></div>
    <div className="mt-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"><span>Signal: <b>pricing</b> + <b>integration</b></span><span className="font-semibold">Hot lead</span></div>
  </Frame>;
}
export function CrawlVisual() {
  const pages: [string, string][] = [["/", "Indexed"], ["/pricing", "Indexed"], ["/integrations", "Indexed"], ["/docs/sso", "Indexed"], ["/blog/launch", "Re-crawling"]];
  return <Frame title="Admin · Knowledge">
    <div className="flex items-center justify-between"><p className="font-semibold text-stone-900">yoursite.com</p><Chip>42 pages</Chip></div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100"><div className="h-full w-[86%] rounded-full" style={{ background: "var(--w-grad-cta)" }} /></div>
    <ul className="mt-4 divide-y divide-stone-100">{pages.map(([p, s]) => <li key={p} className="flex items-center justify-between py-2"><code className="text-[13px] text-stone-700">{p}</code><Chip t={s === "Indexed" ? "teal" : "amber"}>{s}</Chip></li>)}</ul>
  </Frame>;
}
export function SignalsVisual() {
  const rows: [string, string, Tone][] = [["Pricing interest", "/pricing → /pricing#compare", "amber"], ["Integration question", "/integrations → chat", "indigo"], ["Demo request", "/ → /demo → chat", "amber"], ["Security review", "/docs/sso → chat", "indigo"]];
  return <Frame title="Admin · Signals & journeys">
    <ul className="space-y-2.5">{rows.map(([s, j, t]) => <li key={s} className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2"><div><p className="font-medium text-stone-900">{s}</p><p className="text-xs text-stone-500">{j}</p></div><Chip t={t}>{t === "amber" ? "Hot" : "Warm"}</Chip></li>)}</ul>
  </Frame>;
}
export function HandoffVisual() {
  return <Frame title="#sales-leads · Slack">
    <div className="flex gap-3"><img src="/brand/mark.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" /><div><p className="font-semibold text-stone-900">Waylo <span className="ml-1 rounded bg-stone-100 px-1 text-[10px] text-stone-500">APP</span></p>
      <p className="mt-1 text-stone-700"><span className="font-semibold text-amber-700">Hot lead</span> · Dana Kim, dana@acme.co</p>
      <p className="text-stone-600">Asked about HubSpot sync and Starter pricing. Requested a demo.</p>
      <div className="mt-2 flex flex-wrap gap-1.5"><Chip t="amber">demo</Chip><Chip t="indigo">integration</Chip><Chip>3 pages viewed</Chip></div>
      <p className="mt-2 text-xs text-stone-500">Full transcript attached · also sent to CRM webhook</p></div></div>
  </Frame>;
}
export function GuidanceVisual() {
  const g: [string, string, Tone][] = [["Fact", "Annual plans get 2 months free.", "teal"], ["Rule", "Never quote custom enterprise pricing.", "amber"], ["Skill", "For security questions, link /docs/sso and offer a call.", "indigo"]];
  return <Frame title="Admin · Guidance">
    <ul className="space-y-2.5">{g.map(([k, v, t]) => <li key={k} className="flex items-start gap-3 rounded-lg border border-stone-200 px-3 py-2"><Chip t={t}>{k}</Chip><p className="text-stone-700">{v}</p></li>)}</ul>
  </Frame>;
}
export function ModesVisual() {
  return <div className="grid gap-3 sm:grid-cols-3">{([["launcher", "Floating button", "teal"], ["sidebar", "Docked panel", "indigo"], ["track", "Signals only", "amber"]] as [string, string, Tone][]).map(([m, d, t]) => <div key={m} className="w-card-lg p-4"><div className="relative h-24 rounded-lg border border-stone-200 bg-stone-50">
    {m === "launcher" && <span className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-teal-700 shadow" />}
    {m === "sidebar" && <span className="absolute inset-y-1 right-1 w-1/3 rounded-md border border-indigo-200 bg-indigo-50" />}
    {m === "track" && <span className="absolute inset-x-3 bottom-3 flex items-end gap-1">{[30, 55, 40, 70, 50].map((h, i) => <span key={i} className="w-3 rounded-sm bg-amber-400" style={{ height: h / 2 }} />)}</span>}
  </div><p className="mt-3 font-mono text-sm font-semibold text-stone-900">{m}</p><p className="text-xs text-stone-500">{d}</p><span className="mt-2 inline-block"><Chip t={t}>data-mode=&quot;{m}&quot;</Chip></span></div>)}</div>;
}
export function MiniCTA({ title, body }: { title: string; body: string }) {
  return <div className="w-card-lg flex flex-col items-start justify-between gap-4 border-l-4 border-l-amber-500 p-6 sm:flex-row sm:items-center"><div><p className="font-semibold text-stone-900">{title}</p><p className="mt-1 text-sm text-stone-600">{body}</p></div><div className="flex gap-2"><Link href="/demo" className="w-btn-accent">Try the demo</Link><a href="mailto:hello@waylo.ai?subject=Waylo%20early%20access" className="w-btn">Request access</a></div></div>;
}
