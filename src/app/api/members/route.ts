import { NextResponse } from "next/server";
import { addMember, findMember, listMembers, removeMember, updateMember } from "@/lib/store";
import { EMAIL_RE } from "@/lib/signals";
export const dynamic = "force-dynamic";
const ROLES = ["Viewer", "Editor", "Owner"];
const pub = (m: Awaited<ReturnType<typeof listMembers>>[number]) => ({ id: m.id, email: m.email, role: m.role, invitedAt: m.invitedAt, joinedAt: m.joinedAt, inviteToken: m.passwordHash ? undefined : m.inviteToken });
export async function GET() { return NextResponse.json((await listMembers()).map(pub)); }
export async function POST(req: Request) {
  const { email = "", role = "Viewer" } = await req.json().catch(() => ({}));
  const em = String(email).trim().toLowerCase();
  if (!EMAIL_RE.test(em)) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  if (!ROLES.includes(role)) return NextResponse.json({ error: "Bad role" }, { status: 400 });
  if ((await findMember({ email: em }))) return NextResponse.json({ error: "Already a member" }, { status: 409 });
  return NextResponse.json(pub((await addMember(em, role))));
}
export async function PATCH(req: Request) {
  const { id, role } = await req.json().catch(() => ({}));
  if (!ROLES.includes(role)) return NextResponse.json({ error: "Bad role" }, { status: 400 });
  const m = (await updateMember(id, { role })); return m ? NextResponse.json(pub(m)) : NextResponse.json({ error: "not found" }, { status: 404 });
}
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id"); if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  (await removeMember(id)); return NextResponse.json({ ok: true });
}
