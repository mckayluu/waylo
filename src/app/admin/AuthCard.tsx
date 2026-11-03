export function AuthCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center w-gradient px-4">
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center justify-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 font-bold text-white shadow-md ring-1 ring-white/25">W</span><span className="text-lg font-semibold tracking-tight text-white">Waylo</span></div>
      <div className="w-card-lg overflow-hidden"><div className="w-accent-line" /><div className="p-6"><h1 className="text-lg font-bold tracking-tight text-stone-900">{title}</h1>{sub && <p className="mt-1 text-sm text-stone-500">{sub}</p>}<div className="mt-5">{children}</div></div></div>
    </div></div>;
}
