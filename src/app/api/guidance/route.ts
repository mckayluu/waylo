import { NextResponse } from "next/server";
import { addGuidance, deleteGuidance, getGuidance } from "@/lib/store";
export const dynamic = "force-dynamic";
const KINDS = ["facts", "rules", "skills"] as const; type K = (typeof KINDS)[number];
export async function GET() { return NextResponse.json((await getGuidance())); }
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({})); const kind = b.kind as K;
  if (!KINDS.includes(kind)) return NextResponse.json({ error: "bad kind" }, { status: 400 });
  const text = String(b.text || "").trim().slice(0, 1000), name = String(b.name || "").trim().slice(0, 80), instructions = String(b.instructions || "").trim().slice(0, 2000);
  if (kind === "skills" ? !name || !instructions : !text) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  return NextResponse.json((await addGuidance(kind, { text, name, instructions })));
}
export async function DELETE(req: Request) {
  const u = new URL(req.url); const kind = u.searchParams.get("kind") as K; const id = u.searchParams.get("id");
  if (!KINDS.includes(kind) || !id) return NextResponse.json({ error: "bad request" }, { status: 400 });
  (await deleteGuidance(kind, id)); return NextResponse.json({ ok: true });
}
