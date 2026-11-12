import { snippet } from "@/lib/embed";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Section, Shell } from "@/components/marketing/Section";
import { Code } from "@/components/marketing/Code";
import { ProductTour } from "@/components/marketing/ProductTour";
import { tourSteps } from "@/lib/tour";
import { TryWaylo } from "@/components/try/TryWaylo";
import { JsonLd, orgLd, appLd, faqLd, FAQS, DEFINITION } from "@/lib/seo";

export const metadata: Metadata = { title: { absolute: "Waylo – Your website’s own AI chat" }, description: "Waylo learns the public pages on your site and answers visitor questions the way your team would, with a link to the page behind each answer.", alternates: { canonical: "/" }, openGraph: { title: "Waylo – Your website’s own AI chat", description: "Waylo learns the public pages on your site and answers visitor questions the way your team would, with a link to the page behind each answer.", url: "/", siteName: "Waylo", type: "website", images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo – Your website’s own AI chat" }] }, twitter: { card: "summary_large_image", title: "Waylo – Your website’s own AI chat", description: "Waylo learns the public pages on your site and answers visitor questions the way your team would, with a link to the page behind each answer.", images: ["/brand/og.png"] } };

const faqs = FAQS;
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
      <figcaption className="mt-6 text-xs leading-5 text-white/65">Real screenshots. The chat is on <Link href="/demo" className="underline hover:text-white">/demo</Link>, where Northpoint Ops is a fictional company. Admin views use sample data. Slack alerts are on Starter and up.</figcaption>
    </figure>
  );
}
const dayOne: [string, string][] = [["1 script tag", "Paste it before </body> or add it in Google Tag Manager."], ["A source link on every answer", "Visitors can open the page the answer came from."], ["Fresh pages", "Re-crawls every 3 days on the Trial and daily on paid plans."], ["500 AI messages free", "The Trial needs no card. Invite your whole team."]];
const cards: [string, string, string, string, string, string][] = [
  ["Buying signals", "See who looks ready", "Pricing and security questions get flagged. Each one sits next to the pages that visitor read first.", "/product/admin-tracking.webp", "object-[15%_20%]", "w-tile-mist"],
  ["Starter and up", "Ready buyers post to Slack", "When a visitor looks serious, the conversation goes to your Slack channel or a JSON webhook. On the Trial you see the same signals in the admin.", "/product/admin-integrations.webp", "object-[38%_22%]", "w-tile-cream"],
  ["Guidance", "Fill the gaps your pages leave", "Add a fact when a page is missing something. Set a rule for any topic the chat should leave alone.", "/product/admin-guidance.webp", "object-[25%_15%]", "w-tile-mist"],
  ["Site crawl", "Your pages, kept current", "Enter your domain once. Waylo reads your public pages and keeps them fresh. You can re-crawl any time.", "/product/admin-content.webp", "object-[25%_25%]", "w-tile-cream"],
];
const platforms = ["Webflow", "WordPress", "Squarespace", "Wix", "Shopify", "Google Tag Manager"];
const plansTeaser: [string, string, string, string, string][] = [["Trial", "$0", "14 days", "Try it on your own site with real visitors. 500 AI messages and no card.", "w-tile-card"], ["Starter", "$79", "/mo", "One site that wants ready buyers sent to Slack or your CRM. 3,000 messages a month.", "w-tile-blush"], ["Growth", "$249", "/mo", "Up to 3 sites and 15,000 messages a month. Adds Audiences for grouping visitors.", "w-tile-mist"]];

