import type { InfoDef } from "./types";
const P: [string, string] = ["Product", "/features"];
export const PRODUCT: InfoDef[] = [
{ path: "/product/ai-chat", crumb: "AI chat on your site", parent: P, eyebrow: "AI chat", hero: "answer",
  title: "AI chat that only knows what your site says",
  sub: "Waylo reads your public pages, then answers visitors from that text and the facts you add. It doesn’t pull from the open web, and it doesn’t make things up to fill a gap.",
  answer: "Waylo crawls the public pages on your site, starting from your sitemap. It also reads PDF and .docx files you link to. For each visitor question it pulls the matching pages, and the model answers only from those pages and your Guidance. When the pages don’t cover it, Waylo says so and points to the Contact tab.",
  metaTitle: "AI chat that answers from your own website", metaDesc: "How Waylo’s website chat learns your site. It crawls your public pages and documents, pulls the right pages for each question, answers only from them, and says when it doesn’t know.",
  blocks: [
    { t: "steps", eyebrow: "What happens", h: "From your domain to an answer", sub: "There’s no training run and nothing to upload. It reads what you already published.", items: [
      ["You enter your domain", "In **Admin → Content**, paste your site URL. Your plan sets how many pages it reads: 100 on the Trial, 500 on Starter, 2,000 on Growth."],
      ["Waylo crawls your site", "It starts with your sitemap, then follows links on your domain. It respects `robots.txt` rules, reads linked PDF and .docx files, and skips images and video."],
      ["It keeps the readable text", "Navigation, headers, footers, forms, and scripts are stripped. What’s left is the copy a visitor would read."],
      ["A visitor asks a question", "Waylo picks the pages that match, plus your facts, rules, and company profile, and writes a short answer."],
      ["It cites what it used", "The answer ends with numbered source chips that link to those pages. See [citations](/product/citations)."],
      ["Or it says it doesn’t know", "If nothing matches, it tells the visitor and offers the Contact tab or a person."]] },
    { t: "shot", eyebrow: "Your index", h: "See exactly what it read", shot: "content", p: ["The Content view lists every page Waylo indexed, a preview of the text it kept, and how many answers cited each page. If a page is missing, look there first.", "Changed your pricing? Click **Re-crawl site** and the new text replaces the old."],
      bullets: [["Crawl size", "100, 500, or 2,000 pages, by plan."], ["Runs in the background", "The page shows progress while you keep working."], ["Re-crawl", "Click it any time from the same screen."]] },
    { t: "shot", eyebrow: "Guidance", h: "Fill the gaps your pages leave", shot: "guidance", flip: true, p: ["Some things aren’t on your site, or are worded loosely. Guidance lets you add them without editing pages.", "**Facts** are treated as true and win over page text when they conflict. **Rules** are hard limits (“never quote a discount”). **Skills** are short playbooks for a topic (“on security questions, link the security page”). A **company profile** in Settings is added to every answer."] },
    { t: "spec", eyebrow: "Under the hood", h: "The specifics", rows: [
      ["Model", "OpenAI API, `gpt-4o-mini` by default."], ["What’s sent", "The visitor’s messages plus the matching page text and your guidance, per reply."],
      ["Reply style", "Short answers with bold and lists. Text streams in as it’s written."], ["Scope", "Answers about your company only. It’s told not to quote prices or facts that aren’t in your pages or guidance."],
      ["Languages", "Whatever the model handles. Quality is best when your pages use the same language as the question."], ["Feedback", "Visitors can 👍/👎 each answer; you see it on the conversation."]] },
    { t: "limits", items: ["Pages that render their text only with JavaScript come through empty. The crawler reads raw HTML.", "Scanned PDFs, images, and video aren’t indexed.", "Pages behind a login aren’t crawled.", "Crawl again after you publish changes.", "It can still word something poorly. That’s why every answer shows its sources and you can read every conversation."] },
    { t: "faq", items: [
      ["Is my content used to train a model?", "Waylo doesn’t train a model on your site. It sends the relevant page text with each question to OpenAI’s API. OpenAI’s API terms say that data isn’t used for training by default. See [Security & data](/security)."],
      ["How is this different from pasting my site into a chatbot?", "Waylo keeps answers to your pages and guidance. It links the pages it used and logs every question, so you can fix gaps. See [Waylo vs generic chatbots](/compare/generic-chatbots)."],
      ["Can I stop it answering about pricing?", "Yes. Add a rule such as “Never quote prices; offer to send a quote.” Rules apply to every reply."]] }],
  related: [["Citations and source chips", "/product/citations", "How answers link back to your pages."], ["Install", "/product/install", "One script tag, three modes."], ["How it works", "/how-it-works", "The whole loop on one page."]] },

{ path: "/product/citations", crumb: "Citations and source chips", parent: P, eyebrow: "Citations", hero: "demoHome",
  title: "Every answer shows the page it came from",
  sub: "Numbered source chips under each reply link to the pages Waylo used. Buyers can check them, and so can your team.",
  answer: "After each answer, Waylo attaches up to three source chips, each linking to a page on your site that the answer used. If no page supports an answer, it doesn’t invent a source. It says it couldn’t find one.",
  metaTitle: "Cited answers and source chips", metaDesc: "Waylo answers website visitors with numbered source chips that link to the exact pages used. How citations work, what visitors see, and how you audit them.",
  blocks: [
    { t: "shot", eyebrow: "What visitors see", h: "A short answer with its source", shot: "widget", p: ["On the Northpoint Ops demo, “How much is Pro per tech?” gets a one-line answer and a chip labeled **1 · Northpoint Ops Pricing**. Click it and you land on the pricing page the numbers came from.", "A visitor doesn’t have to take the chat’s word for it. They can check in one click."],
      bullets: [["Up to 3 chips", "Per answer, numbered in the order used."], ["Absolute links", "Chips open the real page on your domain."], ["No chip, no claim", "When nothing supports an answer, it says so."]] },
    { t: "prose", eyebrow: "Why it matters", h: "Why sources matter", p: ["Most website bots answer confidently and you can’t tell where the words came from. When the answer is wrong, the visitor finds out later, usually on a sales call.", "Showing the source helps twice. Visitors trust a correct answer more because they can check it. A wrong answer is easy to spot and fix, because you can see which page the model used.", "It also tells you which pages do the selling. The Content view counts how often each page was cited."],
      aside: { title: "How Waylo picks sources", items: ["Retrieves the pages that best match the question", "The model must list which numbered sources it used", "Waylo turns those numbers into chips", "Guidance facts can answer without a page; those show no chip"] } },
    { t: "shots", eyebrow: "Auditing", h: "Check answers after the fact", sub: "Every conversation in the admin keeps its chips, so you can see what each answer relied on.", keys: ["conv", "content"] },
    { t: "limits", items: ["Chips link to the whole page. They don’t highlight the sentence.", "If two pages disagree, such as old and new pricing, the answer may cite the stale one. Remove or update the old page, or add a Fact.", "Answers drawn only from Guidance facts don’t show a chip."] },
    { t: "faq", items: [["Can I turn citations off?", "No. Source chips are core to how Waylo works."], ["Do chips work on single-page apps?", "Chips link to whatever URLs were crawled. If your pages render text with JavaScript only, the crawler won’t see that text. See [AI chat](/product/ai-chat) limits."], ["Can visitors rate answers?", "Yes, 👍/👎 on every reply. Ratings show on the conversation in the admin."]] }],
  related: [["How to make a site chatbot cite sources", "/resources/make-a-website-chatbot-cite-sources", "A practical guide, whatever tool you use."], ["AI chat", "/product/ai-chat", "Where answers come from."], ["Analytics", "/product/analytics", "See what was asked and cited."]] },

{ path: "/product/lead-capture", crumb: "Lead capture and handoff", parent: P, eyebrow: "Lead capture", hero: "conv",
  title: "When a visitor wants a person, they get one",
  sub: "The contact form, demo requests, and “Talk to a person” all sit inside the chat. Visitors can reach you the moment a question gets serious.",
  answer: "The widget has two tabs: AI Chat and Contact. The Contact tab collects name, email, a message, and consent, as either “Leave a message” or “Book a demo.” A “Talk to a person” link opens a handoff. Each one lands in the admin. On Starter and up it can also post to Slack or your webhook.",
  metaTitle: "Lead capture and human handoff in website chat", metaDesc: "How Waylo captures contact and demo requests inside the chat, logs handoffs, links them to the conversation and page journey, and alerts your team.",
  blocks: [
    { t: "split", eyebrow: "Three ways in", h: "How visitors reach your team", left: { title: "Inside the widget", items: ["**Contact tab**: name, email, message, consent checkbox", "Choose **Leave a message** or **Book a demo**", "**Talk to a person** link under the chat box", "An email typed into chat is picked up on the conversation"] }, right: { title: "What your team gets", items: ["A row in **Leads** or **Handoffs** in the admin", "The conversation, page journey, and signals in one view", "Handoffs have open/resolved status", "Slack and webhook alerts on Starter and Growth"] } },
    { t: "shot", eyebrow: "Context", h: "The lead comes with the conversation", shot: "tracking", p: ["A form fill gives you a name. A Waylo lead also shows what they asked, what Waylo answered, and which pages they read on the way.", "In this sample, the visitor came from Google, read the SaaS pre-sales page, went to pricing, asked about plans and Slack, then requested a demo."] },
    { t: "slack", eyebrow: "Alerts", h: "And it shows up in Slack", p: ["Turn on the events you want in **Admin → Integrations**: new Contact-form leads, visitors becoming high-intent, and “Talk to a person” requests. Each posts a short message with a link to the conversation.", "Want it in a CRM? The same events go to a JSON webhook. See [Slack routing](/product/slack-routing)."] },
    { t: "limits", items: ["There’s no calendar booking inside the chat. “Book a demo” sends a request, and your team schedules it.", "There’s no live chat. Your team follows up by email.", "Slack and webhook alerts are part of Starter and Growth on the [pricing page](/pricing). Leads are always saved in the admin."] },
    { t: "faq", items: [["Is consent required?", "Yes. The Contact form requires the consent checkbox before it submits."], ["Can I offer the Contact tab only for some questions?", "Use a Skill in Guidance. For example, “When someone asks about custom pricing, suggest the Contact tab.”"], ["Where do leads go if Slack isn’t connected?", "They’re always saved in **Admin → Leads** with the linked conversation."]] }],
  related: [["Slack routing", "/product/slack-routing", "Which events post and what they say."], ["Analytics", "/product/analytics", "Journeys, questions, and signals."], ["Pricing", "/pricing", "Handoff starts on Starter."]] },

{ path: "/product/slack-routing", crumb: "Slack routing", parent: P, eyebrow: "Slack routing", hero: "integrations",
  title: "Buying intent lands in the channel your team already reads",
  sub: "Paste a Slack incoming webhook and pick which events post. Every message links to the conversation. Starter and up.",
  answer: "Waylo posts to one Slack channel per workspace through an incoming webhook, for three events: a new Contact-form lead, a visitor becoming high-intent, and a “Talk to a person” request. The same events can go to a JSON webhook for your CRM. A delivery log shows every post and its HTTP status.",
  metaTitle: "Route website chat leads to Slack", metaDesc: "Waylo posts high-intent visitors, new leads, and handoff requests to a Slack channel through an incoming webhook. Each post has the signals, the last question, and a link to the conversation.",
  blocks: [
    { t: "slack", eyebrow: "The messages", h: "Short messages with a link", p: ["Each alert says what happened, who (if known), the signals, and the visitor’s words. Then **Open in Waylo** takes the rep to the full conversation and page journey.", "Your team sees hot visitors in a channel they already read."] },
    { t: "spec", eyebrow: "Events", h: "What triggers a post", rows: [
      ["`lead.created`", "Someone submits the Contact tab (message or demo request)."], ["`conversation.high_intent`", "A conversation picks up two or more of pricing, demo, ready-to-buy, enterprise, or any ready-to-buy signal. Posts once per conversation."],
      ["`handoff.requested`", "The visitor clicks “Talk to a person.”"], ["Toggles", "Each event can be switched off in Integrations."],
      ["Test", "**Send test** posts a check message so you know the webhook works."], ["Delivery log", "Recent posts with target, event, and HTTP status."]] },
    { t: "code", eyebrow: "CRM and everything else", h: "The same events as JSON", p: ["Point the outbound webhook at Zapier, Make, n8n, or your own endpoint, and map fields into HubSpot, Salesforce, a sheet, or a second Slack channel.", "The conversation summary includes signals, themes, visitor type, the last question, message count, and an `adminUrl` back to Waylo."], label: "POST · Content-Type: application/json", code: `{
  "event": "handoff.requested",
  "site": "Northpoint Ops",
  "sentAt": "2026-11-11T17:02:11.000Z",
  "data": {
    "handoff": { "email": "sam@example.com", "note": "…", "status": "open" },
    "conversation": {
      "signals": ["pricing", "demo", "high-intent"],
      "visitorType": "Hot prospect",
      "lastQuestion": "Does Growth cover 3 sites?",
      "messages": 6,
      "adminUrl": "https://…/admin/c/…"
    }
  }
}` },
    { t: "steps", eyebrow: "Setup", h: "Set it up in five minutes", items: [["Create an incoming webhook", "In Slack: Apps → Incoming Webhooks → pick the channel."], ["Paste it in Waylo", "**Admin → Integrations → Slack**."], ["Send a test", "Check the message lands."], ["Choose events", "Leads, high-intent, handoffs. All on by default."]] },
    { t: "limits", items: ["One Slack channel per workspace. Reach more channels through the JSON webhook and Zapier or Make.", "Slack messages carry the last question and a link. The full conversation stays in Waylo.", "There’s no native HubSpot or Salesforce app. Use the JSON webhook.", "Signals use keywords, so expect some false alarms, like “plan” in “plan my week.”"] },
    { t: "faq", items: [["Which plan includes Slack?", "Starter ($79/mo) and Growth ($249/mo). See [pricing](/pricing)."], ["Does it retry failed posts?", "Failures are logged with their status in the delivery log. Waylo doesn’t retry them automatically."], ["Can reps reply from Slack?", "Not to the visitor. Slack is the alert, and the follow-up happens by email."]] }],
  related: [["Route website leads to Slack", "/resources/route-website-leads-to-slack", "A guide to doing it well."], ["SaaS pre-sales to Slack", "/use-cases/saas-presales-slack", "A common first setup."], ["Integrations", "/integrations", "Everything Waylo connects to."]] },

{ path: "/product/analytics", crumb: "Analytics and signals", parent: P, eyebrow: "Analytics", hero: "home",
  title: "Know what visitors asked, and what they did before they asked",
  sub: "See every question, the pages each visitor read, and the buying signals. Read it once a week and fix what’s missing.",
  answer: "Waylo records each visitor’s page views (path, title, referrer, including single-page-app route changes), every question and answer, the buying signals detected, and which pages were cited. The admin shows it as Home stats, a searchable Questions list, per-visitor journeys, and Audiences on Growth.",
  metaTitle: "Website chat analytics: questions, journeys, signals", metaDesc: "What Waylo tracks about website visitors, from journeys and questions to buying signals and cited pages, and how teams use it to fix content and follow up.",
  blocks: [
    { t: "spec", eyebrow: "Where to look", h: "Six views in the admin", rows: [
      ["Home", "Conversations, questions, contact forms, high-intent visitors, messages today, and a 14-day questions chart."], ["Questions", "Every visitor question with Waylo’s answer and sources. Search and filter by topic."],
      ["Tracking", "Each visitor’s journey: pages, referrer, and questions in order."], ["Content", "Crawled pages and how often each was cited."],
      ["Audiences (Growth)", "Saved segments by signal, page visited, referrer, page-view count, or visitor type, with live match counts."], ["Conversation", "Transcript, sources, feedback, contact form, journey, and signals on one screen."]] },
    { t: "shot", eyebrow: "Journeys", h: "The path to the question", shot: "tracking", p: ["The snippet sends a page view on load and on every in-app route change. When a visitor chats, their questions appear inline with the pages they read.", "You might learn that people read the integrations page right before they ask about pricing. Or that one blog post brings in more evaluators than the homepage."] },
    { t: "prose", eyebrow: "Signals", h: "How buying intent is detected", p: ["Each visitor message is checked for six signal types: **pricing**, **demo**, **ready-to-buy**, **enterprise** (SSO, security, compliance, seats), **integration**, and **support**. Two or more buying signals in one conversation, or any ready-to-buy signal, marks it **high-intent**.", "Signals also set a rough visitor type (Browser, Evaluator, Hot prospect, Enterprise buyer, Existing customer). You can add your own signal tags to any conversation by hand."],
      aside: { tone: "amber", title: "How far to trust it", items: ["Detection uses keyword rules", "It catches obvious intent and can misfire on casual wording", "Use it to sort, then read the conversation"] } },
    { t: "steps", eyebrow: "A weekly habit", h: "A thirty-minute weekly review", items: [["Open Questions, filter by topic", "Read last week’s pricing and integration questions."], ["Find “I don’t know” answers", "Each one is a content gap. Add a page section or a Fact."], ["Check Content cited counts", "Pages never cited may be thin or hard to parse."], ["Skim high-intent journeys", "Which pages came before serious questions?"]] },
    { t: "limits", items: ["There’s no CSV export yet. The JSON webhook is how you get data out today.", "There are no funnel or attribution reports. Journeys are per visitor.", "Visitors are identified by a random ID in localStorage, so the same person on two devices is two visitors.", "Audiences group visitors in the admin. You can’t target the chat by audience yet."] }],
  related: [["The pre-sales question audit", "/resources/pre-sales-question-audit", "Turn questions into better pages."], ["Lead capture", "/product/lead-capture", "When signals turn into a person."], ["Security and data", "/security", "What’s stored and where."]] },

{ path: "/product/branding", crumb: "Branding and customization", parent: P, eyebrow: "Branding", hero: "settings",
  title: "Looks like part of your site, says things your way",
  sub: "Set the assistant name, accent color, greeting, launcher side, and how it opens. Guidance handles the voice.",
  answer: "In Settings you set the assistant’s name (up to 40 characters), an accent color, and a greeting (up to 300 characters). The script tag sets the launcher color, left or right position, launcher, sidebar, or track mode, and open-on-load. Voice and boundaries come from Guidance rules and skills.",
  metaTitle: "Branding and customization for website chat", metaDesc: "Customize Waylo’s website chat: assistant name, accent color, greeting, launcher position and color, embed mode, open on load, and voice via guidance rules.",
  blocks: [
    { t: "spec", eyebrow: "What you can change", h: "What you can set", rows: [
      ["Assistant name", "Shown in the chat header. Up to 40 characters."], ["Accent color", "Any hex color for the chat UI."], ["Greeting", "First message in the chat. Up to 300 characters."],
      ["`data-color`", "Launcher button color."], ["`data-position`", "`right` (default) or `left`."], ["`data-mode`", "`launcher`, `sidebar`, or `track`."],
      ["`data-open`", "Open the chat on page load. Also a toggle in Install."], ["Your own button", "`Waylo.open()`, `close()`, `toggle()` in launcher mode."]] },
    { t: "shot", eyebrow: "On the demo", h: "Northpoint Ops’ chat says Northpoint Ops", shot: "demoHome", p: ["The /demo site uses its own name, color, and greeting, and the chat answers as Northpoint Ops. Visitors don’t see a pitch for Waylo on a customer’s site.", "Your workspace starts with a neutral greeting; change it before you publish."] },
    { t: "prose", eyebrow: "Voice", h: "Set the tone in Guidance", p: ["Want shorter answers, no exclamation marks, or a rule against comparing yourselves to competitors? Write it as a **Rule**. Want a specific way to handle security questions? Write a **Skill**.", "A **company profile** in Settings tells Waylo who you are and who you serve. It’s added to every answer."] },
    { t: "limits", items: ["The widget footer reads “waylo · answers from this site.” There’s no white-label option.", "You can’t change CSS or fonts inside the chat panel.", "Each workspace has one name, color, and greeting for every page."] }],
  related: [["Install", "/product/install", "Modes and attributes."], ["AI chat", "/product/ai-chat", "Guidance and answers."], ["Embed modes docs", "/docs/embed-modes", "Which mode fits which page."]] },

{ path: "/product/install", crumb: "Install", parent: P, eyebrow: "Install", hero: "install",
  title: "Install with one script tag",
  sub: "Paste it before </body> or add it in Google Tag Manager. It’s about 5 KB and loads async. The chat itself loads only when someone opens it.",
  answer: "Waylo installs with a single async script tag that carries your workspace id. It works on any site that lets you add custom HTML, including Webflow, WordPress, Shopify, Squarespace, Wix, and Google Tag Manager. Choose launcher, sidebar, or track-only with one attribute.",
  metaTitle: "Install Waylo with one script tag", metaDesc: "Install Waylo website chat with one async script tag (about 5 KB). Launcher, sidebar, or track-only modes; works with Webflow, WordPress, Shopify, Squarespace, Wix, and GTM.",
  blocks: [
    { t: "code", eyebrow: "The snippet", h: "This is the whole install", p: ["Your exact tag, with your workspace id, is in **Admin → Install**. Paste it once in your site-wide footer or a GTM Custom HTML tag on All Pages.", "Nothing renders until the page has loaded. The chat panel is an iframe that loads on first open, so it can’t change your page’s styles."], label: "Paste before </body>", code: `<script src="https://waylo-j5hv.onrender.com/waylo.js"
  data-site="YOUR_WORKSPACE_ID"
  data-mode="launcher"
  async></script>` },
    { t: "table", eyebrow: "Modes", h: "Pick a mode for each page", head: ["Mode", "What visitors see", "Good for"], rows: [["`launcher`", "Round button bottom-right (or left); panel opens on click", "Marketing pages, pricing"], ["`sidebar`", "Chat docked to the side, always open (400 px)", "Docs, help centers"], ["`track`", "Nothing. Records page views only", "Measuring before turning chat on"]] },
    { t: "steps", eyebrow: "Go-live checklist", h: "In this order", items: [["Paste the tag", "Site-wide, before </body>."], ["Allow your domain", "**Settings → Allowed embed origins**, so other sites can’t use your workspace."], ["Crawl", "**Content → Re-crawl site**."], ["Ask your five hardest questions", "Fix gaps with Facts before visitors find them."], ["Connect Slack", "Starter and up."], ["Publish", "Until you publish, the widget shows a “Preview only” banner. Publishing needs a Trial or plan."]] },
    { t: "limits", items: ["The app runs on a free Render instance during early access. The first request after a quiet stretch can take a few seconds.", "There’s no WordPress plugin or Shopify app. You paste the tag in theme or custom-code settings.", "`Waylo.open()` does nothing in sidebar mode, since the sidebar is always open."] }],
  related: [["Install guide (docs)", "/docs/install", "Step by step, with troubleshooting."], ["Install checklist", "/docs/install#checklist", "The short version."], ["Branding", "/product/branding", "Colors, position, greeting."]] },
];
