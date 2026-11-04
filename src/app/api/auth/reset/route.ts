import { NextResponse } from "next/server";
import { findMember, updateMember, runIn } from "@/lib/store";
import { hashPassword } from "@/lib/auth";
import { checkResetToken, parseResetToken } from "@/lib/reset";
import { COOKIE, MAX_AGE, sign } from "@/lib/session";
import { rateLimit, clientIp } from "@/lib/ratelimit";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  if (!rateLimit(`reset:${clientIp(req)}`, 10, 15 * 60_000)) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const { token = "", password = "" } = await req.json().catch(() => ({}));
  const p = parseResetToken(String(token)); const m = p && (await findMember({ id: p.id }));
  if (!m || !checkResetToken(String(token), m)) return NextResponse.json({ error: "This reset link is invalid or expired. Request a new one." }, { status: 400 });
  if (String(password).length < 8) return NextResponse.json({ error: "Use at least 8 characters" }, { status: 400 });
  await runIn(m.workspaceId || "default", () => updateMember(m.id, { passwordHash: hashPassword(String(password)) })); // new hash invalidates the token
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await sign({ email: m.email, role: m.role, ws: m.workspaceId || "default" }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" && !/^http:\/\/localhost/.test(process.env.WAYLO_PUBLIC_URL || ""), path: "/", maxAge: MAX_AGE });
  return res;
}
