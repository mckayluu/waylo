import Link from "next/link";
import { headers } from "next/headers";
import { AdminNav } from "./AdminNav";
import { getSettings } from "@/lib/store";
import { currentSession } from "@/lib/auth";
import { authEnabled } from "@/lib/session";
export const dynamic = "force-dynamic";

function isAuthShell(pathname: string) {
  return pathname === "/admin/login" || pathname === "/admin/signup" || pathname === "/admin/forgot" || pathname.startsWith("/admin/invite/") || pathname.startsWith("/admin/reset/");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const st = (await getSettings()); const auth = authEnabled(); const s = await currentSession();
  const pathname = headers().get("x-waylo-pathname") || "";
  // Login / forgot / invite / reset always render bare — even when a session cookie is present.
  if (isAuthShell(pathname) || (auth && !s)) return <>{children}</>;
  const who = s?.email || "Owner"; const ini = who.split(/[@.\s]/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
  return (
    <div className="w-admin-main min-h-screen text-stone-800 md:flex">
      <aside className="sticky top-0 z-20 flex shrink-0 items-center gap-4 w-admin-rail border-white/5 px-3 py-2 md:border-r md:h-screen md:w-60 md:flex-col md:items-stretch md:px-3 md:py-4">
        <Link href="/admin" className="flex items-center gap-2.5 px-2 md:mb-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 text-[15px] font-bold text-white shadow-md ring-1 ring-white/25">W</span>
          <span className="hidden min-w-0 md:flex md:flex-col"><span className="text-[15px] font-semibold leading-tight tracking-tight text-white">Waylo</span><span className="truncate text-[11px] leading-tight text-teal-100/60" title={st.siteName}>{st.siteName}</span></span>
        </Link>
        <AdminNav />
        <div className="mt-auto hidden space-y-1 md:block">
          <Link href="/demo" target="_blank" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-teal-100/60 hover:bg-white/5 hover:text-white">Open live demo <span>↗</span></Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 bg-white/85 backdrop-blur"><div className="flex h-12 items-center justify-between border-b border-stone-200 px-5">
          <div className="flex items-center gap-2 text-sm"><span className="font-semibold tracking-tight text-stone-900">{st.siteName}</span>{st.published ? <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[11px] font-medium text-teal-800 ring-1 ring-inset ring-teal-200">Live</span> : <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-inset ring-amber-200">Preview only</span>}</div>
          <div className="flex items-center gap-3">
            <Link href="/demo" target="_blank" className="hidden text-sm text-stone-500 hover:text-stone-800 sm:inline">Preview widget</Link>
            <Link href="/admin" className="grid h-8 w-8 place-items-center rounded-full border border-stone-200 text-xs text-stone-500 hover:border-teal-300 hover:text-teal-700" title="Setup checklist">?</Link>
            <span className="flex items-center gap-2 rounded-full border border-stone-200 py-1 pl-1 pr-3 text-sm" title={`${who} · ${s?.role}`}><span className="grid h-6 w-6 place-items-center rounded-full bg-teal-700 text-[11px] font-semibold text-white">{ini || "W"}</span><span className="hidden text-stone-700 sm:inline">{auth ? who : "Local owner"}</span><span className="hidden text-[11px] text-stone-400 sm:inline">{s?.role}</span></span>{auth && <form action="/api/auth/logout" method="post"><button className="text-sm text-stone-500 hover:text-stone-800">Sign out</button></form>}
          </div>
        </div><div className="w-accent-line opacity-70" /></header>
        {!auth && <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-xs text-amber-900">Admin is open to anyone who can reach it. Set <code className="font-semibold">WAYLO_ADMIN_PASSWORD</code> to lock it.</div>}
        {!st.published && <div className="border-b border-teal-100 bg-teal-50/60 px-6 py-2 text-center text-xs text-teal-900">Your widget is in preview. Finish the <Link href="/admin" className="font-semibold underline">setup checklist</Link> or <Link href="/admin/install" className="font-semibold underline">install &amp; publish</Link> to go live.</div>}
        <main className="mx-auto max-w-6xl px-5 py-6">{children}</main>
      </div>
    </div>);
}
