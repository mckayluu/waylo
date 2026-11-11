import type { InfoDef } from "./types";
const C: [string, string] = ["Compare", "/compare"];
export const COMPARE: InfoDef[] = [
{ path: "/compare/generic-chatbots", crumb: "Waylo vs generic AI chatbots", parent: C, eyebrow: "Compare", hero: "widget",
  title: "Waylo vs a generic AI chatbot on your site",
  sub: "Most AI chat widgets are a general model with your site pasted in. That works until it confidently says something your site never said.",
  answer: "A generic AI chatbot answers from a general model, sometimes with your content added. Waylo answers only from your crawled pages and guidance, links the pages it used, says when it doesn’t know, and turns buying questions into Slack alerts. Generic bots usually win on channels, integrations, and flow builders.",
  metaTitle: "Waylo vs generic AI chatbots", metaDesc: "An honest comparison of Waylo’s cited-answer website chat and generic AI chatbots: grounding, citations, unknown answers, buying signals, Slack routing, and where generic tools are stronger.",
  blocks: [
    { t: "table", eyebrow: "Side by side", h: "What’s actually different", head: ["", "Waylo", "Typical generic AI chatbot"], rows: [
      ["Where answers come from", "Your crawled pages + your Facts, Rules, Skills", "A general model, often with your docs added"], ["Shows sources", "Numbered chips linking the pages used, on every answer", "Sometimes; often no links"],
      ["When it doesn’t know", "Says so and offers Contact or a person", "Often guesses"], ["Buying intent", "Pricing, demo, enterprise, integration signals; high-intent flag", "Usually not tracked"],
      ["Sales handoff", "Slack alert + JSON webhook with a link to the conversation", "Varies; often email transcripts"], ["Journeys", "Pages viewed before and during the chat", "Varies"],
      ["Channels", "Website only", "Often web, WhatsApp, Messenger, email"], ["Integrations", "Slack + one JSON webhook", "Often dozens of native apps"],
      ["Flow builder", "None; Guidance rules and skills instead", "Often visual flows and buttons"], ["Maturity", "Early access", "Usually established"]],
      note: "“Typical generic AI chatbot” describes the category, not a specific product. Check any vendor’s current features yourself." },
    { t: "prose", eyebrow: "The real question", h: "Would you let it talk to a buyer unsupervised?", p: ["The risk with a website bot isn’t that it’s unhelpful. It’s that it says your product does something it doesn’t, to the person deciding whether to buy.", "Waylo’s answer is narrow on purpose: only your pages, always the link, and “I don’t know” when the pages are silent. You give up breadth. You get answers you can check, and a list of what your site is missing."], aside: { title: "Pick a generic bot if", tone: "amber", items: ["You need WhatsApp, Messenger, or email channels", "You want a visual flow builder with buttons", "You need native CRM or helpdesk apps today", "You want answers beyond what your site says"] } },
    { t: "shots", eyebrow: "See it", h: "What “cited” looks like in practice", keys: ["answer", "content"] },
    { t: "faq", items: [["Can’t I get citations from any GPT-based bot?", "Some can. Check whether the links point to your exact pages, whether it refuses when nothing matches, and whether you can see which page each answer used afterward."], ["Is Waylo a GPT wrapper?", "It uses OpenAI’s API to write replies. The product is everything around the model: the crawl, retrieval, guidance, citations, signals, routing, and the admin."]] }],
  related: [["Waylo vs live chat", "/compare/live-chat", "People vs AI on your site."], ["How to make a site chatbot cite sources", "/resources/make-a-website-chatbot-cite-sources", "Guide."], ["Citations", "/product/citations", "How chips work."]] },

{ path: "/compare/live-chat", crumb: "Waylo vs live chat", parent: C, eyebrow: "Compare", hero: "conv",
  title: "Waylo vs live chat staffed by your team",
  sub: "Live chat puts a person on the other end. Waylo answers instantly from your pages and brings a person in when it matters. Plenty of teams want both.",
  answer: "Live chat tools route visitor messages to people on your team in a shared inbox. Waylo answers visitors automatically from your site with cited sources, around the clock, and alerts your team in Slack when a visitor is high-intent or asks for a person. Waylo has no agent inbox; follow-up happens by email or call.",
  metaTitle: "Waylo vs live chat", metaDesc: "Compare Waylo’s cited AI website chat with staffed live chat: coverage, speed, accuracy, staffing, handoff, and when you should use live chat instead or alongside.",
  blocks: [
    { t: "table", eyebrow: "Side by side", h: "Different jobs", head: ["", "Waylo", "Live chat (staffed)"], rows: [
      ["Who answers", "AI, from your pages and guidance", "Your team"], ["Hours", "24/7", "When someone is online"], ["First reply", "Seconds", "Depends on staffing"],
      ["Accuracy", "Limited to your pages; links its sources", "As good as the person"], ["Judgment, negotiation", "No; hands off", "Yes"],
      ["Agent inbox", "None. Slack alerts + admin", "Yes, the core feature"], ["Mobile apps for agents", "No", "Usually"], ["Cost driver", "AI messages per month", "Seats and people’s time"]] },
    { t: "split", eyebrow: "Choosing", h: "Which one, or both", left: { title: "Waylo alone works when", items: ["Most questions are answered somewhere on your site", "Nobody can staff chat all day", "You want warm leads in Slack, not a new inbox", "Evaluators visit outside business hours"] }, right: { title: "Keep live chat when", items: ["You sell through real-time conversation", "Questions need account access or judgment", "You have people staffing chat now and it converts", "You need agent apps and routing rules"] } },
    { t: "slack", eyebrow: "The handoff", h: "Where Waylo stops and your team starts", p: ["When a visitor clicks “Talk to a person” or turns high-intent, your team gets a Slack message with their words and a link to the conversation. The follow-up is yours, by email or a call."] },
    { t: "faq", items: [["Can Waylo hand off to my live chat tool?", "Not natively. You can send handoffs to a webhook and use Zapier or Make to open a conversation or ticket elsewhere."], ["Can a person reply inside the Waylo widget?", "No. Waylo has no live agent mode."]] }],
  related: [["Waylo vs generic chatbots", "/compare/generic-chatbots", "AI vs AI."], ["Lead capture", "/product/lead-capture", "Contact and handoff."], ["Slack routing", "/product/slack-routing", "Alerts."]] },
];
