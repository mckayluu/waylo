import type { Pageview, Conversation } from "@/lib/store";
// Merged timeline: pageviews + chat questions, chronological.
export function Journey({ pageviews, convs = [] }: { pageviews: Pageview[]; convs?: Conversation[] }) {
  const items = [
    ...pageviews.filter((p) => p.path !== "(chat)").map((p) => ({ at: p.at, kind: "pv" as const, label: p.title || p.path, sub: p.path, ref: p.referrer })),
    ...convs.flatMap((c) => c.messages.filter((m) => m.role === "visitor").map((m) => ({ at: m.at, kind: "q" as const, label: m.text, sub: "Asked Waylo", ref: undefined }))),
  ].sort((a, b) => a.at.localeCompare(b.at));
  if (!items.length) return <p className="text-sm text-stone-500">No pageviews recorded yet.</p>;
  return <ol className="relative space-y-4 border-l border-stone-200 pl-5">{items.map((it, i) => (
    <li key={i} className="relative">
      <span className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${it.kind === "q" ? "bg-amber-500" : /pric|demo|contact/i.test(it.sub) ? "bg-teal-700" : "bg-stone-300"}`} />
      <p className={`text-sm ${it.kind === "q" ? "font-medium text-stone-900" : "text-stone-800"}`}>{it.kind === "q" ? `“${it.label}”` : it.label}</p>
      <p className="text-xs text-stone-500"><span className="font-mono">{it.sub}</span> · {new Date(it.at).toLocaleString()}{it.ref && <> · from <span className="font-mono">{(() => { try { return new URL(it.ref).host; } catch { return it.ref; } })()}</span></>}</p>
    </li>))}</ol>;
}
