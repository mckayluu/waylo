import { NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json((await getSettings())); }
export async function PUT(req: Request) {
  const b = await req.json().catch(() => ({})); const p: Record<string, unknown> = {};
  if (typeof b.siteName === "string" && b.siteName.trim()) p.siteName = b.siteName.trim().slice(0, 80);
  if (typeof b.siteUrl === "string") { const u = b.siteUrl.trim(); p.siteUrl = !u ? "" : /^https?:\/\//i.test(u) ? u : "https://" + u; }
  if (typeof b.companyProfile === "string") p.companyProfile = b.companyProfile.trim().slice(0, 4000);
  if (typeof b.published === "boolean") p.published = b.published;
  return NextResponse.json((await setSettings(p)));
}
