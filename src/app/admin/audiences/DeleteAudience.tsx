"use client";
import { useRouter } from "next/navigation";
export function DeleteAudience({ id }: { id: string }) {
  const r = useRouter();
  return <button onClick={async () => { if (!confirm("Delete this audience?")) return; const res = await fetch(`/api/audiences?id=${id}`, { method: "DELETE" }); if (!res.ok) alert((await res.json().catch(() => ({}))).error || `Delete failed (HTTP ${res.status})`); r.refresh(); }} className="rounded-md px-2 py-1 text-xs text-stone-400 hover:bg-rose-50 hover:text-rose-600">Delete</button>;
}
