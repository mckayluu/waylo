// Mock knowledge base. Later: replace with site crawl + embeddings (RAG).
import type { Citation } from "./store";
export type KPage = Citation & { keywords: RegExp; summary: string };
export const KNOWLEDGE: KPage[] = [
  { title: "Pricing & Plans", url: "/docs/pricing", keywords: /\b(price|pricing|cost|plan|plans|free|quote|how much)\b/i,
    summary: "Waylo has three self-serve plans with unlimited seats: **Trial** — $0 for 14 days, no card (1 site, 100 pages, 500 AI replies); **Starter** — $79/mo (1 site, 500 pages, 3,000 AI replies/mo, Slack + CRM webhooks, guidance, daily re-crawl); **Growth** — $249/mo (3 sites, 2,000 pages, 15,000 AI replies/mo, Audiences). Upgrade, switch or cancel any time in Billing. No overage charges: at the limit, chat falls back to your contact form." },
  { title: "Try Waylo", url: "/signup", keywords: /\b(demo|walkthrough|trial|try|call|meeting|sales|sign ?up|get started)\b/i,
    summary: "Waylo is fully self-serve: paste your website URL on the homepage to chat with your own site in about a minute, or **start the free 14-day trial** at /signup (no card). The live demo at /demo shows a finished install. There are no sales calls." },
  { title: "Installing the Sidebar", url: "/docs/install", keywords: /\b(install|embed|iframe|snippet|setup|set up|website|add)\b/i,
    summary: "Install Waylo by pasting one **iframe snippet** before `</body>`. It docks as a full-height sidebar on the right of your site." },
  { title: "Integrations", url: "/docs/integrations", keywords: /\b(integrat\w*|api|crm|hubspot|salesforce|zapier|webhook)\b/i,
    summary: "Waylo exports leads and conversations via **webhooks** and CSV. Native CRM sync is on the roadmap." },
  { title: "Security & Privacy", url: "/docs/security", keywords: /\b(security|sso|privacy|gdpr|soc ?2|data|compliance)\b/i,
    summary: "Conversations are stored per-workspace and visitors must consent before leaving contact details. Security details are on the /security page." },
  { title: "How Waylo Answers", url: "/docs/how-it-works", keywords: /\b(how|work|ai|answer|knowledge|train|learn|what is waylo)\b/i,
    summary: "Waylo answers from your site's content and shows **numbered citations** so visitors can check sources. It also flags buying signals for your team." },
];
export function findRelevant(text: string, max = 3): KPage[] {
  return KNOWLEDGE.filter((k) => k.keywords.test(text)).slice(0, max);
}
export function knowledgePrompt() {
  return KNOWLEDGE.map((k, i) => `[${i + 1}] ${k.title} (${k.url}): ${k.summary}`).join("\n");
}
