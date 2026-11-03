// Server-side helpers (Node runtime).
import crypto from "crypto";
import { cookies } from "next/headers";
import { COOKIE, verify, authEnabled, type Session } from "./session";
export async function currentSession(): Promise<Session | null> {
  if (!authEnabled()) return { email: process.env.WAYLO_ADMIN_EMAIL || "owner@local", role: "Owner", exp: 0 };
  return verify(cookies().get(COOKIE)?.value);
}
export function hashPassword(pw: string) { const salt = crypto.randomBytes(16).toString("hex"); return `${salt}:${crypto.scryptSync(pw, salt, 32).toString("hex")}`; }
export function checkPassword(pw: string, stored?: string) {
  if (!stored) return false; const [salt, h] = stored.split(":"); const got = crypto.scryptSync(pw, salt, 32);
  const want = Buffer.from(h, "hex"); return want.length === got.length && crypto.timingSafeEqual(got, want);
}
export function safeEqual(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); }
