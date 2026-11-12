import fs from "node:fs";
import path from "node:path";
// Product tour steps. Live-app captures go in /public/tour/<file>; until a file exists the step
// falls back to an existing real product screenshot in /public/product/. Resolved at build time.
export type TourStep = { id: string; title: string; caption: string; src: string; alt: string; w: number; h: number; href?: string; pending: boolean };
const STEPS: { file: string; title: string; caption: string; alt: string; fallback?: [string, number, number]; href?: string }[] = [
  { file: "01-signup.webp", title: "Create your workspace", caption: "Company name, work email, password. You’re the Owner. The Trial gives you 500 AI messages with no card.", alt: "Waylo signup form: company name, website, work email, password", fallback: ["/product/signup.webp", 1440, 900], href: "/signup" },
  { file: "02-add-site-crawl.webp", title: "Add your site and crawl it", caption: "Paste your domain in Content. Waylo reads your public pages in the background, starting from your sitemap, and lists every page it kept.", alt: "Waylo Content view with the crawl box and the list of indexed pages", fallback: ["/product/admin-content.webp", 1440, 900], href: "/product/ai-chat" },
  { file: "03-branding.webp", title: "Name it, color it, guide it", caption: "Assistant name, accent color, and greeting in Settings. Facts, rules, and skills in Guidance for what your pages don’t say.", alt: "Waylo Settings with workspace, website, company profile and branding", fallback: ["/product/admin-settings.webp", 1440, 900], href: "/product/branding" },
  { file: "04-install-snippet.webp", title: "Add Waylo to your site", caption: "Copy your snippet from Install and paste it before </body> or in Google Tag Manager. Launcher, sidebar, or data-mode=\"track\".", alt: "Waylo Install page with the copy-paste script tag", fallback: ["/product/admin-install.webp", 1440, 900], href: "/product/install" },
  { file: "05-live-chat-cited.webp", title: "Visitors get cited answers", caption: "Answers come only from your pages and guidance, with source chips that link the page used. No match means “I don’t know,” not a guess.", alt: "Waylo AI Chat page with the live preview answering a pricing question with a source chip", fallback: ["/product/demo-northpoint-answer.webp", 1920, 1072], href: "/product/citations" },
  { file: "06-dashboard-questions-leads.webp", title: "See questions, leads and journeys", caption: "Questions, leads and visitor journeys show up here as people use the chat. This is a fresh test workspace, so the counts are small.", alt: "Waylo Home dashboard for a test workspace: setup checklist, conversation and question counts, and workspace status", fallback: ["/product/admin-conv.webp", 1440, 900], href: "/product/analytics" },
  { file: "07-slack-routing.webp", title: "Route serious visitors to Slack", caption: "On any plan, paste a Slack incoming webhook and pick events. High-intent visitors, contact forms, and “talk to a person” requests post with a link to the conversation.", alt: "Waylo Integrations page with Slack webhook, CRM webhook and notification settings", fallback: ["/product/admin-integrations.webp", 1440, 900], href: "/product/slack-routing" },
  { file: "08-trial.webp", title: "Publish on the Trial, upgrade when it earns", caption: "Publishing needs a Trial or plan. Starter is $79/mo and Growth $249/mo through Stripe Checkout (test mode during early access).", alt: "Waylo Billing page with Trial, Starter and Growth plans", fallback: ["/product/admin-billing.webp", 1440, 900], href: "/pricing" },
];
function size(file: string): [number, number] | null {
  if (file.endsWith(".webp")) return fs.existsSync(file) ? [1600, 893] : null; // optimized tour captures are all 1600×893
  try { const b = fs.readFileSync(file); if (b.toString("ascii", 1, 4) === "PNG") return [b.readUInt32BE(16), b.readUInt32BE(20)]; } catch {}
  return null;
}
export function tourSteps(): TourStep[] {
  const dir = path.join(process.cwd(), "public", "tour");
  return STEPS.flatMap((s, i): TourStep[] => {
    const real = size(path.join(dir, s.file));
    const id = s.file.replace(/\.(png|webp)$/, "");
    if (real) return [{ id, title: s.title, caption: s.caption, alt: s.alt, href: s.href, src: `/tour/${s.file}`, w: real[0], h: real[1], pending: false }];
    if (!s.fallback) return [];
    const [src, w, h] = s.fallback; void i;
    return [{ id, title: s.title, caption: s.caption, alt: s.alt, href: s.href, src, w, h, pending: true }];
  });
}
export const tourVideo = () => fs.existsSync(path.join(process.cwd(), "public", "tour", "tour.mp4")) ? { src: "/tour/tour.mp4", poster: "/tour/tour-poster.webp" } : null;
