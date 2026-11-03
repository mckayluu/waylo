"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Dogfood: load the Waylo launcher on public pages (same-origin), never on admin/widget/api/demo.
const hidden = (p: string) => /^\/(admin|widget|api|demo)(\/|$)/.test(p);
export default function WayloEmbed() {
  const p = usePathname() || "/";
  useEffect(() => {
    const w = window as unknown as { __waylo?: boolean };
    if (hidden(p) || w.__waylo) return;
    const s = document.createElement("script");
    s.src = "/waylo.js"; s.async = true; s.dataset.site = "waylo"; s.dataset.mode = "launcher";
    document.body.appendChild(s);
  }, [p]);
  useEffect(() => { // hide launcher if client-navigating into admin
    document.querySelectorAll<HTMLElement>('iframe[title="Waylo chat"], button[aria-label="Chat with us"]').forEach((el) => {
      if (el.tagName === "BUTTON") el.style.visibility = hidden(p) ? "hidden" : "visible"; else if (hidden(p)) el.style.display = "none";
    });
  }, [p]);
  return null;
}
