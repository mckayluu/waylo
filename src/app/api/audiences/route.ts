import { NextResponse } from "next/server";
import { addAudience, deleteAudience, listAudiences, type AudienceRule } from "@/lib/store";
export const dynamic = "force-dynamic";
const FIELDS = ["signal", "path", "referrer", "pageviews", "visitorType"], OPS = ["contains", "equals", "gte"];
export async function GET() { return NextResponse.json((await listAudiences())); }
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim().slice(0, 80); if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const rules: AudienceRule[] = (Array.isArray(b.rules) ? b.rules : []).filter((r: AudienceRule) => FIELDS.includes(r?.field) && OPS.includes(r?.op) && String(r?.value || "").trim())
    .slice(0, 10).map((r: AudienceRule) => ({ field: r.field, op: r.op, value: String(r.value).trim().slice(0, 200) }));
  if (!rules.length) return NextResponse.json({ error: "Add at least one rule" }, { status: 400 });
  return NextResponse.json((await addAudience({ name, match: b.match === "any" ? "any" : "all", rules })));
}
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id"); if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  (await deleteAudience(id)); return NextResponse.json({ ok: true });
}
