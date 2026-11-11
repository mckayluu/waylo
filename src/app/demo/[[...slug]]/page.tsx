import Script from "next/script";
import { notFound } from "next/navigation";
import { ProductTour } from "@/components/marketing/ProductTour";
import { tourSteps } from "@/lib/tour";

// Northpoint Ops is a fictional customer site used to demo the Waylo launcher embed.
// Plain <a> links on purpose: full page loads, like a typical marketing site, so each view is tracked as a journey step.
const NAV = [["features", "Features"], ["pricing", "Pricing"], ["case-studies", "Customers"], ["contact", "Contact"]] as const;
const TITLES: Record<string, string> = { "": "Northpoint Ops — Field service scheduling", features: "Northpoint Ops — Features", pricing: "Northpoint Ops — Pricing", "case-studies": "Northpoint Ops — Customers", contact: "Northpoint Ops — Contact" };

export function generateStaticParams() { return Object.keys(TITLES).map((k) => ({ slug: k ? [k] : [] })); }
export function generateMetadata({ params }: { params: { slug?: string[] } }) { return { title: TITLES[params.slug?.[0] || ""] || "Northpoint Ops", robots: { index: false } }; }

const ink = "text-slate-900", muted = "text-slate-600";

function Hero({ kicker, title, sub, children }: { kicker: string; title: string; sub: string; children?: React.ReactNode }) {
  return <section className="border-b border-slate-200 bg-slate-50 px-5 py-12 sm:py-16"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
    <div><p className="text-xs font-semibold uppercase tracking-wider text-orange-600">{kicker}</p><h1 className={`mt-2 max-w-xl text-4xl font-bold tracking-tight ${ink} sm:text-5xl`}>{title}</h1><p className={`mt-4 max-w-lg text-lg ${muted}`}>{sub}</p></div>
    {children}</div></section>;
}
function H2({ k, t, s }: { k: string; t: string; s?: string }) {
  return <div className="mb-6 grid gap-2 border-t border-slate-200 pt-5 lg:grid-cols-[1.3fr_1fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-wider text-orange-600">{k}</p><h2 className={`mt-1 text-2xl font-bold tracking-tight ${ink} sm:text-3xl`}>{t}</h2></div>{s && <p className={`text-[15px] leading-7 ${muted}`}>{s}</p>}</div>;
}
const Btn = ({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) =>
  <a href={href} className={ghost ? "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400" : "rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"}>{children}</a>;

const Board = () => <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  <div className="flex items-center justify-between text-xs text-slate-500"><span className="font-semibold text-slate-800">Today · Tue Nov 3</span><span>14 jobs · 5 techs</span></div>
  <div className="mt-3 space-y-2 text-sm">{[["8:00", "Rivera HVAC — tune-up", "Dana K.", "bg-emerald-100 text-emerald-800", "On site"], ["9:30", "Oak St. water heater", "Marco P.", "bg-orange-100 text-orange-800", "En route"], ["11:00", "Pine Dental — RTU fault", "Dana K.", "bg-slate-100 text-slate-700", "Scheduled"], ["1:15", "Lee residence — install", "Sam T.", "bg-slate-100 text-slate-700", "Scheduled"]].map(([t, j, w, c, s]) =>
    <div key={t} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-md border border-slate-100 px-3 py-2"><span className="text-xs tabular-nums text-slate-500">{t}</span><span><span className="block font-medium text-slate-800">{j}</span><span className="text-xs text-slate-500">{w}</span></span><span className={`rounded px-2 py-0.5 text-[11px] font-medium ${c}`}>{s}</span></div>)}</div>
</div>;

function Home() {
  return <>
    <Hero kicker="For HVAC, plumbing & electrical shops" title="Dispatch the day in ten minutes, not an hour." sub="Northpoint Ops puts jobs, techs, and customer texts on one board. Drag a job, and the customer gets an updated arrival window automatically.">
      <Board /></Hero>
    <div className="mx-auto -mt-px flex max-w-6xl flex-wrap gap-3 px-5 pt-6"><Btn href="/demo/pricing">See pricing</Btn><Btn ghost href="/demo/contact">Book a walkthrough</Btn></div>
    <section className="px-5 py-12"><div className="mx-auto max-w-6xl">
      <p className="text-sm text-slate-500">Used by 1,400+ service shops, including <b className="text-slate-700">Rivera Heating</b>, <b className="text-slate-700">Northwind Plumbing</b>, <b className="text-slate-700">Globex Electric</b>.</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <img src="/marketing/workshop.webp" alt="Technician reviewing a job on a tablet" className="h-72 w-full rounded-xl object-cover lg:h-full" />
        <div><H2 k="What changes" t="Less phone tag, fewer missed windows" />
          <ol className="divide-y divide-slate-200">{[["Morning board", "Unassigned jobs sit on the left; drag them to a tech and Northpoint Ops checks drive time and skills."], ["Customer texts", "Arrival windows, “on my way” and invoice links go out by SMS — no app for the customer."], ["Job notes & photos", "Techs log parts, photos and signatures offline; it syncs when they’re back in signal."], ["Same-day invoicing", "Close the job on site and take card payment before the truck leaves the driveway."]].map(([t, d], i) =>
            <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 py-4"><span className="text-sm font-semibold tabular-nums text-orange-600">0{i + 1}</span><span><b className={ink}>{t}</b><span className={`mt-1 block text-sm ${muted}`}>{d}</span></span></li>)}</ol></div>
      </div></div></section>
    <section className="bg-slate-900 px-5 py-10 text-white"><div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">{[["38%", "fewer “where’s my tech?” calls"], ["2.1 days", "faster average payment"], ["11 min", "median time to plan a 15-job day"]].map(([n, l]) => <div key={l}><p className="text-3xl font-bold text-orange-400">{n}</p><p className="mt-1 text-sm text-slate-300">{l}</p></div>)}</div></section>
  </>;
}

function Features() {
  return <>
    <Hero kicker="Features" title="Everything between the phone call and the paid invoice." sub="Scheduling, dispatch, field app, and billing — built for shops with 3 to 60 technicians." />
    <section className="px-5 py-12"><div className="mx-auto max-w-6xl space-y-12">
      {[["Scheduling", "A board you can actually read at 7am", "Color by job type, filter by zone, and see each tech’s day as a timeline. Recurring maintenance agreements drop onto the board on their own.", "/marketing/dashboard.webp"], ["Field app", "Works in basements and crawl spaces", "iOS and Android. Offline job notes, photos, checklists, and customer signatures. Syncs when the phone finds signal.", "/marketing/laptop.webp"]].map(([k, t, d, img], i) =>
        <div key={k} className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? "lg:[&>img]:order-2" : ""}`}><img src={img} alt="" className="h-64 w-full rounded-xl object-cover" /><div><p className="text-xs font-semibold uppercase tracking-wider text-orange-600">{k}</p><h2 className={`mt-1 text-2xl font-bold ${ink}`}>{t}</h2><p className={`mt-3 ${muted}`}>{d}</p></div></div>)}
      <div><H2 k="Also included" t="The rest of the toolbox" s="No add-on fees for these on Pro." />
        <dl className="grid gap-x-10 sm:grid-cols-2">{[["Realtime sync", "Office and field see the same job state within seconds."], ["QuickBooks & Xero", "Invoices and payments post automatically."], ["Price book", "Flat-rate pricing with good/better/best options."], ["Maintenance plans", "Recurring visits and auto-renewing agreements."], ["Uptime", "99.9% SLA, status page, daily backups."], ["Permissions", "Office, dispatcher, and tech roles."]].map(([t, d]) => <div key={t} className="border-b border-slate-200 py-3"><dt className={`font-semibold ${ink}`}>{t}</dt><dd className={`text-sm ${muted}`}>{d}</dd></div>)}</dl></div>
    </div></section>
  </>;
}

function Pricing() {
  const plans = [["Starter", "$0", "Up to 2 techs", ["Scheduling board", "Customer SMS (200/mo)", "Mobile app"], false], ["Pro", "$29", "per tech / month", ["Everything in Starter", "Unlimited SMS", "Invoicing & card payments", "QuickBooks / Xero sync", "Maintenance plans"], true], ["Enterprise", "Custom", "30+ techs or multi-branch", ["Everything in Pro", "Multi-location dispatch", "SSO & audit log", "Dedicated onboarding"], false]] as const;
  return <>
    <Hero kicker="Pricing" title="Priced per technician. Office seats are free." sub="Start free with two techs. Move to Pro when you need invoicing. Annual billing saves two months." />
    <section className="px-5 py-12"><div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-start">
      {plans.map(([n, p, u, f, hot]) => <div key={n} className={`rounded-xl border bg-white p-6 ${hot ? "border-slate-900 shadow-lg lg:-mt-3 lg:pb-9" : "border-slate-200"}`}>
        <div className="flex items-center justify-between"><h2 className={`font-semibold ${ink}`}>{n}</h2>{hot && <span className="rounded bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-800">Most shops</span>}</div>
        <p className="mt-3"><span className={`text-4xl font-bold ${ink}`}>{p}</span> <span className="text-sm text-slate-500">{u}</span></p>
        <ul className={`mt-5 space-y-2 text-sm ${muted}`}>{f.map((x) => <li key={x} className="flex gap-2"><span className="text-orange-600">✓</span>{x}</li>)}</ul>
        <div className="mt-6"><Btn ghost={!hot} href="/demo/contact">{n === "Enterprise" ? "Talk to sales" : "Start free"}</Btn></div></div>)}
    </div>
    <div className="mx-auto mt-12 max-w-6xl"><H2 k="Questions" t="Billing FAQ" />
      <dl className="grid gap-x-10 sm:grid-cols-2">{[["Do office staff count as seats?", "No. Only technicians who use the field app are billed."], ["Can I switch plans mid-month?", "Yes — we prorate to the day."], ["Is there a contract?", "Monthly plans cancel anytime. Annual is paid upfront."], ["Setup fees?", "None on Starter or Pro. Enterprise includes onboarding."]].map(([q, a]) => <div key={q} className="border-b border-slate-200 py-3"><dt className={`font-semibold ${ink}`}>{q}</dt><dd className={`text-sm ${muted}`}>{a}</dd></div>)}</dl></div></section>
  </>;
}

function Cases() {
  return <>
    <Hero kicker="Customers" title="Shops that stopped running dispatch off a whiteboard." sub="A few of the 1,400+ HVAC, plumbing, and electrical companies on Northpoint Ops." />
    <section className="px-5 py-12"><div className="mx-auto max-w-6xl">
      <figure className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center"><img src="/marketing/team.webp" alt="Northwind Plumbing office team" className="h-72 w-full rounded-xl object-cover" />
        <div><p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Northwind Plumbing · 22 techs</p><blockquote className={`mt-2 text-2xl font-semibold leading-snug ${ink}`}>“New techs used to shadow for two weeks before running their own day. Now it’s about a week — the checklists do half the teaching.”</blockquote><figcaption className={`mt-3 text-sm ${muted}`}>Priya Shah, Operations Manager — onboarding time down 40%</figcaption></div></figure>
      <div className="mt-12"><H2 k="More results" t="By the numbers" />
        <ul className="divide-y divide-slate-200">{[["Globex Electric", "Rolled out to 3,000 seats across 41 branches in two weeks.", "Enterprise"], ["Rivera Heating", "Cut unpaid invoices over 30 days from $48k to $9k.", "Pro"], ["Bluebird HVAC", "Added a second shift without hiring another dispatcher.", "Pro"]].map(([c, r, p]) => <li key={c} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr_auto]"><b className={ink}>{c}</b><span className={muted}>{r}</span><span className="text-xs text-slate-500">{p}</span></li>)}</ul></div>
    </div></section>
  </>;
}

function Contact() {
  return <>
    <Hero kicker="Contact" title="Talk to someone who has run a dispatch desk." sub="Walkthroughs are 30 minutes, on your own job list. Or ask the chat in the corner — it answers from this site." />
    <section className="px-5 py-12"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr]">
      <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-6" action="/demo/contact">
        {[["Name", "text"], ["Work email", "email"], ["Company", "text"], ["Number of technicians", "number"]].map(([l, t]) => <label key={l} className="block text-sm font-medium text-slate-700">{l}<input type={t} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></label>)}
        <button type="button" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Request walkthrough</button>
        <p className="text-xs text-slate-400">Demo form — nothing is submitted. Use the chat’s Contact tab to see a real lead come through.</p></form>
      <dl className="space-y-5 text-sm">{[["Sales", "sales@northpoint.example · (555) 010-2290"], ["Support", "Mon–Fri, 6am–6pm PT · support@northpoint.example"], ["Office", "1200 Market St, Suite 400, Denver, CO"]].map(([k, v]) => <div key={k}><dt className={`font-semibold ${ink}`}>{k}</dt><dd className={muted}>{v}</dd></div>)}</dl>
    </div></section>
  </>;
}

const VIEWS: Record<string, () => JSX.Element> = { "": Home, features: Features, pricing: Pricing, "case-studies": Cases, contact: Contact };

export default function Demo({ params }: { params: { slug?: string[] } }) {
  const key = params.slug?.[0] || ""; const View = VIEWS[key]; if (!View || (params.slug?.length || 0) > 1) notFound();
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="bg-indigo-700 px-5 py-2 text-xs text-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <span><b>Waylo demo</b> — Northpoint Ops is a fictional customer site with Waylo installed. Click around, then open the chat bottom-right.</span>
        <span className="flex gap-4"><a href="/admin/tracking" className="underline decoration-white/50 hover:decoration-white">See your journey in Admin →</a><a href="/" className="text-white/80 hover:text-white">Back to Waylo</a></span></div></div>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-5 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto py-3 text-sm">
        <a href="/demo" className="flex shrink-0 items-center gap-2 font-bold"><span className="grid h-7 w-7 place-items-center rounded-md bg-orange-600 text-xs text-white">N</span>Northpoint Ops</a>
        {NAV.map(([k, l]) => <a key={k} href={`/demo/${k}`} className={`shrink-0 ${k === key ? "font-semibold text-slate-900" : "text-slate-600 hover:text-slate-900"}`}>{l}</a>)}
        <span className="ml-auto shrink-0"><Btn href="/demo/contact">Book a walkthrough</Btn></span></nav></header>
      <main>{<View />}</main>
      <section aria-labelledby="waylo-tour" className="border-t-4 border-indigo-700 bg-slate-50 px-5 py-12"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
        <div><p className="text-xs font-semibold uppercase tracking-[0.08em] text-indigo-700">Waylo · not part of Northpoint Ops</p><h2 id="waylo-tour" className="mt-2 text-2xl font-semibold tracking-tight">Want this chat on your site?</h2><p className="mt-3 text-sm leading-6 text-slate-600">Try the chat bottom-right first. Then flip through the eight screens it takes to set up yourself: sign up, crawl, brand, paste one tag. Screens are the real app on a test workspace.</p>
          <div className="mt-5 flex flex-wrap gap-3"><a href="/signup" className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">Start free trial</a><a href="/how-it-works" className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100">See how it works</a></div></div>
        <ProductTour steps={tourSteps()} compact /></div></section>
      <footer className="border-t border-slate-200 px-5 py-8 pb-24 text-xs text-slate-500"><div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3"><span>© 2026 Northpoint Ops (fictional). Chat by Waylo, embedded with <code>&lt;script src=&quot;/waylo.js&quot; data-mode=&quot;launcher&quot;&gt;</code>.</span><a href="/demo/pricing" className="hover:text-slate-800">Pricing</a></div></footer>
      <Script src="/waylo.js" data-site="northpoint-demo" data-mode="launcher" strategy="afterInteractive" />
    </div>
  );
}
