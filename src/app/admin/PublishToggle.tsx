"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
export function PublishToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const r = useRouter();
  async function flip() { setBusy(true); const n = !on; setOn(n);
    const res = await api<{ published: boolean }>("/api/settings", { method: "PUT", json: { published: n } }); setBusy(false);
    if (!res.ok) { setOn(!n); setErr(res.error); return; } setErr(""); setOn(!!res.data.published); r.refresh(); }
  return <button type="button" onClick={flip} disabled={busy} role="switch" aria-checked={on} className="flex items-center gap-3 text-sm">
    <span className={`relative h-6 w-11 rounded-full transition ${on ? "bg-navy-700" : "bg-warm-300"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} /></span>
    <span className="font-medium text-warm-700">{on ? "Published" : "Not published"}</span>{err && <span className="text-xs text-rose-600">{err}</span>}</button>;
}
