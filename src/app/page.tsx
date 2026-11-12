import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Shell } from "@/components/marketing/Section";
import { JsonLd, orgLd, appLd, faqLd } from "@/lib/seo";
import { ProductTour } from "@/components/marketing/ProductTour";
import { tourSteps } from "@/lib/tour";

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
  ["Know when someone’s ready.", "When a visitor looks ready to buy or leaves their details, you get a Slack message with the whole conversation.", "/product/admin-integrations.webp", "object-[38%_22%]", "w-tile-cream"],
];
const helps: [string, string, string][] = [
  ["SaaS companies", "Evaluators get answers from your pricing and docs pages without waiting on your team.", "/solutions/saas"],
  ["B2B service firms", "Prospects learn what you do and how you work, and you hear from the ones ready to talk.", "/use-cases/b2b-services"],
  ["Online stores", "Shoppers get answers on shipping and returns from your own policy pages before they buy.", "/use-cases/ecommerce"],
  ["Agencies", "Add Waylo to each client’s site. Every site gets its own workspace.", "/use-cases/agencies"],
  ["Sales teams", "Reps hear about serious visitors in Slack, along with the question they asked.", "/solutions/sales"],
  ["Support teams", "Repeat how-to questions get answered from your docs, with a link to the right article.", "/use-cases/support-deflection"],
];
const stack = ["Slack", "CRM via webhooks", "Google Tag Manager", "Webflow", "WordPress", "Shopify", "Squarespace", "Wix"];
const homeFaqs: [string, string][] = [
  ["How do I know the answers are right?", "Waylo only answers from the public pages it reads on your site, and every answer links the page it used. If your pages don’t cover a question, it says it doesn’t know and offers your contact form."],
  ["How do I set it up?", "Add your website and let Waylo read your pages. Then paste one line of code into your site or Google Tag Manager, and publish."],
  ["Do I need a card to start?", "No. The 14-day Trial is free and needs no card. After that, Starter is $79 a month and Growth is $249 a month. Every plan has every feature."],
  ["What happens to my data?", "It’s stored in a managed Postgres database on Supabase, kept separate by workspace. Waylo doesn’t train a model on your site. The Security page lists all five subprocessors."],
  ["Can I try it before I sign up?", "Yes. Enter your website on the try page and ask it a few questions. You don’t need an account."],
  ["Can I cancel anytime?", "Yes. Plans are month to month with no contract. You can change or cancel from Billing in the admin."],
];
function SampleChat() {
  return (
    <div className="w-tile w-tile-card mx-auto w-full max-w-md overflow-hidden p-0 shadow-xl shadow-navy-950/10 ring-1 ring-warm-200" role="img" aria-label="Sample chat. A visitor asks: Do I need a card to start? Waylo answers: No. The 14-day Trial is free and doesn’t ask for a card. You get 500 AI messages and every feature. Source: Pricing.">
      <div className="flex items-center gap-3 bg-navy-900 px-5 py-4 text-white"><span className="grid h-8 w-8 place-items-center rounded-full bg-rasp-600 text-sm font-semibold">W</span><div><p className="text-sm font-semibold">Waylo</p><p className="text-xs text-white/60">Answers from this site</p></div></div>
      <div className="space-y-4 px-5 py-6 text-[15px] leading-6">
        <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-navy-700 px-4 py-2.5 text-white">Do I need a card to start?</p>
        <div className="max-w-[90%]"><p className="rounded-2xl rounded-bl-md bg-warm-100 px-4 py-3 text-warm-800">No. The 14-day Trial is free and doesn’t ask for a card. You get 500 AI messages and every feature.<sup className="ml-0.5 font-semibold text-rasp-700">1</sup></p>
          <Link href="/pricing" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-navy-700 ring-1 ring-warm-200 hover:ring-rasp-600"><span className="font-semibold text-rasp-700">1</span>Pricing · /pricing</Link></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Shell>
      <Header />
      <main>
        <JsonLd data={[orgLd, appLd, faqLd(homeFaqs)]} />
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

        <section id="tour" aria-labelledby="tour-h" className="w-band-paper scroll-mt-20 px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="w-pill">Product tour</p>
            <h2 id="tour-h" className="w-h-lg mt-5 max-w-2xl font-semibold text-warm-900">See it from signup to first answer</h2>
            <div className="mt-10"><ProductTour steps={tourSteps()} compact /></div>
          </div>
        </section>

        <section aria-labelledby="sample-h" className="w-band-mist px-5 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_1fr]">
            <div><p className="w-pill">Sample chat</p><h2 id="sample-h" className="w-h-lg mt-5 font-semibold text-warm-900">What your visitors see</h2><p className="mt-4 max-w-md text-lg leading-8 text-warm-600">A real question about Waylo, answered from our own pricing page. The link takes the visitor straight to the source.</p></div>
            <SampleChat />
          </div>
        </section>

        <section aria-labelledby="helps" className="w-band-paper px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 id="helps" className="w-h-lg max-w-2xl font-semibold text-warm-900">Who Waylo helps</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{helps.map(([t, d, href]) => <li key={t}><Link href={href} className="w-tile w-tile-card group flex h-full flex-col p-6 ring-1 ring-warm-200 transition hover:-translate-y-0.5 hover:ring-rasp-600">
              <span className="font-display text-xl font-semibold text-warm-900">{t}</span><span className="mt-2 flex-1 leading-7 text-warm-600">{d}</span><span className="mt-4 text-sm font-semibold text-rasp-700 group-hover:underline">Learn more →</span></Link></li>)}</ul>
          </div>
        </section>

        <section aria-labelledby="stack-h" className="w-band-navy px-5 py-14 sm:py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.4fr]">
            <div><h2 id="stack-h" className="w-h-lg font-semibold text-white">Works with your stack</h2><p className="mt-4 leading-7 text-white/80">Waylo works anywhere you can add a script tag. Slack and CRM alerts go out through webhooks.</p><Link href="/docs/install" className="mt-5 inline-block text-sm font-semibold text-blush hover:underline">Read the install guide →</Link></div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stack.map(t => <li key={t} className="rounded-2xl bg-white/[0.06] px-4 py-4 text-center text-sm font-semibold text-white ring-1 ring-white/10">{t}</li>)}</ul>
          </div>
        </section>

        <section aria-label="Setup and pricing" className="bg-card px-5 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
            <div id="how" className="w-tile w-band-navy relative overflow-hidden p-8 sm:p-10">
              <div aria-hidden className="absolute -right-5 -top-5 h-24 w-24 rotate-6 rounded-[22px] bg-rasp-600" />
              <h2 className="w-h-lg relative pr-10 font-semibold text-white">Set it up yourself.</h2>
              <p className="relative mt-4 text-lg leading-8 text-white/80">Add your website, paste one line of code, and publish. No call needed.</p>
              <Link href="/how-it-works" className="w-btn-accent w-btn-lg relative mt-8 inline-flex">See how it works</Link>
            </div>
            <div id="pricing" className="w-tile w-tile-blush relative overflow-hidden p-8 sm:p-10">
              <div aria-hidden className="absolute -right-6 -top-6 h-16 w-16 -rotate-6 rounded-[16px] bg-navy-900" />
              <h2 className="w-h-lg relative pr-10 font-semibold text-warm-900">Simple monthly plans.</h2>
              <p className="relative mt-4 text-lg leading-8 text-warm-700">Start free, no card. Every plan has every feature. Cancel anytime.</p>
              <Link href="/pricing" className="w-btn-ghost w-btn-lg relative mt-8 inline-flex bg-card">See pricing</Link>
            </div>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-h" className="w-band-paper px-5 pt-16 sm:pt-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr]">
            <div><h2 id="faq-h" className="w-h-lg font-semibold text-warm-900">Questions</h2><Link href="/faq" className="mt-4 inline-block text-sm font-semibold text-navy-700 hover:underline">All questions →</Link></div>
            <div className="divide-y divide-warm-200 border-y border-warm-200">{homeFaqs.map(([q, a]) => <details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-warm-900"><h3>{q}</h3><span className="text-lg leading-none text-rasp-700 transition group-open:rotate-45">+</span></summary><p className="mt-2 max-w-2xl leading-7 text-warm-600">{a}{q.startsWith("What happens to my data") && <> <Link href="/security" className="font-semibold text-navy-700 hover:underline">Read the Security page →</Link></>}</p></details>)}</div>
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
