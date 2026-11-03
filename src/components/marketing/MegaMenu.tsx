"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NAV, type Tone } from "./nav";
const tile: Record<Tone, string> = { teal: "bg-teal-50 text-teal-800 ring-teal-200", amber: "bg-amber-50 text-amber-800 ring-amber-200", indigo: "bg-indigo-50 text-indigo-800 ring-indigo-200" };
export function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && open) { const b = document.getElementById(`mm-btn-${open}`); setOpen(null); b?.focus(); } };
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);
  const enter = (id: string) => { clearTimeout(timer.current); setOpen(id); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(null), 120); };
  return <div ref={ref} className="hidden md:block" onMouseLeave={leave} onBlur={e => { if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(null); }}>
    <ul className="flex items-center gap-1 text-sm">
      {NAV.map(g => <li key={g.id} onMouseEnter={() => enter(g.id)}>
        <button id={`mm-btn-${g.id}`} type="button" aria-expanded={open === g.id} aria-controls={`mm-${g.id}`} onClick={() => setOpen(open === g.id ? null : g.id)} className={`flex items-center gap-1 rounded-md px-3 py-2 font-medium transition ${open === g.id ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:text-stone-900"}`}>{g.label}<svg aria-hidden width="10" height="10" viewBox="0 0 10 10" className={`transition ${open === g.id ? "rotate-180" : ""}`}><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></button>
      </li>)}
      <li onMouseEnter={() => setOpen(null)}><Link href="/pricing" className="rounded-md px-3 py-2 font-medium text-stone-600 hover:text-stone-900">Pricing</Link></li>
    </ul>
    {NAV.map(g => <div key={g.id} id={`mm-${g.id}`} role="region" aria-label={`${g.label} menu`} hidden={open !== g.id} onMouseEnter={() => enter(g.id)} className="absolute inset-x-0 top-full border-b border-stone-200 bg-white shadow-xl shadow-stone-900/10">
      <div className="w-accent-line" />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[220px_1fr_280px]">
        <div className="hidden lg:block"><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">{g.label}</p><p className="mt-2 text-sm leading-6 text-stone-600">{g.blurb}</p><Link href={g.href} onClick={() => setOpen(null)} className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">Overview →</Link></div>
        <ul className="grid gap-1 sm:grid-cols-2">{g.items.map(it => <li key={it.href}><Link href={it.href} onClick={() => setOpen(null)} className="group flex gap-3 rounded-xl p-3 transition hover:bg-stone-50 focus-visible:bg-stone-50"><span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm ring-1 ${tile[it.t]}`}>{it.icon}</span><span><span className="block text-sm font-semibold text-stone-900 group-hover:text-teal-800">{it.label}</span><span className="block text-xs leading-5 text-stone-500">{it.desc}</span></span></Link></li>)}</ul>
        {g.feature && <Link href={g.feature.href} onClick={() => setOpen(null)} className="group relative hidden overflow-hidden rounded-xl lg:block"><Image src={g.feature.img} alt="" width={560} height={374} sizes="280px" className="h-full w-full object-cover transition group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-indigo-950/40 to-teal-700/10" /><div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="font-semibold">{g.feature.title}</p><p className="mt-1 text-xs text-white/80">{g.feature.body}</p><span className="mt-2 inline-block text-xs font-semibold text-amber-300">{g.feature.cta} →</span></div></Link>}
      </div>
    </div>)}
  </div>;
}
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [open]);
  const close = () => setOpen(false);
  const drawer = (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
      <button type="button" aria-label="Close menu" tabIndex={-1} onClick={close} className="absolute inset-0 h-full w-full bg-stone-950/50 backdrop-blur-sm" />
      <div id="mobile-nav" className="absolute inset-y-0 right-0 flex h-[100dvh] w-[88%] max-w-sm flex-col bg-white shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 px-5">
          <Link href="/" onClick={close} className="flex items-center gap-2 text-lg font-semibold text-stone-900">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/mark.svg" alt="" width={28} height={28} className="h-7 w-7" />Waylo</Link>
          <button type="button" onClick={close} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-lg text-stone-900 ring-1 ring-stone-300"><svg width="20" height="20" viewBox="0 0 18 18" aria-hidden><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" /></svg></button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-5 pb-10">
          {NAV.map(g => <details key={g.id} className="border-b border-stone-100 py-2"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-2 font-semibold text-stone-900">{g.label}<span aria-hidden className="text-stone-400">+</span></summary>
            <ul className="pb-2">{g.items.map(it => <li key={it.href}><Link href={it.href} onClick={close} className="flex gap-3 rounded-lg p-2 hover:bg-stone-50"><span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs ring-1 ${tile[it.t]}`}>{it.icon}</span><span><span className="block text-sm font-medium text-stone-900">{it.label}</span><span className="block text-xs text-stone-500">{it.desc}</span></span></Link></li>)}</ul></details>)}
          <Link href="/pricing" onClick={close} className="flex min-h-11 items-center border-b border-stone-100 py-3 font-semibold text-stone-900">Pricing</Link>
          <div className="mt-6 grid gap-2"><Link href="/demo" onClick={close} className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">Try demo</Link><a href="mailto:hello@waylo.ai?subject=Waylo%20early%20access" onClick={close} className="w-btn justify-center">Request access</a><Link href="/admin/login" onClick={close} className="py-3 text-center text-sm font-medium text-stone-700">Sign in</Link></div>
        </nav>
      </div>
    </div>
  );
  return <div className="md:hidden">
    <button type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-lg bg-white text-stone-900 shadow-sm ring-1 ring-stone-300"><svg width="22" height="22" viewBox="0 0 18 18" aria-hidden><path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
    {open && mounted && createPortal(drawer, document.body)}
  </div>;
}
