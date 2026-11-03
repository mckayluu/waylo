import Link from "next/link";
import { PageHeader, Card, Checklist } from "../ui";
import { listVisitors, listConversations, getSettings } from "@/lib/store";
import { CopyButton } from "../settings/CopyButton";
import { WAYLO_URL } from "@/lib/embed";
import { SnippetBuilder } from "./SnippetBuilder";
export const dynamic = "force-dynamic";
const Code = ({ children }: { children: string }) => <div className="relative"><pre className="overflow-x-auto rounded-xl bg-stone-900 p-4 pr-24 text-sm text-teal-200">{children}</pre><div className="absolute right-2 top-2"><CopyButton text={children} /></div></div>;
export default async function Install() {
  const st = await getSettings(); const WS = "default"; const origins = (st.allowedOrigins || "").split(/\s+/).filter(Boolean);
  const visitors = await listVisitors(); const live = visitors.length > 0;
  const asked = (await listConversations()).some((c) => c.messages.some((m) => m.role === "visitor"));
  return (<>
    <PageHeader title="Install" sub={`Add Waylo to ${st.siteName || "your site"}.`} />
    <div className="space-y-6">
      <Card title="Workspace">
        <div className="flex flex-wrap items-center gap-3"><span className="text-sm text-stone-500">Workspace id</span><code className="rounded-md bg-stone-100 px-2 py-1 font-mono text-sm text-stone-900">{WS}</code><CopyButton text={WS} /></div>
        <p className="mt-2 text-sm text-stone-600">The <code>data-site</code> attribute on your snippet must match this id so visitors, chats and leads bind to this workspace.</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-stone-500">Website URL</dt><dd>{st.siteUrl ? <span className="text-stone-700">{st.siteUrl}</span> : <Link href="/admin/settings" className="text-amber-700 hover:underline">Not set — add in Settings</Link>}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-stone-500">Allowed origins</dt><dd>{origins.length ? <span className="text-stone-700">{origins.length} set</span> : <Link href="/admin/settings" className="text-amber-700 hover:underline">Empty — any site can embed</Link>}</dd></div>
        </dl></Card>
      <Card title="1. Copy this snippet"><SnippetBuilder url={WAYLO_URL} site={WS} initialOpen={!!st.openOnLoad} />
        <p className="mt-3 text-sm text-stone-600">Paste it just before the closing <code>&lt;/body&gt;</code> tag on every page (or in your site builder&apos;s &quot;custom code / footer scripts&quot; box — Webflow, WordPress, Squarespace, Wix, Shopify, GTM all work). A chat button appears bottom-right and page views show up under Tracking.</p></Card>
      <Card title="2. Verify it works" actions={live ? <span className="text-xs font-medium text-teal-700">● Receiving visitors</span> : <span className="text-xs text-stone-400">Waiting for first visit</span>}>
        {live ? <p className="mb-3 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800 ring-1 ring-inset ring-teal-200">✓ Waylo is live — {visitors.length} visitor{visitors.length === 1 ? "" : "s"} tracked, last seen {new Date(visitors[0].lastSeen).toLocaleString()}. <Link href="/admin/tracking" className="font-medium underline">View Tracking →</Link></p> : null}
        <Checklist steps={[
          { ok: live, label: "Publish your site with the snippet", desc: "Deploy or save the page where you pasted it." },
          { ok: live, label: "Open your site in a fresh tab", desc: "The Waylo chat button should appear bottom-right within a second." },
          { ok: live, label: "Check Tracking", desc: "Your visit shows up under Tracking almost immediately.", action: <Link href="/admin/tracking" className="w-btn-ghost">Tracking</Link> },
          { ok: asked, label: "Ask a question", desc: "It appears under Questions with the answer and sources.", action: <Link href="/admin/questions" className="w-btn-ghost">Questions</Link> },
        ]} />
        <p className="mt-3 text-xs text-stone-500">Nothing showing? Check the browser console for blocked scripts, confirm the snippet is on the live page (not just a draft), and that your domain is in the allowlist below if you set one.</p></Card>
      <Card title="3. Optional settings">
        <ul className="list-disc space-y-1 pl-5 text-sm text-stone-600">
          <li><code>data-site</code> — must equal this workspace id (<code>{WS}</code>).</li>
          <li><code>data-mode</code> — <code>launcher</code> (floating button, default), <code>sidebar</code> (always-open panel) or <code>track</code> (analytics only).</li>
          <li><code>data-position=&quot;left&quot;</code>, <code>data-color=&quot;#0f766e&quot;</code>, <code>data-open=&quot;true&quot;</code> (open on load).</li>
          <li>JS API: <code>Waylo.open()</code>, <code>Waylo.close()</code>, <code>Waylo.toggle()</code> — e.g. on a &quot;Talk to us&quot; button.</li>
        </ul>
        <div className="mt-3"><Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="default" data-color="#1d4ed8" data-position="left" async></script>`}</Code></div></Card>
      <Card title="4. Allow your domain"><p className="text-sm text-stone-600">If you set an embed origin allowlist, add your site&apos;s domain under <Link href="/admin/settings" className="font-medium text-teal-700 hover:underline">Settings</Link> so chat requests are accepted.</p></Card>
    </div>
  </>);
}
