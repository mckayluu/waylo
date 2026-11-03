import Link from "next/link";
import { listConversations } from "@/lib/store";
import { PageHeader, Card, Empty, Badge, ago } from "../ui";
import { Tag } from "../Tag";
export const dynamic = "force-dynamic";
export default async function Questions({ searchParams }: { searchParams: { q?: string; signal?: string; id?: string } }) {
  const q = (searchParams.q || "").toLowerCase(), sig = searchParams.signal || "";
  const all = (await listConversations()).flatMap((c) => c.messages.map((m, i) => ({ c, m, i })).filter((x) => x.m.role === "visitor").map(({ c, m, i }) => ({ c, m, answer: c.messages.slice(i + 1).find((x) => x.role === "bot") })))
    .sort((a, b) => b.m.at.localeCompare(a.m.at));
  const signals = [...new Set(all.flatMap((x) => x.c.signals))].sort();
  const rows = all.filter((x) => (!q || x.m.text.toLowerCase().includes(q) || x.answer?.text.toLowerCase().includes(q)) && (!sig || x.c.signals.includes(sig)));
  const sel = rows.find((x) => x.m.id === searchParams.id) || rows[0];
  const qs = (o: Record<string, string>) => "?" + new URLSearchParams({ ...(q && { q }), ...(sig && { signal: sig }), ...o }).toString();
  return (<>
    <PageHeader title="Questions" sub={`${all.length} questions asked across ${(await listConversations()).length} conversations.`} />
    <form className="mb-4 flex flex-wrap gap-2">
      <input name="q" defaultValue={searchParams.q} placeholder="Search questions and answers…" className="w-input max-w-sm" />
      <select name="signal" defaultValue={sig} className="w-input w-auto"><option value="">All topics</option>{signals.map((s) => <option key={s}>{s}</option>)}</select>
      <button className="w-btn">Filter</button>{(q || sig) && <Link href="/admin/questions" className="w-btn-ghost">Clear</Link>}
    </form>
    {rows.length === 0 ? <Card>{all.length === 0 ? <Empty title="No questions yet" body="Every question visitors ask Waylo shows up here with the answer and sources." href="/demo" cta="Ask on the demo" secondaryHref="/admin/install" secondaryCta="Install on your site" /> : <Empty title="No questions match" body="Nothing matches this search or topic." href="/admin/questions" cta="Clear filters" />}</Card> :
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2"><Card pad={false}><ul className="max-h-[70vh] divide-y divide-stone-100 overflow-y-auto">{rows.map((x) => (
        <li key={x.m.id}><Link href={qs({ id: x.m.id })} className={`block px-4 py-2.5 text-sm transition ${sel?.m.id === x.m.id ? "bg-teal-50/70 shadow-[inset_3px_0_0_#0f766e]" : "hover:bg-stone-50"}`}>
          <p className="line-clamp-2 font-medium text-stone-800">{x.m.text}</p>
          <p className="mt-1 flex items-center gap-2 text-xs text-stone-500"><span className="truncate">{x.c.visitorName || x.c.visitorEmail || "Anonymous"}</span>·<span>{ago(x.m.at)}</span>{x.answer?.feedback && <span>{x.answer.feedback === "up" ? "👍" : "👎"}</span>}</p>
        </Link></li>))}</ul></Card></div>
      {sel && <div className="lg:col-span-3"><Card title="Question" actions={<Link href={`/admin/c/${sel.c.id}`} className="text-xs font-medium text-teal-700 hover:underline">Full transcript →</Link>}>
        <p className="text-lg font-medium text-stone-900">{sel.m.text}</p>
        <p className="mt-1 text-xs text-stone-500">{sel.c.visitorName || sel.c.visitorEmail || "Anonymous visitor"} · {new Date(sel.m.at).toLocaleString()}</p>
        <div className="mt-3 flex flex-wrap gap-1">{sel.c.signals.map((s) => <Tag key={s} s={s} />)}</div>
        <p className="w-label mt-6">Waylo answered</p>
        {sel.answer ? <><div className="whitespace-pre-wrap rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-relaxed text-stone-700">{sel.answer.text}</div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">{sel.answer.citations?.map((c, i) => <a key={i} href={c.url} target="_blank" className="rounded-md border border-stone-200 bg-white px-1.5 py-0.5 text-[11px] text-stone-600 hover:border-teal-300"><span className="mr-1 font-mono font-semibold text-teal-700">{i + 1}</span>{c.title}</a>)}
            {!sel.answer.citations?.length && <span className="text-xs text-stone-400">No sources cited</span>}
            {sel.answer.feedback && <Badge tone={sel.answer.feedback === "up" ? "teal" : "rose"}>{sel.answer.feedback === "up" ? "Helpful" : "Not helpful"}</Badge>}</div></>
          : <p className="text-sm text-stone-400">No answer recorded.</p>}
      </Card></div>}
    </div>}
  </>);
}
