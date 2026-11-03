import { pageMeta, JsonLd, crumbsLd } from "@/lib/seo";
import Link from "next/link";
import type { Metadata } from "next";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { Code } from "@/components/marketing/Code";
import { Callout, IconTile, ModesVisual } from "@/components/marketing/Visuals";
import { snippet } from "@/lib/embed";
export const metadata: Metadata = pageMeta("/docs", "Docs: install and configure Waylo", "Waylo documentation: install the AI chat widget with one async script tag, allow your domain, choose launcher, sidebar, or track mode, use the JavaScript API, and troubleshoot.");
const steps: [string, string, string][] = [["Add your site", "In the dashboard, enter your domain. Waylo crawls your public pages in the background and shows progress.", "teal"], ["Paste the snippet", "Add one async script tag before </body>, or via your CMS or Google Tag Manager.", "indigo"], ["Allow your domain", "Add your domain (and www) to the allowlist so the widget only runs on your sites.", "amber"], ["Verify & go live", "Open your site, ask a question, and watch the conversation and signals appear in the dashboard.", "teal"]];
const cards: [string, string, string, "teal" | "amber" | "indigo"][] = [["Install guide", "Snippet, attributes, allowlist, verification, and CMS steps.", "/docs/install", "teal"], ["Embed modes", "Launcher, sidebar, or tracking-only — plus position and color.", "/docs/embed-modes", "indigo"], ["JavaScript API", "Waylo.open(), close(), toggle() from your own buttons.", "/docs/install#api", "amber"], ["CMS notes", "Webflow, WordPress, Squarespace, Wix, Shopify, GTM, Next.js.", "/docs/install#cms", "teal"], ["Troubleshooting", "Widget not showing, CSP rules, www vs root domain.", "/docs/install#troubleshooting", "indigo"], ["Verify it works", "A two-minute checklist after you publish.", "/docs/install#verify", "amber"]];
export default function Docs() {
  return <DocsLayout title="Overview">
    <JsonLd data={crumbsLd([["Docs", "/docs"]])} />
    <p className="w-eyebrow">Documentation</p>
    <h1 className="mt-2">Get Waylo live on your site</h1>
    <p className="text-lg text-stone-600">Waylo runs from a single async script tag. It adds a cited-answer chat, records visitor journeys, and flags buying intent. Most teams are live in under ten minutes.</p>
    <div className="mt-6 [&_pre]:mt-0"><Code label="Quick start — paste before </body>">{snippet()}</Code></div>
    <Callout t="amber" title="Using the default site id">Replace <code>data-site=&quot;default&quot;</code> with your workspace id from Admin → Install. The dashboard shows the exact snippet for your site.</Callout>
    <h2 id="steps">Four steps to launch</h2>
    <ol className="not-prose mt-5 grid gap-4 sm:grid-cols-2">{steps.map(([t, d, c], i) => <li key={t} className="w-card flex gap-3 p-5"><IconTile t={c as "teal"}>{i + 1}</IconTile><div><p className="font-semibold text-stone-900">{t}</p><p className="mt-1 text-sm text-stone-600">{d}</p></div></li>)}</ol>
    <h2 id="modes">Choose how it appears</h2>
    <p>Set <code>data-mode</code> to pick a layout. <Link href="/docs/embed-modes">Compare modes →</Link></p>
    <div className="not-prose mt-5"><ModesVisual /></div>
    <h2 id="guides">Guides</h2>
    <div className="not-prose mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([t, d, h, c]) => <Link key={h} href={h} className={`w-card block border-t-4 p-5 transition hover:-translate-y-0.5 ${c === "teal" ? "border-t-teal-600" : c === "amber" ? "border-t-amber-500" : "border-t-indigo-600"}`}><p className="font-semibold text-stone-900">{t} →</p><p className="mt-1 text-sm text-stone-600">{d}</p></Link>)}</div>
    <Callout t="indigo" title="What Waylo reads">Waylo answers from your public HTML pages plus facts you add in Guidance. JavaScript-only pages and PDFs aren’t supported yet.</Callout>
    <p className="mt-10 text-sm text-stone-500">Questions? Email <a href="mailto:hello@waylo.ai">hello@waylo.ai</a>.</p>
  </DocsLayout>;
}
