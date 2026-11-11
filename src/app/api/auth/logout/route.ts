import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/session";
import { publicUrl } from "@/lib/email";
export async function POST() {
  // req.url on Render is the internal address (https://localhost:10000/...). Always
  // redirect to the public site, not that origin.
  const base = (process.env.WAYLO_PUBLIC_URL || process.env.PUBLIC_URL || publicUrl()).replace(/\/$/, "");
  const res = NextResponse.redirect(`${base}/admin/login`, 303);
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
