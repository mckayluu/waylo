export function Section({ id, eyebrow, title, sub, children, className = "", center = false }: { id?: string; eyebrow?: string; title?: string; sub?: string; children: React.ReactNode; className?: string; center?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-9 sm:py-12 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title) && (center
          ? <div className="mx-auto mb-7 max-w-2xl text-center">
              {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-rasp-700">{eyebrow}</p>}
              {title && <h2 className="mt-2 text-3xl font-semibold tracking-tight text-warm-900 sm:text-4xl">{title}</h2>}
              {sub && <p className="mt-4 text-warm-600">{sub}</p>}
            </div>
          : <div className="mb-7 grid gap-x-10 gap-y-2 border-t border-warm-200 pt-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
              <div>
                {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-rasp-700">{eyebrow}</p>}
                {title && <h2 className="mt-1.5 max-w-2xl text-2xl font-semibold tracking-tight text-warm-900 sm:text-[2rem] sm:leading-tight">{title}</h2>}
              </div>
              {sub && <p className="text-[15px] leading-7 text-warm-600">{sub}</p>}
            </div>)}
        {children}
      </div>
    </section>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mk min-h-screen bg-warm-50 text-warm-900">{children}</div>;
}