export default function Home() {
  return (
    <Shell>
      <Header />
      <main>
        <JsonLd data={[orgLd, appLd, faqLd(FAQS)]} />
        <section className="w-band-navy relative overflow-hidden px-5 pb-20 pt-12 sm:pt-16">
          <div aria-hidden className="pointer-events-none absolute -left-16 bottom-10 hidden h-32 w-32 -rotate-6 rounded-[26px] bg-navy-700 lg:block" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="w-rise">
              <p className="w-pill w-pill-dark"><span className="w-pill-dot" />AI chat for your website · early access</p>
              <h1 className="w-h-xl mt-6 font-semibold text-white">Your website’s <span className="w-marker">own AI chat</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">Waylo reads the public pages on your site and answers visitor questions with a link to the page it used. You see what people ask and who looks ready to buy.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent w-btn-lg">Start free trial</Link><Link href="/how-it-works" className="w-btn-glass w-btn-lg">See how it works</Link></div>
              <p className="mt-3 text-sm text-white/70">500 AI messages free. No card needed.</p>
              <div id="try" className="mt-8 max-w-xl scroll-mt-24 border-t border-white/15 pt-6"><p className="mb-2 text-sm font-medium text-white/90">Or try it on your own site first. No signup needed. It reads up to 20 pages and answers up to 12 questions.</p><TryWaylo compact /></div>
            </div>
            <div id="product" className="relative scroll-mt-20"><HeroCollage /></div>
          </div>
        </section>

        <section aria-label="What you get on day one" className="w-band-mist px-5 py-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-sm text-warm-600">We don’t have customer logos yet, so we don’t show any. Here is what every Trial gets on day one.</p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{dayOne.map(([k, d]) => <div key={k} className="w-tile w-tile-card p-5"><dt className="font-display text-xl font-semibold text-warm-900">{k}</dt><dd className="mt-1.5 text-sm leading-6 text-warm-600">{d}</dd></div>)}</dl>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 bg-card px-5 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="w-pill">What it does</p>
              <h2 className="w-h-lg mt-5 font-semibold text-warm-900">Answers your buyers can check</h2>
              <p className="mt-4 leading-7 text-warm-600">Every reply links the page behind it. When your pages don’t cover a question, Waylo says it doesn’t know and offers your contact form.</p>
              <div className="mt-7 flex flex-wrap items-center gap-4"><Link href="/signup" className="w-btn-accent w-btn-lg">Start free trial</Link><Link href="/features" className="text-sm font-semibold text-navy-700 hover:underline">All features →</Link></div>
            </div>
            <div className="grid gap-5">
              <div className="w-tile w-tile-blush grid items-center gap-6 p-7 md:grid-cols-[1fr_1.15fr]">
                <div><p className="w-pill bg-card/70">Cited answers</p><h3 className="mt-4 text-2xl font-semibold tracking-tight text-warm-900">The answer and the page it came from</h3><p className="mt-2 text-warm-700">Numbered source chips sit under each reply. Your team sees the same sources in the conversation view.</p></div>
                <div className="w-shot-float"><Image src="/product/admin-conv.webp" alt="A conversation in the Waylo admin with the transcript and source chips under each answer" width={1440} height={900} sizes="(min-width:1024px) 380px, 100vw" className="h-60 w-full object-cover object-[30%_30%]" /></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">{cards.map(([tag, t, d, img, pos, tile]) => <div key={t} className={`w-tile ${tile} flex flex-col p-5`}>
                <div className="w-shot-float"><Image src={img} alt={`Waylo admin screenshot for ${tag.toLowerCase()}`} width={1440} height={900} sizes="(min-width:1024px) 340px, 100vw" className={`h-40 w-full object-cover ${pos}`} /></div>
                <p className="mt-5 font-plex text-[11px] font-medium uppercase tracking-[0.09em] text-rasp-700">{tag}</p><h3 className="mt-1.5 text-xl font-semibold tracking-tight text-warm-900">{t}</h3><p className="mt-2 text-sm leading-6 text-warm-600">{d}</p></div>)}</div>
            </div>
          </div>
        </section>

        <Section id="tour" eyebrow="Self-serve setup" title="Set it up yourself in eight screens" sub="These are the real screens in order. You go from signup to a cited answer without talking to anyone." className="w-band-paper">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <ProductTour steps={tourSteps()} compact />
            <div className="w-tile w-tile-card p-6 text-sm text-warm-700 lg:self-start">
              <p className="w-pill">Where we are</p>
              <ul className="mt-4 space-y-2.5">
                <li className="flex gap-2"><span className="text-navy-700">✓</span>The Trial includes 500 AI messages. No card needed.</li>
                <li className="flex gap-2"><span className="text-navy-700">✓</span>Starter is $79 a month and Growth is $249. No contract.</li>
                <li className="flex gap-2"><span className="text-navy-700">✓</span>Every step is in the admin. The docs and FAQ cover the rest.</li>
                <li className="flex gap-2"><span className="text-rasp-600">–</span>We run on a free hosting tier, so a first load can be slow. Stripe is in test mode.</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-2"><Link href="/signup" className="w-btn-accent px-4 py-2">Start free trial</Link><Link href="/how-it-works" className="w-btn-ghost px-4 py-2">See how it works</Link></div>
            </div>
          </div>
        </Section>

        <section id="how" className="w-band-navy scroll-mt-20 px-5 py-16 sm:py-20"><div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
          <div><p className="w-pill w-pill-dark">Install</p><h2 className="w-h-lg mt-5 font-semibold text-white">One script tag and you’re live</h2><p className="mt-4 leading-7 text-white/80">There’s no SDK and no build step. The tag loads async, so it won’t slow your page. Choose a launcher or a docked sidebar with <code className="text-blush">data-mode</code>. Track-only mode records visits without showing the chat.</p>
            <p className="mt-8 text-sm font-medium text-white/80">Works where your site lives</p>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{platforms.map(p => <li key={p} className="rounded-2xl bg-white/[0.06] px-4 py-4 text-center text-sm font-semibold text-white ring-1 ring-white/10">{p}</li>)}</ul>
            <p className="mt-6 text-sm"><Link href="/docs/install" className="font-medium text-blush hover:underline">Read the install guide →</Link></p></div>
          <div><Code label="Paste before </body>">{snippet()}</Code><div className="mt-4"><Code label="Open the chat from your own button">{`<button onclick="Waylo.open()">Ask a question</button>`}</Code></div><p className="mt-4 text-sm"><Link href="/docs/embed-modes" className="font-medium text-blush hover:underline">Compare embed modes →</Link></p></div>
        </div></section>

        <Section id="pricing" eyebrow="Pricing" title="The price is on the page" sub="Start on the free Trial. Paid plans are a flat monthly price with no overage fees." className="bg-card">
          <div className="grid gap-5 md:grid-cols-3">{plansTeaser.map(([n, p, per, d, tile]) => <div key={n} className={`w-tile ${tile} p-6`}><p className="font-plex text-[11px] font-medium uppercase tracking-[0.09em] text-warm-600">{n}</p><p className="mt-3"><span className="font-display text-4xl font-semibold tracking-tight text-warm-900">{p}</span> <span className="text-sm text-warm-500">{per}</span></p><p className="mt-3 text-sm leading-6 text-warm-700">{d}</p></div>)}</div>
          <div className="mt-6 flex flex-wrap items-center gap-4"><Link href="/pricing" className="w-btn-accent w-btn-lg">Compare plans</Link><p className="text-sm text-warm-600">Slack and CRM alerts start on Starter. Change or cancel from Billing.</p></div>
        </Section>

        <Section id="faq" className="w-band-paper">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr]"><div className="lg:sticky lg:top-24 lg:self-start"><p className="w-pill">FAQ</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">Common questions</h2><p className="mt-4 text-sm leading-6 text-warm-600">{DEFINITION}</p><Link href="/faq" className="mt-4 inline-block text-sm font-semibold text-navy-700 hover:underline">All questions →</Link></div><div className="divide-y divide-warm-200 border-y border-warm-200">{faqs.map(([q, a]) => <details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium"><h3>{q}</h3><span className="text-lg leading-none text-rasp-700 transition group-open:rotate-45">+</span></summary><p className="mt-2 max-w-2xl text-sm leading-6 text-warm-600">{a}</p></details>)}</div></div>
        </Section>

        <section className="px-5 pb-16 pt-4 w-band-paper"><div className="w-tile w-band-navy relative mx-auto grid max-w-6xl items-center gap-8 px-8 py-14 sm:px-12 md:grid-cols-[1.4fr_1fr]">
          <div aria-hidden className="absolute -right-6 -top-6 h-36 w-36 rotate-6 rounded-[28px] bg-rasp-600" /><div aria-hidden className="absolute right-28 top-20 h-16 w-16 -rotate-6 rounded-[16px] bg-blush" />
          <div className="relative"><p className="w-pill w-pill-dark">Self-serve</p><h2 className="w-h-lg mt-5 font-semibold text-white">You can have it live this afternoon</h2><p className="mt-4 text-white/80">Crawl your pages and paste one script tag. Then watch the first answers come in.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="w-btn-accent w-btn-lg">Start free trial</Link><Link href="/how-it-works" className="w-btn-glass w-btn-lg">See how it works</Link></div><p className="mt-3 text-sm text-white/65">500 AI messages free. No card needed.</p></div>
        </div></section>
      </main>
      <Footer />
    </Shell>
  );
}
