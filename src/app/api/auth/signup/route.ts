import { NextResponse } from "next/server";
import { COOKIE, MAX_AGE, sign } from "@/lib/session";
import { findMember, createWorkspace, deleteWorkspace, addMember, setSettings, setBranding, runIn, DEFAULT_BRANDING } from "@/lib/store";
import { hashPassword } from "@/lib/auth";
import { usePostgres } from "@/lib/db";
import { rateLimit } from "@/lib/guard";
import { EMAIL_RE } from "@/lib/signals";
export const dynamic = "force-dynamic";
const RESERVED = new Set(["default", "waylo", "acme-demo", "northpoint-demo", "admin", "api", "demo", "www", "app", "widget", "signup", "login"]);
const slugify = (s: string) => s.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\.[a-z.]+(\/.*)?$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
// New customer: create a workspace + its Owner member, then sign them in.
export async function POST(req: Request) {
  { const l = rateLimit(req, "login"); if (l) return l; }
  if (!usePostgres()) return NextResponse.json({ error: "Signup needs the Postgres store (DATABASE_URL)." }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  const company = String(b.company || "").trim().slice(0, 80), email = String(b.email || "").trim().toLowerCase(), pw = String(b.password || "");
  const siteUrl = String(b.siteUrl || "").trim().slice(0, 300);
  if (!company) return NextResponse.json({ error: "Company name required" }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Valid work email required" }, { status: 400 });
  if (pw.length < 8) return NextResponse.json({ error: "Use at least 8 characters for your password" }, { status: 400 });
  if (email === (process.env.WAYLO_ADMIN_EMAIL || "").toLowerCase() || (await findMember({ email }))) return NextResponse.json({ error: "That email already has a Waylo account — sign in instead." }, { status: 409 });
  let base = slugify(String(b.slug || "") || company); if (base.length < 3) base = `site-${base || "x"}`.slice(0, 32);
  let ws;
  for (let i = 0; i < 6 && !ws; i++) {
    const id = i ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base;
    if (!RESERVED.has(id)) ws = await createWorkspace({ id, name: company, ownerEmail: email });
  }
  if (!ws) return NextResponse.json({ error: "Couldn't reserve a workspace id — try another name." }, { status: 409 });
  try {
    await runIn(ws.id, async () => {
      await addMember(email, "Owner", hashPassword(pw));
      await setSettings({ siteName: company, siteUrl, published: false });
      await setBranding({ botName: company.slice(0, 40), greeting: `Hi! Ask me anything about ${company}.`, accent: DEFAULT_BRANDING.accent });
    });
  } catch (e: any) { await deleteWorkspace(ws.id).catch(() => {}); console.error("[signup]", e?.message); return NextResponse.json({ error: "That email already has a Waylo account — sign in instead." }, { status: 409 }); }
  const res = NextResponse.json({ ok: true, workspace: ws.id });
  res.cookies.set(COOKIE, await sign({ email, role: "Owner", ws: ws.id }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" && !/^http:\/\/localhost/.test(process.env.WAYLO_PUBLIC_URL || ""), path: "/", maxAge: MAX_AGE });
  return res;
}
