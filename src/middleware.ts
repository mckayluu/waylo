import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verify, rank, type Role } from "@/lib/session";
// Public endpoints used by the widget / embed. Everything else under /api is admin.
const PUBLIC_API: [RegExp, string[]][] = [
  [/^\/api\/chat$/, ["POST"]], [/^\/api\/track$/, ["POST", "OPTIONS"]], [/^\/api\/feedback$/, ["POST"]],
  [/^\/api\/handoff$/, ["POST"]], [/^\/api\/leads$/, ["POST"]], [/^\/api\/branding$/, ["GET"]],
  [/^\/api\/auth\//, ["GET", "POST"]], [/^\/api\/invites\//, ["GET", "POST"]], [/^\/api\/health$/, ["GET", "HEAD"]], [/^\/api\/contact$/, ["POST"]],
  [/^\/api\/stripe\/webhook$/, ["POST"]], [/^\/api\/cron\//, ["POST"]], [/^\/api\/billing\/checkout$/, ["POST"]], // checkout: public for pricing page; attaches admin session when present. cron: secret-header auth in the route
];
function needed(path: string, method: string): Role {
  if (method === "GET" || method === "HEAD") return "Viewer";
  if (/^\/api\/(members|integrations)/.test(path) || method === "DELETE") return "Owner";
  return "Editor";
}
function isAuthShell(pathname: string) {
  return pathname === "/admin/login" || pathname === "/admin/signup" || pathname === "/admin/forgot" || pathname.startsWith("/admin/invite/") || pathname.startsWith("/admin/reset/");
}
function withPath(req: NextRequest, res: NextResponse) {
  res.headers.set("x-waylo-pathname", req.nextUrl.pathname);
  return res;
}
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; const method = req.method;
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-waylo-pathname", pathname);
  const next = () => withPath(req, NextResponse.next({ request: { headers: reqHeaders } }));

  if (!process.env.WAYLO_ADMIN_PASSWORD) return next(); // open mode
  if (isAuthShell(pathname)) return next();
  if (pathname.startsWith("/api/") && PUBLIC_API.some(([r, m]) => r.test(pathname) && m.includes(method))) return next();
  const s = await verify(req.cookies.get(COOKIE)?.value);
  if (pathname.startsWith("/api/")) {
    if (!s) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const need = needed(pathname, method);
    if (rank[s.role] < rank[need]) return NextResponse.json({ error: `${need} role required` }, { status: 403 });
    return next();
  }
  if (!s) {
    const u = req.nextUrl.clone();
    u.pathname = "/admin/login";
    u.search = `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(u);
  }
  return next();
}
export const config = { matcher: ["/admin/:path*", "/api/:path*"] };
