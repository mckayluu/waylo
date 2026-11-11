import Link from "next/link";
import { MegaMenu, MobileMenu } from "./MegaMenu";
export function Wordmark({ invert = false }: { invert?: boolean }) {
  return <Link href="/" aria-label="Waylo home" className={`flex items-center gap-2 text-lg font-semibold tracking-tight ${invert ? "text-white" : "text-stone-900"}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/mark.svg" alt="" width={28} height={28} className="h-7 w-7" />Waylo</Link>;
}
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="w-accent-line" /><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Wordmark />
        <nav aria-label="Main"><MegaMenu /></nav>
        <div className="flex items-center gap-2">
          <Link href="/admin/login" className="hidden px-2 text-sm font-medium text-stone-700 hover:text-stone-900 sm:inline">Sign in</Link>
          <Link href="/how-it-works" className="hidden items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100 sm:inline-flex">How it works</Link>
          <Link href="/signup" className="w-btn hidden sm:inline-flex">Start free trial</Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
