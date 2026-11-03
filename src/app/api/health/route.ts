import { NextResponse } from "next/server";
import { emailStatus } from "@/lib/email";
export const dynamic = "force-dynamic";
// Public health check (no secrets). Use as Render healthCheckPath.
export async function GET() {
  let db: "postgres" | "json" | "error" = process.env.DATABASE_URL ? "postgres" : "json";
  if (db === "postgres") { try { const { getSettings } = await import("@/lib/store"); await getSettings(); } catch { db = "error"; } }
  const e = process.env, checks = {
    database: db, openai: !!e.OPENAI_API_KEY, adminAuth: !!e.WAYLO_ADMIN_PASSWORD, sessionSecret: !!e.WAYLO_SESSION_SECRET,
    publicUrl: !!e.WAYLO_PUBLIC_URL, email: emailStatus().configured, allowedOrigins: !!e.WAYLO_ALLOWED_ORIGINS,
  };
  const ok = db !== "error";
  return NextResponse.json({ ok, checks, time: new Date().toISOString() }, { status: ok ? 200 : 503 });
}
