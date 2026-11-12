"use client";
// Homepage-only tooltip that points visitors at the live Waylo chat.
// It docks to the widget's real DOM (public/waylo.js):
//   open panel -> iframe[title="Waylo chat"] (display:block): card sits left of the panel, caret on its right edge
//   closed     -> button[aria-label="Chat with us"][data-waylo-ui]: card sits above-left of the launcher, caret down
//   mobile     -> div[data-waylo-ui][role="dialog"] (the teaser) or the launcher; hidden once the panel is open
// It never covers the hero copy, buttons or illustration cards (on desktop, the whole photo collage);
// if no spot is clear, it stays hidden.
// Clicking the card calls window.Waylo.open() (fallback: click the launcher). Dismissal lives in sessionStorage.
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DISMISS_KEY = "waylo_callout_dismissed";
const PANEL = 'iframe[title="Waylo chat"]';
const LAUNCHER = 'button[aria-label="Chat with us"][data-waylo-ui]';
const TEASER = 'div[data-waylo-ui][role="dialog"]';
const GAP = 10; // space between the caret tip and the widget
const EDGE = 12; // keep clear of the viewport edge

type Box = { left: number; top: number; right: number; bottom: number };
type Place = { left: number; top: number; side: "right" | "bottom"; caret: number; mode: string };

const visible = (el: Element | null): el is HTMLElement => {
  if (!el) return false;
  const s = getComputedStyle(el as HTMLElement); const r = el.getBoundingClientRect();
  return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
};
const hits = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Hero text, buttons and cards the tooltip must never sit on.
function obstacles(mobile: boolean): Box[] {
  const fig = document.querySelector("#product figure");
  const hero = fig?.closest("section") || document.querySelector("main section");
  if (!hero) return [];
  const els = Array.from(hero.querySelectorAll("h1, p, a, figcaption, [role=img]"));
  // Desktop keeps off the whole collage. On a phone the collage fills the screen, so only its text cards
  // and caption count; the stock photo behind them may sit under the tooltip.
  if (fig && !mobile) els.push(fig);
  return els.filter(visible).map((e) => e.getBoundingClientRect());
}

// Same-origin input position inside the chat iframe, so the caret can line up with it.
function inputY(panel: HTMLElement): number {
  const r = panel.getBoundingClientRect();
  try {
    const ta = (panel as HTMLIFrameElement).contentDocument?.querySelector("textarea");
    if (ta) { const t = ta.getBoundingClientRect(); if (t.height) return r.top + t.top + t.height / 2; }
  } catch { /* cross-origin embed */ }
  return r.top + r.height * 0.37;
}

