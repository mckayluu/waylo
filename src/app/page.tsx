import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Shell } from "@/components/marketing/Section";
import { JsonLd, orgLd, appLd } from "@/lib/seo";

export const metadata: Metadata = { title: { absolute: "Waylo – Your website’s own AI chat" }, description: "Waylo answers visitors’ questions from your own pages, so they find what they came for instead of leaving. You see what they ask, and you hear about the ones who are ready to buy.", alternates: { canonical: "/" }, openGraph: { title: "Waylo – Your website’s own AI chat", description: "Waylo answers visitors’ questions from your own pages, so they find what they came for instead of leaving. You see what they ask, and you hear about the ones who are ready to buy.", url: "/", siteName: "Waylo", type: "website", images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo – Your website’s own AI chat" }] }, twitter: { card: "summary_large_image", title: "Waylo – Your website’s own AI chat", description: "Waylo answers visitors’ questions from your own pages, so they find what they came for instead of leaving. You see what they ask, and you hear about the ones who are ready to buy.", images: ["/brand/og.png"] } };

// Hero collage: real product screenshots on colour-blocked tiles (design language adapted from the Awardco reference).
function HeroCollage() {
  return (
    <figure className="relative mx-auto w-full max-w-[560px]">
      <div className="grid grid-cols-[1.05fr_1fr] gap-4">
        <div className="w-tile w-tile-blush row-span-2 flex items-end justify-center px-5 pt-6 w-rise">
          <div className="w-shot-float w-full max-w-[250px] translate-y-3"><Image src="/product/widget-answer.webp" alt="Waylo chat widget on the fictional Northpoint Ops demo site answering “How much is Pro per tech?” with a source chip that links its pricing page" width={406} height={648} priority sizes="250px" className="h-auto w-full" /></div>
        </div>
        <div className="w-tile w-tile-mist relative h-44 p-3 w-rise-2"><span className="w-pill absolute left-3 top-3 z-10 bg-card/90">Visitor journey</span><div className="w-shot-float mt-9 h-full"><Image src="/product/admin-tracking.webp" alt="Visitor journey in the Waylo admin with pages viewed and the questions asked" width={1440} height={900} sizes="260px" className="h-full w-full object-cover object-[18%_22%]" /></div></div>
        <div className="w-tile w-tile-cream relative h-44 p-3 w-rise-3"><span className="w-pill absolute left-3 top-3 z-10 bg-card/90">Slack alerts</span><div className="w-shot-float mt-9 h-full"><Image src="/product/admin-integrations.webp" alt="Waylo admin Integrations view with Slack and CRM webhooks connected and recent deliveries" width={1440} height={900} sizes="260px" className="h-full w-full object-cover object-[40%_25%]" /></div></div>
      </div>
      <figcaption className="mt-6 text-xs leading-5 text-white/65">Real screenshots. The chat is on <Link href="/demo" className="underline hover:text-white">/demo</Link>, where Northpoint Ops is a fictional company. Admin views use sample data.</figcaption>
    </figure>
  );
}
const does: [string, string, string, string, string][] = [
  ["Answers you can trust.", "Waylo only answers from your site and links to the page it used. If your site doesn’t cover something, it says so instead of guessing.", "/product/admin-conv.webp", "object-[30%_30%]", "w-tile-blush"],
  ["See what people want.", "Every question shows up in your dashboard, so you learn what buyers care about and which pages leave them stuck.", "/product/admin-tracking.webp", "object-[15%_20%]", "w-tile-mist"],
  ["Know when someone’s ready.", "When a visitor asks about pricing or says they’re ready to buy, you get a Slack message with the whole conversation.", "/product/admin-integrations.webp", "object-[38%_22%]", "w-tile-cream"],
];
const helps: [string, string, string][] = [
  ["SaaS companies", "Evaluators get answers from your pricing and docs pages without waiting on your team.", "/solutions/saas"],
  ["B2B service firms", "Prospects learn what you do and how you work, and you hear from the ones ready to talk.", "/use-cases/b2b-services"],
  ["Online stores", "Shoppers get answers on shipping and returns from your own policy pages before they buy.", "/use-cases/ecommerce"],
  ["Agencies", "Add Waylo to each client’s site. Every site gets its own workspace.", "/use-cases/agencies"],
  ["Sales teams", "Reps hear about serious visitors in Slack, along with the question they asked.", "/solutions/sales"],
  ["Support teams", "Repeat how-to questions get answered from your docs, with a link to the right article.", "/use-cases/support-deflection"],
];

export default function Home() {
  return (
    <Shell>
      <Header />
      <main>
        <JsonLd data={[orgLd, appLd]} />
        <section className="w-band-navy relative overflow-hidden px-5 pb-20 pt-12 sm:pb-24 sm:pt-16">
          <div aria-hidden className="pointer-events-none absolute -left-16 bottom-10 hidden h-32 w-32 -rotate-6 rounded-[26px] bg-navy-700 lg:block" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="w-rise">
              <p className="w-pill w-pill-dark"><span className="w-pill-dot" />AI chat for your website</p>
              <h1 className="w-h-xl mt-6 font-semibold text-white">Your website’s <span className="w-marker">own AI chat</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">Waylo answers visitors’ questions from your own pages, so they find what they came for instead of leaving. You see what they ask, and you hear about the ones who are ready to buy.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent w-btn-lg">Start free trial</Link><Link href="/try" className="w-btn-glass w-btn-lg">Try it on your site</Link></div>
            </div>
            <div id="product" className="relative scroll-mt-20"><HeroCollage /></div>
          </div>
        </section>

        <section aria-labelledby="problem" className="w-band-mist px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="problem" className="w-h-lg font-semibold text-warm-900">Most visitors have a question. Few of them ask it.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-warm-600">They skim a page or two, can’t find the answer, and leave. You never find out what they wanted.</p>
          </div>
        </section>

        <section id="features" aria-labelledby="does" className="scroll-mt-20 bg-card px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 id="does" className="w-h-lg max-w-2xl font-semibold text-warm-900">What Waylo does</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">{does.map(([t, d, img, pos, tile]) => <div key={t} className={`w-tile ${tile} flex flex-col p-6`}>
              <div className="w-shot-float"><Image src={img} alt="" width={1440} height={900} sizes="(min-width:768px) 360px, 100vw" className={`h-44 w-full object-cover ${pos}`} /></div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-warm-900">{t}</h3><p className="mt-2 leading-7 text-warm-700">{d}</p></div>)}</div>
          </div>
        </section>

        <section aria-labelledby="helps" className="w-band-paper px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 id="helps" className="w-h-lg max-w-2xl font-semibold text-warm-900">Who Waylo helps</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{helps.map(([t, d, href]) => <li key={t}><Link href={href} className="w-tile w-tile-card group flex h-full flex-col p-6 ring-1 ring-warm-200 transition hover:-translate-y-0.5 hover:ring-rasp-600">
              <span className="font-display text-xl font-semibold text-warm-900">{t}</span><span className="mt-2 flex-1 leading-7 text-warm-600">{d}</span><span className="mt-4 text-sm font-semibold text-rasp-700 group-hover:underline">Learn more →</span></Link></li>)}</ul>
          </div>
        </section>

        <section aria-label="Setup and pricing" className="bg-card px-5 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
            <div id="how" className="w-tile w-band-navy relative overflow-hidden p-8 sm:p-10">
              <div aria-hidden className="absolute -right-5 -top-5 h-24 w-24 rotate-6 rounded-[22px] bg-rasp-600" />
              <h2 className="w-h-lg relative font-semibold text-white">Set it up yourself.</h2>
              <p className="relative mt-4 text-lg leading-8 text-white/80">Add your website, paste one line of code, and publish. No call needed.</p>
              <Link href="/how-it-works" className="w-btn-accent w-btn-lg relative mt-8 inline-flex">See how it works</Link>
            </div>
            <div id="pricing" className="w-tile w-tile-blush relative overflow-hidden p-8 sm:p-10">
              <div aria-hidden className="absolute -right-4 -top-4 h-20 w-20 -rotate-6 rounded-[18px] bg-navy-900" />
              <h2 className="w-h-lg relative font-semibold text-warm-900">Simple monthly plans.</h2>
              <p className="relative mt-4 text-lg leading-8 text-warm-700">Start free, no card. Every plan has every feature. Cancel anytime.</p>
              <Link href="/pricing" className="w-btn-ghost w-btn-lg relative mt-8 inline-flex bg-card">See pricing</Link>
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 w-band-paper pt-16"><div className="w-tile w-band-navy relative mx-auto max-w-6xl overflow-hidden px-8 py-16 text-center sm:px-12">
          <div aria-hidden className="absolute -right-6 -top-6 h-36 w-36 rotate-6 rounded-[28px] bg-rasp-600" /><div aria-hidden className="absolute bottom-8 left-10 h-16 w-16 -rotate-6 rounded-[16px] bg-blush" />
          <div className="relative"><h2 className="w-h-lg font-semibold text-white">See it on your own site.</h2><p className="mt-4 text-lg text-white/80">Enter your website and ask it anything.</p>
            <div className="mt-8 flex justify-center"><Link href="/try" className="w-btn-accent w-btn-lg">Try it free</Link></div></div>
        </div></section>
      </main>
      <Footer />
    </Shell>
  );
}
