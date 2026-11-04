// Built-in knowledge for the /demo Acme Co site (embed data-site="acme-demo").
// Mirrors copy in src/app/demo/[[...slug]]/page.tsx — keep in sync.
import type { KPage } from "./knowledge";
export const DEMO_SITE = "acme-demo";
export const isDemoSite = (s: unknown) => s === DEMO_SITE;
export const ACME: KPage[] = [
  { title: "Acme Pricing", url: "/demo/pricing", keywords: /\b(price|pricing|cost|plan|plans|free|quote|how much|starter|pro|enterprise|seat|seats|contract|annual|setup fee|prorat\w*)\b/i,
    summary: "Acme is priced per technician; office seats are free. **Starter** — $0 for up to 2 techs (scheduling board, customer SMS 200/mo, mobile app). **Pro** — $29 per tech / month (everything in Starter, unlimited SMS, invoicing & card payments, QuickBooks / Xero sync, maintenance plans). **Enterprise** — custom pricing for 30+ techs or multi-branch (everything in Pro, multi-location dispatch, SSO & audit log, dedicated onboarding). Annual billing saves two months; monthly plans cancel anytime; plan switches prorate to the day; no setup fees on Starter or Pro." },
  { title: "Acme Features", url: "/demo/features", keywords: /\b(feature\w*|schedul\w*|dispatch\w*|board|app|mobile|offline|ios|android|invoic\w*|quickbooks|xero|integrat\w*|price book|maintenance|uptime|sla|permission\w*|roles?|sync|sms|text\w*)\b/i,
    summary: "Acme covers scheduling, dispatch, field app, and billing for shops with 3 to 60 technicians: a scheduling board (color by job type, filter by zone, per-tech timelines, recurring maintenance agreements), an iOS/Android field app with offline notes, photos, checklists and signatures, realtime sync, QuickBooks & Xero sync, flat-rate price book (good/better/best), maintenance plans, 99.9% uptime SLA with daily backups, and office/dispatcher/tech roles. Customers get arrival windows, “on my way” and invoice links by SMS, and techs can take card payment on site." },
  { title: "About Acme", url: "/demo", keywords: /\b(what is acme|acme|about|who|hvac|plumb\w*|electric\w*|results?|calls?|faster)\b/i,
    summary: "Acme Co is field service scheduling software for HVAC, plumbing & electrical shops — jobs, techs, and customer texts on one board. Shops see 38% fewer “where’s my tech?” calls, 2.1 days faster average payment, and an 11 min median time to plan a 15-job day." },
  { title: "Acme Customers", url: "/demo/case-studies", keywords: /\b(customer\w*|case stud\w*|northwind|globex|rivera|bluebird|reference\w*|who uses|examples?)\b/i,
    summary: "1,400+ HVAC, plumbing, and electrical companies use Acme. Northwind Plumbing (22 techs) cut new-tech onboarding time 40%. Globex Electric rolled out to 3,000 seats across 41 branches in two weeks (Enterprise). Rivera Heating cut unpaid invoices over 30 days from $48k to $9k (Pro). Bluebird HVAC added a second shift without hiring another dispatcher (Pro)." },
  { title: "Contact Acme", url: "/demo/contact", keywords: /\b(contact|sales|support|email|phone|call|demo|walkthrough|office|address|hours|talk)\b/i,
    summary: "Sales: sales@acme.example · (555) 010-2290. Support: Mon–Fri, 6am–6pm PT · support@acme.example. Office: 1200 Market St, Suite 400, Denver, CO. Walkthroughs are 30 minutes, on your own job list." },
];
export const findAcme = (text: string, max = 3) => ACME.filter((k) => k.keywords.test(text)).slice(0, max);

/** Widget chrome for /demo — never use Waylo default branding. */
export const DEMO_BRANDING = {
  botName: "Acme",
  accent: "#1d4ed8",
  greeting: "Hi! Ask me anything about Acme — pricing, features, or how shops use us.",
  published: true,
  siteName: "Acme Co",
};
