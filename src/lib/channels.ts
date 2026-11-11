// Traffic channel from referrer + UTM tags, done server-side so old snippets benefit too.
export type Channel = "Paid" | "Email" | "Social" | "Organic search" | "AI" | "Referral" | "Direct";
export const CHANNELS: Channel[] = ["Organic search", "AI", "Paid", "Social", "Email", "Referral", "Direct"];
const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|baidu|yandex|ecosia|brave|startpage|naver|seznam|qwant)\./i;
const AI = /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|you\.com|phind\.com|poe\.com|grok\.com|x\.ai|meta\.ai)$/i;
const SOCIAL = /(^|\.)(facebook|fb|instagram|linkedin|lnkd|twitter|t\.co$|x\.com$|reddit|youtube|youtu\.be|tiktok|pinterest|threads|bsky|mastodon|news\.ycombinator|quora|discord|slack)/i;
const MAIL = /(^|\.)(mail\.google|outlook\.live|outlook\.office|mail\.yahoo|mail\.proton|fastmail)/i;
const hostOf = (u?: string) => { try { return u ? new URL(u).hostname.replace(/^www\./, "") : ""; } catch { return ""; } };
export function classify(referrer: string | undefined, utm: { source?: string; medium?: string } = {}, pageHost = ""): { channel: Channel; source?: string } {
  const m = (utm.medium || "").toLowerCase(), us = (utm.source || "").toLowerCase();
  const rh = hostOf(referrer); const own = rh && pageHost && rh === pageHost.replace(/^www\./, "");
  if (/^(cpc|ppc|paid|paidsearch|paid[_-]?social|display|cpm|cpv|banner|affiliate|retargeting)/.test(m)) return { channel: "Paid", source: us || rh || undefined };
  if (/e-?mail|newsletter/.test(m) || /newsletter|mailchimp|hubspot_?email|klaviyo/.test(us)) return { channel: "Email", source: us || undefined };
  if (/social/.test(m) || SOCIAL.test(us)) return { channel: "Social", source: us || rh || undefined };
  if (/chatgpt|openai|perplexity|claude|gemini|copilot/.test(us)) return { channel: "AI", source: us };
  if (rh && !own) {
    if (AI.test(rh)) return { channel: "AI", source: rh };
    if (SEARCH.test(rh + ".")) return { channel: "Organic search", source: rh };
    if (SOCIAL.test(rh)) return { channel: "Social", source: rh };
    if (MAIL.test(rh)) return { channel: "Email", source: rh };
    return { channel: "Referral", source: rh };
  }
  if (us) return { channel: "Referral", source: us };
  return { channel: "Direct" };
}
export const fmtDur = (ms?: number) => { if (!ms || ms < 1000) return ms ? "<1s" : ""; const s = Math.round(ms / 1000); return s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`; };
