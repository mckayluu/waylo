import Image from "next/image";
// Real product screenshots. Admin shots were captured from a local Waylo build with
// sample data (anonymous/sample visitors, our own site crawled); demo-site shots are the public /demo page (Northpoint Ops).
export const SHOTS = {
  answer: { src: "/product/demo-northpoint-answer.webp", w: 1920, h: 1072, where: "waylo-j5hv.onrender.com/demo", alt: "Waylo chat on the Northpoint Ops demo site answering “Do you sync with QuickBooks?” with a numbered source chip for the Features page", caption: "Live /demo: Northpoint Ops is a sample company. The answer comes from its Features page and links it." },
  widget: { src: "/product/widget-answer.webp", w: 406, h: 648, where: "Chat widget", alt: "Close-up of the Waylo chat widget: AI Chat and Contact tabs, a cited answer with a source chip, Copy, Regenerate, thumbs feedback, and Talk to a person", caption: "The widget: a cited answer with its source chip, Copy, Regenerate, 👍/👎 and “Talk to a person”." },
  demoHome: { src: "/product/demo-northpoint-home.webp", w: 1920, h: 1072, where: "waylo-j5hv.onrender.com/demo", alt: "Northpoint Ops demo site with the Waylo chat open on its start screen: “What can I help you find?” and four suggested questions", caption: "What visitors see: the chat opens with a few suggested questions they can tap." },
  demoPricing: { src: "/product/demo-northpoint-pricing.webp", w: 1920, h: 1072, where: "waylo-j5hv.onrender.com/demo/pricing", alt: "Northpoint Ops demo pricing page with the Waylo chat answering “How much is Pro per tech?” and citing the pricing page", caption: "On the pricing page, the answer links the page it came from so visitors can check." },
  home: { src: "/product/admin-home.webp", w: 1440, h: 900, where: "Admin → Home", alt: "Waylo admin home with the go-live checklist, conversation, question, contact form and high-intent counts, and a 14-day questions chart", caption: "Admin home: go-live checklist, today’s numbers, questions over 14 days." },
  tracking: { src: "/product/admin-tracking.webp", w: 1440, h: 900, where: "Admin → Tracking → visitor", alt: "Visitor journey in the Waylo admin showing pageviews, referrer and questions in order", caption: "Visitor journey: pages, referrer, and questions in the order they happened." },
  content: { src: "/product/admin-content.webp", w: 1440, h: 900, where: "Admin → Content", alt: "Waylo admin Content view listing crawled pages with how often each was cited", caption: "Content: every crawled page, its text preview, and how often answers cited it." },
  guidance: { src: "/product/admin-guidance.webp", w: 1440, h: 900, where: "Admin → Guidance", alt: "Waylo admin Guidance view with Facts, Rules and Skills tabs", caption: "Guidance: facts win over page text, rules are hard limits, skills are playbooks." },
  integrations: { src: "/product/admin-integrations.webp", w: 1440, h: 900, where: "Admin → Integrations", alt: "Waylo admin Integrations view with Slack and JSON webhook URLs, event toggles and recent deliveries", caption: "Integrations: Slack webhook, JSON webhook, which events fire, and a delivery log. (URLs blurred.)" },
  install: { src: "/product/admin-install.webp", w: 1440, h: 900, where: "Admin → Install", alt: "Waylo admin Install view with the copy-paste script tag and verify checks", caption: "Install: the exact script tag for your workspace and checks that it’s live." },
  settings: { src: "/product/admin-settings.webp", w: 1440, h: 900, where: "Admin → Settings", alt: "Waylo admin Settings view with workspace name, website URL, company profile and allowed embed origins", caption: "Settings: site URL, company profile, allowed embed origins, publish toggle." },
} as const;
export type ShotKey = keyof typeof SHOTS;
export function Shot({ k, className = "", crop, priority }: { k: ShotKey; className?: string; crop?: string; priority?: boolean }) {
  const s = SHOTS[k];
  return <figure className={`overflow-hidden rounded-md bg-white ring-1 ring-warm-200 shadow-lg shadow-navy-950/5 ${className}`}>
    <div className="flex items-center gap-1.5 border-b border-warm-200 bg-warm-100 px-3 py-2"><span className="h-2 w-2 rounded-full bg-warm-300" /><span className="h-2 w-2 rounded-full bg-warm-300" /><span className="h-2 w-2 rounded-full bg-warm-300" /><span className="ml-2 truncate text-[11px] text-warm-500">{s.where}</span></div>
    <Image src={s.src} alt={s.alt} width={s.w} height={s.h} priority={priority} sizes="(min-width:1024px) 640px, 100vw" className={crop ? `w-full object-cover object-left-top ${crop}` : "h-auto w-full"} />
    <figcaption className="border-t border-warm-200 px-3 py-2 text-xs leading-5 text-warm-500">{s.caption}</figcaption>
  </figure>;
}
export function ShotNote() {
  return <p className="mt-3 text-xs text-warm-500">Screenshots are the real product. Admin views use sample data (anonymous test visitors, Waylo’s own site crawled); Northpoint Ops is the sample company on <a href="/demo" className="text-navy-700 underline">/demo</a>.</p>;
}
