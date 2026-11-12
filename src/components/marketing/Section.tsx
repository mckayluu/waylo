export function Section({ id, eyebrow, title, sub, children, className = "", center = false, dark = false }: { id?: string; eyebrow?: string; title?: string; sub?: string; children: React.ReactNode; className?: string; center?: boolean; dark?: boolean }) {
  const pill = eyebrow && <p className={`w-pill ${dark ? "w-pill-dark" : ""}`}>{eyebrow}</p>;
  const h = dark ? "text-white" : "text-warm-900"; const s = dark ? "text-white/75" : "text-warm-600";
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-12 sm:py-16 ${dark ? "w-band-navy" : ""} ${className}`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title) && (center
          ? <div className="mx-auto mb-9 max-w-2xl text-center">
              {pill}
              {title && <h2 className={`mt-4 text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1] ${h}`}>{title}</h2>}
              {sub && <p className={`mt-4 ${s}`}>{sub}</p>}
            </div>
          : <div className="mb-9 grid gap-x-10 gap-y-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
              <div>
                {pill}
                {title && <h2 className={`mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1] ${h}`}>{title}</h2>}
              </div>
              {sub && <p className={`text-[15px] leading-7 ${s}`}>{sub}</p>}
            </div>)}
        {children}
      </div>
    </section>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mk min-h-screen bg-warm-50 text-warm-900">{children}</div>;
}
