import { snippet } from "@/lib/embed";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Section, Shell } from "@/components/marketing/Section";
import { Code } from "@/components/marketing/Code";
import { FactsBlock } from "@/components/marketing/Page";
import { ValueProps, WorkflowStrip, PhotoBand, PHOTOS, CrawlVisual, SignalsVisual, HandoffVisual, GuidanceVisual, Chip } from "@/components/marketing/Visuals";
import { Shot, ShotNote } from "@/components/marketing/Shots";
import { ProductTour } from "@/components/marketing/ProductTour";
import { tourSteps } from "@/lib/tour";
import { MSG } from "@/lib/messaging";
import { TryWaylo } from "@/components/try/TryWaylo";
import { JsonLd, orgLd, appLd, faqLd, FAQS, DEFINITION } from "@/lib/seo";

export const metadata: Metadata = { title: { absolute: "Waylo – Your website’s own AI chat" }, description: "Waylo learns the public pages on your site and answers visitor questions the way your team would, with a link to the page behind each answer.", alternates: { canonical: "/" }, openGraph: { title: "Waylo – Your website’s own AI chat", description: "Waylo learns the public pages on your site and answers visitor questions the way your team would, with a link to the page behind each answer.", url: "/", siteName: "Waylo", type: "website", images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo – Your website’s own AI chat" }] }, twitter: { card: "summary_large_image", title: "Waylo – Your website’s own AI chat", description: "Waylo learns the public pages on your site and answers visitor questions the way your team would, with a link to the page behind each answer.", images: ["/brand/og.png"] } };

const features = [
  ["Source links on every answer", "Each reply links the pages it used. Buyers can check it, and so can your team."],
  ["Site crawl", "Enter your domain and Waylo reads your public pages. Run it again after you change the site."],
  ["Buying signals", "Questions about pricing, integrations, security, and demos are flagged and tied to the pages the visitor read."],
  ["Contact and demo requests", "When a visitor asks for a person, Waylo takes their details. On Starter and up it also posts them to Slack or your webhook."],
  ["Slack and JSON webhook", "Starter and up. Alerts go to a Slack channel. The JSON webhook can feed HubSpot or Salesforce through Zapier, Make, or your own endpoint."],
  ["Guidance", "Add facts, rules, and skills so the chat talks the way your team does and stays off topics you choose."],
  ["Audiences", "On Growth, group visitors by what they did. For example, everyone who viewed /pricing."],
  ["Team roles", "Invite teammates as Owner, Editor, or Viewer."],
];
const steps = [["Add your site", "Enter your domain and Waylo crawls your public pages."], ["Paste one tag", "Put the snippet on your site, in your CMS, or in Google Tag Manager."], ["Visitors ask", "The launcher or sidebar answers from your pages, with links, at any hour."], ["Follow up", "On Starter and up, serious visitors and contact requests post to Slack or your webhook."]];
const outcomes = [["A visitor asks “Do you have SSO?”", "Waylo answers from your security page and links it. If the page doesn’t say, the chat says it doesn’t know."], ["Pricing and demo questions get flagged.", "You see them in the admin with the pages the visitor read first."], ["Contact requests reach a person.", "On Starter and up they post to Slack or your webhook with the last question and a link to the conversation."]];
const faqs = FAQS;
function ProductShot() {
  return (
    <figure className="w-glow overflow-hidden rounded-2xl border border-white/20 bg-white">
      <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-100 px-4 py-2.5"><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="h-2.5 w-2.5 rounded-full bg-stone-300" /><span className="ml-3 text-xs text-stone-500">waylo-j5hv.onrender.com/demo</span></div>
      <Image src="/product/demo-northpoint-answer.webp" alt="Waylo chat on the fictional Northpoint Ops demo site answering “How much is Pro per tech?” with a Northpoint Ops Pricing source chip" width={1920} height={1072} priority sizes="(min-width:1024px) 620px, 100vw" className="h-auto w-full" />
      <figcaption className="border-t border-stone-200 bg-white px-4 py-2 text-[11px] text-stone-500">Real screenshot of the <Link href="/demo" className="font-medium text-teal-700 hover:underline">/demo</Link> page. Northpoint Ops is a fictional company. The answer and its source chip come from its pricing page.</figcaption>
    </figure>
  );
}

const rows: [string, string, string, string, string[]][] = [
  ["Cited answers", "Answers visitors can check", "Waylo reads your public pages and replies with links to the pages behind each answer. When your pages don’t cover a question, it says so and offers the contact form.", "/product/widget-answer.webp", ["Answers come from your published pages", "Source links on every reply", "Facts and rules you set"]],
  ["Buying signals", "See who is serious while they browse", "Questions about pricing, integrations, and demos are flagged as buying intent. Each one sits next to the pages that visitor read.", "/product/admin-tracking.webp", ["Signals on each conversation", "Audiences such as “viewed /pricing” on Growth", "A link to the full conversation"]],
  ["Team handoff", "Leads show up in Slack", "On Starter and up, alerts go to a Slack channel or a JSON webhook. Use the webhook with Zapier, Make, or your own endpoint to reach your CRM.", "/product/admin-integrations.webp", ["Slack alerts", "JSON webhook for your CRM", "Owner, Editor, and Viewer roles"]],
];
const stats: [string, string][] = [["1 tag", "to install"], ["async", "won’t block your page"], ["3", "embed modes"], ["500", "free AI messages"]];

export default function Home() {
  return (
    <Shell>
      <Header />
      <main>
        <JsonLd data={[orgLd, appLd, faqLd(FAQS)]} />
        <section className="w-gradient relative overflow-hidden px-5 pb-20 pt-10 text-white sm:pt-14">
          <div className="w-grid-bg absolute inset-0 opacity-70" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />Early access</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Your website’s <span className="w-text-grad-light">own AI chat</span></h1>
              <p className="mt-5 max-w-xl text-lg text-white/90">Waylo learns the public pages on your site and answers visitor questions the way your team would, with a link to the page behind each answer.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent px-5 py-3 text-base">Start free trial</Link><Link href="/how-it-works" className="w-btn-glass px-5 py-3 text-base">See how it works</Link></div><p className="mt-3 text-xs text-white/70">500 AI messages free. One script tag to install.</p>
              <div id="try" className="mt-7 max-w-xl scroll-mt-24"><p className="mb-2 text-sm font-medium text-white/90">Or try it on your own site first. It takes about a minute, with no signup.</p><TryWaylo compact /></div>
              <dl className="mt-8 grid max-w-lg grid-cols-4 gap-3 border-t border-white/15 pt-6">{stats.map(([v, l]) => <div key={l}><dt className="text-xl font-semibold">{v}</dt><dd className="text-xs text-white/70">{l}</dd></div>)}</dl>
            </div>
            <div id="product" className="relative scroll-mt-20">
              <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,.35),rgba(99,102,241,.25)_50%,transparent_75%)] blur-3xl" aria-hidden />
              <div className="relative"><ProductShot /></div>
              
            </div>
          </div>
        </section>
        <div className="relative z-10 -mt-10 px-5"><div className="mx-auto max-w-6xl shadow-xl shadow-indigo-950/10"><ValueProps items={MSG.props} /></div></div>
        
        <Section id="tour" eyebrow="Self-serve" title="Set it up yourself in eight screens" sub="These are the real screens, in order. You go from signup to a cited answer and a Slack alert without talking to anyone." className="bg-white">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <ProductTour steps={tourSteps()} compact />
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Where we are</p>
              <ul className="mt-3 space-y-2">
                <li className="flex gap-2"><span className="text-teal-700">✓</span>The Trial includes 500 AI messages. No card needed.</li>
                <li className="flex gap-2"><span className="text-teal-700">✓</span>Starter is $79 a month and Growth is $249. No contract.</li>
                <li className="flex gap-2"><span className="text-teal-700">✓</span>Every step is in the admin. The docs and FAQ cover the rest.</li>
                <li className="flex gap-2"><span className="text-amber-600">–</span>We run on a free hosting tier, so a first load can be slow. Stripe is in test mode.</li>
                <li className="flex gap-2"><span className="text-amber-600">–</span>We don’t have customer logos yet, so we don’t show any.</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2"><Link href="/signup" className="w-btn-accent px-4 py-2">Start free trial</Link><Link href="/how-it-works" className="w-btn-ghost px-4 py-2">Full tour</Link></div>
            </div>
          </div>
        </Section>
        <Section className="w-mesh">
          <div className="grid gap-y-5 border-y border-stone-200 py-6 md:grid-cols-[1.3fr_1fr_1fr] md:divide-x md:divide-stone-200">{outcomes.map(([a, b], i) => <div key={a} className={i ? "md:pl-6" : "md:pr-6"}><p className={i ? "font-semibold text-stone-900" : "text-xl font-semibold tracking-tight text-stone-900"}>{a}</p><p className="mt-1 text-sm leading-6 text-stone-600">{b}</p></div>)}</div>
          <div className="mt-8"><WorkflowStrip /></div>
        </Section>
        <Section id="views" eyebrow="Inside the admin" title="Four views your team will use" sub="Knowledge shows what was crawled. Signals shows who asked about what. Guidance holds your facts and rules. Handoff decides where leads go." className="bg-white">
          <div className="grid gap-5 lg:grid-cols-2">{([["teal", "Knowledge", "Your site, read by Waylo", "Paste a domain and Waylo crawls your public pages. It re-crawls every 3 days on the Trial and daily on paid plans.", <CrawlVisual key="c" />], ["amber", "Signals", "Who asked about pricing, and from which page", "Pricing, security, integration, and demo questions are flagged and tied to the pages the visitor read.", <SignalsVisual key="s" />], ["indigo", "Handoff", "Leads arrive with context", "On Starter and up, contact and demo requests post to Slack or your webhook with the last question and a link to the conversation.", <HandoffVisual key="h" />], ["teal", "Guidance", "Answers stay inside what you’ve published", "Facts, rules, and skills keep answers accurate and in your voice. When Waylo doesn’t know, it says so.", <GuidanceVisual key="g" />]] as const).map(([t, k, h, d, v], i) => <div key={k} className={`rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200 ${i === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-8" : ""}`}><div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold tracking-tight">{h}</h3><p className="mt-1 text-sm text-stone-600">{d}</p></div><Chip t={t}>{k}</Chip></div>{v}</div>)}</div>
        </Section>
        <Section id="screens" eyebrow="Real screens" title="The admin your team works in" sub="These are real admin screens from the Trial, with sample data." className="w-mesh">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"><Shot k="conv" /><div className="grid gap-5"><Shot k="guidance" crop="h-44" /><Shot k="content" crop="h-44" /></div></div><ShotNote />
        </Section>
        <Section id="features" eyebrow="Features" title="What’s included" sub="Every plan gets the chat, the crawl, and signals. Slack, webhooks, guidance, and audiences depend on the plan." className="w-mesh">
          <div className="space-y-8">{rows.map(([tag, t, d, img, bullets], i) => <div key={t} className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <figure className="overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 w-glow"><Image src={img} alt={`Waylo product screenshot: ${tag}`} width={1440} height={900} sizes="(min-width:1024px) 560px, 100vw" className={`h-72 w-full object-cover ${i === 0 ? "object-top" : "object-left-top"}`} /><figcaption className="flex items-center justify-between border-t border-stone-200 px-4 py-2 text-xs text-stone-500"><span className="font-semibold text-indigo-700">{tag}</span><span>{["Widget on the /demo site", "Admin → Tracking → one visitor", "Admin → Integrations"][i]}</span></figcaption></figure>
            <div><p className="w-eyebrow">{tag}</p><h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t}</h3><p className="mt-3 text-stone-600">{d}</p><ul className="mt-5 grid gap-2 sm:grid-cols-2">{bullets.map(b => <li key={b} className="flex items-start gap-2 text-sm text-stone-700"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">✓</span>{b}</li>)}</ul></div>
          </div>)}</div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[220px_1fr]"><div><h3 className="text-lg font-semibold tracking-tight">Full feature list</h3><p className="mt-1 text-sm text-stone-600">Everything in the admin today.</p><Link href="/features" className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">Feature details →</Link></div><dl className="grid border-t border-stone-200 sm:grid-cols-2 sm:gap-x-10">{features.map(([t, d]) => <div key={t} className="border-b border-stone-200 py-4"><dt className="font-semibold text-stone-900">{t}</dt><dd className="mt-1 text-sm leading-6 text-stone-600">{d}</dd></div>)}</dl></div>
        </Section>
        <section id="how" className="scroll-mt-20 bg-stone-950 px-5 py-14 text-white sm:py-16"><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-300">How it works</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Live in about ten minutes</h2><p className="mt-3 text-stone-300">There’s no SDK and no build step. The tag loads async, so it won’t slow your page. Pick <code className="text-amber-200">launcher</code>, <code className="text-amber-200">sidebar</code>, or <code className="text-amber-200">track</code> with <code className="text-amber-200">data-mode</code>.</p>
            <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">{steps.map(([t, d], i) => <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 py-3.5"><span className="font-mono text-sm text-amber-300">0{i + 1}</span><p className="text-sm text-stone-300"><b className="font-semibold text-white">{t}.</b> {d}</p></li>)}</ol></div>
          <div><Code label="Paste before </body>">{snippet()}</Code><div className="mt-4"><Code label="Open chat from your own button">{`<button onclick="Waylo.open()">Talk to us</button>`}</Code></div><p className="mt-4 text-sm"><Link href="/docs/embed-modes" className="mr-4 font-medium text-amber-300 hover:underline">Compare embed modes →</Link><Link href="/docs/install" className="font-medium text-amber-300 hover:underline">Read the install guide →</Link></p><p className="mt-6 text-sm text-stone-400">Works with Webflow · WordPress · Squarespace · Wix · Shopify · Google Tag Manager · Slack · CRM webhooks</p></div>
        </div></section>
        <Section eyebrow="Who it helps" title="Who uses it" className="bg-white"><PhotoBand items={[PHOTOS.support, PHOTOS.meeting, PHOTOS.dashboard, PHOTOS.workshop]} /></Section>
        <Section id="what" eyebrow="In short" title="What is Waylo?" className="w-mesh"><div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]"><div><p className="text-lg leading-8 text-stone-700">{DEFINITION}</p><div className="relative mt-6 overflow-hidden rounded-2xl w-glow"><Image src="/marketing/collab.webp" alt="A marketing and sales team reviewing website conversations together" width={1400} height={934} sizes="(min-width:1024px) 480px, 100vw" className="h-56 w-full object-cover" /></div><p className="mt-5 text-sm"><Link href="/features" className="font-medium text-teal-700 hover:underline">All features →</Link> · <Link href="/use-cases" className="font-medium text-teal-700 hover:underline">Use cases →</Link></p></div><FactsBlock /></div></Section>
        <Section id="pricing" eyebrow="Pricing" title="Three plans with the price on the page" className="bg-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end"><div className="overflow-hidden rounded-xl ring-1 ring-stone-200">{[["Trial", "$0", "1 site · 500 AI messages"], ["Starter", "$79/mo", "3,000 messages · Slack and webhooks"], ["Growth", "$249/mo", "3 sites · 15,000 messages · Audiences"]].map(([n, p, d], i) => <div key={n} className={`grid grid-cols-[6rem_6.5rem_1fr] items-baseline gap-3 px-5 py-4 text-sm ${i ? "border-t border-stone-200" : ""} ${i === 1 ? "bg-teal-50/60" : "bg-white"}`}><p className="font-semibold text-stone-900">{n}</p><p className="text-xl font-semibold tracking-tight">{p}</p><p className="text-stone-600">{d}</p></div>)}</div>
          <div><Link href="/pricing" className="w-btn-grad px-5 py-2.5">Compare plans →</Link><p className="mt-3 text-xs text-stone-500">Checkout runs on Stripe. Change or cancel your plan from Billing in the admin.</p></div></div>
        </Section>
        <Section id="faq" className="w-mesh">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]"><div className="lg:sticky lg:top-24 lg:self-start"><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">FAQ</p><h2 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-[2rem]">Common questions</h2><Link href="/faq" className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">All questions →</Link></div><div className="divide-y divide-stone-200 border-y border-stone-200">{faqs.map(([q, a]) => <details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium"><h3>{q}</h3><span className="text-lg leading-none text-amber-700 transition group-open:rotate-45">+</span></summary><p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{a}</p></details>)}</div></div>
        </Section>
        <section className="px-5 pb-14 pt-4"><div className="w-gradient w-glow relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-3xl px-8 py-12 text-white md:grid-cols-[1.3fr_1fr]"><div className="w-grid-bg absolute inset-0 opacity-50" aria-hidden /><div className="relative"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">You can have it live this afternoon</h2><p className="mt-3 text-white/85">Crawl your pages, paste one script tag, and watch the first answers come in. 500 AI messages free.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent px-5 py-3 text-base">Start free trial</Link><Link href="/how-it-works" className="w-btn-glass px-5 py-3 text-base">See how it works</Link><Link href="/demo" className="px-2 py-3 text-sm font-medium text-white/85 underline-offset-4 hover:underline">Try the demo site</Link></div></div><div className="relative hidden overflow-hidden rounded-2xl ring-1 ring-white/20 md:block"><Image src="/marketing/office.webp" alt="" width={1400} height={935} sizes="400px" className="h-56 w-full object-cover opacity-90" /></div></div></section>
      </main>
      <Footer />
    </Shell>
  );
}
