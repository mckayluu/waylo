import type { Entitlement } from "@/lib/entitlement";
import { fmtNum } from "@/lib/plans";
export function UsageMeter({ e, compact = false }: { e: Entitlement; compact?: boolean }) {
  if (e.state === "unlimited") return <p className="text-sm text-warm-500">Unlimited AI replies on this workspace.</p>;
  const bar = e.pct >= 100 ? "bg-rose-500" : e.pct >= 80 ? "bg-amber-500" : "bg-navy-600";
  const when = e.plan.replyPeriod === "trial" ? "for the whole trial" : `this month · resets ${e.resetsAt ? new Date(e.resetsAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "on the 1st"}`;
  return <div>
    <div className="flex items-baseline justify-between text-sm"><span className="text-warm-600">AI replies</span><span className="tabular-nums text-warm-800"><strong>{fmtNum(e.used)}</strong> / {fmtNum(e.limit)}</span></div>
    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-warm-100"><div className={`h-full ${bar}`} style={{ width: `${Math.max(e.used ? 2 : 0, e.pct)}%` }} /></div>
    {!compact && <p className="mt-1 text-xs text-warm-500">{e.plan.name} plan, {when}.</p>}
  </div>;
}
