import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Shell, Section } from "@/components/marketing/Section";
import { Code } from "@/components/marketing/Code";
import { CTA } from "@/components/marketing/Page";
import { Rich } from "@/components/marketing/Blocks";
import { GUIDES } from "@/lib/pages/guides";
import { JsonLd, crumbsLd, faqLd, pageMeta, SITE_URL } from "@/lib/seo";
const find = (s: string) => GUIDES.find(g => g.slug === s);
const slug = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const dynamicParams = false;
export function generateStaticParams() { return GUIDES.map(g => ({ slug: g.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) { const g = find(params.slug); if (!g) return {}; const m = pageMeta(`/resources/${g.slug}`, g.title, g.metaDesc); return { ...m, openGraph: { ...m.openGraph, type: "article" } }; }
export default function Guide({ params }: { params: { slug: string } }) {
  const g = find(params.slug); if (!g) notFound();
  const others = GUIDES.filter(x => x.slug !== g.slug);
  const art = { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.metaDesc, dateModified: new Date(g.updated).toISOString().slice(0, 10), author: { "@type": "Person", name: "McKay Luu" }, publisher: { "@id": `${SITE_URL}/#org` }, mainEntityOfPage: `${SITE_URL}/resources/${g.slug}` };
  return <Shell><Header /><main>
    <JsonLd data={[art, crumbsLd([["Resources", "/resources"], [g.title, `/resources/${g.slug}`]]), ...(g.faqs ? [faqLd(g.faqs)] : [])]} />
    <section className="w-gradient relative overflow-hidden px-5 pb-14 pt-10 text-white"><div className="w-grid-bg absolute inset-0 opacity-60" aria-hidden /><div className="relative mx-auto max-w-4xl">
      <nav aria-label="Breadcrumb" className="text-xs text-white/70"><Link href="/" className="hover:text-white">Home</Link> / <Link href="/resources" className="hover:text-white">Resources</Link> / <span>Guide</span></nav>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-amber-300">Guide · {g.tag}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-tight">{g.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-white/85">{g.dek}</p>
      <p className="mt-5 text-xs text-white/70">By McKay Luu · {g.readMin} min read · Updated {g.updated}</p>
    </div></section>
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block"><div className="sticky top-24 text-sm"><p className="w-eyebrow-amber">On this page</p><ol className="mt-3 space-y-2 border-l border-stone-200 pl-3">{g.sections.map(s => <li key={s.h}><a href={`#${slug(s.h)}`} className="text-stone-600 hover:text-teal-700">{s.h}</a></li>)}</ol></div></aside>
      <article className="w-card-lg min-w-0 max-w-3xl p-6 text-[15.5px] leading-7 text-stone-700 sm:p-10">
        {g.sections.map(s => <section key={s.h} id={slug(s.h)} className="scroll-mt-24 border-t border-stone-100 pt-7 first:border-0 first:pt-0 [&+section]:mt-7">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">{s.h}</h2>
          {s.p?.map((p, i) => <p key={i} className="mt-3"><Rich s={p} /></p>)}
          {s.list && (s.ordered === false ? <ul className="mt-3 list-disc space-y-1.5 pl-6">{s.list.map(x => <li key={x}><Rich s={x} /></li>)}</ul> : <ul className="mt-3 space-y-1.5">{s.list.map(x => <li key={x} className="flex gap-2"><span className="mt-0.5 text-teal-700">✓</span><span><Rich s={x} /></span></li>)}</ul>)}
          {s.table && <div className="mt-4 overflow-x-auto rounded-xl ring-1 ring-stone-200"><table className="w-full min-w-[480px] text-sm"><thead className="bg-stone-50"><tr>{s.table.head.map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold text-stone-800">{h}</th>)}</tr></thead><tbody className="divide-y divide-stone-100">{s.table.rows.map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`px-4 py-2.5 align-top ${i ? "text-stone-600" : "font-medium text-stone-900"}`}>{c}</td>)}</tr>)}</tbody></table></div>}
          {s.code && <div className="mt-4"><Code>{s.code}</Code></div>}
          {s.tip && <p className="mt-4 rounded-lg border-l-4 border-l-amber-500 bg-amber-50 px-4 py-3 text-sm text-stone-700"><b className="text-amber-800">Tip:</b> <Rich s={s.tip} /></p>}
        </section>)}
        {g.faqs && <section className="mt-9 border-t border-stone-100 pt-7"><h2 className="text-xl font-semibold tracking-tight text-stone-900">Questions</h2><dl className="mt-3 divide-y divide-stone-100">{g.faqs.map(([q, a]) => <div key={q} className="py-3"><dt className="font-medium text-stone-900">{q}</dt><dd className="mt-1 text-sm text-stone-600">{a}</dd></div>)}</dl></section>}
      </article>
    </div>
    <Section eyebrow="More guides" title="Keep reading" className="bg-white"><ul className="grid gap-px overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-200 md:grid-cols-3">{others.map(o => <li key={o.slug} className="bg-white"><Link href={`/resources/${o.slug}`} className="block h-full p-5 hover:bg-stone-50"><span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">{o.tag} · {o.readMin} min</span><span className="mt-1 block font-semibold text-stone-900">{o.title}</span></Link></li>)}</ul></Section>
    <Section><CTA /></Section>
  </main><Footer /></Shell>;
}
