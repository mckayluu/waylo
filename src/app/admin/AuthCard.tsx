export function AuthCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center w-gradient px-4">
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center justify-center">{/* Mast lockup, on-navy variant for the Night Navy field. */}{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/lockup-on-navy.svg" alt="Waylo" width={113} height={40} className="h-10 w-auto" /></div>
      <div className="w-card-lg overflow-hidden"><div className="w-accent-line" /><div className="p-6"><h1 className="text-lg font-bold tracking-tight text-warm-900">{title}</h1>{sub && <p className="mt-1 text-sm text-warm-500">{sub}</p>}<div className="mt-5">{children}</div></div></div>
    </div></div>;
}
