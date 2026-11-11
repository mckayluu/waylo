import type { InfoDef } from "./types";
export const HOW: InfoDef = { path: "/how-it-works", crumb: "How it works", eyebrow: "How it works", hero: "answer",
  title: "Crawl, answer, signal, hand off",
  sub: "What happens between pasting the script tag and a rep opening Slack, step by step, with nothing skipped.",
  answer: "Waylo crawls your public pages, answers visitor questions from them with source links, tags buying signals as people chat, and posts serious visitors to Slack or a webhook with a link to the conversation. You read everything in one admin.",
  metaTitle: "How Waylo works: crawl, cited answers, signals, handoff", metaDesc: "Step by step: how Waylo crawls your site, answers visitors with cited sources, detects buying intent, and routes leads to Slack or your CRM webhook.",
  blocks: [
    { t: "steps", eyebrow: "Setup, once", h: "About an afternoon, most of it reading", items: [
      ["Create a workspace", "[Sign up](/signup) with your company name and work email. You’re the Owner."], ["Crawl your site", "Paste your domain in Content. Waylo reads up to 100 public pages in the background."],
      ["Add what pages don’t say", "Facts, rules, and skills in Guidance. A company profile in Settings."], ["Paste the script tag", "Before </body>, or a GTM tag. Pick launcher, sidebar, or track."],
      ["Connect Slack", "An incoming webhook in Integrations. Optionally a JSON webhook for your CRM."], ["Publish", "Turn off “Preview only.” Needs a Trial or plan."]] },
    { t: "shot", eyebrow: "1 · Answer", h: "A visitor asks, Waylo answers from your pages", shot: "widget", p: ["Waylo finds the pages that match the question, adds your guidance, and writes a short answer. Up to three numbered source chips link to the pages it used.", "If your pages don’t cover it, it says it couldn’t find that and points to the Contact tab. It doesn’t fill the gap with a guess."] },
    { t: "prose", eyebrow: "2 · Signal", h: "Every message is checked for buying intent", p: ["Pricing, demo, ready-to-buy, enterprise (SSO, security, compliance), integration, and support wording are tagged as signals. Two or more buying signals, or a ready-to-buy signal, make the conversation **high-intent**.", "Page views are recorded from the moment the script loads, so the signal comes with the path that led to it."] },
    { t: "slack", eyebrow: "3 · Hand off", h: "Serious visitors reach a person", p: ["A visitor can leave a message or request a demo in the Contact tab, or click “Talk to a person.” High-intent conversations, leads, and handoffs post to Slack with the last question and an **Open in Waylo** link."] },
    { t: "shots", eyebrow: "4 · Review", h: "Read what happened, then fix the site", sub: "Questions, journeys, and cited pages show what visitors needed and where your content fell short.", keys: ["conv", "tracking", "content"] },
    { t: "faq", items: [["How long does the crawl take?", "Usually under a minute for a small site. It runs in the background with progress shown."], ["Do I need a developer?", "Only if you can’t add custom HTML to your site yourself. It’s one tag."], ["What if it gets something wrong?", "Open the conversation, see which source it used, then fix the page or add a Fact. During early access we review the first week of conversations with you."]] }],
  related: [["AI chat", "/product/ai-chat", "Crawl and answers in detail."], ["Slack routing", "/product/slack-routing", "Events and messages."], ["Pricing", "/pricing", "Trial $0, Starter $79, Growth $249."]] };

