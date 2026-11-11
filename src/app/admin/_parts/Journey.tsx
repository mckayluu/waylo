import type { Pageview, Conversation } from "@/lib/store";
import { fmtDur } from "@/lib/channels";
// Merged timeline: pageviews (with channel, time on page, scroll depth, key clicks) + chat questions, chronological.
export function Journey({ pageviews, convs = [] }: { pageviews: Pageview[]; convs?: Conversation[] }) {
  const items = [
    ...pageviews.filter((p) => p.path !== "(chat)").map((p) => ({ at: p.at, kind: "pv" as const, label: p.title || p.path, sub: p.path, ref: p.referrer, p })),
    ...convs.flatMap((c) => c.messages.filter((m) => m.role === "visitor").map((m) => ({ at: m.at, kind: "q" as const, label: m.text, sub: "Asked Waylo", ref: undefined, p: undefined as Pageview | undefined }))),
  ].sort((a, b) => a.at.localeCompare(b.at));
  if (!items.length) return <p className="text-sm text-stone-500">No pageviews recorded yet.</p>;
  const host = (r: string) => { try { return new URL(r).host; } catch { return r; } };
  return <ol className="relative space-y-4 border-l border-stone-200 pl-5">{items.map((it, i) => (
    <li key={i} className="relative">
      <span className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${it.kind === "q" ? "bg-amber-500" : /pric|demo|contact/i.test(it.sub) ? "bg-teal-700" : "bg-stone-300"}`} />
      <p className={`text-sm ${it.kind === "q" ? "font-medium text-stone-900" : "text-stone-800"}`}>{it.kind === "q" ? `“${it.label}”` : it.label}</p>
      <p className="text-xs text-stone-500"><span className="font-mono">{it.sub}</span> · {new Date(it.at).toLocaleString()}{it.p?.channel && it.p.channel !== "Direct" ? <> · <span className="rounded bg-indigo-50 px-1 text-indigo-700">{it.p.channel}{it.p.source ? ` · ${it.p.source}` : ""}{it.p.utmCampaign ? ` · ${it.p.utmCampaign}` : ""}</span></> : it.ref && <> · from <span className="font-mono">{host(it.ref)}</span></>}</p>
      {it.p && (it.p.durationMs != null || it.p.scrollPct != null) && <p className="mt-0.5 text-xs text-stone-500">{it.p.durationMs != null && <>⏱ {fmtDur(it.p.durationMs) || "0s"} on page</>}{it.p.scrollPct != null && <> · scrolled {it.p.scrollPct}%</>}</p>}
      {!!it.p?.clicks?.length && <div className="mt-1 flex flex-wrap gap-1">{it.p.clicks.map((c, j) => <span key={j} className="rounded-md border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[11px] text-teal-800" title={c.href}>Clicked “{c.label}”</span>)}</div>}
    </li>))}</ol>;
}
