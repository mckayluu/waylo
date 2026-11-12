"use client";
// Homepage-only callout that points visitors at the live Waylo chat: a white card plus one clean curved
// arrow, and a soft pulse ring over the launcher. Everything is placed from the widget's real DOM
// (public/waylo.js):
//   open panel -> [data-waylo-panel] (fallback: iframe[title="Waylo chat"]): card left of the panel, arrow into its input area
//   closed     -> [data-waylo-launcher] (fallback: button[aria-label="Chat with us"][data-waylo-ui]): card left of the launcher, arrow into it
//   mobile     -> div[data-waylo-ui][role="dialog"] (the teaser) or the launcher; hidden once the panel is open
// The card and arrow never sit on the hero copy, buttons, illustration cards or caption (on desktop, nor on
// the hero photo). If no clear spot exists, the callout stays hidden.
// Clicking the card calls window.Waylo.open({ focus: true }) (fallback: click the launcher). Dismissal lives in sessionStorage.
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DISMISS_KEY = "waylo_callout_dismissed";
const panelEl = () => document.querySelector("[data-waylo-panel], iframe[title='Waylo chat']");
const launcherEl = () => document.querySelector("[data-waylo-launcher], button[aria-label='Chat with us'][data-waylo-ui]");
const TEASER = 'div[data-waylo-ui][role="dialog"]';
const EDGE = 12; // keep clear of the viewport edge
const PAD = 6; // breathing room around anything we avoid

type Pt = { x: number; y: number };
type Box = { left: number; top: number; right: number; bottom: number };
type Arrow = { d: string; head: string; nx: number; ny: number; tone: "light" | "rasp" };
type Place = { left: number; top: number; mode: string; arrow: Arrow; ring: Box | null };

const visible = (el: Element | null): el is HTMLElement => {
  if (!el) return false;
  const s = getComputedStyle(el as HTMLElement); const r = el.getBoundingClientRect();
  return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
};
const hits = (a: Box, b: Box, pad = 0) => a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const inside = (p: Pt, b: Box) => p.x >= b.left && p.x <= b.right && p.y >= b.top && p.y <= b.bottom;
// Tight boxes around the actual lines of text, not the whole block.
const textBoxes = (el: Element): Box[] => { const r = document.createRange(); r.selectNodeContents(el); return Array.from(r.getClientRects()).filter((b) => b.width > 0); };

function scene(mobile: boolean) {
  const fig = document.querySelector("#product figure");
  const hero = (fig?.closest("section") || document.querySelector("main section")) as HTMLElement | null;
  const block: Box[] = [];
  if (hero) {
    hero.querySelectorAll("h1, p, figcaption").forEach((e) => { if (visible(e) && !e.closest("[role=img]")) block.push(...textBoxes(e)); });
    hero.querySelectorAll("a, [role=img]").forEach((e) => { if (visible(e)) block.push(e.getBoundingClientRect()); });
    if (fig && !mobile) fig.querySelectorAll("img, div[aria-hidden]").forEach((e) => { if (visible(e)) block.push(e.getBoundingClientRect()); });
  }
  const img = fig?.querySelector("img");
  return { block, hero: hero?.getBoundingClientRect() || null, photo: visible(img || null) ? img!.getBoundingClientRect() : null };
}

// One smooth cubic from s (leaving along ds) to e (arriving along de). The line stops at the head's base.
function arrow(s: Pt, ds: Pt, e: Pt, de: Pt, tone: Arrow["tone"]): { a: Arrow; pts: Pt[] } {
  const len = Math.hypot(e.x - s.x, e.y - s.y), k = len * 0.5, H = 16;
  const b = { x: e.x - de.x * H, y: e.y - de.y * H }; // head base
  const c1 = { x: s.x + ds.x * k, y: s.y + ds.y * k }, c2 = { x: b.x - de.x * k * 0.8, y: b.y - de.y * k * 0.8 };
  const pts: Pt[] = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24, u = 1 - t; pts.push({ x: u * u * u * s.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x, y: u * u * u * s.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y }); }
  pts.push(e);
  const f = (p: Pt) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  const w = { x: -de.y * 8, y: de.x * 8 };
  const head = `M${f(e)} L${f({ x: b.x + w.x, y: b.y + w.y })} Q${f({ x: b.x + de.x * 2.5, y: b.y + de.y * 2.5 })} ${f({ x: b.x - w.x, y: b.y - w.y })} Z`;
  return { a: { d: `M${f(s)} C${f(c1)} ${f(c2)} ${f(b)}`, head, nx: de.x, ny: de.y, tone }, pts };
}
const norm = (x: number, y: number) => { const l = Math.hypot(x, y) || 1; return { x: x / l, y: y / l }; };

