import Link from "next/link";
import { PageHeader, Card, Checklist } from "../ui";
import { listConversations, getSettings, currentWs, getInstall } from "@/lib/store";
import { InstallStatus } from "./InstallStatus";
import { CopyButton } from "../settings/CopyButton";
import { WAYLO_URL } from "@/lib/embed";
import { SnippetBuilder } from "./SnippetBuilder";
export const dynamic = "force-dynamic";
const Code = ({ children }: { children: string }) => <div className="relative"><pre className="overflow-x-auto rounded-md bg-navy-900 p-4 pr-24 text-sm text-navy-100">{children}</pre><div className="absolute right-2 top-2 rounded bg-card px-2 py-0.5"><CopyButton text={children} /></div></div>;
export default async function Install() {
  const st = await getSettings(); const WS = await currentWs(); const origins = (st.allowedOrigins || "").split(/\s+/).filter(Boolean);
  const inst = await getInstall(); const live = !!inst.host || !!inst.check?.siteMatches;
  let siteUrl: string | undefined; try { siteUrl = st.siteUrl ? new URL(st.siteUrl).toString() : undefined; } catch {}
  const asked = (await listConversations()).some((c) => c.messages.some((m) => m.role === "visitor"));
  return (<>
    <PageHeader title="Install" sub={`Add Waylo to ${st.siteName || "your site"} — one script tag, four quick checks.`} actions={<Link href="/admin/tracking" className="w-btn-ghost">Tracking</Link>} />
    <div className="w-accent-line mb-4" />
    <div className="space-y-4">
      <Card title="Workspace" actions={live ? <span className="w-badge-support">Live</span> : <span className="w-badge-accent">Not detected</span>}>
        <div className="flex flex-wrap items-center gap-2"><span className="text-sm text-warm-500">Workspace id</span><code className="rounded-md bg-navy-50 px-2 py-0.5 font-mono text-sm text-navy-700 ring-1 ring-inset ring-navy-100">{WS}</code><CopyButton text={WS} /></div>
        <p className="mt-2 text-sm text-warm-600">The <code>data-site</code> attribute on your snippet must match this id so visitors, chats and leads bind to this workspace.</p>
        <dl className="mt-2 divide-y divide-warm-100 border-t border-warm-100 text-sm [&>div]:py-1.5">
          <div className="flex justify-between gap-4"><dt className="text-warm-500">Website URL</dt><dd>{st.siteUrl ? <span className="text-warm-700">{st.siteUrl}</span> : <Link href="/admin/settings" className="text-amber-700 hover:underline">Not set — add in Settings</Link>}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-warm-500">Allowed origins</dt><dd>{origins.length ? <span className="text-warm-700">{origins.length} set</span> : <Link href="/admin/settings" className="text-amber-700 hover:underline">Empty — any site can embed</Link>}</dd></div>
        </dl>
        <div className="mt-3 border-t border-warm-100 pt-3"><InstallStatus initial={inst} siteUrl={siteUrl} /></div></Card>
      <Card title="1. Copy this snippet"><SnippetBuilder key={st.openOnLoad ? "open" : "closed"} url={WAYLO_URL} site={WS} initialOpen={!!st.openOnLoad} />
        <p className="mt-2 text-sm text-warm-600">Paste it just before the closing <code>&lt;/body&gt;</code> tag on every page (or in your site builder&apos;s &quot;custom code / footer scripts&quot; box — Webflow, WordPress, Squarespace, Wix, Shopify, GTM all work). A chat button appears bottom-right and page views show up under Tracking.</p></Card>
      <Card title="2. Verify it works" actions={live ? <span className="text-xs font-medium text-navy-700">● Receiving visitors</span> : <span className="text-xs text-warm-400">Waiting for first visit</span>}>
        {live ? <p className="mb-3 rounded-lg bg-navy-50 px-3 py-2 text-sm text-navy-800 ring-1 ring-inset ring-navy-200">✓ Waylo is installed{inst.host ? <> on {inst.host}, last seen {inst.lastSeen ? new Date(inst.lastSeen).toLocaleString() : "recently"}</> : null}. <Link href="/admin/tracking" className="font-medium underline">View Tracking →</Link></p> : null}
        <Checklist steps={[
          { ok: live, label: "Publish your site with the snippet", desc: "Deploy or save the page where you pasted it." },
          { ok: live, label: "Open your site in a fresh tab", desc: "The Waylo chat button should appear bottom-right within a second." },
          { ok: live, label: "Check Tracking", desc: "Your visit shows up under Tracking almost immediately.", action: <Link href="/admin/tracking" className="w-btn-ghost">Tracking</Link> },
          { ok: asked, label: "Ask a question", desc: "It appears under Questions with the answer and sources.", action: <Link href="/admin/questions" className="w-btn-ghost">Questions</Link> },
        ]} />
        <p className="mt-3 text-xs text-warm-500">Nothing showing? Check the browser console for blocked scripts, confirm the snippet is on the live page (not just a draft), and that your domain is in the allowlist below if you set one.</p></Card>
      <Card title="3. Optional settings">
        <ul className="list-disc space-y-0.5 pl-5 text-sm text-warm-600">
          <li><code>data-site</code> — must equal this workspace id (<code>{WS}</code>).</li>
          <li><code>data-mode</code> — <code>launcher</code> (floating button, default), <code>sidebar</code> (always-open panel) or <code>track</code> (analytics only).</li>
          <li><code>data-position=&quot;left&quot;</code>, <code>data-color=&quot;#A81B48&quot;</code>, <code>data-open=&quot;true&quot;</code> (open on load).</li>
          <li>JS API: <code>Waylo.open()</code>, <code>Waylo.close()</code>, <code>Waylo.toggle()</code> — e.g. on a &quot;Talk to us&quot; button.</li>
        </ul>
        <div className="mt-3"><Code>{`<script src="${WAYLO_URL}/waylo.js" data-site="${WS}" data-color="#1d4ed8" data-position="left" async></script>`}</Code></div></Card>
      <Card title="4. Allow your domain"><p className="text-sm text-warm-600">If you set an embed origin allowlist, add your site&apos;s domain under <Link href="/admin/settings" className="font-medium text-navy-700 hover:underline">Settings</Link> so chat requests are accepted.</p></Card>
    </div>
  </>);
}
