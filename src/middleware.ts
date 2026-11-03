import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verify, rank, type Role } from "@/lib/session";
// Public endpoints used by the widget / embed. Everything else under /api is admin.
const PUBLIC_API: [RegExp, string[]][] = [
  [/^\/api\/chat$/, ["POST"]], [/^\/api\/track$/, ["POST", "OPTIONS"]], [/^\/api\/feedback$/, ["POST"]],
  [/^\/api\/handoff$/, ["POST"]], [/^\/api\/leads$/, ["POST"]], [/^\/api\/branding$/, ["GET"]],
  [/^\/api\/auth\//, ["GET", "POST"]], [/^\/api\/invites\//, ["GET", "POST"]], [/^\/api\/health$/, ["GET", "HEAD"]],
];
// Minimum role per admin API mutation (GET needs Viewer).
function needed(path: string, method: string): Role {
  if (method === "GET" || method === "HEAD") return "Viewer";
  if (/^\/api\/(members|integrations)/.test(path) || method === "DELETE") return "Owner";
  return "Editor";
}
export async function middleware(req: NextRequest) {
  if (!process.env.WAYLO_ADMIN_PASSWORD) return NextResponse.next(); // open mode
  const { pathname } = req.nextUrl; const method = req.method;
  if (pathname === "/admin/login" || pathname.startsWith("/admin/invite/") || pathname === "/admin/forgot" || pathname.startsWith("/admin/reset/")) return NextResponse.next();
  if (pathname.startsWith("/api/") && PUBLIC_API.some(([r, m]) => r.test(pathname) && m.includes(method))) return NextResponse.next();
  const s = await verify(req.cookies.get(COOKIE)?.value);
  if (pathname.startsWith("/api/")) {
    if (!s) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const need = needed(pathname, method);
    if (rank[s.role] < rank[need]) return NextResponse.json({ error: `${need} role required` }, { status: 403 });
    return NextResponse.next();
  }
  if (!s) { const u = req.nextUrl.clone(); u.pathname = "/admin/login"; u.search = `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`; return NextResponse.redirect(u); }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/api/:path*"] };
