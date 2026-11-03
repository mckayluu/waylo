import { NextResponse } from "next/server";
import { listHandoffs, setHandoffStatus } from "@/lib/store";
export const dynamic = "force-dynamic";
// TODO(auth): admin-only.
export async function GET() { return NextResponse.json((await listHandoffs())); }
export async function PATCH(req: Request) {
  const { id, status } = await req.json().catch(() => ({}));
  if (!id || !["open", "resolved"].includes(status)) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const h = (await setHandoffStatus(id, status)); return h ? NextResponse.json(h) : NextResponse.json({ error: "not found" }, { status: 404 });
}
