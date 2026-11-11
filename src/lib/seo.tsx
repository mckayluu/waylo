import type { Metadata } from "next";
export const SITE_URL = (process.env.WAYLO_PUBLIC_URL || process.env.NEXT_PUBLIC_WAYLO_URL || "https://waylo-j5hv.onrender.com").replace(/\/$/, "");
export const SITE_NAME = "Waylo";
export const TAGLINE = "AI website chat that answers with cited sources and turns conversations into sales signals.";
export const DEFINITION = "Waylo is an AI chat for B2B and SaaS websites. It crawls your public pages, answers visitor questions with cited links to its sources, flags buying intent and visitor journeys, and hands warm leads to your team in Slack or your CRM. It installs with one script tag.";

export const OG = { url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo — AI website chat that shows its sources" };
export function pageMeta(path: string, title: string, description: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title: `${title} | Waylo`, description, url: path, siteName: SITE_NAME, type: "website", images: [OG] }, twitter: { card: "summary_large_image", images: ["/brand/og.png"], title: `${title} | Waylo`, description } };
}
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
export const orgLd = { "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/brand/mark.svg`, description: TAGLINE };
export const appLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", "@id": `${SITE_URL}/#app`, name: SITE_NAME, applicationCategory: "BusinessApplication", operatingSystem: "Web", url: SITE_URL, description: DEFINITION, publisher: { "@id": `${SITE_URL}/#org` },
  offers: [{ "@type": "Offer", name: "Trial", price: "0", priceCurrency: "USD" }, { "@type": "Offer", name: "Starter", price: "79", priceCurrency: "USD" }, { "@type": "Offer", name: "Growth", price: "249", priceCurrency: "USD" }],
  featureList: ["Answers with cited sources", "Site crawling", "Buying-intent signals", "Contact and demo handoff", "Slack and CRM webhooks", "Guidance rules and facts", "Audiences", "Team roles"] };
