export function Section({ id, eyebrow, title, sub, children, className = "" }: { id?: string; eyebrow?: string; title?: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title) && <div className="mx-auto mb-10 max-w-2xl text-center">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">{eyebrow}</p>}
          {title && <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{title}</h2>}
          {sub && <p className="mt-4 text-stone-600">{sub}</p>}
        </div>}
        {children}
      </div>
    </section>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-stone-50 text-stone-900">{children}</div>;
}
