import Link from "next/link";
export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-[22px] font-bold leading-tight tracking-tight text-warm-900">{title}</h1>{sub && <p className="mt-0.5 text-sm text-warm-500">{sub}</p>}</div>{actions && <div className="flex gap-2">{actions}</div>}</div>;
}
export function MetricCard({ label, value, hint, tone = "neutral" }: { label: string; value: number | string; hint?: string; tone?: "neutral" | "navy" | "amber" | "info" | "rasp" }) {
  const dot = { neutral: "bg-warm-400", navy: "bg-navy-600", amber: "bg-amber-500", info: "bg-navy-400", rasp: "bg-rasp-600" }[tone];
  return <div className="w-card p-3.5"><p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-warm-500"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{label}</p><p className="mt-1.5 font-display text-[28px] font-semibold leading-none tabular-nums tracking-tight">{value}</p>{hint && <p className="mt-1 text-xs text-warm-400">{hint}</p>}</div>;
}
export function Card({ title, actions, children, pad = true }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; pad?: boolean }) {
  return <section className="w-card">{title && <div className="flex items-center justify-between border-b border-warm-100 px-4 py-2.5"><h2 className="text-sm font-semibold tracking-tight text-warm-900">{title}</h2>{actions}</div>}<div className={pad ? "p-4" : ""}>{children}</div></section>;
}
export function Empty({ title, body, href, cta, secondaryHref, secondaryCta, tip }: { title: string; body: string; href?: string; cta?: string; secondaryHref?: string; secondaryCta?: string; tip?: string }) {
  return <div className="px-6 py-9 text-center"><div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-navy-50 text-navy-700 ring-1 ring-navy-100">✦</div><p className="mt-3 font-medium text-warm-800">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm text-warm-500">{body}</p>
    {(href || secondaryHref) && <div className="mt-4 flex flex-wrap justify-center gap-2">{href && <Link href={href} className="w-btn">{cta}</Link>}{secondaryHref && <Link href={secondaryHref} className="w-btn-ghost">{secondaryCta}</Link>}</div>}
    {tip && <p className="mx-auto mt-4 max-w-sm text-xs text-warm-400">Tip: {tip}</p>}</div>;
}
export type Step = { ok: boolean; label: string; desc?: string; action?: React.ReactNode };
export function Checklist({ steps }: { steps: Step[] }) {
  return <ol className="divide-y divide-warm-100">{steps.map((x, i) => <li key={x.label} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${x.ok ? "bg-navy-700 text-white" : "border border-warm-300 text-warm-500"}`}>{x.ok ? "✓" : i + 1}</span>
    <div className="min-w-0 flex-1"><p className={`text-sm font-medium ${x.ok ? "text-warm-500 line-through decoration-warm-300" : "text-warm-800"}`}>{x.label}</p>{x.desc && <p className="text-xs text-warm-500">{x.desc}</p>}</div>
    {!x.ok && x.action}</li>)}</ol>;
}
export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "navy" | "amber" | "rose" | "info" | "rasp" }) {
  const c = { neutral: "bg-warm-100 text-warm-600 ring-warm-200", navy: "bg-navy-50 text-navy-800 ring-navy-200", amber: "bg-amber-50 text-amber-800 ring-amber-200", rose: "bg-rose-50 text-rose-700 ring-rose-200", info: "bg-navy-100 text-navy-700 ring-navy-200", rasp: "bg-rasp-100 text-rasp-700 ring-rasp-200" }[tone];
  return <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${c}`}>{children}</span>;
}
export const ago = (iso: string) => { const s = (Date.now() - +new Date(iso)) / 1000; return s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : new Date(iso).toLocaleDateString(); };
export const initials = (s: string) => s.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "?";
