import { listConversations, listPages, getSettings, getLastCrawl, currentWs, DEFAULT_WS } from "@/lib/store";
import { KNOWLEDGE } from "@/lib/knowledge";
import { decodeEntities } from "@/lib/crawler";
import { PageHeader, Card, Badge, ago } from "../ui";
import { CrawlPanel } from "./CrawlPanel";
import { DeletePage } from "./DeletePage";
export const dynamic = "force-dynamic";
export default async function Content({ searchParams }: { searchParams: { q?: string } }) {
  const counts = new Map<string, number>();
  (await listConversations()).forEach((c) => c.messages.forEach((m) => m.citations?.forEach((x) => counts.set(x.url, (counts.get(x.url) || 0) + 1))));
  const pages = (await listPages()); const crawled = pages.length > 0; const q = (searchParams.q || "").toLowerCase();
  const isDefault = (await currentWs()) === DEFAULT_WS;
  const rows = (crawled ? pages.map((p) => ({ id: p.id, url: p.url, title: decodeEntities(p.title), summary: decodeEntities(p.text.slice(0, 220)), chars: p.text.length, at: p.updatedAt }))
    : isDefault ? KNOWLEDGE.map((k) => ({ id: "", url: k.url, title: k.title, summary: k.summary.replace(/\*\*|`/g, ""), chars: k.summary.length, at: "" })) : [])
    .filter((r) => !q || (r.title + r.url + r.summary).toLowerCase().includes(q));
  const totalChars = pages.reduce((n, p) => n + p.text.length, 0);
  const emptyNew = !crawled && !isDefault;
  return (<>
    <PageHeader title="Content" sub={crawled ? `${pages.length} pages indexed from your site · ${(totalChars / 1000).toFixed(0)}k characters. Waylo answers from these and cites them.` : emptyNew ? "Nothing crawled yet. This workspace starts empty — add your website URL and crawl to index your own pages." : "Nothing crawled yet — Waylo is using its built-in sample pages."} />
    <div className="mb-4"><Card title="Crawl your site"><CrawlPanel siteUrl={(await getSettings()).siteUrl} last={(await getLastCrawl())} /></Card></div>
    <form className="mb-3"><input name="q" defaultValue={searchParams.q} placeholder="Filter pages…" className="w-input max-w-xs" /></form>
    <Card pad={false}><div className="overflow-x-auto"><table className="w-full text-sm">
      <thead className="border-b border-stone-100 bg-stone-50/60"><tr><th className="w-th">Page</th><th className="w-th">Preview</th><th className="w-th">Status</th><th className="w-th text-right">Cited</th><th className="w-th" /></tr></thead>
      <tbody className="divide-y divide-stone-100">{rows.map((k) => <tr key={k.url} className="group align-top hover:bg-stone-50">
        <td className="max-w-xs px-4 py-2.5"><a href={k.url} target="_blank" rel="noreferrer" className="font-medium text-stone-800 hover:text-teal-700">{k.title}</a><p className="truncate font-mono text-xs text-stone-400">{k.url}</p></td>
        <td className="max-w-md px-4 py-2.5 text-stone-600"><p className="line-clamp-2">{k.summary}</p><p className="mt-0.5 text-[11px] text-stone-400">{k.chars.toLocaleString()} chars{k.at && ` · ${ago(k.at)}`}</p></td>
        <td className="px-4 py-2.5">{crawled ? <Badge tone="teal">Indexed</Badge> : <Badge>Sample</Badge>}</td>
        <td className="px-4 py-2.5 text-right tabular-nums text-stone-600">{counts.get(k.url) || 0}</td>
        <td className="px-3 py-3 text-right">{k.id && <DeletePage id={k.id} />}</td></tr>)}
        {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-stone-500">{emptyNew ? <>No pages indexed yet. Set your website URL in Settings, then crawl — Waylo won’t use the sample Waylo pages in this workspace.</> : q ? "No pages match." : "No pages yet."}</td></tr>}</tbody></table></div></Card>
  </>);
}
