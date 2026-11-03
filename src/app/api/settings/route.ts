import { NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/store";
import { billingAllowsPublish } from "@/lib/stripe";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json((await getSettings())); }
export async function PUT(req: Request) {
  const b = await req.json().catch(() => ({})); const p: Record<string, unknown> = {};
  if (typeof b.siteName === "string" && b.siteName.trim()) p.siteName = b.siteName.trim().slice(0, 80);
  if (typeof b.siteUrl === "string") { const u = b.siteUrl.trim(); p.siteUrl = !u ? "" : /^https?:\/\//i.test(u) ? u : "https://" + u; }
  if (typeof b.companyProfile === "string") p.companyProfile = b.companyProfile.trim().slice(0, 4000);
  if (typeof b.published === "boolean") {
    if (b.published && !(await getSettings()).published && !(await billingAllowsPublish())) return NextResponse.json({ error: "Choose a plan in Billing to publish Waylo on your site." }, { status: 402 });
    p.published = b.published;
  }
  if (typeof b.allowedOrigins === "string") p.allowedOrigins = b.allowedOrigins.split(/[\s,]+/).map((s: string) => s.trim()).filter(Boolean).slice(0, 50).join("\n");
  return NextResponse.json((await setSettings(p)));
}
