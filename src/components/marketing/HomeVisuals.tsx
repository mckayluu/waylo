// Illustrative UI cut-outs for the homepage. These are drawn in code, not screenshots.
// Northpoint Ops is the fictional demo company used across the site.
import type { ReactNode } from "react";

export function SlackCard({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full max-w-sm rounded-2xl bg-white p-4 text-left text-[13px] leading-5 text-warm-800 shadow-2xl shadow-navy-950/25 ring-1 ring-warm-200 ${className}`} role="img" aria-label="Illustration of a Slack message from Waylo about a ready buyer on the fictional Northpoint Ops site">
      <p className="font-plex text-[11px] font-medium text-warm-500"># sales-leads</p>
      <div className="mt-2 flex gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-900 text-xs font-bold text-white">W</span>
        <div className="min-w-0">
          <p><span className="font-semibold text-warm-900">Waylo</span> <span className="rounded bg-warm-100 px-1 text-[10px] font-semibold text-warm-500">APP</span> <span className="text-[11px] text-warm-400">9:42 AM</span></p>
          <p className="mt-0.5 font-semibold text-warm-900">Ready buyer on Northpoint Ops</p>
          <p className="mt-1 border-l-2 border-rasp-600 pl-2 text-warm-700">“Can we get set up for 12 techs next week?”</p>
          <p className="mt-2 flex flex-wrap gap-1.5"><Chip>pricing</Chip><Chip>ready-to-buy</Chip></p>
          <p className="mt-2 text-[12px] text-warm-500">Read /pricing, then /features</p>
          <span className="mt-2 inline-block rounded-md px-2.5 py-1 text-[12px] font-semibold text-navy-800 ring-1 ring-warm-300">Open in Waylo</span>
        </div>
      </div>
    </div>
  );
}
function Chip({ children }: { children: ReactNode }) { return <span className="rounded-full bg-rasp-50 px-2 py-0.5 text-[11px] font-medium text-rasp-700 ring-1 ring-rasp-100">{children}</span>; }

export function ChatBubble({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full max-w-[290px] space-y-2 text-left text-[13px] leading-5 ${className}`} role="img" aria-label="Illustration of a chat on the fictional Northpoint Ops site. A visitor asks if it syncs with QuickBooks, and the answer links the features page.">
      <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-navy-700 px-3.5 py-2 text-white shadow-lg">Does it sync with QuickBooks?</p>
      <div className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-warm-800 shadow-xl shadow-navy-950/20 ring-1 ring-warm-200">
        Yes. Invoices and payments post to QuickBooks and Xero automatically.<sup className="ml-0.5 font-semibold text-rasp-700">1</sup>
        <span className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-warm-50 px-2.5 py-0.5 text-[11px] font-medium text-navy-700 ring-1 ring-warm-200"><span className="font-semibold text-rasp-700">1</span>Northpoint Ops · Features</span>
      </div>
    </div>
  );
}

export function LeftCard({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full max-w-[260px] rounded-2xl bg-white p-4 text-left text-[13px] leading-5 shadow-2xl shadow-navy-950/20 ring-1 ring-warm-200 ${className}`} role="img" aria-label="Illustration of a visitor who read two pages and left without asking a question">
      <p className="font-plex text-[10px] font-medium uppercase tracking-[0.09em] text-warm-500">Visitor session</p>
      <ul className="mt-2 space-y-1 text-warm-700"><li>/pricing</li><li>/features</li></ul>
      <p className="mt-3 rounded-lg bg-warm-50 px-2.5 py-1.5 text-[12px] italic text-warm-600">“Will this work with our setup?”</p>
      <p className="mt-2 text-[11px] font-semibold text-rasp-700">Left without asking</p>
    </div>
  );
}

const P = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
// Icon paths adapted from Lucide (ISC license, lucide.dev).
export function Icon({ name, className = "h-5 w-5" }: { name: "megaphone" | "target" | "headset"; className?: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden className={className} {...P}>
    {name === "megaphone" && <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>}
    {name === "target" && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>}
    {name === "headset" && <><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" /><path d="M21 16v2a4 4 0 0 1-4 4h-5" /></>}
  </svg>;
}
