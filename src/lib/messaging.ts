// Positioning (from App Boss's messaging plan, in our own words). Only shipped behavior goes here.
// HOLD until shipped: "try it on your own URL without signing up", "nightly answer checks",
// "unlimited seats" (seats are 1 / 5 / unlimited today). Add them to `later` slots when live.
export const MSG = {
  headline: ["Website chat", "that shows its receipts."] as const,
  sub: "Waylo reads your public pages, answers every visitor with a link to the page it used, and tells you who’s ready to buy. Start free and set it up yourself — no sales call.",
  props: [
    { k: "Answers you can check", t: "teal" as const, d: "Every reply links the page it came from. When your pages don’t cover a question, it says so instead of guessing.", href: "/product/citations" },
    { k: "Know who’s warm", t: "amber" as const, d: "Questions, page journeys, and buying signals in one admin. High-intent visitors post to Slack with a link to the conversation.", href: "/product/analytics" },
    { k: "Self-serve, priced in public", t: "indigo" as const, d: "Free Trial with no card, then flat monthly plans with no overage fees. Sign up, crawl, paste one tag, upgrade from Billing.", href: "/pricing" },
  ],
};
