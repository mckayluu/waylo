// Safe JSON fetch for admin client components: never throws, surfaces API errors.
export async function api<T = any>(url: string, init?: RequestInit & { json?: unknown }): Promise<{ ok: boolean; data: T; error: string }> {
  const { json, ...rest } = init || {};
  try {
    const res = await fetch(url, json !== undefined ? { ...rest, headers: { "Content-Type": "application/json", ...(rest.headers || {}) }, body: JSON.stringify(json) } : rest);
    const data = await res.json().catch(() => ({}));
    const error = res.ok ? "" : (data as any)?.error || (data as any)?.message || (res.status === 401 ? "Session expired — sign in again." : res.status === 403 ? "You don't have permission for this." : `Request failed (HTTP ${res.status})`);
    return { ok: res.ok, data, error };
  } catch (e) { return { ok: false, data: {} as T, error: "Network error — check your connection and retry." }; }
}