function place(w: number, h: number, mobile: boolean): Place | null {
  const W = window.innerWidth, H = window.innerHeight;
  const panel = panelEl(), launcher = launcherEl(), teaser = document.querySelector(TEASER);
  const { block, hero, photo } = scene(mobile);
  const widget = [panel, launcher, teaser].filter(visible).map((e) => e.getBoundingClientRect());
  const tone = (pts: Pt[]): Arrow["tone"] => {
    const navy = pts.filter((p) => hero && inside(p, hero) && !(photo && inside(p, photo))).length;
    return navy > pts.length / 2 ? "light" : "rasp";
  };
  // Try a card position plus an arrow; keep it only if nothing we care about is covered.
  const attempt = (left: number, top: number, s: Pt, ds: Pt, e: Pt, de: Pt, mode: string, ring: Box | null): Place | null => {
    const card = { left, top, right: left + w, bottom: top + h };
    if (card.left < EDGE || card.top < EDGE || card.right > W - EDGE || card.bottom > H - EDGE) return null;
    if (block.some((o) => hits(card, o, PAD)) || widget.some((o) => hits(card, o, PAD))) return null;
    const first = arrow(s, ds, e, de, "light");
    const body = first.pts.slice(2, -1).map((p) => ({ left: p.x - 2, top: p.y - 2, right: p.x + 2, bottom: p.y + 2 }));
    if (body.some((b) => block.some((o) => hits(b, o, PAD - 2)))) return null;
    return { left, top, mode, ring, arrow: arrow(s, ds, e, de, tone(first.pts)).a };
  };
  const right = { x: 1, y: 0 }, up = { x: 0, y: -1 };
  if (mobile) {
    if (visible(panel)) return null;
    if (visible(teaser)) {
      const r = teaser.getBoundingClientRect(), e = { x: r.left + r.width * 0.7, y: r.top - 4 };
      for (const lift of [40, 54, 70, 88]) for (const left of [EDGE + 4, EDGE + 16]) {
        const top = r.top - lift - h, s = { x: left + w + 4, y: top + h * 0.5 };
        if (s.x > e.x - 14) continue;
        const p = attempt(left, top, s, right, e, norm(0.35, 1), "teaser", visible(launcher) ? launcher.getBoundingClientRect() : null);
        if (p) return p;
      }
    }
    if (visible(launcher)) {
      const r = launcher.getBoundingClientRect(), e = { x: r.left + 6, y: r.top + 4 };
      for (const lift of [30, 48, 64]) for (const dx of [50, 70]) {
        const left = r.left - dx - w, top = r.top - lift - h * 0.5, s = { x: left + w + 4, y: top + h * 0.5 };
        const p = attempt(left, top, s, right, e, norm(0.6, 0.8), "launcher", r);
        if (p) return p;
      }
    }
    return null;
  }
  if (visible(panel)) {
    // Card in the clear space left of the panel's lower half (below the hero collage); a short, mostly
    // horizontal arrow runs right from the card and ends with its tip on the panel's left edge, aimed up
    // slightly toward the starter questions / input.
    const r = panel.getBoundingClientRect();
    let aim = r.top + r.height * 0.6;
    try {
      const d = (panel as HTMLIFrameElement).contentDocument;
      const ta = d?.querySelector("textarea"), chips = d ? Array.from(d.querySelectorAll("button")).filter((b) => b.getBoundingClientRect().top > (ta?.getBoundingClientRect().bottom ?? 0)) : [];
      const last = chips.map((b) => b.getBoundingClientRect().bottom).filter((y) => y < r.height - 60);
      if (last.length) aim = r.top + Math.max(...last) - 12; else if (ta) aim = r.top + ta.getBoundingClientRect().bottom;
    } catch { /* cross-origin: keep the estimate */ }
    const under = Math.max(...block.filter((o) => o.right > r.left - w - 120 && o.left < r.left && o.top < r.bottom).map((o) => o.bottom), r.top + r.height * 0.45) + PAD + 2;
    for (let top = under; top + h <= H - EDGE && top + h * 0.5 <= r.bottom + 30; top += 6) for (const gap of [96, 112, 84, 130]) {
      const left = r.left - gap - w, s = { x: left + w + 6, y: top + h * 0.5 };
      const e = { x: r.left - 1, y: Math.min(Math.max(s.y - clamp(s.y - (aim + 30), 16, 30), under), r.bottom - 24) }; // tip on the panel edge, a gentle 16-30px rise
      const rise = (e.y - s.y) / (e.x - s.x);
      const p = attempt(left, top, s, right, e, norm(1, rise * 1.2), "panel", null);
      if (p) return p;
    }
    return null;
  }
  if (visible(launcher)) {
    const r = launcher.getBoundingClientRect(), e = { x: r.left - 7, y: r.top + r.height * 0.5 };
    for (const dx of [96, 116, 136]) for (const lift of [80, 104, 128]) {
      const left = r.left - dx - w, top = r.top - lift, s = { x: left + w + 4, y: top + h * 0.5 };
      const p = attempt(left, top, s, right, e, norm(1, 0.55), "launcher", r);
      if (p) return p;
    }
  }
  return null;
}

