import { NextResponse } from "next/server";
import { getBranding, setBranding, getSettings } from "@/lib/store";
export const dynamic = "force-dynamic";
import { withSite, siteParam, isDemo } from "@/lib/site";
import { currentSession } from "@/lib/auth";
// Public (widget) reads branding for ?site=; admin (no site param) reads the signed-in workspace.
export async function GET(req: Request) { const s = siteParam(req); if (s == null && (await currentSession())) return get(); return withSite(isDemo(s) ? "default" : s, get); }
async function get() { const st = (await getSettings()); return NextResponse.json({ ...(await getBranding()), published: st.published, siteName: st.siteName }); }
export async function PUT(req: Request) {
  const b = await req.json().catch(() => ({}));
  const patch: Record<string, string> = {};
  if (typeof b.botName === "string" && b.botName.trim()) patch.botName = b.botName.trim().slice(0, 40);
  if (typeof b.accent === "string" && /^#[0-9a-f]{6}$/i.test(b.accent)) patch.accent = b.accent;
  if (typeof b.greeting === "string" && b.greeting.trim()) patch.greeting = b.greeting.trim().slice(0, 300);
  return NextResponse.json((await setBranding(patch)));
}
