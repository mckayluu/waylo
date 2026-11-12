import { NextResponse } from "next/server";
import { getBranding, setBranding, getSettings, listPages } from "@/lib/store";
export const dynamic = "force-dynamic";
import { withSite, siteParam, isDemo } from "@/lib/site";
import { currentSession } from "@/lib/auth";
import { DEMO_BRANDING } from "@/lib/demoKnowledge";
import { entitlement } from "@/lib/entitlement";
import { cleanStarters, starterSuggestions } from "@/lib/suggestions";
import { DEFAULT_WS, currentWs } from "@/lib/tenant";

const CORS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" };

// Public (widget / embed) reads branding for ?site=; admin (no site param) reads the signed-in workspace.
// northpoint-demo (and alias acme-demo) must NOT fall through to the default (Waylo) workspace branding.
export async function GET(req: Request) {
  const s = siteParam(req);
  if (isDemo(s)) {
    return NextResponse.json({
      ...DEMO_BRANDING,
      openOnLoad: true,
      suggestions: starterSuggestions({ configured: DEMO_BRANDING.starterQuestions, demo: true }),
    }, { headers: CORS });
  }
  if (s == null && (await currentSession())) return get();
  return withSite(s, get);
}
async function get() {
  const st = (await getSettings());
  const b = (await getBranding());
  const e = await entitlement().catch(() => null);
  const pages = await listPages().catch(() => []);
  const self = (await currentWs()) === DEFAULT_WS;
  return NextResponse.json({
    ...b,
    published: st.published,
    siteName: st.siteName,
    paused: e ? !e.chatOpen : false,
    openOnLoad: typeof st.openOnLoad === "boolean" ? st.openOnLoad : undefined,
    suggestions: starterSuggestions({ configured: b.starterQuestions, pages, self }),
  }, { headers: CORS });
}
export async function PUT(req: Request) {
  const b = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof b.botName === "string" && b.botName.trim()) patch.botName = b.botName.trim().slice(0, 40);
  if (typeof b.accent === "string" && /^#[0-9a-f]{6}$/i.test(b.accent)) patch.accent = b.accent;
  if (typeof b.greeting === "string" && b.greeting.trim()) patch.greeting = b.greeting.trim().slice(0, 300);
  if (b.starterQuestions !== undefined) patch.starterQuestions = cleanStarters(b.starterQuestions);
  return NextResponse.json((await setBranding(patch as any)));
}
