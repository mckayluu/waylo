// A workspace's websites: the primary Settings URL plus extra sites (Growth: up to 3 total).
import type { SiteSettings } from "./store-types";
export const originOf = (u: string) => { try { return new URL(/^https?:\/\//i.test(u) ? u : "https://" + u).origin.toLowerCase(); } catch { return ""; } };
/** Same site regardless of www. */
export const siteKey = (u: string) => originOf(u).replace(/^https?:\/\/(www\.)?/, "");
export function siteList(st: SiteSettings): string[] {
  const all = [st.siteUrl, ...(st.extraSites || [])].map((s) => (s || "").trim()).filter(Boolean);
  const seen = new Set<string>(); return all.filter((u) => { const k = siteKey(u); if (!k || seen.has(k)) return false; seen.add(k); return true; });
}
