import { Header } from "./Header"; import { Footer } from "./Footer"; import { Shell } from "./Section";
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return <Shell><Header /><main className="mx-auto max-w-3xl px-5 py-16">
    <h1 className="text-4xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-sm text-warm-500">Last updated {updated}</p>
    <div className="mt-6 rounded-md border border-rasp-200 bg-rasp-50 p-4 text-sm text-rasp-900">This document is a plain-language template. It’s usable as-is, but have a lawyer review it for your jurisdiction before relying on it.</div>
    <div className="mt-10 space-y-4 text-[15px] leading-7 text-warm-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-warm-900 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_a]:text-navy-700 [&_a]:underline">{children}</div>
  </main><Footer /></Shell>;
}
