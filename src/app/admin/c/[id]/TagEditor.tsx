"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function TagEditor({ id, initial }: { id: string; initial: string[] }) {
  const [tags, setTags] = useState(initial); const [val, setVal] = useState(""); const [saving, setSaving] = useState(false); const router = useRouter();
  async function save(next: string[]) {
    const prev = tags; setTags(next); setSaving(true);
    const res = await fetch(`/api/conversations/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ signals: next }) }).catch(() => null);
    if (!res?.ok) { setTags(prev); alert("Couldn't save tags" + (res ? ` (HTTP ${res.status})` : "")); }
    setSaving(false); router.refresh();
  }
  return (<section className="w-card">
    <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3"><h2 className="text-sm font-semibold">Signals</h2>{saving && <span className="text-xs text-stone-400">Saving…</span>}</div>
    <div className="p-5"><div className="flex flex-wrap gap-1.5">{tags.map((t) => (
      <span key={t} className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${t === "high-intent" ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-teal-50 text-teal-800 ring-teal-200"}`}>{t}<button onClick={() => save(tags.filter((x) => x !== t))} className="opacity-50 hover:opacity-100" aria-label={`Remove ${t}`}>×</button></span>))}
      {tags.length === 0 && <span className="text-sm text-stone-400">No signals yet</span>}</div>
    <form onSubmit={(e) => { e.preventDefault(); const v = val.trim().toLowerCase(); if (v && !tags.includes(v)) save([...tags, v]); setVal(""); }} className="mt-4 flex gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Add a signal…" className="w-input" />
      <button className="w-btn">Add</button></form></div>
  </section>);
}
