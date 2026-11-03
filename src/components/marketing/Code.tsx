export function Code({ children, label }: { children: string; label?: string }) {
  return <div className="overflow-hidden rounded-xl bg-stone-900">{label && <div className="border-b border-stone-800 px-5 py-2 text-xs text-stone-400">{label}</div>}<pre className="overflow-x-auto p-5 font-mono text-sm leading-6 text-teal-200">{children}</pre></div>;
}
