// Stateless, single-use password-reset tokens: HMAC over (memberId, expiry, current password hash).
// Changing the password changes the hash, so a used token stops verifying — no schema change needed.
import crypto from "crypto";
import type { Member } from "./store-types";
const TTL = 60 * 60 * 1000;
const secret = () => process.env.WAYLO_SESSION_SECRET || process.env.WAYLO_ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? (() => { throw new Error("Set WAYLO_SESSION_SECRET or WAYLO_ADMIN_PASSWORD") })() : "waylo-dev");
const mac = (id: string, exp: number, hash: string) => crypto.createHmac("sha256", secret()).update(`reset|${id}|${exp}|${hash}`).digest("base64url");
export function makeResetToken(m: Member) { const exp = Date.now() + TTL; return `${Buffer.from(m.id).toString("base64url")}.${exp}.${mac(m.id, exp, m.passwordHash || "")}`; }
export function parseResetToken(t: string) {
  const [a, e, s] = String(t).split("."); const exp = Number(e); if (!a || !s || !exp || exp < Date.now()) return null;
  return { id: Buffer.from(a, "base64url").toString(), exp, sig: s };
}
export function checkResetToken(t: string, m: Member) {
  const p = parseResetToken(t); if (!p || p.id !== m.id || !m.passwordHash) return false;
  const want = Buffer.from(mac(m.id, p.exp, m.passwordHash)), got = Buffer.from(p.sig);
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}
