import type { InfoDef } from "./types";
export const HOW: InfoDef = { path: "/how-it-works", crumb: "How it works", eyebrow: "Product tour",
  title: "From signup to your first cited answer",
  sub: "Here are the eight real screens in order. You need your own pages and one script tag.",
  answer: "Create a workspace and crawl your site. Name the assistant, and add guidance where your pages miss something. Then paste one script tag. Visitors get answers from your pages with a link to the source. You read every question in the admin. On Starter and up, ready buyers also post to Slack.",
  metaTitle: "How Waylo works, step by step", metaDesc: "A screen-by-screen tour of Waylo. Create a workspace, crawl your site, brand the assistant, paste the script tag, and see cited answers, the admin, Slack routing, and the free Trial.",
  blocks: [
    { t: "prose", eyebrow: "Behind the answers", h: "How buying intent is detected", p: ["Waylo checks every visitor message for words about pricing, demos, buying, enterprise needs like SSO and compliance, integrations, and support. Two or more buying signals, or a ready-to-buy signal, make the conversation **high-intent**.", "Page views are recorded from the moment the script loads, so each signal comes with the path that led to it."] },
    { t: "slack", eyebrow: "Hand off", h: "What lands in Slack", p: ["On Starter and up, high-intent conversations and contact requests post to your channel. Each post has the visitor’s words and signals, with an **Open in Waylo** link.", "The Trial doesn’t send Slack or CRM alerts. You see the same signals in the admin."] },
    { t: "faq", items: [["How long does setup take?", "Most of it is reading. The crawl usually finishes in under a minute for a small site, and the install is one tag."], ["Do I need a developer?", "Only if you can’t add custom HTML to your site yourself. See the [install guide](/docs/install)."], ["What if it gets something wrong?", "Open the conversation, see which source it used, then fix the page or add a Fact in Guidance. The answer changes on the next question."]] }],
  related: [["AI chat", "/product/ai-chat", "Crawl and answers in detail."], ["Install guide", "/docs/install", "Every attribute, every CMS."], ["Pricing", "/pricing", "Trial $0, Starter $79, Growth $249."]] };

export const SECURITY: InfoDef = { path: "/security", crumb: "Security and data", eyebrow: "Security and data", hero: "settings",
  title: "What Waylo stores, where it goes, and who can see it",
  sub: "This page explains how Waylo handles data today. It also lists what we don’t have yet.",
  answer: "Waylo stores your crawled page text, guidance, conversations, journeys, leads, and settings in Postgres on Supabase, kept separate by workspace. The app is hosted on Render. Visitor messages and matching page text go to OpenAI’s API to write replies. Billing runs through Stripe and account email through Resend. Admin access uses hashed passwords, signed session cookies, and Owner, Editor, and Viewer roles. Waylo has no SSO, SOC 2 report, or DPA.",
  metaTitle: "Security and data handling", metaDesc: "How Waylo handles data. What’s stored, which subprocessors see it, workspace isolation, roles, rate limits, allowed origins, and what isn’t available.",
  blocks: [
    { t: "spec", eyebrow: "Data", h: "What’s stored", sub: "Per workspace. Other workspaces can’t read it.", rows: [
      ["Crawled pages", "URL, title, and readable text (up to 40,000 characters per page) of public pages you crawl."], ["Guidance", "Facts, rules, skills, and company profile you write."],
      ["Conversations", "Visitor and Waylo messages, sources, 👍/👎, signals, and any name or email the visitor gives."], ["Journeys", "Page path, title, referrer, and time for each page view, tied to a random visitor ID."],
      ["Leads and handoffs", "Name, email, message, consent, and status."], ["Account", "Member emails, roles, password hashes, billing status from Stripe."]] },
    { t: "table", eyebrow: "Subprocessors", h: "Subprocessors", sub: "Waylo uses five outside services to run the product.", head: ["Service", "What it does for Waylo"], rows: [
      ["Supabase", "Database"], ["Render", "Hosting"], ["OpenAI", "AI answers"], ["Stripe", "Billing"], ["Resend", "Email"]],
      note: "Slack and webhook alerts go only to the URLs you add. Visitor browsers get a random ID in localStorage (`waylo_vid`), and the admin uses one session cookie." },
    { t: "spec", eyebrow: "Controls", h: "How access is limited", rows: [
      ["Passwords", "Hashed with scrypt. Reset links expire after 1 hour."], ["Sessions", "Signed, httpOnly cookie, 14 days."],
      ["Roles", "Viewer reads. Editor changes content, guidance, settings, and crawls. Owner also manages members, integrations, and deletions."], ["Workspace isolation", "Every read and write is scoped to the signed-in workspace."],
      ["Allowed origins", "List your domains and the public chat API refuses requests from other sites."], ["Rate limits", "Per-IP limits on chat, tracking, contact, handoff, and login."],
      ["Crawler", "Reads public pages and linked documents on your own domain. It honors `robots.txt` and refuses private and local addresses."], ["Demo", "Chats on /demo are kept in memory only and never stored in a workspace."]] },
    { t: "limits", h: "What we don’t have", items: ["No SSO or SAML. Sign-in is email and password.", "No SOC 2 or ISO 27001 report.", "No DPA.", "No data export or per-conversation delete in the admin.", "The app runs on Render’s free tier during early access, so expect slow first loads.", "No redaction of personal data before text goes to the model."] },
    { t: "faq", items: [["Does Waylo read pages behind a login?", "No. The crawler fetches public pages without cookies."], ["Will Waylo show one customer’s content to another?", "No. Each workspace has its own index, guidance, and conversations. The chat answers only from the workspace named in the script tag."]] }],
  related: [["Privacy Policy", "/privacy", "The formal version."], ["Terms", "/terms", "Service terms."], ["FAQ", "/faq#data", "Data and AI questions."]] };

