import Link from "next/link";
export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-[22px] font-bold leading-tight tracking-tight text-stone-900">{title}</h1>{sub && <p className="mt-0.5 text-sm text-stone-500">{sub}</p>}</div>{actions && <div className="flex gap-2">{actions}</div>}</div>;
}
export function MetricCard({ label, value, hint, tone = "stone" }: { label: string; value: number | string; hint?: string; tone?: "stone" | "teal" | "amber" | "indigo" }) {
  const dot = { stone: "bg-stone-400", teal: "bg-teal-600", amber: "bg-amber-500", indigo: "bg-indigo-600" }[tone];
  return <div className="w-card p-3.5"><p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{label}</p><p className="mt-1.5 text-[28px] font-semibold leading-none tabular-nums tracking-tight">{value}</p>{hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}</div>;
}
export function Card({ title, actions, children, pad = true }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; pad?: boolean }) {
  return <section className="w-card">{title && <div className="flex items-center justify-between border-b border-stone-100 px-4 py-2.5"><h2 className="text-sm font-semibold tracking-tight text-stone-900">{title}</h2>{actions}</div>}<div className={pad ? "p-4" : ""}>{children}</div></section>;
}
export function Empty({ title, body, href, cta, secondaryHref, secondaryCta, tip }: { title: string; body: string; href?: string; cta?: string; secondaryHref?: string; secondaryCta?: string; tip?: string }) {
  return <div className="px-6 py-9 text-center"><div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">✦</div><p className="mt-3 font-medium text-stone-800">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">{body}</p>
    {(href || secondaryHref) && <div className="mt-4 flex flex-wrap justify-center gap-2">{href && <Link href={href} className="w-btn">{cta}</Link>}{secondaryHref && <Link href={secondaryHref} className="w-btn-ghost">{secondaryCta}</Link>}</div>}
    {tip && <p className="mx-auto mt-4 max-w-sm text-xs text-stone-400">Tip: {tip}</p>}</div>;
}
export type Step = { ok: boolean; label: string; desc?: string; action?: React.ReactNode };
export function Checklist({ steps }: { steps: Step[] }) {
  return <ol className="divide-y divide-stone-100">{steps.map((x, i) => <li key={x.label} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${x.ok ? "bg-teal-700 text-white" : "border border-stone-300 text-stone-500"}`}>{x.ok ? "✓" : i + 1}</span>
    <div className="min-w-0 flex-1"><p className={`text-sm font-medium ${x.ok ? "text-stone-500 line-through decoration-stone-300" : "text-stone-800"}`}>{x.label}</p>{x.desc && <p className="text-xs text-stone-500">{x.desc}</p>}</div>
    {!x.ok && x.action}</li>)}</ol>;
}
export function Badge({ children, tone = "stone" }: { children: React.ReactNode; tone?: "stone" | "teal" | "amber" | "rose" | "indigo" }) {
  const c = { stone: "bg-stone-100 text-stone-600 ring-stone-200", teal: "bg-teal-50 text-teal-800 ring-teal-200", amber: "bg-amber-50 text-amber-800 ring-amber-200", rose: "bg-rose-50 text-rose-700 ring-rose-200", indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200" }[tone];
  return <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${c}`}>{children}</span>;
}
export const ago = (iso: string) => { const s = (Date.now() - +new Date(iso)) / 1000; return s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : new Date(iso).toLocaleDateString(); };
export const initials = (s: string) => s.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "?";
