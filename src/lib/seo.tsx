import type { Metadata } from "next";
export const SITE_URL = (process.env.WAYLO_PUBLIC_URL || process.env.NEXT_PUBLIC_WAYLO_URL || "https://waylo-j5hv.onrender.com").replace(/\/$/, "");
export const SITE_NAME = "Waylo";
export const TAGLINE = "AI chat for your website. It answers from your own pages and links the page behind each answer.";
export const DEFINITION = "Waylo is AI chat for B2B and SaaS websites. It reads your public pages and answers visitor questions with a link to the page behind each answer. It flags buying intent, records the pages each visitor read, and can post warm leads to Slack or your CRM. It installs with one script tag.";

export const OG = { url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo, AI chat for your website" };
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
  ["What it is", "AI chat for the websites of B2B and SaaS companies"],
  ["Answers", "From your crawled public pages and the facts you add. Every answer links its sources."],
  ["When unsure", "Says it doesn’t know and offers the contact form"],
  ["Signals", "Flags questions about pricing, integrations, security, and demos"],
  ["Integrations", "Starter and up. A Slack incoming webhook and a JSON webhook you can route to HubSpot or Salesforce with Zapier, Make, or your own endpoint."],
  ["Install", "One async script tag before </body>. Works with Webflow, WordPress, Shopify, Squarespace, Wix, and GTM."],
  ["Embed modes", "Launcher, sidebar, or track (page views only)"],
  ["Pricing", "Trial $0 (500 AI messages), Starter $79/mo (3,000), Growth $249/mo (15,000, 3 sites)"],
  ["Availability", "Early access, self-serve"],
];
export const FAQS: [string, string][] = [
  ["What is Waylo?", DEFINITION],
  ["Who is Waylo for?", "Marketing and sales teams at B2B and SaaS companies. It suits sites where buyers ask the same questions about pricing, integrations, and security before they talk to anyone."],
  ["Where do Waylo’s answers come from?", "From the public pages Waylo crawls on your site, including linked PDF and .docx files, plus any facts and rules you add. Each answer links to its sources. Waylo can’t read pages that render text only with JavaScript."],
  ["What if Waylo doesn’t know something?", "It says it doesn’t know and offers the contact form. The question shows up in your admin, so you can add a fact or fix the page."],
  ["How do I install Waylo?", "Paste one script tag before </body>, or add it through Google Tag Manager or your CMS’s custom-code settings. It takes a few minutes."],
  ["Will Waylo slow my site down?", "No. The script loads async, so it doesn’t block your page. The chat panel loads only when someone opens it."],
  ["Does Waylo work with my CRM?", "Yes, through a JSON webhook on Starter and up. Point it at Zapier, Make, or your own endpoint and map the fields into HubSpot, Salesforce, or another CRM. There are no native CRM apps today."],
  ["Which AI model does Waylo use?", "OpenAI’s API (gpt-4o-mini by default). The visitor’s messages and the relevant crawled page text are sent to OpenAI to write each reply. See the Privacy Policy."],
  ["How much does Waylo cost?", "Trial is free (500 AI messages), Starter is $79/month (3,000 messages), and Growth is $249/month (3 sites, 15,000 messages, Audiences)."],
  ["Is Waylo available now?", "Yes, in early access. Start a free Trial at /signup and set it up yourself. The tour at /how-it-works shows every step."],
];

export const FAQ_GROUPS: { id: string; title: string; items: [string, string][] }[] = [
  { id: "basics", title: "The basics", items: FAQS.slice(0, 2).concat([["How is Waylo different from a generic chatbot?", "Waylo answers only from your crawled pages and the facts you add. Every reply shows numbered source links. It also flags buying intent and can send leads to Slack or your CRM."], FAQS[9]]) },
  { id: "answers", title: "Answers & accuracy", items: [FAQS[2], FAQS[3], ["Can I control what Waylo says?", "Yes. In Guidance you add facts, set rules for what Waylo must never say, and write skills for topics like security or custom pricing."], ["How do I keep answers up to date?", "Crawl your site again from the admin after you publish changes. Facts you add in Guidance apply right away."]] },
  { id: "signals", title: "Signals & handoff", items: [["What is a buying-intent signal?", "A tag Waylo adds when a visitor asks about pricing, integrations, security, or a demo. Signals show up in the admin next to the pages that visitor read."], ["How do leads reach my team?", "On Starter and up, Waylo posts the lead to your Slack channel and any CRM webhook when a visitor shares contact details or asks for a demo. The post has the signals, the last question, and a link to the conversation."], FAQS[6], ["What are Audiences?", "On the Growth plan, Audiences group visitors by behavior and signals, such as everyone who viewed /pricing and asked about integrations."]] },
  { id: "install", title: "Install & performance", items: [FAQS[4], FAQS[5], ["Which embed modes are there?", "There are three. Launcher is a floating button and the default. Sidebar is a panel that stays open. Track shows no chat and only records page views."], ["Can I open the chat from my own button?", "Yes. Call Waylo.open(), Waylo.close(), or Waylo.toggle() from any element on your page."]] },
  { id: "data", title: "Data & AI", items: [FAQS[7], ["Who on my team can see conversations?", "Anyone you invite. Each member is an Owner, Editor, or Viewer, which sets who can change settings and guidance."], ["Where is data stored?", "In a managed Postgres database on Supabase, kept separate by workspace. The app is hosted on Render, and OpenAI writes the replies. The Security page lists every subprocessor."], ["Does Waylo have SSO or SOC 2?", "No. Admin sign-in is email and password, with Owner, Editor, and Viewer roles. Waylo has no SOC 2 or ISO 27001 report."], ["Is my site content used to train AI models?", "Waylo doesn’t train a model on your site. Relevant page text goes to OpenAI’s API with each question. OpenAI’s API terms say that data isn’t used for training by default."], ["Can I delete a visitor’s data?", "Yes. Ask through the support form at /contact. There’s no export or delete button in the admin yet."]] },
  { id: "limits", title: "Honest limits", items: [["Can Waylo read JavaScript-rendered pages or PDFs?", "It reads PDF and .docx files that your pages link to, as long as they contain real text. It can’t read text that JavaScript adds after the page loads, scanned PDFs, or images."], ["How many pages can it crawl?", "It depends on your plan. The Trial reads up to 100 pages, Starter 500, and Growth 2,000. Crawl again after you publish changes."], ["Is there a native HubSpot or Salesforce integration?", "No. Waylo sends a JSON webhook you can route into any CRM with Zapier, Make, or your own endpoint."], ["Can someone on my team reply live in the chat?", "No. There’s no live reply mode. “Talk to a person” alerts your team in Slack, and they follow up by email."], ["Can I white-label the widget?", "No. You set the assistant name, color, and greeting. The footer reads “waylo · answers from this site.”"], ["Is the service always fast?", "Mostly. During early access Waylo runs on a free hosting tier. A keep-alive ping helps, but the first request after a quiet stretch can take a few seconds."]] },
  { id: "pricing", title: "Pricing", items: [FAQS[8], ["Is there a contract?", "No. Plans are monthly through Stripe Checkout, and you can cancel from Billing in the admin. During early access Stripe runs in test mode."]] },
];