export const faqLd = (faqs: [string, string][]) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
export const crumbsLd = (items: [string, string][]) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ...items].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${path}` })) });

export const FACTS: [string, string][] = [
  ["What it is", "AI website chat for marketing and sales teams"],
  ["Answers", "Grounded in your crawled public pages plus facts you add; every answer cites source links"],
  ["When unsure", "Says it doesn’t know and offers a handoff to your team"],
  ["Signals", "Flags buying intent such as pricing, integration, and demo interest"],
  ["Integrations", "Slack incoming webhook and a JSON outbound webhook (connect HubSpot or Salesforce through Zapier, Make, or your own endpoint)"],
  ["Install", "One async script tag before </body>; works with Webflow, WordPress, Shopify, Squarespace, Wix, GTM"],
  ["Embed modes", "launcher, sidebar, or track (analytics only)"],
  ["Pricing", "Trial $0 (500 AI messages), Starter $79/mo (3,000), Growth $249/mo (15,000, 3 sites)"],
  ["Availability", "Early access"],
];
export const FAQS: [string, string][] = [
  ["What is Waylo?", DEFINITION],
  ["Who is Waylo for?", "Marketing and sales teams at B2B and SaaS companies that want website visitors to get accurate answers fast and want to know which visitors are ready to talk to sales."],
  ["Where do Waylo’s answers come from?", "From the public HTML pages Waylo crawls on your site, plus any facts and rules you add. Each answer links to its sources. JavaScript-rendered pages and PDFs aren’t supported yet."],
  ["What if Waylo doesn’t know something?", "It says so and offers to connect the visitor with your team instead of guessing. You can add facts to fill the gap."],
  ["How do I install Waylo?", "Paste one script tag before </body>, or add it through Google Tag Manager or your CMS’s custom-code settings. Most teams are live in a few minutes."],
  ["Will Waylo slow my site down?", "No. The script loads with async, so it never blocks rendering, and the chat panel only loads when opened."],
  ["Does Waylo work with my CRM?", "Through a JSON webhook. Point it at Zapier, Make, or your own endpoint and map the fields into HubSpot, Salesforce, or any CRM. There are no native CRM apps today."],
  ["Which AI model does Waylo use?", "OpenAI’s API (gpt-4o-mini by default). The visitor’s messages and the relevant crawled page text are sent to OpenAI to write each reply. See the Privacy Policy."],
  ["How much does Waylo cost?", "Trial is free (500 AI messages), Starter is $79/month (3,000 messages), and Growth is $249/month (3 sites, 15,000 messages, Audiences)."],
  ["Is Waylo available now?", "Yes, in early access. Start a free Trial at /signup (no card), and McKay will help set up your first site."],
];

export const FAQ_GROUPS: { id: string; title: string; items: [string, string][] }[] = [
  { id: "basics", title: "The basics", items: FAQS.slice(0, 2).concat([["How is Waylo different from a generic chatbot?", "Waylo only answers from your crawled pages and the facts you add, shows numbered source links on every reply, and turns conversations into buying-intent signals and lead handoffs instead of just chat logs."], ["Is Waylo available now?", "Waylo is in early access. Start a free Trial at /signup (no card), or use the contact form at /contact and McKay will help set up your site."]]) },
  { id: "answers", title: "Answers & accuracy", items: [FAQS[2], FAQS[3], ["Can I control what Waylo says?", "Yes. Guidance lets you add facts, set rules for what Waylo must never say, and define skills for how to handle topics like security or custom pricing."], ["How do I keep answers up to date?", "Re-crawl your site from the dashboard after you publish changes. Facts you add in Guidance apply immediately."]] },
  { id: "signals", title: "Signals & handoff", items: [["What is a buying-intent signal?", "A tag Waylo adds when a conversation shows interest in pricing, integrations, security, or a demo. Signals appear in the dashboard with the visitor’s page journey."], ["How do leads reach my team?", "When a visitor shares contact details or asks for a demo, Waylo posts the lead to your Slack channel and to any CRM webhook, with the signals, last question, and a link to the full transcript."], FAQS[6], ["What are Audiences?", "On the Growth plan, Audiences group visitors by behavior and signals, such as everyone who viewed /pricing and asked about integrations."]] },
  { id: "install", title: "Install & performance", items: [FAQS[4], FAQS[5], ["Which embed modes are there?", "Three: launcher (floating button, default), sidebar (always-open docked panel), and track (no chat UI, records page views and signals only)."], ["Can I open the chat from my own button?", "Yes. Call Waylo.open(), Waylo.close(), or Waylo.toggle() from any element, such as a “Talk to us” button."]] },
  { id: "data", title: "Data & AI", items: [FAQS[7], ["Who on my team can see conversations?", "Anyone you invite. Members get Owner, Editor, or Viewer roles that control who can change settings and guidance."], ["Where is data stored?", "In a managed Postgres database (Supabase), separated by workspace. The app runs on Render in the US. See the Security & data page for the full list of subprocessors."], ["Does Waylo have SSO or SOC 2?", "Not today. Admin sign-in is email and password with Owner, Editor, and Viewer roles. There’s no SOC 2 or ISO 27001 report yet."], ["Is my site content used to train AI models?", "Waylo doesn’t train a model on your site. Relevant page text is sent to OpenAI’s API with each question; under OpenAI’s API terms that data isn’t used for training by default."], ["Can I delete a visitor’s data?", "Yes, on request through the contact form. Self-serve export and delete in the admin aren’t built yet."]] },
  { id: "limits", title: "Honest limits", items: [["Can Waylo read JavaScript-rendered pages or PDFs?", "Not yet. The crawler reads the HTML your server sends; text added later by JavaScript, PDFs, and images aren’t indexed."], ["How many pages can it crawl?", "50 per crawl by default, up to 100. Re-crawl after you publish changes; scheduled re-crawls aren’t built yet."], ["Is there a native HubSpot or Salesforce integration?", "No. Waylo sends a JSON webhook you can route into any CRM with Zapier, Make, or your own endpoint."], ["Can someone on my team reply live in the chat?", "No. Waylo has no live agent mode. “Talk to a person” alerts your team in Slack and they follow up by email or call."], ["Can I white-label the widget?", "Not today. You set the assistant name, color, and greeting; the footer reads “waylo · answers from this site.”"], ["Is the service always fast?", "Mostly. During early access Waylo runs on a free hosting tier with a keep-alive ping, so an occasional first request after a quiet stretch can take a few seconds."]] },
  { id: "pricing", title: "Pricing", items: [FAQS[8], ["Is there a contract?", "No long-term contract. Plans are monthly through Stripe Checkout and you can cancel from Billing in the admin. During early access Stripe runs in test mode."]] },
];
