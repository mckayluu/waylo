import { pageMeta, JsonLd, crumbsLd } from "@/lib/seo";
import type { Metadata } from "next";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { Code } from "@/components/marketing/Code";
import { snippet, WAYLO_URL } from "@/lib/embed";
export const metadata: Metadata = pageMeta("/docs/install", "Install guide: add Waylo to any website", "Add the Waylo AI chat widget to any website with one async script tag. Covers embed options, JavaScript API, domain allowlist, CMS notes, and troubleshooting.");
const attrs: [string, string, string][] = [["data-site", "default", "Your workspace id."], ["data-mode", "launcher", "launcher (floating button), sidebar (always-open panel), or track (analytics only, no chat)."], ["data-position", "right", "right or left."], ["data-color", "#0f766e", "Launcher / accent color (any hex)."], ["data-open", "false", "true opens the chat on page load."]];
const cms: [string, string][] = [["Webflow", "Site settings → Custom code → Footer code. Publish."], ["WordPress", "Use a header/footer code plugin, or add to your theme’s footer.php before </body>."], ["Squarespace", "Settings → Advanced → Code injection → Footer."], ["Wix", "Settings → Custom code → Add code → Body – end, all pages."], ["Shopify", "Online Store → Themes → Edit code → theme.liquid → paste before </body>."], ["Google Tag Manager", "New tag → Custom HTML → paste snippet → trigger: All Pages → Publish."], ["Next.js / React", "Add the tag to your root layout (e.g. next/script with strategy=\"afterInteractive\")."]];
export default function Install() {
  const s = snippet();
  return <DocsLayout>
    <JsonLd data={crumbsLd([["Docs", "/docs"], ["Install guide", "/docs/install"]])} />
    <p className="w-eyebrow">Install guide</p>
    <h1 className="mt-2">Install Waylo</h1>
    <p className="text-lg text-stone-600">One line of HTML adds a chat launcher to every page and starts tracking visitor journeys.</p>
    <h2 id="snippet">1. Add the snippet</h2>
    <p>Paste this just before the closing <code>&lt;/body&gt;</code> tag on every page, or in your site builder’s footer-scripts box.</p>
    <Code>{s}</Code>
    <p>The script loads with <code>async</code>, so it never blocks rendering. A chat button appears bottom-right and page views show up under Tracking in your dashboard.</p>
    <h2 id="allowlist">2. Allow your domain</h2>
    <p>If your workspace uses an embed origin allowlist, add every domain where the widget runs under Settings — for example <code>example.com</code>, <code>www.example.com</code>, and staging. Requests from other origins are rejected.</p>
    <h2 id="verify">3. Verify</h2>
    <ul><li>Reload your site — the launcher appears.</li><li>Ask a question; the conversation shows up in your dashboard.</li><li>Visit a few pages; they appear in the visitor’s journey.</li></ul>
    <h2 id="options">Embed options</h2>
    <p>Configure the widget with <code>data-*</code> attributes on the script tag.</p>
    <div className="mt-4 w-card overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead className="bg-stone-50"><tr><th className="w-th">Attribute</th><th className="w-th">Default</th><th className="w-th">Description</th></tr></thead><tbody className="divide-y divide-stone-100">{attrs.map(([a, d, x]) => <tr key={a}><td className="px-5 py-3"><code>{a}</code></td><td className="px-5 py-3"><code>{d}</code></td><td className="px-5 py-3 text-stone-600">{x}</td></tr>)}</tbody></table></div>
    <h3>Example: left side, custom color</h3>
    <Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default" data-color="#1d4ed8" data-position="left" async></script>`}</Code>
    <h3>Example: tracking only</h3>
    <Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default" data-mode="track" async></script>`}</Code>
    <h2 id="api">JavaScript API</h2>
    <p>Once loaded, the script exposes <code>window.Waylo</code>:</p>
    <ul><li><code>Waylo.open()</code>, <code>Waylo.close()</code>, <code>Waylo.toggle()</code> — control the chat panel.</li><li><code>Waylo.track()</code> — record a page view manually (single-page apps; history changes are tracked automatically).</li><li><code>Waylo.visitorId</code>, <code>Waylo.site</code> — read-only identifiers.</li></ul>
    <Code label="Open chat from your own button">{`<button onclick="Waylo.open()">Talk to us</button>`}</Code>
    <h2 id="cms">CMS & platform notes</h2>
    <ul>{cms.map(([n, d]) => <li key={n}><b className="text-stone-900">{n}:</b> {d}</li>)}</ul>
    <h2 id="troubleshooting">Troubleshooting</h2>
    <ul><li><b className="text-stone-900">Widget doesn’t appear:</b> view source to confirm the script is on the page, check <code>data-site</code>, and look for errors in the browser console.</li><li><b className="text-stone-900">Works on www but not the root domain:</b> allowlist both.</li><li><b className="text-stone-900">Content Security Policy:</b> allow <code>{WAYLO_URL}</code> in <code>script-src</code>, <code>connect-src</code>, and <code>frame-src</code>.</li><li><b className="text-stone-900">Loaded twice:</b> the script guards against double-loading, so a duplicate tag is harmless — but remove it.</li></ul>
    <p className="mt-10 text-sm text-stone-500">Stuck? Email <a href="mailto:hello@waylo.ai">hello@waylo.ai</a> and we’ll help you install.</p>
  </DocsLayout>;
}
