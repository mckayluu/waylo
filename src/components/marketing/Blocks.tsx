import Link from "next/link";
import { Section } from "./Section";
import { Code } from "./Code";
import { Shot } from "./Shots";
import { CTA } from "./Page";
import type { Block, InfoDef, Tone } from "@/lib/pages/types";
const eb = (t: Tone = "teal") => (t === "amber" ? "w-eyebrow-amber" : t === "indigo" ? "w-eyebrow-alt" : "w-eyebrow");
const bg = (i: number) => (i % 2 ? "bg-white" : "w-mesh");
// Tiny inline formatter: `code` and **bold** in copy strings.
export function Rich({ s }: { s: string }) {
  const parts = s.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return <>{parts.map((p, i) => p.startsWith("`") ? <code key={i} className="rounded bg-warm-100 px-1 py-0.5 font-mono text-[0.9em] text-navy-800">{p.slice(1, -1)}</code>
    : p.startsWith("**") ? <b key={i} className="font-semibold text-warm-900">{p.slice(2, -2)}</b>
    : p.startsWith("[") ? (() => { const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!; return <Link key={i} href={m[2]} className="font-medium text-navy-700 underline underline-offset-2">{m[1]}</Link>; })()
    : p)}</>;
}
const SLACK: [string, string, string, string, string[]][] = [
  ["handoff.requested", "👋", "Visitor wants a person", "on Brightfield: sam@example.com", ["Can someone walk us through onboarding?", "Last question: Does Growth cover 3 sites?"]],
  ["conversation.high_intent", "🔥", "High-intent visitor", "on Brightfield: Anonymous — signals: pricing, demo, high-intent", ["Can we get a demo next week?"]],
  ["lead.created", "✉️", "New demo request", "on Brightfield from Sam (sam@example.com)", ["Want a walkthrough before we pick a plan."]],
];
export function SlackFormats() {
  return <div className="grid gap-3">{SLACK.map(([e, em, t, rest, q]) => <div key={e} className="rounded-md bg-white p-4 text-sm text-warm-800 ring-1 ring-warm-200 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-warm-900"># sales-leads</p><p className="font-mono text-[11px] text-navy-700">{e}</p></div>
    <p className="mt-2 leading-6"><span aria-hidden>{em}</span> <b>{t}</b> {rest}</p>{q.map(x => <p key={x} className="mt-1 border-l-4 border-warm-300 pl-3 text-warm-600">{x}</p>)}<p className="mt-1.5 text-xs font-medium text-navy-700">· Open in Waylo</p></div>)}
    <p className="text-xs text-warm-500">The three Slack messages Waylo sends, in its real format (sample visitor “Sam”). “Open in Waylo” links to the full conversation in your admin.</p></div>;
}
// Section rhythm matches the homepage: paper, mist and card bands; tinted tiles; Fraunces headings.
const BANDS = ["w-band-paper", "w-band-mist", "bg-card"];
const band = (i: number) => BANDS[i % BANDS.length];
const TILES = ["w-tile-blush", "w-tile-mist", "w-tile-cream"];
const tile = (j: number) => TILES[j % TILES.length];
function B({ b, i }: { b: Block; i: number }) {
  const H = ({ eyebrow, h }: { eyebrow?: string; h?: string; tone?: Tone }) => <>{eyebrow && <p className="w-pill">{eyebrow}</p>}{h && <h2 className="w-h-lg mt-5 max-w-2xl font-semibold text-warm-900">{h}</h2>}</>;
  const P = ({ p }: { p: string[] }) => <>{p.map((x, j) => <p key={j} className="mt-4 max-w-2xl text-lg leading-8 text-warm-700"><Rich s={x} /></p>)}</>;
  const S = (props: { children: React.ReactNode; eyebrow?: string; title?: string; sub?: string }) => <Section id={b.id} eyebrow={props.eyebrow} title={props.title} sub={props.sub} className={`${band(i)} py-16 sm:py-20`}>{props.children}</Section>;
  switch (b.t) {
    case "prose": return <S><div className={`grid gap-10 ${b.aside ? "lg:grid-cols-[1.4fr_1fr] lg:items-start" : ""}`}><div><H eyebrow={b.eyebrow} h={b.h} /><P p={b.p} /></div>
      {b.aside && <aside className={`w-tile ${b.aside.tone === "amber" ? "w-tile-blush" : "w-tile-mist"} relative overflow-hidden p-7`}><div aria-hidden className="absolute -right-5 -top-5 h-14 w-14 rotate-6 rounded-[14px] bg-navy-900" /><p className="relative pr-10 font-display text-xl font-semibold text-warm-900">{b.aside.title}</p><ul className="relative mt-4 space-y-2.5 leading-7 text-warm-700">{b.aside.items.map(x => <li key={x} className="flex gap-2.5"><span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-rasp-600" /><span><Rich s={x} /></span></li>)}</ul></aside>}</div></S>;
    case "shot": return <S><div className={`grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] ${b.flip ? "lg:[&>*:first-child]:order-2" : ""}`}><div><H eyebrow={b.eyebrow} h={b.h} /><P p={b.p} />
      {b.bullets && <ul className="mt-7 grid gap-3">{b.bullets.map(([k, v], j) => <li key={k} className={`w-tile ${tile(j)} p-4`}><p className="font-semibold text-warm-900">{k}</p><p className="mt-1 leading-7 text-warm-700"><Rich s={v} /></p></li>)}</ul>}</div>
      <div className="relative"><div aria-hidden className={`absolute -top-4 h-20 w-20 rotate-6 rounded-[20px] ${b.flip ? "-left-4 bg-blush" : "-right-4 bg-rasp-600"}`} /><Shot k={b.shot} className={`relative ${b.shot === "widget" ? "mx-auto max-w-sm" : ""}`} /></div></div></S>;
    case "shots": return <S eyebrow={b.eyebrow} title={b.h} sub={b.sub}><div className={`grid gap-5 ${b.keys.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>{b.keys.map(k => <Shot key={k} k={k} crop="h-56" />)}</div></S>;
    case "spec": return <S eyebrow={b.eyebrow} title={b.h} sub={b.sub}><dl className="grid gap-4 sm:grid-cols-2">{b.rows.map(([k, v], j) => <div key={k} className={`w-tile ${tile(j)} p-6`}><dt className="font-display text-xl font-semibold text-warm-900">{k}</dt><dd className="mt-2 leading-7 text-warm-700"><Rich s={v} /></dd></div>)}</dl></S>;
    case "steps": return <S eyebrow={b.eyebrow} title={b.h} sub={b.sub}><ol className="grid gap-5 md:grid-cols-2">{b.items.map(([h, d], j) => <li key={h} className="w-tile w-tile-card flex gap-5 p-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy-900 font-display text-xl font-semibold text-white">{j + 1}</span><div><p className="font-display text-xl font-semibold text-warm-900">{h}</p><p className="mt-1.5 leading-7 text-warm-700"><Rich s={d} /></p></div></li>)}</ol></S>;
    case "code": return <S><div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]"><div><H eyebrow={b.eyebrow} h={b.h} /><P p={b.p} /></div><Code label={b.label}>{b.code}</Code></div></S>;
    case "table": return <S eyebrow={b.eyebrow} title={b.h} sub={b.sub}><div className="w-tile w-tile-card overflow-x-auto"><table className="w-full min-w-[620px] text-[15px]"><thead><tr className="border-b border-warm-200">{b.head.map((h, j) => <th key={h} className={`px-5 py-4 text-left font-semibold ${j === 1 ? "text-rasp-700" : "text-warm-700"}`}>{h}</th>)}</tr></thead><tbody className="divide-y divide-warm-200">{b.rows.map(r => <tr key={r[0]}>{r.map((c, j) => <td key={j} className={`px-5 py-3.5 align-top leading-7 ${j ? "text-warm-600" : "font-medium text-warm-900"} ${j === 1 ? "bg-rasp-50/60" : ""}`}><Rich s={c} /></td>)}</tr>)}</tbody></table></div>{b.note && <p className="mt-3 text-sm text-warm-500"><Rich s={b.note} /></p>}</S>;
    case "limits": return <S><div className="w-tile w-tile-cream relative overflow-hidden p-8 sm:p-10"><div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rotate-6 rounded-[20px] bg-navy-900" /><p className="w-pill relative">Honest limits</p><h2 className="w-h-lg relative mt-5 max-w-2xl pr-12 font-semibold text-warm-900">{b.h || "What it doesn’t do yet"}</h2><ul className="relative mt-6 grid gap-x-10 gap-y-3 leading-7 text-warm-700 md:grid-cols-2">{b.items.map(x => <li key={x} className="flex gap-2.5"><span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-rasp-600" /><span><Rich s={x} /></span></li>)}</ul></div></S>;
    case "qa": return <S eyebrow={b.eyebrow} title={b.h} sub={b.sub}><div className="grid gap-4 md:grid-cols-2">{b.items.map(([q, a, sig], j) => <div key={q} className={`w-tile ${tile(j)} p-6`}><div className="flex items-start justify-between gap-3"><p className="font-display text-lg font-semibold text-warm-900">“{q}”</p><span className="shrink-0 rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-rasp-700 ring-1 ring-rasp-200">{sig}</span></div><p className="mt-2 leading-7 text-warm-700"><Rich s={a} /></p></div>)}</div></S>;
    case "slack": return <S><div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]"><div><H eyebrow={b.eyebrow} h={b.h} /><P p={b.p} /></div><SlackFormats /></div></S>;
    case "split": return <S eyebrow={b.eyebrow} title={b.h}><div className="grid gap-5 md:grid-cols-2">{[b.left, b.right].map((c, j) => <div key={c.title} className={`w-tile ${j ? "w-tile-blush" : "w-tile-mist"} p-7`}><p className="font-display text-xl font-semibold text-warm-900">{c.title}</p><ul className="mt-4 space-y-2.5 leading-7 text-warm-700">{c.items.map(x => <li key={x} className="flex gap-2.5"><span aria-hidden className={j ? "text-rasp-700" : "text-navy-700"}>{j ? "→" : "✓"}</span><span><Rich s={x} /></span></li>)}</ul></div>)}</div></S>;
    case "faq": return <section id={b.id} className={`${band(i)} scroll-mt-20 px-5 py-16 sm:py-20`}><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr]"><div><h2 className="w-h-lg font-semibold text-warm-900">{b.h || "Questions"}</h2><Link href="/faq" className="mt-4 inline-block text-sm font-semibold text-navy-700 hover:underline">All questions →</Link></div>
      <div className="divide-y divide-warm-200 border-y border-warm-200">{b.items.map(([q, a]) => <details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-warm-900"><h3>{q}</h3><span className="text-lg leading-none text-rasp-700 transition group-open:rotate-45">+</span></summary><p className="mt-2 max-w-2xl leading-7 text-warm-600"><Rich s={a} /></p></details>)}</div></div></section>;
  }
}
export function Related({ items }: { items: [string, string, string][] }) {
  return <Section title="Keep reading" className="w-band-paper py-16 sm:py-20"><ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(([l, h, desc], j) => <li key={h}><Link href={h} className={`w-tile ${tile(j)} group block h-full p-6 transition hover:-translate-y-0.5`}><span className="font-display text-xl font-semibold text-warm-900">{l}</span><span className="mt-2 block leading-7 text-warm-700">{desc}</span><span className="mt-4 block text-sm font-semibold text-rasp-700 group-hover:underline">Read more →</span></Link></li>)}</ul></Section>;
}
export function Blocks({ d }: { d: InfoDef }) {
  return <>
    {d.hero && <div className="mx-auto mt-10 max-w-5xl px-5"><div className="relative"><div aria-hidden className="absolute -left-4 -top-4 h-20 w-20 -rotate-6 rounded-[18px] bg-navy-900" /><Shot k={d.hero} priority className="relative" /></div></div>}
    <div className="h-10" />
    {d.blocks.map((b, i) => <B key={i} b={b} i={i} />)}
    {d.related && <Related items={d.related} />}
    <section className="w-band-paper px-5 pb-16"><CTA /></section>
  </>;
}
