"use client";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
export function DeletePage({ id }: { id: string }) {
  const r = useRouter();
  return <button onClick={async () => { const res = await api(`/api/pages?id=${id}`, { method: "DELETE" }); if (!res.ok) alert(res.error); r.refresh(); }} className="rounded-md px-2 py-1 text-xs text-stone-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">Remove</button>;
}
