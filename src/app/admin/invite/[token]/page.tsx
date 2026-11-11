import { findMember, getSettings, getWorkspace, runIn } from "@/lib/store";
import { AuthCard } from "../../AuthCard";
import { AcceptForm } from "./AcceptForm";
export const dynamic = "force-dynamic";
export default async function Invite({ params }: { params: { token: string } }) {
  const m = (await findMember({ token: params.token }));
  if (!m || m.passwordHash) return <AuthCard title="Invite not found" sub="This link was already used or removed. Ask an Owner for a new one."><a href="/admin/login" className="w-btn w-full">Go to sign in</a></AuthCard>;
  const wsId = m.workspaceId || "default";
  const [ws, st] = await Promise.all([getWorkspace(wsId), runIn(wsId, () => getSettings())]);
  const name = ws?.name || st.siteName || "the workspace";
  return <AuthCard title={`Join ${name} on Waylo`} sub={`You're invited as ${m.role} (${m.email}). Choose a password to finish.`}><AcceptForm token={params.token} /></AuthCard>;
}
