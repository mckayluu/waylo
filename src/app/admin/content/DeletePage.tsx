"use client";
import { useRouter } from "next/navigation";
export function DeletePage({ id }: { id: string }) {
  const r = useRouter();
  return <button onClick={async () => { await fetch(`/api/pages?id=${id}`, { method: "DELETE" }); r.refresh(); }} className="rounded-md px-2 py-1 text-xs text-stone-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">Remove</button>;
}
