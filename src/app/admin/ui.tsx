import Link from "next/link";
export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-[22px] font-semibold tracking-tight text-stone-900">{title}</h1>{sub && <p className="mt-0.5 text-sm text-stone-500">{sub}</p>}</div>{actions && <div className="flex gap-2">{actions}</div>}</div>;
}
export function MetricCard({ label, value, hint, tone = "stone" }: { label: string; value: number | string; hint?: string; tone?: "stone" | "teal" | "amber" }) {
  const dot = { stone: "bg-stone-400", teal: "bg-teal-600", amber: "bg-amber-500" }[tone];
  return <div className="w-card p-5"><p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{label}</p><p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{value}</p>{hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}</div>;
}
export function Card({ title, actions, children, pad = true }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; pad?: boolean }) {
  return <section className="w-card">{title && <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3"><h2 className="text-sm font-semibold text-stone-800">{title}</h2>{actions}</div>}<div className={pad ? "p-5" : ""}>{children}</div></section>;
}
export function Empty({ title, body, href, cta }: { title: string; body: string; href?: string; cta?: string }) {
  return <div className="px-6 py-14 text-center"><div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-teal-50 text-teal-700">✦</div><p className="mt-3 font-medium text-stone-800">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">{body}</p>{href && <Link href={href} className="w-btn mt-4">{cta}</Link>}</div>;
}
export function Badge({ children, tone = "stone" }: { children: React.ReactNode; tone?: "stone" | "teal" | "amber" | "rose" }) {
  const c = { stone: "bg-stone-100 text-stone-600 ring-stone-200", teal: "bg-teal-50 text-teal-800 ring-teal-200", amber: "bg-amber-50 text-amber-800 ring-amber-200", rose: "bg-rose-50 text-rose-700 ring-rose-200" }[tone];
  return <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${c}`}>{children}</span>;
}
export const ago = (iso: string) => { const s = (Date.now() - +new Date(iso)) / 1000; return s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : new Date(iso).toLocaleDateString(); };
export const initials = (s: string) => s.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "?";
