import { NextResponse } from "next/server";
import { getSettings } from "@/lib/store";

// In-memory fixed-window rate limiter. Fine for a single instance;
// multiple instances need a shared store (e.g. Redis / Render Key Value).
const LIMITS = { chat: 20, track: 120, feedback: 30, handoff: 10, leads: 10, login: 10, forgot: 5 } as const;
export type Bucket = keyof typeof LIMITS;
const WINDOW = 60_000;
const hits = new Map<string, { n: number; reset: number }>();

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

export function rateLimit(req: Request, bucket: Bucket): NextResponse | null {
  const now = Date.now(); const key = bucket + ":" + clientIp(req); const h = hits.get(key);
  if (hits.size > 50_000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  if (!h || h.reset < now) { hits.set(key, { n: 1, reset: now + WINDOW }); return null; }
  if (++h.n > LIMITS[bucket]) {
    const retry = Math.ceil((h.reset - now) / 1000);
    return NextResponse.json({ error: `Too many requests. Try again in ${retry}s.` }, { status: 429, headers: { "Retry-After": String(retry) } });
  }
  return null;
}

const norm = (o: string) => { try { return new URL(/^https?:\/\//i.test(o) ? o : "https://" + o).origin.toLowerCase(); } catch { return ""; } };
let warned = false;

export async function allowedOrigins(): Promise<string[]> {
  const env = (process.env.WAYLO_ALLOWED_ORIGINS || "").split(",");
  let fromSettings: string[] = [];
  try { fromSettings = ((await getSettings()).allowedOrigins || "").split(/[\s,]+/); } catch {}
  return [...new Set([...env, ...fromSettings].map((s) => s.trim()).filter(Boolean).map(norm).filter(Boolean))];
}

/** Returns null when allowed. Empty Origin (server tools) and same-site are always allowed. */
export async function checkOrigin(req: Request): Promise<NextResponse | null> {
  const origin = req.headers.get("origin");
  if (!origin) return null;
  const list = await allowedOrigins();
  if (!list.length) { if (!warned) { warned = true; console.warn("[waylo] WAYLO_ALLOWED_ORIGINS / Allowed embed origins not set — public APIs accept any origin."); } return null; }
  const o = origin.toLowerCase();
  const self = [new URL(req.url).origin, process.env.WAYLO_PUBLIC_URL ? norm(process.env.WAYLO_PUBLIC_URL) : ""];
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) self.push("https://" + host, "http://" + host);
  if (self.map((s) => s.toLowerCase()).includes(o) || list.includes(o)) return null;
  return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
}

/** Rate limit + origin check for public endpoints. */
export async function guard(req: Request, bucket: Bucket) {
  return rateLimit(req, bucket) || (await checkOrigin(req));
}
