"use client";
import { useState } from "react";
import { api } from "@/lib/api-client";
import type { Guidance } from "@/lib/store";
import { PageHeader } from "../ui";
type K = "facts" | "rules" | "skills";
const INFO: Record<K, { label: string; blurb: string; ph: string }> = {
  facts: { label: "Facts", blurb: "Statements Waylo treats as true. They win over knowledge pages when they conflict.", ph: "e.g. We ship to the US and Canada only." },
  rules: { label: "Rules", blurb: "Guardrails Waylo always follows.", ph: "e.g. Never promise delivery dates; link the shipping page instead." },
  skills: { label: "Skills", blurb: "Playbooks for specific intents — when a visitor wants X, do Y.", ph: "e.g. When someone asks for a quote, ask for their project size and work email." },
};
export function GuidanceEditor({ initial }: { initial: Guidance }) {
  const [g, setG] = useState(initial); const [tab, setTab] = useState<K>("facts");
  const [text, setText] = useState(""); const [name, setName] = useState(""); const [err, setErr] = useState("");
  async function add(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const r = await api("/api/guidance", { method: "POST", json: tab === "skills" ? { kind: tab, name, instructions: text } : { kind: tab, text } });
    if (!r.ok) return setErr(r.error === "missing fields" ? (tab === "skills" ? "Add a name and instructions." : "Write something first.") : r.error); const it = r.data;
    setG({ ...g, [tab]: [...g[tab], it] }); setText(""); setName("");
  }
  async function del(id: string) {
    const r = await api(`/api/guidance?kind=${tab}&id=${id}`, { method: "DELETE" }); if (!r.ok) return setErr(r.error);
    setG({ ...g, [tab]: (g[tab] as { id: string }[]).filter((x) => x.id !== id) } as Guidance);
  }
  const f = "w-input";
  return (<div>
    <PageHeader title="Guidance" sub="Shape how Waylo answers. Everything here applies to every chat." />
    <div className="flex gap-1 rounded-lg border border-warm-200 bg-card p-1 text-sm shadow-sm w-fit">
      {(Object.keys(INFO) as K[]).map((k) => <button type="button" key={k} onClick={() => { setTab(k); setErr(""); }} className={`rounded-md px-3.5 py-1.5 font-medium transition ${tab === k ? "bg-navy-700 text-white" : "text-warm-600 hover:bg-warm-100"}`}>{INFO[k].label} <span className={`ml-1 text-xs ${tab === k ? "text-navy-100" : "text-warm-400"}`}>{g[k].length}</span></button>)}
    </div>
    <p className="mt-4 text-sm text-warm-600">{INFO[tab].blurb}</p>
    <form onSubmit={add} className="w-card mt-3 space-y-3 p-5">
      {tab === "skills" && <input className={f} placeholder="Skill name, e.g. Demo request" value={name} onChange={(e) => setName(e.target.value)} />}
      <textarea rows={2} className={f} placeholder={INFO[tab].ph} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex items-center gap-3"><button className="w-btn">Add {INFO[tab].label.slice(0, -1).toLowerCase()}</button>{err && <span className="text-xs text-red-600">{err}</span>}</div>
    </form>
    <ul className="w-card mt-4 divide-y divide-warm-100">
      {g[tab].length === 0 && <li className="px-6 py-12 text-center text-sm text-warm-500"><p className="font-medium text-warm-700">No {INFO[tab].label.toLowerCase()} yet</p><p className="mt-1">Add your first one above.</p></li>}
      {g[tab].map((it) => <li key={it.id} className="group flex items-start justify-between gap-4 px-5 py-3.5 text-sm hover:bg-warm-50">
        <div>{"name" in it && <p className="font-medium">{it.name}</p>}<p className="text-warm-700">{"name" in it ? it.instructions : it.text}</p></div>
        <button onClick={() => del(it.id)} className="rounded-md px-2 py-1 text-xs text-warm-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">Delete</button></li>)}
    </ul>
  </div>);
}
