import Link from "next/link";
import { entitlement } from "@/lib/entitlement";
import { fmtNum } from "@/lib/plans";
// Self-serve trial-to-paid nudges: shown on every admin page when action is needed. No sales contact anywhere.
export async function PlanBanner() {
  let e; try { e = await entitlement(); } catch { return null; }
  let tone: "rose" | "amber" | "navy" | null = null; let msg = ""; let cta = "Upgrade";
  if (e.state === "ended") { tone = "rose"; msg = `${e.reason}: AI answers are paused on your site and visitors see your contact form instead.`; cta = "Choose a plan"; }
  else if (e.state === "over_limit") { tone = "rose"; msg = `You've used all ${fmtNum(e.limit)} AI replies ${e.plan.replyPeriod === "trial" ? "in your trial" : "this month"}. Chat is paused until ${e.resetsAt ? new Date(e.resetsAt).toLocaleDateString() : "you upgrade"}.`; }
  else if (e.state === "past_due") { tone = "rose"; msg = "Your last payment failed. Update your card to keep Waylo answering."; cta = "Fix billing"; }
  else if (e.state === "preview") { tone = "navy"; msg = `No plan yet. Preview includes ${fmtNum(e.limit)} test replies (${fmtNum(e.used)} used). Start the free 14-day trial; no card needed.`; cta = "Start free trial"; }
  else if (e.state === "trial" && e.daysLeft !== undefined && e.daysLeft <= 4) { tone = "amber"; msg = `${e.daysLeft === 0 ? "Your trial ends today" : `${e.daysLeft} day${e.daysLeft === 1 ? "" : "s"} left in your trial`}. Upgrade now and keep the remaining days; you're only charged when the trial ends.`; }
  else if (e.pct >= 80) { tone = "amber"; msg = `You've used ${e.pct}% of your AI replies (${fmtNum(e.used)} of ${fmtNum(e.limit)}).`; }
  if (!tone) return null;
  const c = { rose: "border-rose-200 bg-rose-50 text-rose-900", amber: "border-amber-200 bg-amber-50 text-amber-950", navy: "border-navy-200 bg-navy-50 text-navy-900" }[tone];
  return <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b px-6 py-2 text-center text-xs ${c}`} data-plan-banner={e.state}><span>{msg}</span><Link href="/admin/billing" className="rounded-md bg-white/70 px-2 py-0.5 font-semibold underline-offset-2 ring-1 ring-inset ring-black/10 hover:underline">{cta} →</Link></div>;
}
