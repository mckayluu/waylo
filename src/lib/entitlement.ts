// What a workspace may do right now: plan limits + billing state + usage. Used by chat (enforcement),
// the widget (graceful pause), crawl (page/site caps) and admin (banners, meters).
import { getBilling, currentWs, DEFAULT_WS, type Tier } from "./store";
import { stripeConfigured } from "./stripe";
import { PLANS, PREVIEW, UNLIMITED, monthKey, nextReset, type PlanLimits } from "./plans";
import { getUsage } from "./usage";

export type EntState = "unlimited" | "preview" | "trial" | "active" | "past_due" | "ended" | "over_limit";
export type Entitlement = {
  state: EntState; plan: PlanLimits; tier?: Tier; period: string; used: number; limit: number;
  chatOpen: boolean; reason?: string; trialEndsAt?: string; daysLeft?: number; resetsAt?: string; pct: number;
};
const DAY = 86_400_000;
export async function entitlement(ws?: string): Promise<Entitlement> {
  const w = ws || (await currentWs());
  if (w === DEFAULT_WS || !stripeConfigured()) return { state: "unlimited", plan: UNLIMITED, period: monthKey(), used: 0, limit: Infinity, chatOpen: true, pct: 0 };
  const b = await getBilling();
  const end = b.currentPeriodEnd ? +new Date(b.currentPeriodEnd) : undefined;
  let state: EntState; let plan: PlanLimits; const tier = b.tier;
  if (b.status === "trialing") { plan = PLANS[tier && tier !== "trial" ? tier : "trial"]; state = end && end < Date.now() ? "ended" : "trial"; }
  else if (b.status === "active") { plan = PLANS[tier && tier !== "trial" ? tier : "starter"]; state = "active"; }
  else if (b.status === "past_due") { plan = PLANS[tier || "starter"]; state = "past_due"; }
  else if (b.status === "canceled") { plan = PLANS[tier || "trial"]; state = "ended"; }
  else { plan = PREVIEW; state = "preview"; }
  // A trial that is converting to a paid tier still meters as a trial total.
  const period = plan.replyPeriod === "trial" ? "trial" : monthKey();
  const used = await getUsage(period, w);
  const limit = plan.replies;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const out: Entitlement = { state, plan, tier, period, used, limit, chatOpen: true, pct, resetsAt: plan.replyPeriod === "month" ? nextReset().toISOString() : undefined };
  if (b.status === "trialing" && end) { out.trialEndsAt = new Date(end).toISOString(); out.daysLeft = Math.max(0, Math.ceil((end - Date.now()) / DAY)); }
  if (state === "ended") { out.chatOpen = false; out.reason = b.status === "canceled" && tier && tier !== "trial" ? "Plan canceled" : "Trial ended"; }
  else if (used >= limit) { out.state = "over_limit"; out.chatOpen = false; out.reason = `${plan.name} reply limit reached`; }
  return out;
}
// Shown in the widget when the workspace's trial ended or its reply limit is reached. The Contact tab keeps working.
export const PAUSED_REPLY = "Our AI assistant is taking a short break. Please leave your question in the **Contact** tab and the team will get back to you.";
