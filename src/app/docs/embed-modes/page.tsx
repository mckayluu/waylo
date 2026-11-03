import Link from "next/link";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { Code } from "@/components/marketing/Code";
import { Callout, ModesVisual } from "@/components/marketing/Visuals";
import { WAYLO_URL } from "@/lib/embed";
import { JsonLd, crumbsLd, pageMeta } from "@/lib/seo";
export const metadata = pageMeta("/docs/embed-modes", "Embed modes: launcher, sidebar, and track", "Choose how the Waylo widget appears: a floating launcher for marketing sites, an always-open sidebar for docs, or tracking-only mode that records journeys and intent with no chat UI.");
const modes: [string, string, string, string, string][] = [
  ["launcher", "Floating chat button (default)", "A button in the corner opens the chat panel. Unobtrusive, always one click away.", "Marketing sites, pricing pages, landing pages.", ""],
  ["sidebar", "Always-open docked panel", "The chat sits open beside your content, so readers can ask while they read.", "Docs, help centers, long product pages.", ` data-mode="sidebar"`],
  ["track", "Signals only, no chat UI", "Records page views and visitor journeys without showing chat. Turn chat on later by changing one attribute.", "Measuring intent before launch; pages where chat would distract.", ` data-mode="track"`],
];
export default function EmbedModes() {
  return <DocsLayout title="Embed modes">
    <JsonLd data={crumbsLd([["Docs", "/docs"], ["Embed modes", "/docs/embed-modes"]])} />
    <p className="w-eyebrow-alt">Configure</p><h1 className="mt-2">Embed modes</h1>
    <p className="text-lg text-stone-600">Waylo has three embed modes, set with the <code>data-mode</code> attribute: <code>launcher</code> (default), <code>sidebar</code>, and <code>track</code>. Use a different mode per page if you like.</p>
    <div className="not-prose mt-6"><ModesVisual /></div>
    <div className="not-prose mt-8 overflow-x-auto rounded-xl border border-stone-200"><table className="w-full min-w-[520px] text-sm"><thead className="bg-stone-50"><tr><th className="w-th">Mode</th><th className="w-th">Chat UI</th><th className="w-th">Journeys & signals</th><th className="w-th">Best for</th></tr></thead><tbody className="divide-y divide-stone-100">{modes.map(([m, , , b]) => <tr key={m}><td className="px-5 py-3 font-mono font-semibold">{m}</td><td className="px-5 py-3">{m === "track" ? "—" : "✓"}</td><td className="px-5 py-3 text-teal-700">✓</td><td className="px-5 py-3 text-stone-600">{b}</td></tr>)}</tbody></table></div>
    {modes.map(([m, h, d, b, a]) => <div key={m}><h2 id={m}><code>{m}</code> — {h}</h2><p>{d}</p><p><b className="text-stone-900">Best for:</b> {b}</p><div className="mt-3"><Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default"${a} async></script>`}</Code></div></div>)}
    <h2 id="style">Position, color, and open on load</h2>
    <ul><li><code>data-position=&quot;left&quot;</code> moves the launcher or sidebar to the left (default <code>right</code>).</li><li><code>data-color=&quot;#0f766e&quot;</code> sets the accent color to match your brand.</li><li><code>data-open=&quot;true&quot;</code> opens the chat as soon as the page loads.</li></ul>
    <Code label="Sidebar on the left, brand color, open on load">{`<script src="${WAYLO_URL}/waylo.js" data-site="default" data-mode="sidebar" data-position="left" data-color="#4338CA" data-open="true" async></script>`}</Code>
    <Callout t="amber" title="Tip: start with track, then launch chat">Run <code>track</code> for a week to see which pages show buying intent, then switch to <code>launcher</code> on those pages first.</Callout>
    <p className="mt-8">See every attribute and the JavaScript API in the <Link href="/docs/install#options">install guide</Link>.</p>
  </DocsLayout>;
}
