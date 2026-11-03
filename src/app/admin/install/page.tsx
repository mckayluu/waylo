import { PageHeader, Card } from "../ui";
import { CopyButton } from "../settings/CopyButton";
import { snippet, WAYLO_URL } from "@/lib/embed";
export const dynamic = "force-dynamic";
const Code = ({ children }: { children: string }) => <div className="relative"><pre className="overflow-x-auto rounded-xl bg-stone-900 p-4 pr-24 text-sm text-teal-200">{children}</pre><div className="absolute right-2 top-2"><CopyButton text={children} /></div></div>;
export default function Install() {
  const s = snippet();
  return (<>
    <PageHeader title="Install" sub="Add Waylo to any website with one line of HTML." />
    <div className="space-y-6">
      <Card title="1. Copy this snippet"><Code>{s}</Code>
        <p className="mt-3 text-sm text-stone-600">Paste it just before the closing <code>&lt;/body&gt;</code> tag on every page (or in your site builder&apos;s &quot;custom code / footer scripts&quot; box — Webflow, WordPress, Squarespace, Wix, Shopify, GTM all work). A chat button appears bottom-right and page views show up under Tracking.</p></Card>
      <Card title="2. Optional settings">
        <ul className="list-disc space-y-1 pl-5 text-sm text-stone-600">
          <li><code>data-site</code> — your workspace id (keep <code>default</code> for now).</li>
          <li><code>data-mode</code> — <code>launcher</code> (floating button, default), <code>sidebar</code> (always-open panel) or <code>track</code> (analytics only).</li>
          <li><code>data-position=&quot;left&quot;</code>, <code>data-color=&quot;#0f766e&quot;</code>, <code>data-open=&quot;true&quot;</code> (open on load).</li>
          <li>JS API: <code>Waylo.open()</code>, <code>Waylo.close()</code>, <code>Waylo.toggle()</code> — e.g. on a &quot;Talk to us&quot; button.</li>
        </ul>
        <div className="mt-3"><Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default" data-color="#1d4ed8" data-position="left" async></script>`}</Code></div></Card>
      <Card title="3. Allow your domain"><p className="text-sm text-stone-600">If you set an embed origin allowlist, add your site&apos;s domain under Settings so chat requests are accepted.</p></Card>
    </div>
  </>);
}
