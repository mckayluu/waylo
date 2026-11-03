"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type M = { id: string; email: string; role: "Viewer" | "Editor" | "Owner"; invitedAt: string; joinedAt?: string; inviteToken?: string };
const ROLE_DESC = { Viewer: "Read-only", Editor: "Edit content, guidance, settings", Owner: "Everything incl. members, integrations, deletes" };
export function MembersClient({ members, canManage, base, owner }: { members: M[]; canManage: boolean; base: string; owner: string }) {
  const [email, setEmail] = useState(""); const [role, setRole] = useState<M["role"]>("Editor"); const [err, setErr] = useState(""); const [copied, setCopied] = useState(""); const [note, setNote] = useState(""); const r = useRouter();
  const call = async (method: string, body?: unknown, q = "") => { setErr(""); setNote(""); const res = await fetch(`/api/members${q}`, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }); const j = await res.json().catch(() => ({})); if (!res.ok) setErr(j.error); else if (method === "POST") setNote(j.emailSent ? `Invite emailed to ${j.email}. You can also copy the link below.` : `${j.emailNote || "Email not configured — copy link."} Share it with ${j.email}.`); r.refresh(); return res.ok; };
  const link = (t: string) => `${base}/admin/invite/${t}`;
  const copy = (t: string) => { navigator.clipboard.writeText(link(t)); setCopied(t); setTimeout(() => setCopied(""), 1500); };
  return <div className="space-y-6">
    {canManage && <form onSubmit={async (e) => { e.preventDefault(); if (await call("POST", { email, role })) setEmail(""); }} className="w-card flex flex-wrap items-end gap-3 p-5">
      <div className="min-w-[14rem] flex-1"><label className="w-label">Invite by email</label><input className="w-input" type="email" placeholder="teammate@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div><label className="w-label">Role</label><select className="w-input w-auto" value={role} onChange={(e) => setRole(e.target.value as M["role"])}>{(["Viewer", "Editor", "Owner"] as const).map((x) => <option key={x}>{x}</option>)}</select></div>
      <button className="w-btn">Create invite</button>
      <p className="w-full text-xs text-stone-500">We email the invite link when email is configured; you can always copy the link below too. {note && <span className="text-teal-700">{note} </span>}{err && <span className="text-rose-600">{err}</span>}</p>
    </form>}
    <section className="w-card"><div className="overflow-x-auto"><table className="w-full text-sm">
      <thead className="border-b border-stone-100 bg-stone-50/60"><tr><th className="w-th">Member</th><th className="w-th">Role</th><th className="w-th">Status</th><th className="w-th" /></tr></thead>
      <tbody className="divide-y divide-stone-100">
        <tr><td className="px-5 py-3"><p className="font-medium text-stone-800">{owner}</p><p className="text-xs text-stone-500">Workspace owner (env password)</p></td><td className="px-5 py-3"><span className="text-stone-700">Owner</span></td><td className="px-5 py-3 text-xs text-teal-700">Active</td><td /></tr>
        {members.map((m) => <tr key={m.id} className="group hover:bg-stone-50">
          <td className="px-5 py-3"><p className="font-medium text-stone-800">{m.email}</p><p className="text-xs text-stone-500">Invited {new Date(m.invitedAt).toLocaleDateString()}</p></td>
          <td className="px-5 py-3">{canManage ? <select className="w-input w-auto py-1" value={m.role} onChange={(e) => call("PATCH", { id: m.id, role: e.target.value })}>{(["Viewer", "Editor", "Owner"] as const).map((x) => <option key={x}>{x}</option>)}</select> : m.role}<p className="mt-0.5 text-[11px] text-stone-400">{ROLE_DESC[m.role]}</p></td>
          <td className="px-5 py-3">{m.joinedAt ? <span className="text-xs text-teal-700">Joined {new Date(m.joinedAt).toLocaleDateString()}</span> : m.inviteToken ? <div><span className="text-xs text-amber-700">Invite pending</span>{canManage && <button onClick={() => copy(m.inviteToken!)} className="ml-2 text-xs font-medium text-teal-700 hover:underline">{copied === m.inviteToken ? "Copied ✓" : "Copy link"}</button>}{canManage && <p className="max-w-[16rem] truncate font-mono text-[10px] text-stone-400">{link(m.inviteToken)}</p>}</div> : "—"}</td>
          <td className="px-5 py-3 text-right">{canManage && <button onClick={() => confirm(`Remove ${m.email}?`) && call("DELETE", undefined, `?id=${m.id}`)} className="rounded-md px-2 py-1 text-xs text-stone-400 opacity-0 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">Remove</button>}</td>
        </tr>)}
      </tbody></table></div></section>
  </div>;
}
