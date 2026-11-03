export function AuthCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-[#0d1b1e] px-4">
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center justify-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-600 font-bold text-white">W</span><span className="text-lg font-semibold tracking-tight text-white">Waylo</span></div>
      <div className="rounded-2xl bg-white p-6 shadow-xl"><h1 className="text-lg font-semibold text-stone-900">{title}</h1>{sub && <p className="mt-1 text-sm text-stone-500">{sub}</p>}<div className="mt-5">{children}</div></div>
    </div></div>;
}
