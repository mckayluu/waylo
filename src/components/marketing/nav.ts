export type Tone = "teal" | "amber" | "indigo";
export type NavItem = { label: string; href: string; desc: string; icon: string; t: Tone };
export type NavGroup = { id: string; label: string; href: string; blurb: string; items: NavItem[]; feature?: { title: string; body: string; href: string; cta: string; img: string } };
export const NAV: NavGroup[] = [
  { id: "product", label: "Product", href: "/features", blurb: "Website chat that links its sources and sends serious leads to sales.", items: [
    { label: "Cited answers", href: "/features#answers", desc: "Every reply links the pages it used", icon: "💬", t: "teal" },
    { label: "Knowledge & crawl", href: "/features#knowledge", desc: "Crawl your site, add facts and rules", icon: "🗂", t: "indigo" },
    { label: "Intent signals", href: "/features#signals", desc: "Pricing, demo, security, integration intent", icon: "📈", t: "amber" },
    { label: "Lead handoff", href: "/features#handoff", desc: "Slack alerts and CRM webhooks", icon: "🤝", t: "teal" },
    { label: "Control & guidance", href: "/features#control", desc: "Voice, skills, roles, brand color", icon: "🎛", t: "indigo" },
    { label: "Embed modes", href: "/docs/embed-modes", desc: "Launcher, sidebar, or track-only", icon: "🧩", t: "amber" },
  ], feature: { title: "Try the live demo", body: "Ask a real question and watch the cited answer and signal appear.", href: "/demo", cta: "Open demo", img: "/marketing/laptop.webp" } },
  { id: "solutions", label: "Solutions", href: "/use-cases", blurb: "How marketing, sales, SaaS, and agency teams set Waylo up.", items: [
    { label: "Marketing teams", href: "/solutions/marketing", desc: "See which questions come before a demo", icon: "📣", t: "teal" },
    { label: "Sales teams", href: "/solutions/sales", desc: "Slack alerts on pricing and demo interest", icon: "🎯", t: "amber" },
    { label: "SaaS & docs", href: "/solutions/saas", desc: "Cited answers from docs and pricing", icon: "🧪", t: "indigo" },
    { label: "SaaS pre-sales → Slack", href: "/use-cases/saas-presales-slack", desc: "Cited answers, then a rep in Slack", icon: "#", t: "amber" },
    { label: "Agencies", href: "/solutions/agencies", desc: "Cited chat across client sites", icon: "🏢", t: "teal" },
    { label: "All use cases", href: "/use-cases", desc: "Compare every team side by side", icon: "↗", t: "amber" },
  ], feature: { title: "Sales handoff in minutes", body: "Reps open Slack to a lead that already asked about pricing — transcript included.", href: "/solutions/sales", cta: "See how", img: "/marketing/meeting.webp" } },
  { id: "resources", label: "Resources", href: "/resources", blurb: "Docs, setup guides, and answers for evaluating and running Waylo.", items: [
    { label: "Resources hub", href: "/resources", desc: "Everything in one place", icon: "📚", t: "indigo" },
    { label: "Documentation", href: "/docs", desc: "How every feature works", icon: "📘", t: "teal" },
    { label: "Install guide", href: "/docs/install", desc: "One script tag, live in minutes", icon: "⚡", t: "amber" },
    { label: "JavaScript API", href: "/docs/install#api", desc: "Open chat from your own buttons", icon: "</>", t: "indigo" },
    { label: "FAQ", href: "/faq", desc: "Accuracy, data, pricing, rollout", icon: "❓", t: "teal" },
  ], feature: { title: "Install in one line", body: "Paste the snippet before </body> — works on Webflow, WordPress, Shopify, and GTM.", href: "/docs/install", cta: "Install guide", img: "/marketing/dashboard.webp" } },
];
