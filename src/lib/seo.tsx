import type { Metadata } from "next";
export const SITE_URL = (process.env.WAYLO_PUBLIC_URL || process.env.NEXT_PUBLIC_WAYLO_URL || "https://waylo-j5hv.onrender.com").replace(/\/$/, "");
export const SITE_NAME = "Waylo";
export const TAGLINE = "AI website chat that answers with cited sources and turns conversations into sales signals.";
export const DEFINITION = "Waylo is an AI chat for B2B and SaaS websites. It learns your public pages, answers visitor questions with links to its sources, detects buying intent, and hands warm leads to your team in Slack or your CRM. It installs with one script tag.";

export const OG = { url: "/brand/og.png", width: 1200, height: 630, alt: "Waylo — AI website chat that shows its sources" };
export function pageMeta(path: string, title: string, description: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title: `${title} | Waylo`, description, url: path, siteName: SITE_NAME, type: "website", images: [OG] }, twitter: { card: "summary_large_image", images: ["/brand/og.png"], title: `${title} | Waylo`, description } };
}
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
export const orgLd = { "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/brand/mark.svg`, email: "hello@waylo.ai", description: TAGLINE };
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
  ["Integrations", "Slack and outbound webhooks (HubSpot, Salesforce, Zapier, Make)"],
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
  ["Does Waylo work with my CRM?", "Yes, via webhooks that work with HubSpot, Salesforce, Zapier, Make, and most CRMs. Native apps are on the roadmap."],
  ["Which AI model does Waylo use?", "OpenAI models. Your content is sent to OpenAI only to generate replies. See the Privacy Policy."],
  ["How much does Waylo cost?", "Trial is free (500 AI messages), Starter is $79/month (3,000 messages), and Growth is $249/month (3 sites, 15,000 messages, Audiences)."],
  ["Is Waylo available now?", "Waylo is in early access. Request access and we’ll set up your site with you."],
];
