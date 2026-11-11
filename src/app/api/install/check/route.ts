import { NextResponse } from "next/server";
import { currentWs, getSettings, getInstall, setInstall } from "@/lib/store";
import { assertPublicUrl } from "@/lib/netguard";
export const dynamic = "force-dynamic";
// "Check now": fetch the customer's homepage and look for the Waylo snippet with this workspace's data-site.
export async function GET() { return NextResponse.json(await getInstall()); }
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const st = await getSettings(); const ws = await currentWs();
  const raw = String(b.url || st.siteUrl || "").trim();
  if (!raw) return NextResponse.json({ error: "Set your website URL in Settings first." }, { status: 400 });
  let html = "", url = raw;
  try {
    const u = await assertPublicUrl(raw); url = u.toString();
    const r = await fetch(url, { redirect: "follow", headers: { "User-Agent": "WayloInstallCheck/1.0 (+https://waylo-j5hv.onrender.com)" }, signal: AbortSignal.timeout(10_000) });
    html = (await r.text()).slice(0, 2_000_000);
  } catch (e: any) { return NextResponse.json({ error: `Couldn't load ${url}: ${e?.message || "fetch failed"}` }, { status: 502 }); }
  const tags = [...html.matchAll(/<script\b[^>]*waylo\.js[^>]*>/gi)].map((m) => m[0]);
  const found = tags.length > 0;
  const siteMatches = tags.some((t) => new RegExp(`data-site=["']?${ws.replace(/[-]/g, "\\-")}["'\\s>]`).test(t));
  const viaTagManager = !found && /googletagmanager\.com\/gtm\.js/.test(html);
  const detail = siteMatches ? "Snippet found with your workspace id." : found ? `Found a Waylo snippet, but data-site isn't "${ws}". Copy the snippet from this page again.` : viaTagManager ? "No snippet in the page HTML, but Google Tag Manager is present. If you installed through GTM, open your site in a browser; we'll detect the first visit." : "No Waylo snippet found in the page HTML. Paste it before </body> and publish your site.";
  const check = { at: new Date().toISOString(), url, found, siteMatches, detail };
  await setInstall({ check });
  return NextResponse.json(check);
}
