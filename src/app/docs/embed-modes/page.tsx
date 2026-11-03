import Link from "next/link";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { Code } from "@/components/marketing/Code";
import { WAYLO_URL } from "@/lib/embed";
import { JsonLd, crumbsLd, pageMeta } from "@/lib/seo";
export const metadata = pageMeta("/docs/embed-modes", "Embed modes: launcher, sidebar, and track", "Choose how the Waylo widget appears: a floating launcher, an always-open sidebar, or tracking-only analytics with no chat.");
const modes: [string, string, string][] = [["launcher", "Default. A floating chat button in the corner that opens the panel. Best for marketing sites.", ""], ["sidebar", "An always-open panel docked to the side. Best for docs and help centers.", ` data-mode="sidebar"`], ["track", "No chat UI. Records page views and intent signals only. Useful to measure before turning chat on.", ` data-mode="track"`]];
export default function EmbedModes() {
  return <DocsLayout>
    <JsonLd data={crumbsLd([["Docs", "/docs"], ["Embed modes", "/docs/embed-modes"]])} />
    <p className="w-eyebrow">Docs</p><h1 className="mt-2">Embed modes</h1>
    <p className="text-lg text-stone-600">Waylo has three embed modes, set with the <code>data-mode</code> attribute: <code>launcher</code> (default), <code>sidebar</code>, and <code>track</code>.</p>
    {modes.map(([m, d, a]) => <div key={m}><h2 id={m}>{m}</h2><p>{d}</p><div className="mt-3"><Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default"${a} async></script>`}</Code></div></div>)}
    <h2>Open on load</h2><p>Add <code>data-open=&quot;true&quot;</code> to open the chat as soon as the page loads.</p>
    <p className="mt-8">See all attributes in the <Link href="/docs/install#options">install guide</Link>.</p>
  </DocsLayout>;
}
