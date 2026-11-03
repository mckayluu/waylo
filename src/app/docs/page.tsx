import { pageMeta, JsonLd, crumbsLd } from "@/lib/seo";
import Link from "next/link";
import type { Metadata } from "next";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { Code } from "@/components/marketing/Code";
import { snippet } from "@/lib/embed";
export const metadata: Metadata = pageMeta("/docs", "Docs: install and configure Waylo", "Waylo documentation: install the chat widget with one script tag, choose an embed mode, use the JavaScript API, and troubleshoot.");
const cards: [string, string, string][] = [["Install guide", "Add the snippet, allow your domain, and verify it works.", "/docs/install"], ["Embed modes", "Launcher, sidebar, or tracking-only — plus position and color.", "/docs/embed-modes"], ["JavaScript API", "Open the chat from your own “Talk to us” buttons.", "/docs/install#api"], ["CMS notes", "Webflow, WordPress, Squarespace, Wix, Shopify, GTM.", "/docs/install#cms"]];
export default function Docs() {
  return <DocsLayout>
    <JsonLd data={crumbsLd([["Docs", "/docs"]])} />
    <p className="w-eyebrow">Documentation</p>
    <h1 className="mt-2">Get Waylo on your site</h1>
    <p className="text-lg text-stone-600">Waylo runs from a single script tag. Most teams are live in a few minutes.</p>
    <div className="mt-6 [&_pre]:mt-0"><Code label="Quick start — paste before </body>">{snippet()}</Code></div>
    <div className="mt-10 grid gap-4 sm:grid-cols-2">{cards.map(([t, d, h]) => <Link key={h} href={h} className="w-card block p-5 !no-underline transition hover:border-teal-300"><p className="font-semibold text-stone-900">{t} →</p><p className="mt-1 text-sm text-stone-600">{d}</p></Link>)}</div>
    <p className="mt-10 text-sm text-stone-500">Questions? Email <a href="mailto:hello@waylo.ai">hello@waylo.ai</a>.</p>
  </DocsLayout>;
}
