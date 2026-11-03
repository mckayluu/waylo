import { NextResponse } from "next/server";
import { deletePage, listPages } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json((await listPages()).map(({ text, ...p }) => ({ ...p, chars: text.length }))); }
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id"); if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  (await deletePage(id)); return NextResponse.json({ ok: true });
}
