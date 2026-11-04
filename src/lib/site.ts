// Resolve the public embed's data-site → workspace and run the handler in that workspace.
import { NextResponse } from "next/server";
import { getWorkspace } from "./store";
import { runIn, DEFAULT_WS, SITE_ALIASES, DEMO_SITE } from "./tenant";
export async function resolveSite(raw: unknown): Promise<string | null> {
  const s = typeof raw === "string" && raw.trim() ? raw.trim().toLowerCase() : DEFAULT_WS;
  const id = SITE_ALIASES[s] || s;
  if (!/^[a-z0-9-]{1,40}$/.test(id)) return null;
  return (await getWorkspace(id)) ? id : null;
}
export const siteParam = (req: Request) => new URL(req.url).searchParams.get("site");
export const isDemo = (site: unknown) => site === DEMO_SITE;
/** Runs fn inside the site's workspace; 404 for unknown sites. */
export async function withSite(site: unknown, fn: () => Promise<Response>, headers?: Record<string, string>): Promise<Response> {
  const ws = await resolveSite(site);
  if (!ws) return NextResponse.json({ error: "Unknown site — check data-site on your Waylo snippet." }, { status: 404, headers });
  return runIn(ws, fn);
}
