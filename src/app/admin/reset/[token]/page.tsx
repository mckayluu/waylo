import { listMembers } from "@/lib/store";
import { checkResetToken, parseResetToken } from "@/lib/reset";
import { AuthCard } from "../../AuthCard";
import { ResetForm } from "./ResetForm";
export const dynamic = "force-dynamic";
export default async function Reset({ params }: { params: { token: string } }) {
  const p = parseResetToken(params.token); const m = p && (await listMembers()).find((x) => x.id === p.id);
  if (!m || !checkResetToken(params.token, m)) return <AuthCard title="Link expired" sub="This reset link is invalid, already used, or older than an hour."><a href="/admin/forgot" className="w-btn w-full">Request a new link</a></AuthCard>;
  return <AuthCard title="Choose a new password" sub={`For ${m.email}. At least 8 characters.`}><ResetForm token={params.token} /></AuthCard>;
}
