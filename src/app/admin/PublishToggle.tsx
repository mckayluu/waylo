"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function PublishToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial); const [busy, setBusy] = useState(false); const r = useRouter();
  async function flip() { setBusy(true); const n = !on; setOn(n);
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: n }) }); setBusy(false); r.refresh(); }
  return <button type="button" onClick={flip} disabled={busy} role="switch" aria-checked={on} className="flex items-center gap-3 text-sm">
    <span className={`relative h-6 w-11 rounded-full transition ${on ? "bg-teal-700" : "bg-stone-300"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} /></span>
    <span className="font-medium text-stone-700">{on ? "Published" : "Not published"}</span></button>;
}
