import type { InfoDef } from "./types";
const C: [string, string] = ["Compare", "/compare"];
export const COMPARE: InfoDef[] = [
{ path: "/compare/generic-chatbots", crumb: "Waylo and generic AI chatbots", parent: C, eyebrow: "Compare", hero: "widget",
  title: "Waylo compared with a generic AI chatbot",
  sub: "Many AI chat widgets are a general model with your site pasted in. That works until one tells a buyer something your site never said.",
  answer: "A generic AI chatbot answers from a general model, sometimes with your content added. Waylo answers only from your crawled pages and guidance. It links the pages it used, says when it doesn’t know, and can turn buying questions into Slack alerts. Generic bots usually offer more channels, integrations, and flow builders.",
  metaTitle: "Waylo compared with generic AI chatbots", metaDesc: "A plain comparison of Waylo and generic AI chatbots. Where answers come from, sources, unknown answers, buying signals, Slack routing, and where generic tools are stronger.",
  blocks: [
    { t: "table", eyebrow: "Side by side", h: "Where they differ", head: ["", "Waylo", "Typical generic AI chatbot"], rows: [
      ["Where answers come from", "Your crawled pages and your Facts, Rules, and Skills", "A general model, often with your docs added"], ["Shows sources", "Numbered chips linking the pages used, on every answer", "Sometimes. Often no links."],
      ["When it doesn’t know", "Says so and offers Contact or a person", "Often guesses"], ["Buying intent", "Pricing, demo, enterprise, and integration signals, plus a high-intent flag", "Usually not tracked"],
      ["Sales handoff", "Slack alert and JSON webhook with a link to the conversation (every plan)", "Varies. Often email transcripts."], ["Journeys", "Pages viewed before and during the chat", "Varies"],
      ["Channels", "Website only", "Often web, WhatsApp, Messenger, email"], ["Integrations", "Slack and one JSON webhook", "Often dozens of native apps"],
      ["Flow builder", "None. You use Guidance rules and skills.", "Often visual flows and buttons"], ["Maturity", "Early access", "Usually established"]],
      note: "“Typical generic AI chatbot” describes the category. It doesn’t describe any one product. Check each vendor’s current features yourself." },
    { t: "prose", eyebrow: "The real question", h: "Would you let it talk to a buyer alone?", p: ["The real risk with a website bot is that it tells the person deciding whether to buy that your product does something it doesn’t.", "Waylo is narrow on purpose. It uses only your pages, always shows the link, and says “I don’t know” when the pages are silent. You give up breadth. You get answers you can check and a list of what your site is missing."], aside: { title: "Pick a generic bot if", tone: "amber", items: ["You need WhatsApp, Messenger, or email channels", "You want a visual flow builder with buttons", "You need native CRM or helpdesk apps today", "You want answers beyond what your site says"] } },
    { t: "shots", eyebrow: "See it", h: "What a cited answer looks like", keys: ["answer", "content"] },
    { t: "faq", items: [["Can’t I get citations from any GPT-based bot?", "Some can. Check whether the links point to your exact pages, whether it refuses when nothing matches, and whether you can see which page each answer used afterward."], ["Is Waylo a GPT wrapper?", "It uses OpenAI’s API to write replies. The product is everything around the model: the crawl, retrieval, guidance, citations, signals, routing, and the admin."]] }],
  related: [["Waylo and live chat", "/compare/live-chat", "People and AI on your site."], ["How to make a site chatbot cite sources", "/resources/make-a-website-chatbot-cite-sources", "Guide."], ["Citations", "/product/citations", "How chips work."]] },

{ path: "/compare/live-chat", crumb: "Waylo and live chat", parent: C, eyebrow: "Compare", hero: "conv",
  title: "Waylo compared with staffed live chat",
  sub: "Live chat puts a person on the other end. Waylo answers right away from your pages and brings a person in when it matters. Plenty of teams use both.",
  answer: "Live chat tools send visitor messages to people on your team in a shared inbox. Waylo answers visitors from your site with cited sources at any hour. It alerts your team in Slack when a visitor is high-intent or asks for a person. Waylo has no agent inbox, so follow-up happens by email.",
  metaTitle: "Waylo compared with live chat", metaDesc: "How Waylo’s cited AI website chat compares with staffed live chat on hours, speed, accuracy, staffing, and handoff, and when to keep live chat.",
  blocks: [
    { t: "table", eyebrow: "Side by side", h: "They do different jobs", head: ["", "Waylo", "Live chat (staffed)"], rows: [
      ["Who answers", "AI, from your pages and guidance", "Your team"], ["Hours", "24/7", "When someone is online"], ["First reply", "Seconds", "Depends on staffing"],
      ["Accuracy", "Limited to your pages, with source links", "As good as the person"], ["Judgment and negotiation", "No. It hands off.", "Yes"],
      ["Agent inbox", "None. Slack alerts and the admin.", "Yes, it’s the core feature"], ["Mobile apps for agents", "No", "Usually"], ["Cost driver", "AI messages per month", "Seats and people’s time"]] },
    { t: "split", eyebrow: "Choosing", h: "Choosing one or both", left: { title: "Waylo alone works when", items: ["Most questions are answered somewhere on your site", "Nobody can staff chat all day", "You want warm leads in Slack", "Evaluators visit outside business hours"] }, right: { title: "Keep live chat when", items: ["You sell through real-time conversation", "Questions need account access or judgment", "You have people staffing chat now and it converts", "You need agent apps and routing rules"] } },
    { t: "slack", eyebrow: "The handoff", h: "Where Waylo stops and your team starts", p: ["When a visitor clicks “Talk to a person” or turns high-intent, your team gets a Slack message with their words and a link to the conversation. Your team handles the follow-up."] },
    { t: "faq", items: [["Can Waylo hand off to my live chat tool?", "Not natively. You can send handoffs to a webhook and use Zapier or Make to open a conversation or ticket elsewhere."], ["Can a person reply inside the Waylo widget?", "No. Waylo has no live agent mode."]] }],
  related: [["Waylo and generic chatbots", "/compare/generic-chatbots", "Two kinds of AI chat."], ["Lead capture", "/product/lead-capture", "Contact and handoff."], ["Slack routing", "/product/slack-routing", "Alerts."]] },
];
