import { pageMeta, JsonLd, crumbsLd } from "@/lib/seo";
import Link from "next/link";
import type { Metadata } from "next";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { Code } from "@/components/marketing/Code";
import { Callout, IconTile, ModesVisual, ChatVisual, CrawlVisual } from "@/components/marketing/Visuals";
import { snippet } from "@/lib/embed";
export const metadata: Metadata = pageMeta("/docs", "Docs: install and configure Waylo", "Waylo documentation. Install the chat widget with one async script tag, allow your domain, choose launcher, sidebar, or track mode, use the JavaScript API, and fix common problems.");
const steps: [string, string, string][] = [["Add your site", "In the admin, enter your domain. Waylo crawls your public pages in the background and shows progress.", "teal"], ["Paste the snippet", "Add one async script tag before </body>, or via your CMS or Google Tag Manager.", "indigo"], ["Allow your domain", "Add your domain and its www version to the allowlist, so the widget runs only on your sites.", "amber"], ["Verify & go live", "Open your site, ask a question, and watch the conversation and signals appear in the admin.", "teal"]];
const cards: [string, string, string, "teal" | "amber" | "indigo"][] = [["Install guide", "Snippet, attributes, allowlist, verification, and CMS steps.", "/docs/install", "teal"], ["Embed modes", "Launcher, sidebar, or tracking-only, plus position and color.", "/docs/embed-modes", "indigo"], ["JavaScript API", "Waylo.open(), close(), toggle() from your own buttons.", "/docs/install#api", "amber"], ["CMS notes", "Webflow, WordPress, Squarespace, Wix, Shopify, GTM, Next.js.", "/docs/install#cms", "teal"], ["Troubleshooting", "Widget not showing, CSP rules, and www or root domain.", "/docs/install#troubleshooting", "indigo"], ["Verify it works", "A two-minute checklist after you publish.", "/docs/install#verify", "amber"]];
export default function Docs() {
  return <DocsLayout title="Overview">
    <JsonLd data={crumbsLd([["Docs", "/docs"]])} />
    <p className="w-eyebrow">Documentation</p>
    <h1 className="mt-2">Get Waylo live on your site</h1>
    <p className="text-lg text-warm-600">Waylo runs from a single async script tag. It adds the chat, records visitor journeys, and flags buying intent. The install takes about ten minutes.</p>
    <div className="mt-6 [&_pre]:mt-0"><Code label="Quick start. Paste before </body>">{snippet()}</Code></div>
    <Callout t="amber" title="Using the default site id">Replace <code>data-site=&quot;default&quot;</code> with your workspace id from Admin → Install. The admin shows the exact snippet for your site.</Callout>
    <dl className="not-prose mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-warm-200 ring-1 ring-warm-200 sm:grid-cols-4">{([["1 tag", "async, never blocks", "text-navy-700"], ["3 modes", "launcher · sidebar · track", "text-navy-700"], ["5 attributes", "data-* config", "text-rasp-700"], ["~10 min", "typical install", "text-navy-700"]] as const).map(([v, l, c]) => <div key={v} className="bg-white px-4 py-3"><dt className={`text-lg font-semibold ${c}`}>{v}</dt><dd className="text-xs text-warm-500">{l}</dd></div>)}</dl>
    <h2 id="steps">Four steps to launch</h2>
    <ol className="not-prose mt-5 grid gap-4 sm:grid-cols-2">{steps.map(([t, d, c], i) => <li key={t} className="w-card flex gap-3 p-5"><IconTile t={c as "teal"}>{i + 1}</IconTile><div><p className="font-semibold text-warm-900">{t}</p><p className="mt-1 text-sm text-warm-600">{d}</p></div></li>)}</ol>
    <h2 id="result">What you get after install</h2>
    <p>Visitors get answers from your pages with source chips. Your team sees crawl status, conversations, journeys, and intent signals in the admin.</p>
    <div className="not-prose mt-5 grid gap-4 lg:grid-cols-2"><ChatVisual /><CrawlVisual /></div>
    <h2 id="modes">Choose how it appears</h2>
    <p>Set <code>data-mode</code> to pick a layout. <Link href="/docs/embed-modes">Compare modes →</Link></p>
    <div className="not-prose mt-5"><ModesVisual /></div>
    <h2 id="api-teaser">Control it from your own UI</h2>
    <p>The script exposes <code>window.Waylo</code>, so any button can open the chat. That could be a “Talk to sales” button, a pricing-table link, or a help icon.</p>
    <div className="not-prose mt-4 grid gap-4 lg:grid-cols-2"><Code label="Open from a CTA">{`<button onclick="Waylo.open()">Ask a question</button>`}</Code><Code label="Single-page apps">{`// route changes are tracked automatically;\n// call manually if you need to:\nWaylo.track();`}</Code></div>
    <h2 id="guides">Guides</h2>
    <div className="not-prose mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([t, d, h, c]) => <Link key={h} href={h} className={`w-card block border-t-4 p-5 transition hover:-translate-y-0.5 ${c === "teal" ? "border-t-navy-600" : c === "amber" ? "border-t-rasp-500" : "border-t-navy-600"}`}><p className="font-semibold text-warm-900">{t} →</p><p className="mt-1 text-sm text-warm-600">{d}</p></Link>)}</div>
    <Callout t="indigo" title="What Waylo reads">Waylo answers from your public pages, linked PDF and .docx files, and facts you add in Guidance. It can’t read text that only appears after JavaScript runs.</Callout>
    <p className="mt-10 text-sm text-warm-500">Questions? Try the <a href="/faq">FAQ</a> or <a href="/contact">Help &amp; support</a>.</p>
  </DocsLayout>;
}
