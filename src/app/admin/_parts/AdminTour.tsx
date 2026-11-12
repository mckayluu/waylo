"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
// First-run product tour over the admin nav. Shown once (localStorage), relaunch from the "?" button.
const KEY = "waylo_tour_v1";
const STEPS: { sel: string; title: string; body: string }[] = [
  { sel: 'a[href="/admin"]', title: "Home: your setup checklist", body: "Six steps from URL to live. Each one turns green on its own as you finish it, including a real install check on your domain." },
  { sel: 'aside a[href="/admin/content"]', title: "Content: what your bot knows", body: "Waylo reads your sitemap and pages (PDFs too). Re-crawls run automatically every 3 days on the Trial, daily on paid plans; you can crawl again any time." },
  { sel: 'aside a[href="/admin/guidance"]', title: "Guidance: how it answers", body: "Add facts, rules and skills, like “never quote custom pricing” or “send security questions to the trust page”." },
  { sel: 'aside a[href="/admin/questions"]', title: "Questions: what visitors ask", body: "Every question with the answer and its sources. Thumbs-down and “not covered” answers show you what to write next." },
  { sel: 'aside a[href="/admin/tracking"]', title: "Tracking: who's ready to buy", body: "Page journeys, traffic source, time on page and scroll depth, scored High / Medium / Low so you know who to follow up with." },
  { sel: 'aside a[href="/admin/install"]', title: "Install: one line of HTML", body: "Copy the snippet into your site footer. We detect the first visit from your domain, or press Check now." },
  { sel: 'aside a[href="/admin/billing"]', title: "Billing: no sales call needed", body: "Your trial includes 500 AI replies. Upgrade, switch or cancel yourself here, any time." },
];
export function AdminTour({ autoStart }: { autoStart: boolean }) {
  const [i, setI] = useState(-1); const [r, setR] = useState<DOMRect | null>(null); const path = usePathname();
  const end = useCallback(() => { setI(-1); try { localStorage.setItem(KEY, new Date().toISOString()); } catch {} }, []);
  useEffect(() => {
    const go = () => setI(0); window.addEventListener("waylo:tour", go);
    try { if (autoStart && path === "/admin" && !localStorage.getItem(KEY)) setTimeout(go, 600); } catch {}
    return () => window.removeEventListener("waylo:tour", go);
  }, [autoStart, path]);
  useEffect(() => {
    if (i < 0) return; const el = document.querySelector(STEPS[i].sel) as HTMLElement | null;
    const place = () => setR(el ? el.getBoundingClientRect() : null);
    el?.scrollIntoView({ block: "nearest", inline: "nearest" }); place();
    window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") end(); if (e.key === "ArrowRight") setI((x) => Math.min(STEPS.length - 1, x + 1)); if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1)); };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); window.removeEventListener("keydown", k); };
  }, [i, end]);
  if (i < 0) return null;
  const s = STEPS[i]; const last = i === STEPS.length - 1;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const side = r && r.right + 340 < vw; // room to the right (desktop rail)
  const style: React.CSSProperties = r ? (side ? { top: Math.max(12, r.top - 8), left: r.right + 14 } : { top: r.bottom + 12, left: Math.min(Math.max(12, r.left), vw - 332) }) : { top: 80, left: Math.max(12, vw / 2 - 160) };
  return <div className="fixed inset-0 z-[60]" role="dialog" aria-label="Product tour">
    <div className="absolute inset-0 bg-warm-950/40" onClick={end} />
    {r && <div className="pointer-events-none absolute rounded-lg ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent" style={{ top: r.top - 3, left: r.left - 3, width: r.width + 6, height: r.height + 6, boxShadow: "0 0 0 9999px rgba(12,10,9,.25)" }} />}
    <div className="absolute w-80 rounded-xl bg-card p-4 text-warm-800 shadow-2xl" style={style}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-700">Quick tour · {i + 1}/{STEPS.length}</p>
      <p className="mt-1 font-semibold">{s.title}</p><p className="mt-1 text-sm text-warm-600">{s.body}</p>
      <div className="mt-3 flex items-center justify-between">
        <button onClick={end} className="text-xs text-warm-500 hover:text-warm-800">Skip tour</button>
        <div className="flex gap-2">{i > 0 && <button onClick={() => setI(i - 1)} className="w-btn-ghost px-3 py-1 text-sm">Back</button>}
          <button onClick={() => (last ? end() : setI(i + 1))} className="w-btn px-3 py-1 text-sm">{last ? "Done" : "Next"}</button></div>
      </div>
    </div>
  </div>;
}
export function TourButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("waylo:tour"))} className="grid h-8 w-8 place-items-center rounded-full border border-warm-200 text-xs text-warm-500 hover:border-navy-300 hover:text-navy-700" title="Take the quick tour" aria-label="Take the quick tour">?</button>;
}
