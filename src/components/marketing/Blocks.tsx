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
  return <>{parts.map((p, i) => p.startsWith("`") ? <code key={i} className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[0.9em] text-indigo-800">{p.slice(1, -1)}</code>
    : p.startsWith("**") ? <b key={i} className="font-semibold text-stone-900">{p.slice(2, -2)}</b>
    : p.startsWith("[") ? (() => { const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!; return <Link key={i} href={m[2]} className="font-medium text-teal-700 underline underline-offset-2">{m[1]}</Link>; })()
    : p)}</>;
}
const SLACK: [string, string, string, string, string[]][] = [
  ["handoff.requested", "👋", "Visitor wants a person", "on Brightfield: sam@example.com", ["Can someone walk us through onboarding?", "Last question: Does Growth cover 3 sites?"]],
  ["conversation.high_intent", "🔥", "High-intent visitor", "on Brightfield: Anonymous — signals: pricing, demo, high-intent", ["Can we get a demo next week?"]],
  ["lead.created", "✉️", "New demo request", "on Brightfield from Sam (sam@example.com)", ["Want a walkthrough before we pick a plan."]],
];
export function SlackFormats() {
  return <div className="grid gap-3">{SLACK.map(([e, em, t, rest, q]) => <div key={e} className="rounded-xl bg-white p-4 text-sm text-stone-800 ring-1 ring-stone-200 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-stone-900"># sales-leads</p><p className="font-mono text-[11px] text-indigo-700">{e}</p></div>
    <p className="mt-2 leading-6"><span aria-hidden>{em}</span> <b>{t}</b> {rest}</p>{q.map(x => <p key={x} className="mt-1 border-l-4 border-stone-300 pl-3 text-stone-600">{x}</p>)}<p className="mt-1.5 text-xs font-medium text-sky-700">· Open in Waylo</p></div>)}
    <p className="text-xs text-stone-500">The three Slack messages Waylo sends, in its real format (sample visitor “Sam”). “Open in Waylo” links to the full conversation in your admin.</p></div>;
}
function B({ b, i }: { b: Block; i: number }) {
  const H = ({ eyebrow, h, tone }: { eyebrow?: string; h?: string; tone?: Tone }) => <>{eyebrow && <p className={eb(tone)}>{eyebrow}</p>}{h && <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-stone-900 sm:text-[1.85rem] sm:leading-tight">{h}</h2>}</>;
  switch (b.t) {
    case "prose": return <Section id={b.id} className={bg(i)}><div className={`grid gap-10 ${b.aside ? "lg:grid-cols-[1.5fr_1fr]" : ""}`}><div className="max-w-3xl"><H eyebrow={b.eyebrow} h={b.h} />{b.p.map((p, j) => <p key={j} className="mt-4 leading-7 text-stone-700"><Rich s={p} /></p>)}</div>
      {b.aside && <aside className={`self-start rounded-xl border-l-4 p-5 text-sm ${b.aside.tone === "amber" ? "border-l-amber-500 bg-amber-50" : b.aside.tone === "indigo" ? "border-l-indigo-500 bg-indigo-50/60" : "border-l-teal-600 bg-teal-50/60"}`}><p className="font-semibold text-stone-900">{b.aside.title}</p><ul className="mt-3 space-y-2 text-stone-700">{b.aside.items.map(x => <li key={x} className="flex gap-2"><span className="text-teal-700">·</span><span><Rich s={x} /></span></li>)}</ul></aside>}</div></Section>;
    case "shot": return <Section id={b.id} className={bg(i)}><div className={`grid items-start gap-10 lg:grid-cols-[1fr_1.25fr] ${b.flip ? "lg:[&>*:first-child]:order-2" : ""}`}><div><H eyebrow={b.eyebrow} h={b.h} />{b.p.map((p, j) => <p key={j} className="mt-4 leading-7 text-stone-700"><Rich s={p} /></p>)}
      {b.bullets && <dl className="mt-6 divide-y divide-stone-200 border-y border-stone-200">{b.bullets.map(([k, v]) => <div key={k} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr] sm:gap-4"><dt className="text-sm font-semibold text-stone-900">{k}</dt><dd className="text-sm leading-6 text-stone-600"><Rich s={v} /></dd></div>)}</dl>}</div>
      <Shot k={b.shot} className={b.shot === "widget" ? "mx-auto max-w-sm" : ""} /></div></Section>;
    case "shots": return <Section id={b.id} eyebrow={b.eyebrow} title={b.h} sub={b.sub} className={bg(i)}><div className={`grid gap-5 ${b.keys.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>{b.keys.map(k => <Shot key={k} k={k} crop="h-56" />)}</div></Section>;
    case "spec": return <Section id={b.id} eyebrow={b.eyebrow} title={b.h} sub={b.sub} className={bg(i)}><dl className="grid border-t border-stone-200 sm:grid-cols-2 sm:gap-x-10">{b.rows.map(([k, v]) => <div key={k} className="grid gap-1 border-b border-stone-200 py-3.5 sm:grid-cols-[150px_1fr] sm:gap-4"><dt className="text-sm font-semibold text-stone-900">{k}</dt><dd className="text-sm leading-6 text-stone-600"><Rich s={v} /></dd></div>)}</dl></Section>;
    case "steps": return <Section id={b.id} eyebrow={b.eyebrow} title={b.h} sub={b.sub} className={bg(i)}><ol className="grid gap-x-8 gap-y-5 md:grid-cols-2">{b.items.map(([h, d], j) => <li key={h} className="grid grid-cols-[2.25rem_1fr] gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-600 to-indigo-600 font-mono text-sm font-semibold text-white">{j + 1}</span><div><p className="font-semibold text-stone-900">{h}</p><p className="mt-1 text-sm leading-6 text-stone-600"><Rich s={d} /></p></div></li>)}</ol></Section>;
    case "code": return <Section id={b.id} className={bg(i)}><div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]"><div><H eyebrow={b.eyebrow} h={b.h} />{b.p.map((p, j) => <p key={j} className="mt-4 leading-7 text-stone-700"><Rich s={p} /></p>)}</div><Code label={b.label}>{b.code}</Code></div></Section>;
    case "table": return <Section id={b.id} eyebrow={b.eyebrow} title={b.h} sub={b.sub} className={bg(i)}><div className="w-card-lg overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead className="bg-stone-50"><tr>{b.head.map((h, j) => <th key={h} className={`px-5 py-3 text-left font-semibold ${j === 1 ? "text-teal-800" : "text-stone-700"}`}>{h}</th>)}</tr></thead><tbody className="divide-y divide-stone-100">{b.rows.map(r => <tr key={r[0]}>{r.map((c, j) => <td key={j} className={`px-5 py-3 align-top leading-6 ${j ? "text-stone-600" : "font-medium text-stone-900"} ${j === 1 ? "bg-teal-50/40" : ""}`}><Rich s={c} /></td>)}</tr>)}</tbody></table></div>{b.note && <p className="mt-3 text-xs text-stone-500"><Rich s={b.note} /></p>}</Section>;
    case "limits": return <Section id={b.id} className={bg(i)}><div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6"><p className="w-eyebrow-amber">Honest limits</p><h2 className="mt-1.5 text-xl font-semibold tracking-tight text-stone-900">{b.h || "What it doesn’t do (yet)"}</h2><ul className="mt-4 grid gap-x-8 gap-y-2 text-sm text-stone-700 md:grid-cols-2">{b.items.map(x => <li key={x} className="flex gap-2"><span className="text-amber-600">–</span><span><Rich s={x} /></span></li>)}</ul></div></Section>;
    case "qa": return <Section id={b.id} eyebrow={b.eyebrow} title={b.h} sub={b.sub} className={bg(i)}><div className="divide-y divide-stone-200 border-y border-stone-200">{b.items.map(([q, a, sig]) => <div key={q} className="grid gap-2 py-4 sm:grid-cols-[260px_1fr_auto] sm:items-baseline"><p className="font-semibold text-stone-900">{q}</p><p className="text-sm leading-6 text-stone-600"><Rich s={a} /></p><span className="w-fit rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">{sig}</span></div>)}</div></Section>;
    case "slack": return <Section id={b.id} className={bg(i)}><div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]"><div><H eyebrow={b.eyebrow} h={b.h} tone="amber" />{b.p.map((p, j) => <p key={j} className="mt-4 leading-7 text-stone-700"><Rich s={p} /></p>)}</div><SlackFormats /></div></Section>;
    case "split": return <Section id={b.id} eyebrow={b.eyebrow} title={b.h} className={bg(i)}><div className="grid gap-px overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-200 md:grid-cols-2">{[b.left, b.right].map((c, j) => <div key={c.title} className="bg-white p-6"><p className={j ? "w-eyebrow-amber" : "w-eyebrow"}>{c.title}</p><ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">{c.items.map(x => <li key={x} className="flex gap-2"><span className={j ? "text-amber-600" : "text-teal-700"}>{j ? "→" : "✓"}</span><span><Rich s={x} /></span></li>)}</ul></div>)}</div></Section>;
    case "faq": return <Section id={b.id} eyebrow="Questions" title={b.h || "Common questions"} className={bg(i)}><div className="max-w-3xl divide-y divide-stone-200 border-y border-stone-200">{b.items.map(([q, a]) => <details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-stone-900"><h3>{q}</h3><span className="text-lg leading-none text-amber-700 transition group-open:rotate-45">+</span></summary><p className="mt-2 text-sm leading-6 text-stone-600"><Rich s={a} /></p></details>)}</div></Section>;
  }
}
export function Blocks({ d }: { d: InfoDef }) {
  return <>
    {d.hero && <div className="mx-auto mt-8 max-w-5xl px-5"><Shot k={d.hero} priority /></div>}
    {d.blocks.map((b, i) => <B key={i} b={b} i={i} />)}
    {d.related && <Section eyebrow="Keep reading" title="Related pages" className="bg-white"><ul className="grid gap-px overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-200 sm:grid-cols-2 lg:grid-cols-3">{d.related.map(([l, h, desc]) => <li key={h} className="bg-white"><Link href={h} className="block h-full p-5 hover:bg-stone-50"><span className="font-semibold text-stone-900">{l} →</span><span className="mt-1 block text-sm leading-6 text-stone-600">{desc}</span></Link></li>)}</ul></Section>}
    <Section className="pt-6"><CTA /></Section>
  </>;
}
