import { NextResponse } from "next/server";
import { COOKIE, MAX_AGE, sign, authEnabled } from "@/lib/session";
import { findMember } from "@/lib/store";
import { checkPassword, safeEqual } from "@/lib/auth";
import { guard } from "@/lib/guard";
export const dynamic = "force-dynamic";
const fails = new Map<string, { n: number; until: number }>();
export async function POST(req: Request) {
  { const g = await guard(req, "login"); if (g) return g; }
  if (!authEnabled()) return NextResponse.json({ ok: true, open: true });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local"; const f = fails.get(ip);
  if (f && f.until > Date.now()) return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  const { email = "", password = "" } = await req.json().catch(() => ({}));
  const em = String(email).trim().toLowerCase(), pw = String(password);
  const ownerEmail = (process.env.WAYLO_ADMIN_EMAIL || "").toLowerCase();
  let session: { email: string; role: "Viewer" | "Editor" | "Owner" } | null = null;
  if ((!ownerEmail || em === ownerEmail || !em) && safeEqual(pw, process.env.WAYLO_ADMIN_PASSWORD!)) session = { email: ownerEmail || em || "owner", role: "Owner" };
  else { const m = em ? (await findMember({ email: em })) : undefined; if (m?.passwordHash && checkPassword(pw, m.passwordHash)) session = { email: m.email, role: m.role }; }
  if (!session) { const n = (f?.n || 0) + 1; fails.set(ip, { n, until: n >= 5 ? Date.now() + 60_000 : 0 }); return NextResponse.json({ error: "Wrong email or password." }, { status: 401 }); }
  fails.delete(ip);
  const res = NextResponse.json({ ok: true, role: session.role });
  res.cookies.set(COOKIE, await sign(session), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" && !/^http:\/\/localhost/.test(process.env.WAYLO_PUBLIC_URL || ""), path: "/", maxAge: MAX_AGE });
  return res;
}
