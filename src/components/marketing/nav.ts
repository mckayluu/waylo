export type Tone = "teal" | "amber" | "indigo";
export type NavItem = { label: string; href: string; desc: string; icon: string; t: Tone };
export type NavGroup = { id: string; label: string; href: string; blurb: string; items: NavItem[]; feature?: { title: string; body: string; href: string; cta: string; img: string } };
export const NAV: NavGroup[] = [
  { id: "product", label: "Product", href: "/features", blurb: "Website chat that links its sources and tells sales who is serious.", items: [
    { label: "AI chat on your site", href: "/product/ai-chat", desc: "Answers only from your pages", icon: "💬", t: "teal" },
    { label: "Citations and sources", href: "/product/citations", desc: "Every reply links its pages", icon: "¹", t: "indigo" },
    { label: "Lead capture", href: "/product/lead-capture", desc: "Contact, demo, talk to a person", icon: "✉", t: "amber" },
    { label: "Slack routing", href: "/product/slack-routing", desc: "High-intent visitors to a channel", icon: "#", t: "teal" },
    { label: "Analytics and signals", href: "/product/analytics", desc: "Questions, journeys, intent", icon: "📈", t: "amber" },
    { label: "Branding", href: "/product/branding", desc: "Name, color, greeting, voice", icon: "🎨", t: "indigo" },
    { label: "Install", href: "/product/install", desc: "One script tag, three modes", icon: "</>", t: "teal" },
    { label: "How it works", href: "/how-it-works", desc: "The eight setup screens, in order", icon: "↻", t: "indigo" },
    { label: "Integrations", href: "/integrations", desc: "Slack, JSON webhook, CMS, GTM", icon: "⇄", t: "amber" },
    { label: "Security and data", href: "/security", desc: "What’s stored and where", icon: "🔒", t: "teal" },
  ], feature: { title: "Try the live demo", body: "Ask the fictional Northpoint Ops site a question and see the cited answer.", href: "/demo", cta: "Open demo", img: "/marketing/laptop.webp" } },
  { id: "solutions", label: "Solutions", href: "/use-cases", blurb: "How different teams use Waylo.", items: [
    { label: "Marketing teams", href: "/solutions/marketing", desc: "See which questions come before a demo", icon: "📣", t: "teal" },
    { label: "Sales teams", href: "/solutions/sales", desc: "Slack alerts when a buyer looks ready", icon: "🎯", t: "amber" },
    { label: "SaaS and docs", href: "/solutions/saas", desc: "Cited answers from docs and pricing", icon: "🧪", t: "indigo" },
    { label: "SaaS pre-sales to Slack", href: "/use-cases/saas-presales-slack", desc: "Cited answers, then a rep in Slack", icon: "#", t: "amber" },
    { label: "Agencies", href: "/use-cases/agencies", desc: "A workspace per client site", icon: "🏢", t: "teal" },
    { label: "E-commerce", href: "/use-cases/ecommerce", desc: "Shipping, returns, sizing answers", icon: "🛒", t: "indigo" },
    { label: "B2B services", href: "/use-cases/b2b-services", desc: "Scope, process, and call requests", icon: "💼", t: "amber" },
    { label: "Support deflection", href: "/use-cases/support-deflection", desc: "Docs answers with the link", icon: "🛟", t: "teal" },
    { label: "Compare", href: "/compare", desc: "Waylo next to chatbots and live chat", icon: "⚖", t: "indigo" },
    { label: "All use cases", href: "/use-cases", desc: "Compare every team side by side", icon: "↗", t: "amber" },
  ], feature: { title: "Sales handoff in minutes", body: "Reps get a Slack post with the question and a link to the conversation.", href: "/solutions/sales", cta: "See how", img: "/marketing/meeting.webp" } },
  { id: "resources", label: "Resources", href: "/resources", blurb: "Docs, guides, and answers for trying and running Waylo.", items: [
    { label: "Resources hub", href: "/resources", desc: "Everything in one place", icon: "📚", t: "indigo" },
    { label: "Documentation", href: "/docs", desc: "How every feature works", icon: "📘", t: "teal" },
    { label: "Install guide", href: "/docs/install", desc: "One script tag", icon: "⚡", t: "amber" },
    { label: "JavaScript API", href: "/docs/install#api", desc: "Open chat from your own buttons", icon: "</>", t: "indigo" },
    { label: "FAQ", href: "/faq", desc: "Accuracy, data, and pricing", icon: "❓", t: "teal" },
    { label: "Make chat cite sources", href: "/resources/make-a-website-chatbot-cite-sources", desc: "Setup that holds up with buyers", icon: "¹", t: "teal" },
    { label: "Pre-sales question audit", href: "/resources/pre-sales-question-audit", desc: "Find what buyers ask first", icon: "?", t: "amber" },
    { label: "Pricing pages that answer", href: "/resources/pricing-pages-that-answer-questions", desc: "Limits, trials, and exclusions", icon: "$", t: "indigo" },
    { label: "Send leads to Slack", href: "/resources/route-website-leads-to-slack", desc: "No CRM project needed", icon: "#", t: "teal" },
    { label: "About", href: "/about", desc: "Who builds Waylo and why", icon: "👋", t: "amber" },
    { label: "Changelog", href: "/changelog", desc: "What shipped, by date", icon: "🗓", t: "indigo" },
  ], feature: { title: "Install in one line", body: "Paste the snippet before </body>. It works on Webflow, WordPress, Shopify, and GTM.", href: "/docs/install", cta: "Install guide", img: "/marketing/dashboard.webp" } },
];
