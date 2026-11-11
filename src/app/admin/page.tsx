import Link from "next/link";
import { listConversations, stats, listLeads, getSettings, listPages, listVisitors, listHandoffs, getBranding, getGuidance, DEFAULT_BRANDING, currentWs, DEFAULT_WS } from "@/lib/store";
import { KNOWLEDGE } from "@/lib/knowledge";
import { daily, tier } from "@/lib/analytics";
import { PageHeader, MetricCard, Card, Badge, Checklist, ago } from "./ui";
import { PublishToggle } from "./PublishToggle";
import { billingAllowsPublish, getBilling, stripeConfigured } from "@/lib/stripe";
import { getInstall, getLastCrawl } from "@/lib/store";
import { entitlement } from "@/lib/entitlement";
import { UsageMeter } from "./_parts/UsageMeter";
import { FirstDay } from "./_parts/FirstDay";
export const dynamic = "force-dynamic";
export default async function Home() {
  const s = (await stats()); const convs = (await listConversations()); const leads = (await listLeads()); const st = (await getSettings());
  const questions = convs.reduce((n, c) => n + c.messages.filter((m) => m.role === "visitor").length, 0);
  const d = daily(convs, leads); const max = Math.max(1, ...d.map((x) => x.questions));
  const tiers = { High: 0, Medium: 0, Low: 0 }; convs.forEach((c) => tiers[tier(c)]++);
  const topics = new Map<string, number>(); convs.forEach((c) => c.themes.forEach((t) => topics.set(t, (topics.get(t) || 0) + 1)));
  const top = [...topics].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const pages = await listPages(); const visitors = await listVisitors(); const handoffs = await listHandoffs(); const b = await getBranding(); const g = await getGuidance();
  const wsId = await currentWs(); const isDefault = wsId === DEFAULT_WS;
  const inst = await getInstall(); const last = await getLastCrawl(); const ent = await entitlement(); const preview = `/widget?site=${encodeURIComponent(wsId)}`;
  const bill = await getBilling(); const stripeOn = stripeConfigured(); const canPublish = await billingAllowsPublish();
  // Signup auto-fills botName/greeting from the company name. Don't treat that as the user finishing this step.
  const signupBrand = !!st.siteName && b.botName === st.siteName.slice(0, 40) && b.greeting === `Hi! Ask me anything about ${st.siteName}.` && b.accent === DEFAULT_BRANDING.accent;
  const wayloBrand = b.botName === DEFAULT_BRANDING.botName && b.accent === DEFAULT_BRANDING.accent && b.greeting === DEFAULT_BRANDING.greeting;
  const branded = !signupBrand && !wayloBrand;
  const guided = !!st.companyProfile || g.facts.length + g.rules.length + g.skills.length > 0;
  const go = (href: string, label: string) => <Link href={href} className="w-btn-ghost whitespace-nowrap">{label}</Link>;
  const crawling = last?.status === "running";
  const steps = [
    { ok: !!st.siteUrl?.trim(), label: "Set website URL", desc: "Tell Waylo which site it represents.", action: go("/admin/settings", "Settings") },
    { ok: pages.length > 0, label: "Index your site", desc: crawling ? `Crawling now: ${last?.pages || 0} pages so far. Watch it live in Content.` : st.siteUrl?.trim() ? `Crawl your pages so answers cite your content.${pages.length ? "" : " Sitemap first, then links."}` : (isDefault ? "Set a website URL first, then crawl. Until then replies use demo samples only." : "Set a website URL first, then crawl your pages."), action: st.siteUrl?.trim() ? go("/admin/content", crawling ? "Watch crawl" : "Content") : go("/admin/settings", "Settings") },
    { ok: s.totalConversations > 0, label: "Send a test chat", desc: "Ask your bot a real question in the preview. It shows up under Questions with its sources.", action: <a href={preview} target="_blank" rel="noreferrer" className="w-btn-ghost whitespace-nowrap">Open preview ↗</a> },
    { ok: branded || guided, label: "Brand or guide answers", desc: "Set name, color and greeting, or add facts and rules.", action: <span className="flex gap-2">{go("/admin/settings", "Branding")}{go("/admin/guidance", "Guidance")}</span> },
    { ok: !!inst.host || !!inst.check?.siteMatches, label: "Install on your site", desc: inst.host ? `Detected on ${inst.host}.` : inst.check && !inst.check.siteMatches ? inst.check.detail : "Paste one line of HTML. Verified when the snippet reports in from your domain, or use Check now.", action: go("/admin/install", inst.host ? "Install" : "Install & check") },
    { ok: st.published && canPublish, label: "Publish", desc: canPublish ? "Remove the “Preview only” banner for visitors." : "Choose a plan in Billing first. Publishing needs an active plan or trial.", action: canPublish ? <PublishToggle initial={st.published} /> : go("/admin/billing", "Billing") },
  ];
  const done = steps.filter((x) => x.ok).length; const complete = done === steps.length;
  const firstRun = visitors.length === 0 && s.totalConversations === 0;
  type Act = { at: string; kind: string; text: string; href: string; tone: "stone" | "teal" | "amber" };
  const activity: Act[] = [
    ...convs.flatMap((c) => c.messages.filter((m) => m.role === "visitor").map((m) => ({ at: m.at, kind: "Question", text: m.text, href: `/admin/questions?id=${m.id}`, tone: "teal" as const }))),
    ...leads.map((l) => ({ at: l.createdAt, kind: l.intent === "demo" ? "Demo request" : "Lead", text: `${l.name} · ${l.email}`, href: "/admin/leads", tone: "amber" as const })),
    ...handoffs.map((h) => ({ at: h.createdAt, kind: "Handoff", text: h.name || h.email || h.note || "Visitor asked for a person", href: "/admin/handoffs", tone: "stone" as const })),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);
  return (<>
    <PageHeader title="Home" sub={`Workspace performance for ${st.siteName}.`} actions={<><Link href="/admin/install" className="w-btn-ghost">Install</Link><Link href="/admin/ai-chat" className="w-btn">AI Chat setup</Link></>} />
    <div className="w-accent-line mb-4" />
    {complete && canPublish ? <div className="mb-4 flex items-center gap-2 text-sm text-teal-800"><span className="grid h-5 w-5 place-items-center rounded-full bg-teal-700 text-[10px] text-white">✓</span>Setup complete — Waylo is live on {st.siteName}.</div> : complete && !canPublish ? <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">Setup steps are done, but publishing needs an active plan or trial. <Link href="/admin/billing" className="font-semibold underline">Open Billing</Link></div> :
      <div className="mb-4"><Card title={`Get Waylo live · ${done}/${steps.length}`} actions={<div className="h-1.5 w-32 overflow-hidden rounded-full bg-stone-100"><div className="h-full bg-teal-600" style={{ width: `${(done / steps.length) * 100}%` }} /></div>}><Checklist steps={steps} /></Card></div>}
    {firstRun && <div className="mb-4"><Card pad={false}><FirstDay ws={wsId} title="No visitors or chats yet" body="Two minutes to see the whole loop: ask your bot a question in the preview, then paste the snippet on your site." steps={pages.length ? ["chat", "install"] : ["crawl", "chat"]}
      example={<div className="grid gap-2 text-left text-sm sm:grid-cols-3"><div className="rounded-lg bg-white p-3 ring-1 ring-stone-200"><p className="text-xs text-stone-500">Conversations</p><p className="text-xl font-semibold">18</p></div><div className="rounded-lg bg-white p-3 ring-1 ring-stone-200"><p className="text-xs text-stone-500">Top question</p><p className="font-medium">“Do you integrate with HubSpot?”</p></div><div className="rounded-lg bg-white p-3 ring-1 ring-stone-200"><p className="text-xs text-stone-500">High intent</p><p className="font-medium">3 visitors viewed /pricing twice</p></div></div>} /></Card></div>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard label="Conversations" value={s.totalConversations} hint="All time" tone="indigo" />
      <MetricCard label="Questions" value={questions} hint="Visitor messages" tone="teal" />
      <MetricCard label="Contact forms" value={leads.length} hint={`${leads.filter((l) => l.intent === "demo").length} demo requests`} tone="indigo" />
      <MetricCard label="High intent" value={s.highIntent} hint="Ready for follow-up" tone="amber" />
      <MetricCard label="Messages today" value={s.messagesToday} hint="Visitor + Waylo" />
    </div>
    <div className="mt-3 grid gap-3 lg:grid-cols-3">
      <div className="lg:col-span-2"><Card title="Questions · last 14 days" actions={<span className="text-xs text-stone-500">{d.reduce((n, x) => n + x.questions, 0)} total · {d.reduce((n, x) => n + x.leads, 0)} leads</span>}>
        {d.every((x) => x.questions === 0) ? <div className="grid h-44 place-items-center rounded-lg border border-dashed border-stone-200 text-center text-sm text-stone-400"><p>No questions in the last 14 days.<br /><a href={preview} target="_blank" rel="noreferrer" className="font-medium text-teal-700 hover:underline">Ask one in your preview ↗</a></p></div> : <>
        <div className="flex h-44 items-end gap-1.5">{d.map((x) => (
          <div key={x.day} className="group relative flex h-full flex-1 flex-col justify-end" title={`${x.day}: ${x.questions} questions, ${x.leads} leads`}>
            <div className="rounded-t bg-teal-600/85 transition group-hover:bg-teal-700" style={{ height: `${(x.questions / max) * 100}%`, minHeight: x.questions ? 4 : 2, opacity: x.questions ? 1 : 0.15 }} />
            {x.leads > 0 && <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-500" />}
          </div>))}</div>
        <div className="mt-2 flex justify-between text-[10px] text-stone-400"><span>{d[0].day.slice(5)}</span><span>Today</span></div></>}
      </Card></div>
      <Card title="Workspace" actions={<span className="w-badge-support">Active</span>}>
        <p className="text-base font-bold tracking-tight text-stone-900">{st.siteName}</p>
        <dl className="mt-2 divide-y divide-stone-100 text-sm [&>div]:py-1.5">
          <div className="flex justify-between"><dt className="text-stone-500">Workspace id</dt><dd className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-xs text-indigo-700 ring-1 ring-inset ring-indigo-100">{wsId}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-stone-500">Status</dt><dd className="flex flex-wrap items-center justify-end gap-1.5 text-right">{st.published ? <Badge tone="teal">Published</Badge> : <Badge tone="amber">Preview only</Badge>}{stripeOn && !canPublish && <Badge tone="amber">No active plan</Badge>}{st.published && (!st.siteUrl?.trim() || pages.length === 0) && <Badge tone="stone">Setup incomplete</Badge>}</dd></div>
          {stripeOn && <div className="flex justify-between"><dt className="text-stone-500">Plan</dt><dd className="text-stone-700">{bill.tier ? bill.tier[0]!.toUpperCase() + bill.tier.slice(1) : "No plan"}{bill.status && bill.status !== "none" ? <span className="text-stone-400"> · {bill.status}</span> : null}</dd></div>}
          <div className="flex justify-between gap-3"><dt className="text-stone-500">Website URL</dt><dd className="max-w-[14rem] truncate text-right text-stone-700">{st.siteUrl?.trim() || <Link href="/admin/settings" className="text-amber-700 hover:underline">Not set</Link>}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-stone-500">Indexed pages</dt><dd className="text-right">{pages.length ? <span className="tabular-nums text-stone-800">{pages.length}</span> : isDefault ? <span className="text-amber-800">None yet · <span className="text-stone-500">demo samples only ({KNOWLEDGE.length})</span></span> : <span className="text-amber-800">None yet — crawl your site to index pages</span>}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-500">Embed</dt><dd>{visitors.length ? <Badge tone="teal">Receiving · {ago(visitors[0].lastSeen)}</Badge> : <Link href="/admin/install" className="text-amber-700 hover:underline">Not detected</Link>}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-500">Company profile</dt><dd className="text-stone-700">{st.companyProfile ? "Set" : "—"}</dd></div>
        </dl>
        <div className="mt-3 border-t border-stone-100 pt-3"><UsageMeter e={ent} compact />{ent.state !== "unlimited" && <Link href="/admin/billing" className="mt-1 inline-block text-xs text-teal-700 hover:underline">{ent.plan.name} plan · Billing →</Link>}</div>
        <div className="mt-3 flex gap-2"><Link href="/admin/content" className="w-btn-ghost flex-1">Content</Link><Link href="/admin/settings" className="w-btn-ghost flex-1">Settings</Link></div>
      </Card>
    </div>
    <div className="mt-3 grid gap-3 lg:grid-cols-3">
      <Card title="Visitor value">
        {(["High", "Medium", "Low"] as const).map((t) => { const n = tiers[t]; const pct = convs.length ? (n / convs.length) * 100 : 0;
          return <div key={t} className="mb-3 last:mb-0"><div className="flex justify-between text-sm"><span className="text-stone-700">{t}</span><span className="tabular-nums text-stone-500">{n}</span></div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100"><div className={`h-full ${t === "High" ? "bg-amber-500" : t === "Medium" ? "bg-teal-600" : "bg-stone-400"}`} style={{ width: `${pct}%` }} /></div></div>; })}
        <Link href="/admin/tracking" className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline">View visitors →</Link>
      </Card>
      <Card title="Top topics">
        {top.length === 0 ? <p className="text-sm text-stone-500">Topics show up once visitors start asking questions.</p> :
          <ul className="space-y-2 text-sm">{top.map(([t, n]) => <li key={t} className="flex items-center justify-between"><Link href={`/admin/questions?signal=${t}`} className="text-stone-700 hover:text-teal-700">{t}</Link><span className="tabular-nums text-stone-500">{n}</span></li>)}</ul>}
        <Link href="/admin/questions" className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline">All questions →</Link>
      </Card>
      <Card title="Recent activity">
        {activity.length === 0 ? <p className="text-sm text-stone-500">Questions, leads and handoffs appear here as they happen.</p> :
          <ul className="space-y-2.5 text-sm">{activity.map((a, i) => <li key={i}><Link href={a.href} className="group flex items-start gap-2"><Badge tone={a.tone}>{a.kind}</Badge><span className="min-w-0 flex-1 truncate text-stone-700 group-hover:text-teal-700">{a.text}</span><span className="shrink-0 text-xs text-stone-400">{ago(a.at)}</span></Link></li>)}</ul>}
      </Card>
    </div>
  </>);
}
