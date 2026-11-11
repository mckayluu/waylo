import Link from "next/link";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { Code } from "@/components/marketing/Code";
import { Callout, ModesVisual, Chip } from "@/components/marketing/Visuals";
import { WAYLO_URL } from "@/lib/embed";
import { JsonLd, crumbsLd, pageMeta } from "@/lib/seo";
export const metadata = pageMeta("/docs/embed-modes", "Embed modes: launcher, sidebar, and track", "Choose how the Waylo widget appears. Use a floating launcher on marketing sites, an open sidebar on docs, or tracking-only mode to record journeys and intent with no chat.");
const modes: [string, string, string, string, string][] = [
  ["launcher", "Floating chat button", "A button in the corner opens the chat panel. It stays out of the way and is one click from any page.", "Marketing sites, pricing pages, landing pages.", ""],
  ["sidebar", "Docked panel that stays open", "The chat sits open beside your content, so readers can ask while they read.", "Docs, help centers, long product pages.", ` data-mode="sidebar"`],
  ["track", "Tracking with no chat", "Records page views and visitor journeys without showing chat. Turn chat on later by changing one attribute.", "Measuring intent before launch, and pages where chat would distract.", ` data-mode="track"`],
];
export default function EmbedModes() {
  return <DocsLayout title="Embed modes">
    <JsonLd data={crumbsLd([["Docs", "/docs"], ["Embed modes", "/docs/embed-modes"]])} />
    <p className="w-eyebrow-alt">Configure</p><h1 className="mt-2">Embed modes</h1>
    <p className="text-lg text-stone-600">Waylo has three embed modes, set with the <code>data-mode</code> attribute: <code>launcher</code> (default), <code>sidebar</code>, and <code>track</code>. You can use a different mode on each page.</p>
    <div className="not-prose mt-6"><ModesVisual /></div>
    <div className="not-prose mt-8 overflow-x-auto rounded-xl border border-stone-200"><table className="w-full min-w-[520px] text-sm"><thead className="bg-stone-50"><tr><th className="w-th">Mode</th><th className="w-th">Chat UI</th><th className="w-th">Journeys and signals</th><th className="w-th">Best for</th></tr></thead><tbody className="divide-y divide-stone-100">{modes.map(([m, , , b]) => <tr key={m}><td className="px-5 py-3 font-mono font-semibold">{m}</td><td className="px-5 py-3">{m === "track" ? "–" : "✓"}</td><td className="px-5 py-3 text-teal-700">✓</td><td className="px-5 py-3 text-stone-600">{b}</td></tr>)}</tbody></table></div>
    {modes.map(([m, h, d, b, a], i) => <div key={m}><h2 id={m}>{h} (<code>{m}</code>)</h2><div className="not-prose mt-3 flex flex-wrap gap-2"><Chip t={(["teal", "indigo", "amber"] as const)[i]}>{m === "track" ? "No chat UI" : "Chat with cited answers"}</Chip><Chip t="teal">Journeys and signals</Chip>{m !== "track" && <Chip t="indigo">Waylo.open / close / toggle</Chip>}</div><p>{d}</p><p><b className="text-stone-900">Good for</b> {b.charAt(0).toLowerCase() + b.slice(1)}</p><div className="mt-3"><Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default"${a} async></script>`}</Code></div></div>)}
    <h2 id="by-page">Recommended mode by page</h2>
    <div className="not-prose mt-4 overflow-x-auto rounded-xl border border-stone-200"><table className="w-full min-w-[480px] text-sm"><thead className="bg-stone-50"><tr><th className="w-th">Page</th><th className="w-th">Mode</th><th className="w-th">Why</th></tr></thead><tbody className="divide-y divide-stone-100">{[["Homepage, pricing, landing pages", "launcher", "Always one click away without covering the page."], ["Docs, help center, long guides", "sidebar", "Readers ask follow-ups while they read."], ["Checkout, signup, app login", "track", "Keep the flow clean but still record intent."]].map(([p, m, w]) => <tr key={p}><td className="px-5 py-3 text-stone-800">{p}</td><td className="px-5 py-3 font-mono font-semibold text-indigo-700">{m}</td><td className="px-5 py-3 text-stone-600">{w}</td></tr>)}</tbody></table></div>
    <h2 id="style">Position, color, and open on load</h2>
    <ul><li><code>data-position=&quot;left&quot;</code> moves the launcher or sidebar to the left (default <code>right</code>).</li><li><code>data-color=&quot;#0f766e&quot;</code> sets the accent color to match your brand.</li><li><code>data-open=&quot;true&quot;</code> opens the chat as soon as the page loads.</li><li><code>data-sidebar=&quot;true&quot;</code> is a shorthand for <code>data-mode=&quot;sidebar&quot;</code>.</li></ul>
    <Code label="Sidebar on the left, brand color, open on load">{`<script src="${WAYLO_URL}/waylo.js" data-site="default" data-mode="sidebar" data-position="left" data-color="#4338CA" data-open="true" async></script>`}</Code>
    <Callout t="amber" title="Start with track, then turn on chat">Run <code>track</code> for a week to see which pages show buying intent, then switch to <code>launcher</code> on those pages first.</Callout>
    <h2 id="custom-trigger">Use your own trigger</h2>
    <p>In <code>launcher</code> or <code>sidebar</code> mode, wire any element to the chat:</p>
    <Code label="Custom buttons">{`<a href="#" onclick="Waylo.open();return false">Talk to sales</a>\n<button onclick="Waylo.toggle()">Help</button>\n<button onclick="Waylo.close()">Close chat</button>`}</Code>
    <p className="mt-8">See every attribute and the JavaScript API in the <Link href="/docs/install#options">install guide</Link>.</p>
  </DocsLayout>;
}
