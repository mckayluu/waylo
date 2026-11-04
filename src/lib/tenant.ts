// Workspace (tenant) context. Every store call is scoped to the current workspace:
// public routes wrap work in runIn(site), admin requests fall back to the signed-in session's workspace.
import { AsyncLocalStorage } from "async_hooks";
import { COOKIE, verify, authEnabled } from "./session";
export const DEFAULT_WS = "default";
const g = globalThis as unknown as { __wayloWs?: AsyncLocalStorage<string> };
const als = (g.__wayloWs ||= new AsyncLocalStorage<string>());
export const runIn = <T,>(ws: string, fn: () => T): T => als.run(ws, fn);
export async function currentWs(): Promise<string> {
  const w = als.getStore(); if (w) return w;
  if (!authEnabled()) return DEFAULT_WS;
  try { const { cookies } = await import("next/headers"); const s = await verify(cookies().get(COOKIE)?.value); return s?.ws || DEFAULT_WS; } catch { return DEFAULT_WS; }
}
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;
// Marketing site embeds with data-site="waylo"; it is the original default workspace.
export const SITE_ALIASES: Record<string, string> = { waylo: DEFAULT_WS };
export const DEMO_SITE = "acme-demo";
