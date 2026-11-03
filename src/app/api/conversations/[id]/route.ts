import { NextResponse } from "next/server";
import { updateConversation } from "@/lib/store";
// TODO(auth): protect admin APIs.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { signals } = await req.json();
  if (!Array.isArray(signals)) return NextResponse.json({ error: "signals[] required" }, { status: 400 });
  const c = (await updateConversation(params.id, { signals: signals.map(String).filter(Boolean) }));
  return c ? NextResponse.json(c) : NextResponse.json({ error: "not found" }, { status: 404 });
}
