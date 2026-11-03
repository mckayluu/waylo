"use client";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
export function ResolveButton({ id, status }: { id: string; status: "open" | "resolved" }) {
  const r = useRouter();
  return <button onClick={async () => { const res = await api("/api/handoffs", { method: "PATCH", json: { id, status: status === "open" ? "resolved" : "open" } }); if (!res.ok) alert(res.error); r.refresh(); }}
    className={status === "open" ? "w-btn" : "w-btn-ghost"}>{status === "open" ? "Mark resolved" : "Reopen"}</button>;
}
