import Link from "next/link";
export function Wordmark({ invert = false }: { invert?: boolean }) {
  return <Link href="/" aria-label="Waylo home" className={`flex items-center gap-2 text-lg font-semibold tracking-tight ${invert ? "text-white" : "text-stone-900"}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/mark.svg" alt="" width={28} height={28} className="h-7 w-7" />Waylo</Link>;
}
const nav: [string, string][] = [["Features", "/features"], ["Use cases", "/use-cases"], ["Pricing", "/pricing"], ["Docs", "/docs"], ["FAQ", "/faq"]];
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Wordmark />
        <nav className="hidden gap-7 text-sm text-stone-600 md:flex">{nav.map(([l, h]) => <Link key={l} href={h} className="hover:text-stone-900">{l}</Link>)}</nav>
        <div className="flex items-center gap-2">
          <Link href="/admin/login" className="hidden px-2 text-sm font-medium text-stone-700 hover:text-stone-900 sm:inline">Sign in</Link>
          <Link href="/demo" className="w-btn-ghost hidden sm:inline-flex">Try demo</Link>
          <a href="mailto:hello@waylo.ai?subject=Waylo%20early%20access" className="w-btn">Request access</a>
        </div>
      </div>
    </header>
  );
}
