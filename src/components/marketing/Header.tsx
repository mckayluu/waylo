import Link from "next/link";
export function Wordmark() {
  return <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-stone-900"><span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-700 text-sm font-bold text-white">W</span>Waylo</Link>;
}
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Wordmark />
        <nav className="hidden gap-7 text-sm text-stone-600 md:flex">
          <Link href="/#product" className="hover:text-stone-900">Product</Link>
          <Link href="/#features" className="hover:text-stone-900">Features</Link>
          <Link href="/#how" className="hover:text-stone-900">How it works</Link>
          <Link href="/pricing" className="hover:text-stone-900">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/admin/login" className="hidden px-2 text-sm font-medium text-stone-700 hover:text-stone-900 sm:inline">Sign in</Link>
          <Link href="/demo" className="w-btn">Try demo</Link>
        </div>
      </div>
    </header>
  );
}
