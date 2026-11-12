/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { SlackCard } from "./HomeVisuals";
type Tone = "teal" | "amber" | "indigo";
const tone: Record<Tone, string> = { teal: "bg-navy-50 text-navy-700 ring-navy-200", amber: "bg-rasp-50 text-rasp-700 ring-rasp-200", indigo: "bg-navy-50 text-navy-700 ring-navy-200" };
export function IconTile({ t = "teal", children }: { t?: Tone; children: React.ReactNode }) {
  return <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md text-sm font-bold ring-1 ${tone[t]}`}>{children}</span>;
}
export function Chip({ t = "teal", children }: { t?: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${tone[t]}`}>{children}</span>;
}
export function Callout({ t = "teal", title, children }: { t?: Tone; title: string; children: React.ReactNode }) {
  const b = { teal: "border-l-navy-600 bg-navy-50/60", amber: "border-l-rasp-500 bg-rasp-50", indigo: "border-l-navy-600 bg-navy-50/70" }[t];
  return <div className={`not-prose mt-6 rounded-md border border-warm-200 border-l-4 ${b} p-4 text-sm leading-6 text-warm-700`}><p className="font-semibold text-warm-900">{title}</p><div className="mt-1">{children}</div></div>;
}
function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="w-shot-float"><div className="flex items-center gap-1.5 border-b border-warm-200 bg-paper px-4 py-2.5"><span className="h-2.5 w-2.5 rounded-full bg-rasp-600/70" /><span className="h-2.5 w-2.5 rounded-full bg-blush" /><span className="h-2.5 w-2.5 rounded-full bg-navy-200" /><span className="ml-3 text-xs text-warm-500">{title}</span><span className="ml-auto font-plex text-[9px] uppercase tracking-[0.08em] text-warm-400">Illustration</span></div><div className="p-5 text-sm">{children}</div></div>;
}
export function ChatVisual() {
  return <Frame title="yoursite.com/pricing · Waylo chat">
    <div className="ml-auto w-fit max-w-[85%] rounded-md rounded-br-sm bg-navy-700 px-3 py-2 text-white">Does the Starter plan include CRM webhooks?</div>
    <div className="mt-3 max-w-[92%] rounded-md rounded-bl-sm bg-warm-100 px-3 py-2 text-warm-800">Yes. Every plan includes Slack and CRM webhooks plus contact and demo handoff, the Trial too.<sup className="ml-0.5 font-semibold text-navy-700">1</sup></div>
    <div className="mt-2 flex flex-wrap gap-1.5"><Chip t="indigo">1 · Pricing</Chip><Chip t="indigo">2 · Integrations</Chip></div>
    <div className="mt-4 flex items-center justify-between rounded-md border border-rasp-200 bg-rasp-50 px-3 py-2 text-xs text-rasp-900"><span>Signal: <b>pricing</b> + <b>integration</b></span><span className="font-semibold">Hot lead</span></div>
  </Frame>;
}
export function CrawlVisual() {
  const pages: [string, string][] = [["/", "Indexed"], ["/pricing", "Indexed"], ["/integrations", "Indexed"], ["/docs/setup", "Indexed"], ["/blog/launch", "Re-crawling"]];
  return <Frame title="Admin · Knowledge">
    <div className="flex items-center justify-between"><p className="font-semibold text-warm-900">yoursite.com</p><Chip>42 pages</Chip></div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-warm-100"><div className="h-full w-[86%] rounded-full" style={{ background: "var(--w-grad-cta)" }} /></div>
    <ul className="mt-4 divide-y divide-warm-100">{pages.map(([p, s]) => <li key={p} className="flex items-center justify-between py-2"><code className="text-[13px] text-warm-700">{p}</code><Chip t={s === "Indexed" ? "teal" : "amber"}>{s}</Chip></li>)}</ul>
  </Frame>;
}
export function SignalsVisual() {
  const rows: [string, string, Tone][] = [["Pricing interest", "/pricing → /pricing#compare", "amber"], ["Integration question", "/integrations → chat", "indigo"], ["Demo request", "/ → /demo → chat", "amber"], ["Security question", "/security → chat", "indigo"]];
  return <Frame title="Admin · Signals and journeys">
    <ul className="space-y-2.5">{rows.map(([s, j, t]) => <li key={s} className="flex items-center justify-between gap-3 rounded-md border border-warm-200 bg-white px-3 py-2"><div><p className="font-medium text-warm-900">{s}</p><p className="text-xs text-warm-500">{j}</p></div><Chip t={t}>{t === "amber" ? "Hot" : "Warm"}</Chip></li>)}</ul>
  </Frame>;
}
export function HandoffVisual() {
  return <SlackCard className="mx-auto" />;
}
export function GuidanceVisual() {
  const g: [string, string, Tone][] = [["Fact", "Annual plans get 2 months free.", "teal"], ["Rule", "Never quote custom enterprise pricing.", "amber"], ["Skill", "For security questions, link the security page.", "indigo"]];
  return <Frame title="Admin · Guidance">
    <ul className="space-y-2.5">{g.map(([k, v, t]) => <li key={k} className="flex items-start gap-3 rounded-md border border-warm-200 px-3 py-2"><Chip t={t}>{k}</Chip><p className="text-warm-700">{v}</p></li>)}</ul>
  </Frame>;
}
export function ModesVisual() {
  return <div className="grid gap-3 sm:grid-cols-3">{([["launcher", "Floating button", "teal"], ["sidebar", "Docked panel", "indigo"], ["track", "Signals only", "amber"]] as [string, string, Tone][]).map(([m, d, t]) => <div key={m} className="w-card-lg p-4"><div className="relative h-24 rounded-md border border-warm-200 bg-warm-50">
    {m === "launcher" && <span className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-navy-700 shadow" />}
    {m === "sidebar" && <span className="absolute inset-y-1 right-1 w-1/3 rounded-md border border-navy-200 bg-navy-50" />}
    {m === "track" && <span className="absolute inset-x-3 bottom-3 flex items-end gap-1">{[30, 55, 40, 70, 50].map((h, i) => <span key={i} className="w-3 rounded-sm bg-rasp-400" style={{ height: h / 2 }} />)}</span>}
  </div><p className="mt-3 font-mono text-sm font-semibold text-warm-900">{m}</p><p className="text-xs text-warm-500">{d}</p><span className="mt-2 inline-block"><Chip t={t}>data-mode=&quot;{m}&quot;</Chip></span></div>)}</div>;
}
export function MiniCTA({ title, body }: { title: string; body: string }) {
  return <div className="w-tile w-tile-blush relative flex flex-col items-start justify-between gap-5 overflow-hidden p-7 sm:flex-row sm:items-center sm:p-8"><div aria-hidden className="absolute -right-5 -top-5 h-14 w-14 rotate-6 rounded-[14px] bg-navy-900" /><div className="relative"><p className="font-display text-2xl font-semibold text-warm-900">{title}</p><p className="mt-2 max-w-xl leading-7 text-warm-700">{body}</p></div><div className="relative flex flex-wrap gap-2 sm:mr-10"><Link href="/signup" className="w-btn-accent w-btn-lg">Start free trial</Link><Link href="/how-it-works" className="w-btn-ghost w-btn-lg bg-card">See how it works</Link></div></div>;
}
/* ---- Density chunk: photo bands, workflow strip, proof bar ---- */
export function PhotoBand({ items }: { items: { src: string; alt: string; tag: string; t: Tone; caption: string }[] }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <figure key={p.src} className="w-tile w-tile-card group overflow-hidden">
    <div className="relative aspect-[4/3] overflow-hidden"><img src={p.src} alt={p.alt} loading="lazy" decoding="async" width={600} height={450} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-3 top-3"><Chip t={p.t}>{p.tag}</Chip></span></div>
    <figcaption className="p-5 leading-7 text-warm-700">{p.caption}</figcaption></figure>)}</div>;
}
export function WorkflowStrip() {
  const steps: [Tone, string, string, string][] = [
    ["indigo", "Crawl", "Paste your domain", "Waylo reads your public pages in the background. You don’t upload a sitemap."],
    ["teal", "Answer", "Cited replies", "Visitors get answers from your pages, with links they can check."],
    ["amber", "Signal", "Intent and journey", "Buying questions get tagged as they happen, so you can see who is serious."],
    ["indigo", "Hand off", "Slack and webhook", "When a visitor looks ready to buy, leaves their details, or asks for a person, Slack hears about it."],
  ];
  return <ol className="grid gap-4 md:grid-cols-4">{steps.map(([t, k, h, d], i) => <li key={k} className={`w-tile ${["w-tile-mist", "w-tile-blush", "w-tile-cream", "w-tile-mist"][i]} relative p-6`}>
    <div className="flex items-center gap-3"><span aria-hidden data-tone={t} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-900 font-display text-lg font-semibold text-white">{i + 1}</span><div><p className="font-plex text-[11px] font-medium uppercase tracking-[0.09em] text-rasp-700">{k}</p><h3 className="font-display text-lg font-semibold text-warm-900">{h}</h3></div></div>
    <p className="mt-3 leading-7 text-warm-700">{d}</p>{i < 3 && <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-rasp-600 text-xs text-white md:grid">→</span>}</li>)}</ol>;
}
export function ProofBar() {
  const facts: [Tone, string, string][] = [["teal", "1 script tag", "to install on any site"], ["indigo", "Every reply", "links its source pages"], ["amber", "Buying signals", "on every conversation"], ["teal", "Slack and CRM", "alerts on every plan"]];
  return <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-warm-200 ring-1 ring-warm-200 md:grid-cols-4">{facts.map(([t, a, b]) => <div key={a} className="bg-white px-5 py-4"><p className={`text-lg font-semibold ${t === "amber" ? "text-rasp-700" : t === "indigo" ? "text-navy-700" : "text-navy-700"}`}>{a}</p><p className="text-sm text-warm-600">{b}</p></div>)}</div>;
}
export const PHOTOS = {
  support: { src: "/images/people/support-team-headsets.webp", alt: "Two women wearing headsets in a bright office", tag: "Support deflection", t: "teal" as Tone, caption: "Waylo answers the repeat pre-sales questions from your docs, with sources. Your team takes the hard ones." },
  meeting: { src: "/images/people/team-laughing-table.webp", alt: "Three people laughing together around a table", tag: "Sales handoff", t: "amber" as Tone, caption: "Reps see a Slack post when a visitor looks ready to buy or leaves their details, with a link to the conversation." },
  dashboard: { src: "/images/people/owner-desk-laptop.webp", alt: "A woman standing at a desk working on her laptop in a small office", tag: "Signals", t: "indigo" as Tone, caption: "Journeys and signals show which pages lead to buying questions." },
  workshop: { src: "/images/people/marketing-two-women-laptop.webp", alt: "Two women talking at a laptop by a bright window", tag: "Guidance", t: "teal" as Tone, caption: "Marketing owns the voice. Facts, rules, and skills keep answers in your words." },
};
export function ValueProps({ items }: { items: { k: string; d: string; href: string; t: Tone }[] }) {
  return <div className="grid gap-4 md:grid-cols-3">{items.map((p, i) => <Link key={p.k} href={p.href} className={`w-tile ${["w-tile-blush", "w-tile-mist", "w-tile-cream"][i % 3]} group p-6 transition hover:-translate-y-0.5`}><p className={`font-mono text-[11px] font-semibold ${p.t === "amber" ? "text-rasp-700" : p.t === "indigo" ? "text-navy-700" : "text-navy-700"}`}>0{i + 1}</p><p className="mt-1 font-display text-xl font-semibold text-warm-900">{p.k}</p><p className="mt-2 leading-7 text-warm-700">{p.d}</p></Link>)}</div>;
}
