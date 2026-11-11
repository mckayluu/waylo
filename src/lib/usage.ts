// AI reply counters per workspace + period. Postgres when available; in-memory for the JSON/dev store.
import { usePostgres, q } from "./db";
import { currentWs } from "./tenant";
const mem = new Map<string, number>();
export async function getUsage(period: string, ws?: string): Promise<number> {
  const w = ws || (await currentWs());
  if (!usePostgres()) return mem.get(`${w}:${period}`) || 0;
  try { const r = await q<{ replies: number }>("SELECT replies FROM usage_counters WHERE workspace_id=$1 AND period=$2", [w, period]); return r[0]?.replies || 0; }
  catch (e: any) { console.error("[usage] read", e?.message); return 0; }
}
export async function addUsage(period: string, n = 1, ws?: string): Promise<number> {
  const w = ws || (await currentWs());
  if (!usePostgres()) { const k = `${w}:${period}`; const v = (mem.get(k) || 0) + n; mem.set(k, v); return v; }
  try {
    const r = await q<{ replies: number }>("INSERT INTO usage_counters(workspace_id,period,replies) VALUES($1,$2,$3) ON CONFLICT(workspace_id,period) DO UPDATE SET replies=usage_counters.replies+EXCLUDED.replies, updated_at=now() RETURNING replies", [w, period, n]);
    return r[0]?.replies || 0;
  } catch (e: any) { console.error("[usage] write", e?.message); return 0; }
}
