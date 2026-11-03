import { headers } from "next/headers";
import { listMembers } from "@/lib/store";
import { currentSession } from "@/lib/auth";
import { authEnabled } from "@/lib/session";
import { PageHeader } from "../ui";
import { MembersClient } from "./MembersClient";
export const dynamic = "force-dynamic";
export default async function Members() {
  const s = await currentSession(); const h = headers();
  const base = process.env.WAYLO_PUBLIC_URL || `${h.get("x-forwarded-proto") || "http"}://${h.get("host")}`;
  const members = (await listMembers()).map((m) => ({ id: m.id, email: m.email, role: m.role, invitedAt: m.invitedAt, joinedAt: m.joinedAt, inviteToken: m.passwordHash ? undefined : m.inviteToken }));
  return (<>
    <PageHeader title="Members" sub={authEnabled() ? `Signed in as ${s?.email} (${s?.role}). Owners manage members.` : "Admin is open (no password set) — invites work, but sign-in is only enforced once WAYLO_ADMIN_PASSWORD is set."} />
    <MembersClient members={members} canManage={s?.role === "Owner"} base={base} owner={process.env.WAYLO_ADMIN_EMAIL || "Owner"} />
  </>);
}
