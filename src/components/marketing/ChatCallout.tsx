"use client";
// Homepage-only callout: a hand-drawn raspberry arrow from the hero to the live Waylo chat.
// Target comes from the widget's real DOM (public/waylo.js):
//   open panel  -> iframe[title="Waylo chat"] (display:block)
//   closed      -> button[aria-label="Chat with us"][data-waylo-ui] (the launcher)
//   mobile      -> div[data-waylo-ui][role="dialog"] (the teaser), else the launcher
// Opening uses window.Waylo.open() (fallback: click the launcher), then focuses the widget textarea
// through the same-origin iframe (see openChat).
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Pt = { x: number; y: number };
type Geo = { d1: string; d2: string; head: string; w: number; h: number; mobile: boolean; label?: { right: number; bottom: number } } | null;

const visible = (el: Element | null): el is HTMLElement => {
  if (!el) return false;
  const s = getComputedStyle(el as HTMLElement); const r = el.getBoundingClientRect();
  return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
};
function target(mobile: boolean): { p: Pt; kind: "panel" | "launcher" | "teaser" } | null {
  const panel = document.querySelector('iframe[title="Waylo chat"]');
  const launcher = document.querySelector('button[aria-label="Chat with us"][data-waylo-ui]');
  const teaser = document.querySelector('div[data-waylo-ui][role="dialog"]');
  if (mobile) {
    if (visible(teaser)) { const r = teaser.getBoundingClientRect(); return { p: { x: r.left + r.width * 0.35, y: r.top - 6 }, kind: "teaser" }; }
    if (visible(launcher)) { const r = launcher.getBoundingClientRect(); return { p: { x: r.left - 4, y: r.top + 8 }, kind: "launcher" }; }
    return fallback(true);
  }
  if (visible(panel)) { const r = panel.getBoundingClientRect(); return { p: { x: r.left - 14, y: Math.min(r.bottom - 60, r.top + r.height * 0.62) }, kind: "panel" }; }
  if (visible(launcher)) { const r = launcher.getBoundingClientRect(); return { p: { x: r.left - 12, y: r.top + r.height / 2 }, kind: "launcher" }; }
  return fallback(false);
}
// Fixed fallback: waylo.js puts its 60px launcher 20px from the bottom-right corner. Only used when the
// script has loaded (window.Waylo exists) but we can't find its DOM; with no widget at all, hide the arrow.
function fallback(mobile: boolean): { p: Pt; kind: "launcher" } | null {
  if (!(window as unknown as { Waylo?: unknown }).Waylo) return null;
  const W = window.innerWidth, H = window.innerHeight;
  return { p: mobile ? { x: W - 84, y: H - 72 } : { x: W - 92, y: H - 50 }, kind: "launcher" };
}
// Deterministic wobble so the line looks drawn by hand but doesn't jitter between renders.
const wob = (t: number, seed: number) => Math.sin(t * 9.1 + seed) * 1.3 + Math.sin(t * 23.7 + seed * 2) * 0.6;
function sketch(s: Pt, e: Pt, bulge: number, seed: number): string {
  const dx = e.x - s.x, dy = e.y - s.y, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len; // normal
  const c1 = { x: s.x + dx * 0.3 + nx * bulge, y: s.y + dy * 0.3 + ny * bulge };
  const c2 = { x: s.x + dx * 0.72 + nx * bulge * 0.55, y: s.y + dy * 0.72 + ny * bulge * 0.55 };
  const pts: Pt[] = [];
  const N = Math.max(10, Math.round(len / 28));
  for (let i = 0; i <= N; i++) {
    const t = i / N, u = 1 - t;
    const x = u * u * u * s.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * e.x;
    const y = u * u * u * s.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * e.y;
    const w = i === 0 || i === N ? 0 : wob(t, seed);
    pts.push({ x: x + nx * w, y: y + ny * w });
  }
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) { const m = { x: (pts[i].x + pts[i + 1].x) / 2, y: (pts[i].y + pts[i + 1].y) / 2 }; d += ` Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${m.x.toFixed(1)} ${m.y.toFixed(1)}`; }
  const L = pts[pts.length - 1]; d += ` L${L.x.toFixed(1)} ${L.y.toFixed(1)}`;
  return d;
}
function arrowhead(e: Pt, from: Pt, size: number): string {
  const a = Math.atan2(e.y - from.y, e.x - from.x);
  const wing = (ang: number, l: number, bend: number) => {
    const p = { x: e.x - Math.cos(a + ang) * l, y: e.y - Math.sin(a + ang) * l };
    const m = { x: (e.x + p.x) / 2 + Math.cos(a + ang + Math.PI / 2) * bend, y: (e.y + p.y) / 2 + Math.sin(a + ang + Math.PI / 2) * bend };
    return `M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q${m.x.toFixed(1)} ${m.y.toFixed(1)} ${(e.x + 0.8).toFixed(1)} ${(e.y - 0.6).toFixed(1)}`;
  };
  return `${wing(0.46, size, 1.6)} ${wing(-0.6, size * 0.78, -1.2)}`; // uneven wings, on purpose
}