export const SECURITY: InfoDef = { path: "/security", crumb: "Security & data", eyebrow: "Security & data", hero: "settings",
  title: "What Waylo stores, where it goes, and who can see it",
  sub: "A plain account of how the product handles data today, including what we don’t have yet. Early access means fewer badges, not fewer answers.",
  answer: "Waylo stores your crawled page text, guidance, conversations, page-view journeys, leads, and settings in a managed Postgres database, separated by workspace. Visitor messages and matching page text go to OpenAI’s API to write replies. Admin access uses hashed passwords, signed session cookies, and Owner/Editor/Viewer roles. There’s no SSO or SOC 2 report today.",
  metaTitle: "Security and data handling", metaDesc: "How Waylo handles data: what’s stored, subprocessors (OpenAI, hosting, Stripe, email), workspace isolation, roles, rate limits, allowed origins, and what isn’t available yet.",
  blocks: [
    { t: "spec", eyebrow: "Data", h: "What’s stored", sub: "Per workspace. Other workspaces can’t read it.", rows: [
      ["Crawled pages", "URL, title, and readable text (up to 40,000 characters per page) of public pages you crawl."], ["Guidance", "Facts, rules, skills, and company profile you write."],
      ["Conversations", "Visitor and Waylo messages, sources, 👍/👎, signals, and any name or email the visitor gives."], ["Journeys", "Page path, title, referrer, and time for each page view, tied to a random visitor ID."],
      ["Leads & handoffs", "Name, email, message, consent, and status."], ["Account", "Member emails, roles, password hashes, billing status from Stripe."]] },
    { t: "table", eyebrow: "Subprocessors", h: "Who else touches data", head: ["Service", "What it gets", "Why"], rows: [
      ["OpenAI (API)", "Visitor messages, matching page text, guidance", "To write each reply. API data isn’t used for training by default under OpenAI’s API terms."],
      ["Render (US, Oregon) and the managed Postgres host", "Everything above", "Run the app and store its database."], ["Stripe", "Billing email and subscription", "Checkout and the billing portal."],
      ["Resend", "Member email addresses", "Invite and password-reset emails."], ["Your Slack / webhook", "What you configure it to receive", "Alerts you set up."]],
      note: "Visitor browsers get a random ID in localStorage (`waylo_vid`). The admin uses one session cookie. See the [Privacy Policy](/privacy) for retention." },
    { t: "spec", eyebrow: "Controls", h: "How access is limited", rows: [
      ["Passwords", "Hashed with scrypt. Reset links expire after 1 hour."], ["Sessions", "Signed, httpOnly cookie, 14 days."],
      ["Roles", "Viewer reads. Editor changes content, guidance, settings, and crawls. Owner also manages members, integrations, and deletions."], ["Workspace isolation", "Every read and write is scoped to the signed-in workspace."],
      ["Allowed origins", "List your domains and the public chat API refuses requests from other sites."], ["Rate limits", "Per-IP limits on chat, tracking, contact, handoff, and login."],
      ["Crawler", "Public pages only, same domain only, honors `robots.txt`, refuses private and local addresses."], ["Demo", "Chats on /demo are kept in memory only and never stored in a workspace."]] },
    { t: "limits", h: "What we don’t have yet", items: ["No SSO or SAML. Email and password only.", "No SOC 2 or ISO 27001 report.", "No signed DPA template on the site; email us if you need one reviewed.", "No self-serve data export or per-conversation delete in the admin yet; email us and we’ll handle it.", "Single region on Render’s free tier during early access, with cold starts.", "No PII redaction before text is sent to the model."] },
    { t: "faq", items: [["Can visitors’ data be deleted?", "Yes, on request through the contact form at /contact. The [Privacy Policy](/privacy) covers retention after an account closes."], ["Does Waylo read pages behind a login?", "No. The crawler fetches public pages without cookies."], ["Will Waylo show one customer’s content to another?", "No. Each workspace has its own index, guidance, and conversations, and the chat answers only from the workspace named in the script tag."]] }],
  related: [["Privacy Policy", "/privacy", "The formal version."], ["Terms", "/terms", "Service terms."], ["FAQ", "/faq#data", "Data & AI questions."]] };

export const INTEGRATIONS: InfoDef = { path: "/integrations", crumb: "Integrations", eyebrow: "Integrations", hero: "integrations",
  title: "Two outbound connections, and a script tag that fits anywhere",
  sub: "Slack incoming webhook, a JSON webhook for everything else, and installs on any site that takes custom HTML. No long list of logos we haven’t built.",
  answer: "Waylo connects outward through a Slack incoming webhook and a generic JSON webhook, and installs through one script tag on any CMS or Google Tag Manager. To reach HubSpot, Salesforce, or a spreadsheet, point the JSON webhook at Zapier, Make, n8n, or your own endpoint.",
  metaTitle: "Integrations: Slack, JSON webhook, CMS and GTM", metaDesc: "What Waylo integrates with today: Slack via incoming webhook, any CRM via a JSON webhook (Zapier, Make, n8n), and installs on Webflow, WordPress, Shopify, Squarespace, Wix, and GTM.",
  blocks: [
    { t: "table", eyebrow: "Today", h: "What’s built, and how it connects", head: ["Integration", "How", "Notes"], rows: [
      ["Slack", "Incoming webhook URL", "One channel per workspace. Leads, high-intent, handoffs. [Details](/product/slack-routing)."], ["CRM (HubSpot, Salesforce, …)", "JSON webhook → Zapier / Make / n8n / your endpoint", "No native CRM app."],
      ["Google Tag Manager", "Custom HTML tag, All Pages", "[Install guide](/docs/install#cms)."], ["Webflow", "Site settings → Custom code → Footer", ""],
      ["WordPress", "Theme footer or a header/footer code plugin", "No Waylo plugin."], ["Shopify", "theme.liquid, before </body>", "No Shopify app."],
      ["Squarespace, Wix", "Code injection / custom code", "Paid plans on those platforms may be required for custom code."], ["Stripe", "Built-in billing for your Waylo plan", "Not a visitor-facing integration."]] },
    { t: "code", eyebrow: "Your own buttons", h: "A tiny JavaScript API", p: ["In launcher mode, open the chat from any element on your page, such as a “Talk to us” button in your nav.", "`Waylo.track()` records a page view manually if your router does something unusual."], label: "JavaScript", code: `<button onclick="Waylo.open()">Talk to us</button>

Waylo.open();    // open the chat panel
Waylo.close();   // close it
Waylo.toggle();  // open or close
Waylo.visitorId; // this visitor's random id` },
    { t: "limits", h: "Not built (and we won’t pretend)", items: ["Native HubSpot, Salesforce, or Pipedrive apps", "Helpdesk ticket creation (Zendesk, Intercom, Help Scout) except through the webhook", "Calendar booking inside the chat", "Inbound APIs to push content into Waylo; it learns from the crawl and Guidance", "Microsoft Teams alerts"] },
    { t: "faq", items: [["Which webhook events are there?", "`lead.created`, `conversation.high_intent`, `handoff.requested`, plus `test`."], ["Can I send to two Slack channels?", "Use the JSON webhook with Zapier or Make for the second one."], ["Is there an API key for the admin?", "No public admin API yet."]] }],
  related: [["Slack routing", "/product/slack-routing", "Message formats and events."], ["Install", "/product/install", "Modes and snippet."], ["Route website leads to Slack", "/resources/route-website-leads-to-slack", "Guide."]] };
