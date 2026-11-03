// Signed session cookie using Web Crypto (works in Edge middleware and Node routes).
export type Role = "Viewer" | "Editor" | "Owner";
export type Session = { email: string; role: Role; exp: number };
export const COOKIE = "waylo_session";
export const MAX_AGE = 60 * 60 * 24 * 14; // 14 days
export const authEnabled = () => !!process.env.WAYLO_ADMIN_PASSWORD;
const secret = () => process.env.WAYLO_SESSION_SECRET || `waylo:${process.env.WAYLO_ADMIN_PASSWORD || ""}`;
const b64u = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64u = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));
async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data)));
}
export async function sign(s: Omit<Session, "exp">) {
  const body = b64u(new TextEncoder().encode(JSON.stringify({ ...s, exp: Math.floor(Date.now() / 1000) + MAX_AGE })));
  return `${body}.${await hmac(body)}`;
}
export async function verify(token?: string): Promise<Session | null> {
  if (!token) return null; const [body, sig] = token.split("."); if (!body || !sig) return null;
  const want = await hmac(body); if (want.length !== sig.length) return null;
  let diff = 0; for (let i = 0; i < want.length; i++) diff |= want.charCodeAt(i) ^ sig.charCodeAt(i); if (diff) return null;
  try { const s = JSON.parse(fromB64u(body)) as Session; return s.exp > Date.now() / 1000 ? s : null; } catch { return null; }
}
export const rank: Record<Role, number> = { Viewer: 1, Editor: 2, Owner: 3 };
