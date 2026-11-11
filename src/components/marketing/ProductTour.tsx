"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import type { TourStep } from "@/lib/tour";
export function ProductTour({ steps, compact = false, start = 0 }: { steps: TourStep[]; compact?: boolean; start?: number }) {
  const [i, setI] = useState(Math.min(start, steps.length - 1));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const go = useCallback((n: number, focus = false) => { const k = (n + steps.length) % steps.length; setI(k); if (focus) tabs.current[k]?.focus(); }, [steps.length]);
  if (!steps.length) return null;
  const s = steps[i];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1, true); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); go(0, true); } else if (e.key === "End") { e.preventDefault(); go(steps.length - 1, true); }
  };
  return <div className={`overflow-hidden rounded-md bg-white ring-1 ring-warm-200 shadow-xl shadow-navy-950/5 ${compact ? "" : "lg:grid lg:grid-cols-[300px_1fr]"}`}>
    <div role="tablist" aria-label="Product tour steps" aria-orientation={compact ? "horizontal" : "vertical"} onKeyDown={onKey}
      className={compact ? "flex gap-1 overflow-x-auto border-b border-warm-200 bg-warm-50 p-2 [scrollbar-width:none]" : "flex gap-1 overflow-x-auto border-b border-warm-200 bg-warm-50 p-2 [scrollbar-width:none] lg:block lg:space-y-1 lg:overflow-visible lg:border-b-0 lg:border-r lg:p-3"}>
      {steps.map((t, k) => <button key={t.id} ref={el => { tabs.current[k] = el; }} type="button" role="tab" id={`${uid}-t${k}`} aria-selected={k === i} aria-controls={`${uid}-p`} tabIndex={k === i ? 0 : -1} onClick={() => go(k)}
        className={`flex shrink-0 items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition ${compact ? "" : "lg:w-full"} ${k === i ? "bg-white font-semibold text-warm-900 shadow-sm ring-1 ring-warm-200" : "text-warm-600 hover:bg-white/70 hover:text-warm-900"}`}>
        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px] font-semibold ${k === i ? "bg-gradient-to-br from-navy-600 to-navy-600 text-white" : k < i ? "bg-navy-100 text-navy-800" : "bg-warm-200 text-warm-600"}`}>{k + 1}</span>
        <span className={compact ? "whitespace-nowrap" : "whitespace-nowrap lg:whitespace-normal"}>{t.title}</span></button>)}
    </div>
    <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t${i}`} className="min-w-0">
      <div className="relative bg-warm-100">
        <Image key={s.src} src={s.src} alt={s.alt} width={s.w} height={s.h} sizes={compact ? "(min-width:1024px) 720px, 100vw" : "(min-width:1024px) 860px, 100vw"} className="h-auto w-full" priority={i === 0} />
        <span className="absolute left-3 top-3 rounded-full bg-warm-950/75 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">Step {i + 1} / {steps.length}{s.pending ? " · sample data" : ""}</span>
      </div>
      <div className="flex flex-col gap-3 border-t border-warm-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div aria-live="polite" className="min-w-0"><p className="font-semibold text-warm-900">{s.title}</p><p className="mt-1 text-sm leading-6 text-warm-600">{s.caption}{s.href && !compact && <> <Link href={s.href} className="font-medium text-navy-700 hover:underline">More →</Link></>}</p></div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous step" className="grid h-10 w-10 place-items-center rounded-md text-warm-700 ring-1 ring-warm-300 hover:bg-warm-50">←</button>
          {i < steps.length - 1 ? <button type="button" onClick={() => go(i + 1)} className="w-btn h-10 px-4">Next step →</button> : <Link href="/signup" className="w-btn-accent h-10 px-4">Start free trial</Link>}
        </div>
      </div>
    </div>
  </div>;
}
