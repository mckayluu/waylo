// Instant try sessions: crawl ~20 pages of a visitor's site and let them chat with it, no account.
// In memory only (single Render instance), 60-minute TTL, capped pages/replies, rate-limited per IP and globally.
import crypto from "crypto";
import { crawl } from "./crawler";
import { assertPublicUrl } from "./netguard";
import type { Page } from "./store-types";
export type TrySession = { id: string; url: string; host: string; siteName: string; status: "running" | "done" | "error"; pages: Page[]; found: number; message?: string; createdAt: number; ip: string; replies: number };
export const TRY_TTL_MS = 60 * 60_000, TRY_PAGES = 20, TRY_REPLIES = 12, TRY_MAX_SESSIONS = 60;
const g = globalThis as unknown as { __wayloTrySessions?: Map<string, TrySession>; __wayloTryHits?: Map<string, number[]> };
const sessions = (g.__wayloTrySessions ||= new Map<string, TrySession>());
const hits = (g.__wayloTryHits ||= new Map<string, number[]>());
function sweep() { const now = Date.now(); for (const [k, s] of sessions) if (now - s.createdAt > TRY_TTL_MS) sessions.delete(k); }
/** Sliding-window limiter: true when allowed. */
export function allow(key: string, max: number, windowMs: number) {
  const now = Date.now(); const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return false; } arr.push(now); hits.set(key, arr);
  if (hits.size > 20_000) for (const [k, v] of hits) if (!v.some((t) => now - t < 3_600_000)) hits.delete(k);
  return true;
}
export function getTry(id: unknown): TrySession | undefined {
  sweep(); if (typeof id !== "string" || !/^[A-Za-z0-9_-]{16,40}$/.test(id)) return undefined; return sessions.get(id);
}
const titleCase = (h: string) => h.replace(/^www\./, "").split(".")[0].replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
function siteNameFrom(pages: Page[], host: string) {
  const t = pages[0]?.title || ""; const parts = t.split(/\s[|\-–—·:]\s/).map((x) => x.trim()).filter(Boolean);
  const clean = (x: string) => x.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}.!)]+$/gu, "").trim();
  const pick0 = parts.length > 1 ? parts.sort((a, b) => a.length - b.length)[0] : parts[0];
  const pick = pick0 && clean(pick0); return pick && pick.length <= 40 ? pick : titleCase(host);
}
export async function startTry(rawUrl: string, ip: string): Promise<TrySession> {
  sweep();
  const u = await assertPublicUrl(rawUrl);
  if (sessions.size >= TRY_MAX_SESSIONS) throw Object.assign(new Error("Lots of people are trying Waylo right now. Give it a minute and try again, or start a free trial."), { status: 503 });
  const s: TrySession = { id: crypto.randomBytes(16).toString("base64url"), url: u.toString(), host: u.hostname, siteName: titleCase(u.hostname), status: "running", pages: [], found: 0, createdAt: Date.now(), ip, replies: 0 };
  sessions.set(s.id, s);
  crawl(u.toString(), { max: TRY_PAGES, concurrency: 6, deadlineMs: 45_000, documents: false, onProgress: (n) => { s.found = n; } })
    .then((r) => {
      s.pages = r.pages.map((p, i) => ({ ...p, id: `t${i}` })); s.found = s.pages.length; s.url = r.origin + "/";
      s.siteName = siteNameFrom(s.pages, s.host);
      s.status = s.pages.length ? "done" : "error";
      if (!s.pages.length) s.message = r.failures[0] ? `We couldn't read ${s.host} (${r.failures[0].reason}). Sites that block bots or need JavaScript to render aren't supported yet.` : `We couldn't find readable pages on ${s.host}. Sites that need JavaScript to render aren't supported yet.`;
    })
    .catch((e) => { s.status = "error"; s.message = (e as Error).message; });
  return s;
}
/** Suggested first questions from what was crawled. */
export function suggestions(s: TrySession): string[] {
  const paths = s.pages.map((p) => new URL(p.url).pathname.toLowerCase());
  const out = [`What does ${s.siteName} do?`];
  if (paths.some((p) => /pric|plan/.test(p))) out.push("How much does it cost?");
  if (paths.some((p) => /contact|about|team/.test(p))) out.push("Who is behind this?");
  if (paths.some((p) => /faq|help|support|docs/.test(p))) out.push("How do I get help?");
  if (out.length < 3) out.push("What makes you different?");
  return out.slice(0, 3);
}
