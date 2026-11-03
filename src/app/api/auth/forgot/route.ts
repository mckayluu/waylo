import { NextResponse } from "next/server";
import { findMember } from "@/lib/store";
import { EMAIL_RE } from "@/lib/signals";
import { makeResetToken } from "@/lib/reset";
import { publicUrl, sendPasswordResetEmail, emailConfigured } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/ratelimit";
export const dynamic = "force-dynamic";
const GENERIC = "If that email belongs to a Waylo member, a reset link is on its way.";
export async function POST(req: Request) {
  const { email = "" } = await req.json().catch(() => ({}));
  const em = String(email).trim().toLowerCase();
  if (!rateLimit(`forgot:ip:${clientIp(req)}`, 5, 15 * 60_000) || (em && !rateLimit(`forgot:em:${em}`, 3, 15 * 60_000)))
    return NextResponse.json({ error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  if (!EMAIL_RE.test(em)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  const owner = (process.env.WAYLO_ADMIN_EMAIL || "").toLowerCase();
  const m = await findMember({ email: em });
  if (owner && em === owner && !m?.passwordHash)
    return NextResponse.json({ ok: true, owner: true, message: "This is the workspace owner account. Its password is the WAYLO_ADMIN_PASSWORD environment variable — change it on your host (e.g. Render → Environment) and redeploy." });
  if (m?.passwordHash) {
    const link = `${publicUrl()}/admin/reset/${makeResetToken(m)}`;
    const r = await sendPasswordResetEmail(m.email, link);
    if (!r.sent) console.warn(`[waylo:forgot] reset link for ${m.email}: ${link}`);
  }
  return NextResponse.json({ ok: true, message: emailConfigured() ? GENERIC : `${GENERIC} (Email isn't configured on this server — an Owner can find the link in the server logs.)` });
}
