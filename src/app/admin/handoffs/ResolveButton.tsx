"use client";
import { useRouter } from "next/navigation";
export function ResolveButton({ id, status }: { id: string; status: "open" | "resolved" }) {
  const r = useRouter();
  return <button onClick={async () => { await fetch("/api/handoffs", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: status === "open" ? "resolved" : "open" }) }); r.refresh(); }}
    className={status === "open" ? "w-btn" : "w-btn-ghost"}>{status === "open" ? "Mark resolved" : "Reopen"}</button>;
}
