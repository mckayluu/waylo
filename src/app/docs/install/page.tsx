import { pageMeta, JsonLd, crumbsLd } from "@/lib/seo";
import type { Metadata } from "next";
import { DocsLayout } from "@/components/marketing/DocsLayout";
import { Code } from "@/components/marketing/Code";
import { snippet, WAYLO_URL } from "@/lib/embed";
import { Callout, IconTile, HandoffVisual, SignalsVisual } from "@/components/marketing/Visuals";
export const metadata: Metadata = pageMeta("/docs/install", "Install guide: add Waylo to any website", "Add the Waylo chat widget to any website with one async script tag. Covers embed options, the JavaScript API, the domain allowlist, CMS notes, and fixes for common problems.");
const attrs: [string, string, string][] = [["data-site", "default", "Your workspace id."], ["data-mode", "launcher", "launcher (floating button), sidebar (always-open panel), or track (analytics only, no chat)."], ["data-position", "right", "right or left."], ["data-color", "#0f766e", "Launcher / accent color (any hex)."], ["data-open", "false", "true opens the chat on page load."], ["data-sidebar", "–", "Shorthand: \"true\" is the same as data-mode=\"sidebar\"."]];
const cms: [string, string][] = [["Webflow", "Site settings → Custom code → Footer code. Publish."], ["WordPress", "Use a header and footer code plugin, or add it to your theme’s footer.php before </body>."], ["Squarespace", "Settings → Advanced → Code injection → Footer."], ["Wix", "Settings → Custom code → Add code → Body – end, all pages."], ["Shopify", "Online Store → Themes → Edit code → theme.liquid → paste before </body>."], ["Google Tag Manager", "New tag → Custom HTML → paste the snippet → trigger All Pages → Publish."], ["Next.js / React", "Add the tag to your root layout (e.g. next/script with strategy=\"afterInteractive\")."]];
export default function Install() {
  const s = snippet();
  return <DocsLayout title="Install guide">
    <JsonLd data={crumbsLd([["Docs", "/docs"], ["Install guide", "/docs/install"]])} />
    <p className="w-eyebrow">Install guide</p>
    <h1 className="mt-2">Install Waylo</h1>
    <p className="text-lg text-warm-600">One line of HTML adds the chat to every page. It also starts recording visitor journeys and flagging buying intent. There’s no build step or SDK.</p>
    <ol className="not-prose mt-6 grid gap-3 sm:grid-cols-3">{([["Add the snippet", "#snippet", "teal"], ["Allow your domain", "#allowlist", "indigo"], ["Verify", "#verify", "amber"]] as const).map(([t, h, c], i) => <li key={h}><a href={h} className="w-card flex items-center gap-3 p-4 !no-underline hover:border-rasp-300"><IconTile t={c}>{i + 1}</IconTile><span className="font-semibold text-warm-900">{t}</span></a></li>)}</ol>
    <h2 id="checklist">Install checklist</h2>
    <p>Work through these in order. Each one takes a few minutes. To see answers from your own pages before you install anything, <a href="/try">try it on your site</a> first. It reads up to 20 pages, answers up to 12 questions, and carries over into a Trial when you sign up.</p>
    <ol className="not-prose mt-4 divide-y divide-warm-200 border-y border-warm-200 text-sm">{([
      ["Add the script tag", <>Paste the snippet before <code>&lt;/body&gt;</code> on every page, or as a GTM Custom HTML tag on All Pages.</>],
      ["Set data-site", <>Use the workspace id from Admin → Install. A wrong id loads the widget but logs nothing.</>],
      ["Pick data-mode", <><code>launcher</code> for marketing pages, <code>sidebar</code> for docs, <code>track</code> to collect journeys and signals without chat.</>],
      ["Allow your domains", <>Add the root domain, <code>www</code>, and staging to the embed allowlist.</>],
      ["Verify the crawl", <>In the admin, check that your pricing, docs, and integrations pages are in the crawled list. Waylo re-crawls every 3 days on the Trial and daily on paid plans. Click Re-crawl after big changes if you can’t wait.</>],
      ["Ask a test question", <>Ask something only your pricing page answers. The reply should link that page. Then ask something that isn’t on your site. It should say it doesn’t know.</>],
      ["Connect Slack", <>Create a Slack incoming webhook for your leads channel, paste it in Admin → Integrations, and run a test handoff (Starter and up).</>],
    ] as const).map(([h, d], i) => <li key={h} className="grid gap-1 py-3 sm:grid-cols-[28px_180px_1fr]"><span className="font-mono text-navy-700">{i + 1}</span><span className="font-semibold text-warm-900">{h}</span><span className="text-warm-600">{d}</span></li>)}</ol>
    <p className="text-sm text-warm-500">You can do every step yourself. The <a href="/how-it-works">product tour</a> shows each screen.</p>
    <h2 id="snippet">1. Add the snippet</h2>
    <p>Paste this just before the closing <code>&lt;/body&gt;</code> tag on every page, or in your site builder’s footer-scripts box.</p>
    <Code>{s}</Code>
    <p>The script loads with <code>async</code>, so it doesn’t block rendering. A chat button appears bottom-right, and page views show up under Tracking in your admin.</p>
    <Callout t="amber" title="Get your exact snippet">Admin → Install shows the snippet with your real <code>data-site</code> id and a one-click copy button.</Callout>
    <h2 id="allowlist">2. Allow your domain</h2>
    <p>If your workspace uses an embed origin allowlist, add every domain where the widget runs under Settings. For example, <code>example.com</code>, <code>www.example.com</code>, and staging. Requests from other origins are rejected.</p>
    <Callout t="indigo" title="Don’t forget www and staging">The allowlist matches exact origins. Add the root domain, www, and any staging host you test on.</Callout>
    <h2 id="verify">3. Verify</h2>
    <ol className="not-prose mt-4 grid gap-3 sm:grid-cols-3">{([["teal", "Launcher appears", "Reload any page. The chat button shows in the corner, or the sidebar is docked."], ["indigo", "Conversation logged", "Ask a question. It shows in the admin with the cited source pages."], ["amber", "Journey + signals", "Browse to /pricing. The page path and any intent signal attach to that visitor."]] as const).map(([t, h, d], i) => <li key={h} className="w-card p-4"><IconTile t={t}>{i + 1}</IconTile><p className="mt-3 font-semibold text-warm-900">{h}</p><p className="mt-1 text-sm text-warm-600">{d}</p></li>)}</ol>
    <div className="not-prose mt-5 grid gap-4 lg:grid-cols-2"><SignalsVisual /><HandoffVisual /></div>
    <h2 id="options">Embed options</h2>
    <p>Configure the widget with <code>data-*</code> attributes on the script tag.</p>
    <div className="mt-4 w-card overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead className="bg-warm-50"><tr><th className="w-th">Attribute</th><th className="w-th">Default</th><th className="w-th">Description</th></tr></thead><tbody className="divide-y divide-warm-100">{attrs.map(([a, d, x]) => <tr key={a}><td className="px-5 py-3"><code>{a}</code></td><td className="px-5 py-3"><code>{d}</code></td><td className="px-5 py-3 text-warm-600">{x}</td></tr>)}</tbody></table></div>
    <h3>Example: left side, custom color</h3>
    <Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default" data-color="#A81B48" data-position="left" async></script>`}</Code>
    <h3>Example: tracking only</h3>
    <Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default" data-mode="track" async></script>`}</Code>
    <h2 id="api">JavaScript API</h2>
    <p>Once loaded, the script exposes <code>window.Waylo</code>:</p>
    <Callout t="indigo" title="Track mode">With <code>data-mode=&quot;track&quot;</code> there is no chat UI, so <code>open</code>, <code>close</code>, and <code>toggle</code> do nothing. <code>track()</code> still works.</Callout>
    <ul><li><code>Waylo.open()</code>, <code>Waylo.close()</code>, <code>Waylo.toggle()</code> control the chat panel.</li><li><code>Waylo.track()</code> records a page view by hand. Single-page apps rarely need it, since history changes are tracked automatically.</li><li><code>Waylo.visitorId</code>, <code>Waylo.site</code> are read-only identifiers.</li></ul>
    <Code label="Open chat from your own button">{`<button onclick="Waylo.open()">Talk to us</button>`}</Code>
    <h2 id="cms">CMS & platform notes</h2>
    <div className="not-prose mt-4 grid gap-3 sm:grid-cols-2">{cms.map(([n, d], i) => <div key={n} className={`w-card border-l-4 p-4 ${["border-l-navy-600", "border-l-navy-600", "border-l-rasp-500"][i % 3]}`}><p className="font-semibold text-warm-900">{n}</p><p className="mt-1 text-sm text-warm-600">{d}</p></div>)}</div>
    <h2 id="troubleshooting">Troubleshooting</h2>
    <ul><li><b className="text-warm-900">Widget doesn’t appear:</b> view source to confirm the script is on the page, check <code>data-site</code>, and look for errors in the browser console.</li><li><b className="text-warm-900">Works on www but not the root domain:</b> allowlist both.</li><li><b className="text-warm-900">Content Security Policy:</b> allow <code>{WAYLO_URL}</code> in <code>script-src</code>, <code>connect-src</code>, and <code>frame-src</code>.</li><li><b className="text-warm-900">Loaded twice:</b> the script guards against loading twice, so a duplicate tag does no harm. Remove it anyway.</li></ul>
    <p className="mt-10 text-sm text-warm-500">Stuck? See <a href="#troubleshooting">troubleshooting</a>, the <a href="/faq">FAQ</a>, or <a href="/contact">Help &amp; support</a>.</p>
  </DocsLayout>;
}