export function ChatCallout() {
  const btn = useRef<HTMLButtonElement>(null);
  const [geo, setGeo] = useState<Geo>(null);
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const key = useRef("");

  const measure = useCallback(() => {
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const t = target(mobile);
    const W = window.innerWidth, H = window.innerHeight;
    if (!t || (mobile && t.kind === "panel")) { setShow(false); return; }
    if (mobile) {
      // Small fixed label just above-left of the teaser/launcher, only near the top of the page.
      if (window.scrollY > 700) { setShow(false); return; }
      const e = t.p;
      const label = { right: Math.max(12, W - (e.x - 10)), bottom: Math.max(12, H - (e.y - 46)) };
      const s = { x: e.x - 54, y: e.y - 40 };
      const k = `m${Math.round(e.x)},${Math.round(e.y)},${W},${H}`;
      if (k !== key.current) { key.current = k; setGeo({ d1: sketch(s, e, -14, 1.7), d2: sketch({ x: s.x + 1.2, y: s.y + 0.8 }, e, -12, 4.2), head: arrowhead(e, { x: e.x - 18, y: e.y - 20 }, 11), w: W, h: H, mobile, label }); }
      setShow(true); return;
    }
    const b = btn.current; if (!b) return;
    const r = b.getBoundingClientRect();
    if (r.bottom < 0 || r.top > H || window.scrollY > 260) { setShow(false); return; }
    const s = { x: r.right + 10, y: r.top + r.height * 0.55 };
    const e = t.p;
    const k = `d${Math.round(s.x)},${Math.round(s.y)},${Math.round(e.x)},${Math.round(e.y)},${W},${H}`;
    if (k !== key.current) {
      key.current = k;
      const bulge = t.kind === "panel" ? 52 : -120;
      const near = { x: e.x - 30, y: e.y - (t.kind === "panel" ? 6 : 14) };
      setGeo({ d1: sketch(s, e, bulge, 1.3), d2: sketch({ x: s.x + 1.5, y: s.y - 1 }, { x: e.x - 1, y: e.y + 0.8 }, bulge * 0.94, 3.9), head: arrowhead(e, near, 17), w: W, h: H, mobile });
    }
    setShow(true);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    tick();
    const iv = window.setInterval(tick, 400); // the widget mounts and auto-opens on its own clock
    window.addEventListener("resize", tick); window.addEventListener("scroll", tick, { passive: true });
    const mo = new MutationObserver(tick); mo.observe(document.body, { childList: true, subtree: false, attributes: true, attributeFilter: ["style"] });
    return () => { cancelAnimationFrame(raf); clearInterval(iv); window.removeEventListener("resize", tick); window.removeEventListener("scroll", tick); mo.disconnect(); };
  }, [measure]);

  const openChat = () => {
    const w = window as unknown as { Waylo?: { open?: () => void } };
    if (w.Waylo && typeof w.Waylo.open === "function") w.Waylo.open();
    else (document.querySelector('button[aria-label="Chat with us"][data-waylo-ui]') as HTMLButtonElement | null)?.click();
    window.setTimeout(measure, 50);
    // waylo.js posts "waylo:opened", but the widget's focusInput() checks (min-width: 641px) inside the
    // 400px iframe, so it never focuses there. The iframe is same-origin, so focus the textarea directly.
    // Skipped on touch screens so we don't pop the keyboard (matches the widget's own mobile rule).
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let n = 0;
    const tryFocus = () => {
      const f = document.querySelector('iframe[title="Waylo chat"]') as HTMLIFrameElement | null;
      try {
        const ta = f?.contentDocument?.querySelector("textarea") as HTMLTextAreaElement | null;
        if (f && ta) { f.focus(); ta.focus(); return; }
      } catch { return; } // cross-origin embed: leave it to the widget
      if (++n < 30) window.setTimeout(tryFocus, 100);
    };
    tryFocus();
  };

  const label = <span className="w-callout-text">This is it. <span className="whitespace-nowrap">Try it now.</span></span>;
  return <>
    {/* Desktop: sits in the hero, under the buttons. */}
    <button ref={btn} type="button" onClick={openChat} aria-label="Open the Waylo chat and ask it a question" className="w-callout mt-7 hidden sm:inline-flex">{label}</button>
    {/* Fixed pieces are portaled to <body>: the hero column has a transform, which would trap position:fixed. */}
    {mounted && createPortal(<div className="mk">
    {/* Mobile: small, fixed just above the launcher or teaser. */}
    {geo?.mobile && show && geo.label && <button type="button" onClick={openChat} aria-label="Open the Waylo chat and ask it a question" className="w-callout w-callout-sm fixed sm:hidden" style={{ right: geo.label.right, bottom: geo.label.bottom, zIndex: 2147483645 }}>Try it now.</button>}
    {geo && show && <svg aria-hidden="true" focusable="false" className="w-callout-arrow pointer-events-none fixed inset-0" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} style={{ zIndex: 2147483645 }}>
      <path d={geo.d1} pathLength={1} className="w-callout-line w-callout-halo" strokeWidth={geo.mobile ? 5.5 : 7.5} />
      <path d={geo.head} pathLength={1} className="w-callout-line w-callout-halo w-callout-head" strokeWidth={geo.mobile ? 5.5 : 7.5} />
      <path d={geo.d1} pathLength={1} className="w-callout-line" strokeWidth={geo.mobile ? 2.6 : 3.8} />
      <path d={geo.d2} pathLength={1} className="w-callout-line w-callout-line-2" strokeWidth={geo.mobile ? 1.2 : 1.5} />
      <path d={geo.head} pathLength={1} className="w-callout-line w-callout-head" strokeWidth={geo.mobile ? 2.6 : 3.6} />
    </svg>}
    </div>, document.body)}
  </>;
}