function place(w: number, h: number, mobile: boolean): Place | null {
  const W = window.innerWidth, H = window.innerHeight;
  const panel = document.querySelector(PANEL), launcher = document.querySelector(LAUNCHER), teaser = document.querySelector(TEASER);
  const block = obstacles(mobile);
  const ok = (p: Place) => {
    const b = { left: p.left, top: p.top, right: p.left + w, bottom: p.top + h };
    return b.left >= EDGE && b.top >= EDGE && b.right <= W - EDGE && b.bottom <= H - EDGE && !block.some((o) => hits(b, o));
  };
  const above = (r: DOMRect, aimX: number, mode: string): Place => {
    const left = clamp(aimX + 22 - w, EDGE, W - EDGE - w); // caret 22px in from the card's right edge
    return { left, top: r.top - GAP - h, side: "bottom", caret: clamp(aimX - left, 24, w - 24), mode };
  };
  const beside = (r: DOMRect, aimY: number, mode: string, minTop = -Infinity): Place => {
    const top = clamp(Math.max(aimY - h / 2, minTop), EDGE, H - EDGE - h);
    return { left: r.left - GAP - w, top, side: "right", caret: clamp(aimY - top, 24, h - 24), mode };
  };
  if (mobile) {
    if (visible(panel)) return null;
    const c: Place[] = [];
    if (visible(teaser)) { const r = teaser.getBoundingClientRect(); c.push(above(r, r.right - 40, "teaser")); }
    if (visible(launcher)) { const r = launcher.getBoundingClientRect(); c.push(beside(r, r.top + r.height / 2, "launcher-side"), above(r, r.left + r.width / 2, "launcher")); }
    return c.find(ok) || null;
  }
  if (visible(panel)) {
    const r = panel.getBoundingClientRect(), y = inputY(panel);
    const first = beside(r, y, "panel");
    if (ok(first)) return first;
    // The hero collage sits beside the panel at most widths: drop below it, caret still on the panel edge.
    const under = Math.max(...block.filter((o) => o.right > r.left - GAP - w && o.left < r.left).map((o) => o.bottom), -Infinity) + 14;
    const second = beside(r, Math.max(y, under + 18), "panel", under);
    return ok(second) ? second : null;
  }
  if (visible(launcher)) { const r = launcher.getBoundingClientRect(); const p = above(r, r.left + r.width / 2, "launcher"); return ok(p) ? p : null; }
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
    // Desktop: only while the hero is on screen. Mobile: the obstacle check already keeps it off the hero.
    const p = el && (m || window.scrollY < 320) ? place(el.offsetWidth, el.offsetHeight, m) : null;
    const k = p ? `${Math.round(p.left)},${Math.round(p.top)},${p.side},${Math.round(p.caret)},${p.mode}` : "";
    if (k !== last.current) { last.current = k; setPos(p); }
  }, []);

  useEffect(() => {
    if (!mounted || dismissed) return;
    let raf = 0;
    const tick = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    tick();
    const iv = window.setInterval(tick, 400); // the widget mounts and auto-opens on its own clock and sends no events
    window.addEventListener("resize", tick); window.addEventListener("scroll", tick, { passive: true });
    const mo = new MutationObserver(tick); mo.observe(document.body, { childList: true, attributes: true, attributeFilter: ["style"] });
    return () => { cancelAnimationFrame(raf); clearInterval(iv); window.removeEventListener("resize", tick); window.removeEventListener("scroll", tick); mo.disconnect(); };
  }, [mounted, dismissed, measure]);

  const dismiss = () => { setDismissed(true); try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* private mode */ } };

  const openChat = () => {
    const w = window as unknown as { Waylo?: { open?: () => void } };
    if (w.Waylo && typeof w.Waylo.open === "function") w.Waylo.open();
    else (document.querySelector(LAUNCHER) as HTMLButtonElement | null)?.click();
    window.setTimeout(measure, 50);
    // TEMPORARY until the widget focus fix lands: waylo.js posts "waylo:opened", but the widget's
    // focusInput() checks (min-width: 641px) inside the 400px iframe, so it never focuses. The iframe is
    // same-origin, so focus its textarea directly. Skipped on touch screens so the keyboard doesn't pop up
    // (matches the widget's own mobile rule). Remove once Waylo.open() focuses the input itself.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let n = 0;
    const tryFocus = () => {
      const f = document.querySelector(PANEL) as HTMLIFrameElement | null;
      try {
        const ta = f?.contentDocument?.querySelector("textarea") as HTMLTextAreaElement | null;
        if (f && ta) { f.focus(); ta.focus(); return; }
      } catch { return; } // cross-origin embed: leave it to the widget
      if (++n < 30) window.setTimeout(tryFocus, 100);
    };
    tryFocus();
  };

  if (!mounted || dismissed) return null;
  // Portaled to <body>: the hero column has a transform, which would trap position:fixed.
  return createPortal(
    <div className="mk">
      <div ref={card} className={`w-cc ${mobile ? "w-cc-sm" : ""}`} data-side={pos?.side} data-waylo-callout=""
        style={pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, visibility: "hidden" }}
        onKeyDown={(e) => { if (e.key === "Escape") dismiss(); }}>
        <div key={pos ? `${pos.mode}` : "x"} className={pos ? "w-cc-in" : ""}>
          <button type="button" className="w-cc-main" onClick={openChat} aria-label="This is Waylo. Open the chat and ask it anything about our product.">
            <span className="w-cc-eyebrow"><span className="w-cc-dot" aria-hidden="true" />Live on this page</span>
            <span className="w-cc-title">This is Waylo. Try it now.</span>
            {!mobile && <span className="w-cc-line">Ask it anything about our product.</span>}
          </button>
          <button type="button" className="w-cc-x" onClick={dismiss} aria-label="Dismiss the chat tip">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 12 12" width="10" height="10"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          {pos && <span aria-hidden="true" className="w-cc-caret" style={pos.side === "right" ? { top: pos.caret } : { left: pos.caret }} />}
        </div>
      </div>
    </div>,
    document.body,
  );
}
