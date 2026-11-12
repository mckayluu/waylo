// Plan catalog: the single source of truth for limits shown in-app and enforced server-side.
import type { Tier } from "./store-types";
export type PlanLimits = { name: string; price: number; replies: number; replyPeriod: "trial" | "month"; sites: number; pages: number; recrawlDays: number };
export const PLANS: Record<Tier, PlanLimits> = {
  trial: { name: "Trial", price: 0, replies: 500, replyPeriod: "trial", sites: 1, pages: 100, recrawlDays: 3 },
  starter: { name: "Starter", price: 79, replies: 3000, replyPeriod: "month", sites: 1, pages: 500, recrawlDays: 1 },
  growth: { name: "Growth", price: 249, replies: 15000, replyPeriod: "month", sites: 3, pages: 2000, recrawlDays: 1 },
};
/** Before any plan is chosen (or Stripe failed at signup): enough to test the widget in preview. */
export const PREVIEW: PlanLimits = { name: "Preview", price: 0, replies: 50, replyPeriod: "trial", sites: 1, pages: 25, recrawlDays: 7 };
/** Self-hosted / Waylo's own workspace: no metering. Shown as "Internal", not a customer plan name. */
export const UNLIMITED: PlanLimits = { name: "Internal", price: 0, replies: Number.POSITIVE_INFINITY, replyPeriod: "month", sites: 10, pages: 2000, recrawlDays: 1 };
export const PAID_TIERS: Tier[] = ["starter", "growth"];
export const monthKey = (d = new Date()) => d.toISOString().slice(0, 7);
/** First day of next UTC month (when monthly reply counts reset). */
export const nextReset = (d = new Date()) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
export const fmtNum = (n: number) => (Number.isFinite(n) ? n.toLocaleString("en-US") : "Unlimited");
