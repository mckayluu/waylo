// Positioning (from App Boss's messaging plan, in our own words). Only shipped behavior goes here.
// Shipped and verified: /try (20 pages, 12 questions, no signup, carries into the Trial),
// automatic re-crawl (every 3 days on the Trial, daily on paid). No plan caps seats. Say "Invite your whole team" or leave seats out.
// HOLD until shipped: "nightly answer checks".
export const MSG = {
  headline: ["Website chat", "that shows its receipts."] as const,
  sub: "Waylo reads your public pages, answers every visitor with a link to the page it used, and tells you who’s ready to buy. Start free and set it up yourself.",
  props: [
    { k: "Answers you can check", t: "teal" as const, d: "Every reply links the page it came from. When your pages don’t cover a question, the chat says so.", href: "/product/citations" },
    { k: "Know who is warm", t: "amber" as const, d: "Questions, the pages people read, and buying signals sit in one admin. On Starter and up, serious visitors post to Slack.", href: "/product/analytics" },
    { k: "Prices on the page", t: "indigo" as const, d: "Start on the free Trial. Paid plans are a flat monthly price with no overage fees. You upgrade from Billing.", href: "/pricing" },
  ],
};