export const INTEGRATIONS: InfoDef = { path: "/integrations", crumb: "Integrations", eyebrow: "Integrations", hero: "integrations",
  title: "What Waylo connects to",
  sub: "There’s a Slack incoming webhook and a JSON webhook for everything else. The script tag works on any site that takes custom HTML.",
  answer: "On Starter and up, Waylo sends data out through a Slack incoming webhook and a JSON webhook. It installs with one script tag on any CMS or in Google Tag Manager. To reach HubSpot, Salesforce, or a spreadsheet, point the JSON webhook at Zapier, Make, n8n, or your own endpoint.",
  metaTitle: "Integrations: Slack, JSON webhook, CMS and GTM", metaDesc: "What Waylo integrates with today. Slack through an incoming webhook, any CRM through a JSON webhook with Zapier, Make, or n8n, and installs on Webflow, WordPress, Shopify, Squarespace, Wix, and GTM.",
  blocks: [
    { t: "table", eyebrow: "Today", h: "What’s built and how it connects", head: ["Integration", "How", "Notes"], rows: [
      ["Slack", "Incoming webhook URL", "Starter and Growth. One channel per workspace. Leads, high-intent, handoffs. [Details](/product/slack-routing)."], ["CRM (HubSpot, Salesforce, and others)", "JSON webhook to Zapier, Make, n8n, or your endpoint", "Starter and Growth. No native CRM app."],
      ["Google Tag Manager", "Custom HTML tag, All Pages", "[Install guide](/docs/install#cms)."], ["Webflow", "Site settings → Custom code → Footer", ""],
      ["WordPress", "Theme footer or a header/footer code plugin", "No Waylo plugin."], ["Shopify", "theme.liquid, before </body>", "No Shopify app."],
      ["Squarespace, Wix", "Code injection or custom code", "Those platforms may need a paid plan for custom code."], ["Stripe", "Built-in billing for your Waylo plan", "Not a visitor-facing integration."]] },
    { t: "code", eyebrow: "Your own buttons", h: "A tiny JavaScript API", p: ["In launcher mode, open the chat from any element on your page, such as a “Talk to us” button in your nav.", "`Waylo.track()` records a page view manually if your router does something unusual."], label: "JavaScript", code: `<button onclick="Waylo.open()">Talk to us</button>

Waylo.open();    // open the chat panel
Waylo.close();   // close it
Waylo.toggle();  // open or close
Waylo.visitorId; // this visitor's random id` },
    { t: "limits", h: "What isn’t built", items: ["Native HubSpot, Salesforce, or Pipedrive apps", "Helpdesk tickets in Zendesk, Intercom, or Help Scout, except through the webhook", "Calendar booking inside the chat", "An API to push content into Waylo. It learns from the crawl and Guidance.", "Microsoft Teams alerts", "White-label or agency pricing"] },
    { t: "faq", items: [["Which webhook events are there?", "`lead.created`, `conversation.high_intent`, `handoff.requested`, plus `test`."], ["Can I send to two Slack channels?", "Use the JSON webhook with Zapier or Make for the second one."], ["Is there an API key for the admin?", "No. There’s no public admin API."]] }],
  related: [["Slack routing", "/product/slack-routing", "Message formats and events."], ["Install", "/product/install", "Modes and snippet."], ["Route website leads to Slack", "/resources/route-website-leads-to-slack", "Guide."]] };
