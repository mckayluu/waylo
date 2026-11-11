import type { Pageview } from "./store-types";
import { classify } from "./channels";
/** Acquisition channel for a visitor: the first pageview that carries one (older rows fall back to referrer). */
export function visitorChannel(pvs: Pageview[]): { channel: string; source?: string; campaign?: string } {
  const p = pvs.find((x) => x.path !== "(chat)" && (x.channel || x.referrer)) || pvs.find((x) => x.path !== "(chat)");
  if (!p) return { channel: "Direct" };
  if (p.channel) return { channel: p.channel, source: p.source, campaign: p.utmCampaign };
  return classify(p.referrer);
}
export function engagement(pvs: Pageview[]) {
  const real = pvs.filter((p) => p.path !== "(chat)");
  const durationMs = real.reduce((n, p) => n + (p.durationMs || 0), 0);
  const withScroll = real.filter((p) => p.scrollPct != null);
  const avgScroll = withScroll.length ? Math.round(withScroll.reduce((n, p) => n + (p.scrollPct || 0), 0) / withScroll.length) : undefined;
  const clicks = real.flatMap((p) => (p.clicks || []).map((c) => ({ ...c, path: p.path })));
  return { durationMs, avgScroll, clicks, measured: real.some((p) => p.durationMs != null) };
}
