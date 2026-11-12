"use client";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { SlackCard } from "./HomeVisuals";

type Tab = { title: string; line: string; img?: { src: string; w: number; h: number; alt: string }; note?: string };
// Homepage-only tour: what an evaluator gets, not setup steps. Separate from the 8-step tour in lib/tour.ts.
const TABS: Tab[] = [
  { title: "Visitors get a straight answer", line: "Waylo answers from your own pages and links the page it used, so visitors can check it.", img: { src: "/tour/05-live-chat-cited.webp", w: 1600, h: 893, alt: "Waylo chat on the Waylo pricing page answering “Is there a free trial?” with a source chip linking the signup page" }, note: "Live chat on this site" },
  { title: "See what buyers ask", line: "Conversations, questions and contact requests add up on your dashboard as people use the chat.", img: { src: "/tour/home-dashboard-sample.webp", w: 1600, h: 893, alt: "Waylo Home dashboard for the fictional Northpoint Ops workspace with conversation, question, contact form and high-intent counts and a 14-day question chart" }, note: "Sample data" },
  { title: "Know who’s ready", line: "Each visitor’s journey shows the pages they read and the questions they asked. Buying signals are tagged as they come up.", img: { src: "/product/admin-tracking.webp", w: 1440, h: 900, alt: "Waylo visitor journey: pages viewed, questions asked and a summary of the visit" }, note: "Sample data" },
  { title: "Hear about ready buyers in Slack", line: "When a visitor looks ready to buy or leaves their details, your channel gets a message with a link to the conversation.", note: "Illustration · Northpoint Ops is fictional" },
  { title: "Fix the pages that leave people stuck", line: "When a page leaves something out, add a fact in Guidance so the next visitor gets an answer.", img: { src: "/product/admin-guidance.webp", w: 1440, h: 900, alt: "Waylo Guidance view where you add facts, rules and skills" } },
];

export function HomeTour() {
  const [i, setI] = useState(0);
  const uid = useId(); const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (n: number, f = false) => { const k = (n + TABS.length) % TABS.length; setI(k); if (f) refs.current[k]?.focus(); };
  const t = TABS[i];
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:items-start">
      <div role="tablist" aria-label="What Waylo shows you" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible"
        onKeyDown={e => { if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); } if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); } }}>
        {TABS.map((x, k) => <button key={x.title} ref={el => { refs.current[k] = el; }} role="tab" type="button" id={`${uid}-t${k}`} aria-selected={k === i} aria-controls={`${uid}-p`} tabIndex={k === i ? 0 : -1} onClick={() => go(k)}
          className={`w-tile shrink-0 px-5 py-4 text-left transition lg:w-full ${k === i ? "w-tile-card shadow-lg shadow-navy-950/10 ring-2 ring-rasp-600" : "bg-white/50 ring-1 ring-warm-200 hover:bg-white"}`}>
          <span className={`block font-display text-lg font-semibold ${k === i ? "text-warm-900" : "text-warm-700"}`}>{x.title}</span>
          <span className={`mt-1 hidden text-sm leading-6 text-warm-600 ${k === i ? "lg:block" : ""}`}>{x.line}</span>
        </button>)}
      </div>
      <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t${i}`} className="w-tile w-tile-mist relative overflow-hidden p-4 sm:p-6">
        <div aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rotate-6 rounded-[22px] bg-blush" />
        <div className="relative">
          {t.img ? <div className="w-shot-float"><Image key={t.img.src} src={t.img.src} alt={t.img.alt} width={t.img.w} height={t.img.h} sizes="(min-width:1024px) 720px, 100vw" className="h-auto w-full" /></div>
            : <div className="grid min-h-[320px] place-items-center rounded-xl bg-navy-900 p-6 sm:min-h-[420px]"><SlackCard /></div>}
          <p aria-live="polite" className="mt-4 text-base leading-7 text-warm-800 lg:hidden">{t.line}</p>
          {t.note && <p className="mt-3 font-plex text-[11px] uppercase tracking-[0.08em] text-warm-500">{t.note}</p>}
        </div>
      </div>
    </div>
  );
}