export function ChatCallout() {
  const card = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true); // read sessionStorage after mount
  const [mobile, setMobile] = useState(false);
  const [pos, setPos] = useState<Place | null>(null);
  const last = useRef("");

  useEffect(() => {
    setMounted(true);
    try { setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1"); } catch { setDismissed(false); }
  }, []);

  const measure = useCallback(() => {
    const m = window.matchMedia("(max-width: 640px)").matches;
    setMobile(m);
    const el = card.current;
    // Desktop: only while the hero is in view. Mobile: the obstacle checks keep it off the hero content.
    const p = el && (m || window.scrollY < 320) ? place(el.offsetWidth, el.offsetHeight, m) : null;
    const k = p ? `${Math.round(p.left)},${Math.round(p.top)},${p.mode},${p.arrow.d},${p.arrow.tone}` : "";
    if (k !== last.current) { last.current = k; setPos(p); }
  }, []);

  useEffect(() => {
    if (!mounted || dismissed) return;
    let raf = 0;
    const tick = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    tick();
    const iv = window.setInterval(tick, 1000); // fallback if an older waylo.js is cached and doesn't emit waylo:state
    window.addEventListener("resize", tick); window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("waylo:state", tick);
    const mo = new MutationObserver(tick); mo.observe(document.body, { childList: true, attributes: true, attributeFilter: ["style"] });
    return () => { cancelAnimationFrame(raf); clearInterval(iv); window.removeEventListener("resize", tick); window.removeEventListener("scroll", tick); window.removeEventListener("waylo:state", tick); mo.disconnect(); };
  }, [mounted, dismissed, measure]);

  const dismiss = () => { setDismissed(true); try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* private mode */ } };

  const openChat = () => {
    const w = window as unknown as { Waylo?: { open?: (opts?: { focus?: boolean }) => void } };
    if (w.Waylo && typeof w.Waylo.open === "function") w.Waylo.open({ focus: true });
    else (launcherEl() as HTMLButtonElement | null)?.click();
    window.setTimeout(measure, 50);
  };

  if (!mounted || dismissed) return null;
  const a = pos?.arrow;
  // Portaled to <body>: the hero column has a transform, which would trap position:fixed.
  return createPortal(
    <div className="mk">
      {pos?.ring && <span key={`ring-${pos.mode}`} aria-hidden="true" className="w-cc-ring" style={{ left: pos.ring.left, top: pos.ring.top, width: pos.ring.right - pos.ring.left, height: pos.ring.bottom - pos.ring.top }} />}
      {a && <svg key={`arrow-${pos.mode}`} aria-hidden="true" focusable="false" className={`w-cc-arrow w-cc-${a.tone}`} width="100%" height="100%" style={{ ["--nx" as string]: a.nx, ["--ny" as string]: a.ny }}>
        <g className="w-cc-nudge">
          {a.tone === "rasp" && <><path d={a.d} className="w-cc-halo" pathLength={1} /><path d={a.head} className="w-cc-halo w-cc-head" /></>}
          <path d={a.d} className="w-cc-line" pathLength={1} />
          <path d={a.head} className="w-cc-head" />
        </g>
      </svg>}
      <div ref={card} className={`w-cc ${mobile ? "w-cc-sm" : ""}`} data-waylo-callout="" data-mode={pos?.mode}
        style={pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, visibility: "hidden" }}
        onKeyDown={(e) => { if (e.key === "Escape") dismiss(); }}>
        <div key={pos ? pos.mode : "x"} className={pos ? "w-cc-in" : ""}>
          <button type="button" className="w-cc-main" onClick={openChat} aria-label="This is Waylo. Open the chat and ask it anything about our product.">
            <span className="w-cc-eyebrow"><span className="w-cc-dot" aria-hidden="true" />Live on this page</span>
            <span className="w-cc-title">This is Waylo. Try it now.</span>
            {!mobile && <span className="w-cc-line-text">Ask it anything about our product.</span>}
          </button>
          <button type="button" className="w-cc-x" onClick={dismiss} aria-label="Dismiss the chat tip">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 12 12" width="10" height="10"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
