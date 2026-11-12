"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
type M = { id: string; email: string; role: "Viewer" | "Editor" | "Owner"; invitedAt: string; joinedAt?: string; inviteToken?: string };
type LastInvite = { id: string; email: string; role: M["role"]; inviteToken: string; invitedAt: string };
const ROLE_DESC = { Viewer: "Read-only", Editor: "Edit content, guidance, settings", Owner: "Everything incl. members, integrations, deletes" };
export function MembersClient({ members, canManage, base, owner }: { members: M[]; canManage: boolean; base: string; owner: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<M["role"]>("Editor");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const [note, setNote] = useState("");
  const [lastInvite, setLastInvite] = useState<LastInvite | null>(null);
  const r = useRouter();
  const link = (t: string) => `${base.replace(/\/$/, "")}/admin/invite/${t}`;
  const copy = (t: string) => { navigator.clipboard.writeText(link(t)); setCopied(t); setTimeout(() => setCopied(""), 1500); };

  const rows = useMemo(() => {
    if (!lastInvite) return members;
    if (members.some((m) => m.id === lastInvite.id || m.email.toLowerCase() === lastInvite.email.toLowerCase())) {
      return members.map((m) =>
        (m.id === lastInvite.id || m.email.toLowerCase() === lastInvite.email.toLowerCase()) && !m.inviteToken && !m.joinedAt
          ? { ...m, inviteToken: lastInvite.inviteToken }
          : m,
      );
    }
    return [{ id: lastInvite.id, email: lastInvite.email, role: lastInvite.role, invitedAt: lastInvite.invitedAt, inviteToken: lastInvite.inviteToken }, ...members];
  }, [members, lastInvite]);

  const call = async (method: string, body?: unknown, q = "") => {
    setErr(""); setNote("");
    const res = await fetch(`/api/members${q}`, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(j.error || "Request failed");
      return false;
    }
    if (method === "POST") {
      const token = typeof j.inviteToken === "string" ? j.inviteToken : "";
      if (token && j.id) {
        setLastInvite({ id: j.id, email: j.email || email, role: (j.role as M["role"]) || role, inviteToken: token, invitedAt: j.invitedAt || new Date().toISOString() });
      } else {
        setLastInvite(null);
      }
      if (j.emailSent) {
        setNote(`Invite emailed to ${j.email}. You can also copy the link below.`);
      } else if (token) {
        setNote(`${j.emailNote || "Email not sent — copy the link instead."} Share it with ${j.email}.`);
      } else {
        setErr(j.emailNote || "Invite may have been created, but no invite link was returned. Refresh and check the list.");
      }
    }
    r.refresh();
    return true;
  };

  const bannerToken = lastInvite?.inviteToken;
  const showBanner = !!bannerToken && !!note && !note.startsWith("Invite emailed");

  return <div className="space-y-6">
    {canManage && <form onSubmit={async (e) => { e.preventDefault(); if (await call("POST", { email, role })) setEmail(""); }} className="w-card flex flex-wrap items-end gap-3 p-5">
      <div className="min-w-[14rem] flex-1"><label className="w-label">Invite by email</label><input className="w-input" type="email" placeholder="teammate@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div><label className="w-label">Role</label><select className="w-input w-auto" value={role} onChange={(e) => setRole(e.target.value as M["role"])}>{(["Viewer", "Editor", "Owner"] as const).map((x) => <option key={x}>{x}</option>)}</select></div>
      <button className="w-btn">Create invite</button>
      <p className="w-full text-xs text-warm-500">We email the invite link when email is configured; you can always copy the link below too. {note && !showBanner && <span className="text-navy-700">{note} </span>}{err && <span className="text-rose-600">{err}</span>}</p>
    </form>}

    {showBanner && bannerToken && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">{note}</p>
      <p className="mt-1 text-xs text-amber-800/80">Copyable invite link for {lastInvite?.email}:</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 break-all rounded-lg border border-amber-200 bg-card px-2.5 py-1.5 font-mono text-xs text-warm-800">{link(bannerToken)}</code>
        <button type="button" onClick={() => copy(bannerToken)} className="w-btn-ghost shrink-0 text-xs">{copied === bannerToken ? "Copied ✓" : "Copy link"}</button>
      </div>
    </div>}

    <section className="w-card"><div className="overflow-x-auto"><table className="w-full text-sm">
      <thead className="border-b border-warm-100 bg-warm-50/60"><tr><th className="w-th">Member</th><th className="w-th">Role</th><th className="w-th">Status</th><th className="w-th" /></tr></thead>
      <tbody className="divide-y divide-warm-100">
        <tr><td className="px-5 py-3"><p className="font-medium text-warm-800">{owner}</p><p className="text-xs text-warm-500">Workspace owner (env password)</p></td><td className="px-5 py-3"><span className="text-warm-700">Owner</span></td><td className="px-5 py-3 text-xs text-navy-700">Active</td><td /></tr>
        {rows.map((m) => <tr key={m.id} className="group hover:bg-warm-50">
          <td className="px-5 py-3"><p className="font-medium text-warm-800">{m.email}</p><p className="text-xs text-warm-500">Invited {new Date(m.invitedAt).toLocaleDateString()}</p></td>
          <td className="px-5 py-3">{canManage ? <select className="w-input w-auto py-1" value={m.role} onChange={(e) => call("PATCH", { id: m.id, role: e.target.value })}>{(["Viewer", "Editor", "Owner"] as const).map((x) => <option key={x}>{x}</option>)}</select> : m.role}<p className="mt-0.5 text-[11px] text-warm-400">{ROLE_DESC[m.role]}</p></td>
          <td className="px-5 py-3">{m.joinedAt ? <span className="text-xs text-navy-700">Joined {new Date(m.joinedAt).toLocaleDateString()}</span> : m.inviteToken ? <div><span className="text-xs text-amber-700">Invite pending</span>{canManage && <button type="button" onClick={() => copy(m.inviteToken!)} className="ml-2 text-xs font-medium text-navy-700 hover:underline">{copied === m.inviteToken ? "Copied ✓" : "Copy link"}</button>}{canManage && <p className="max-w-[16rem] truncate font-mono text-[10px] text-warm-400">{link(m.inviteToken)}</p>}</div> : "—"}</td>
          <td className="px-5 py-3 text-right">{canManage && <button type="button" onClick={() => confirm(`Remove ${m.email}?`) && call("DELETE", undefined, `?id=${m.id}`)} className="rounded-md px-2 py-1 text-xs text-warm-400 opacity-0 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">Remove</button>}</td>
        </tr>)}
      </tbody></table></div></section>
  </div>;
}
