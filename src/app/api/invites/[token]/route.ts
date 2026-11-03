import { NextResponse } from "next/server";
import { findMember, updateMember } from "@/lib/store";
import { hashPassword } from "@/lib/auth";
import { COOKIE, MAX_AGE, sign } from "@/lib/session";
export const dynamic = "force-dynamic";
// Accept an invite: set a password, get signed in.
export async function POST(req: Request, { params }: { params: { token: string } }) {
  const m = (await findMember({ token: params.token })); if (!m || m.passwordHash) return NextResponse.json({ error: "Invite not found or already used" }, { status: 404 });
  const { password = "" } = await req.json().catch(() => ({}));
  if (String(password).length < 8) return NextResponse.json({ error: "Use at least 8 characters" }, { status: 400 });
  (await updateMember(m.id, { passwordHash: hashPassword(String(password)), joinedAt: new Date().toISOString(), inviteToken: undefined }));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await sign({ email: m.email, role: m.role }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" && !/^http:\/\/localhost/.test(process.env.WAYLO_PUBLIC_URL || ""), path: "/", maxAge: MAX_AGE });
  return res;
}
