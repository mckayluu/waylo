// Positioning (from App Boss's messaging plan, in our own words). Only shipped behavior goes here.
// HOLD until shipped: "try it on your own URL without signing up", "nightly answer checks",
// seat counts (still being checked). Add them to `later` slots when confirmed.
export const MSG = {
  headline: ["Website chat", "that shows its receipts."] as const,
  sub: "Waylo reads your public pages, answers every visitor with a link to the page it used, and tells you who’s ready to buy. Start free and set it up yourself.",
  props: [
    { k: "Answers you can check", t: "teal" as const, d: "Every reply links the page it came from. When your pages don’t cover a question, the chat says so.", href: "/product/citations" },
    { k: "Know who is warm", t: "amber" as const, d: "Questions, the pages people read, and buying signals sit in one admin. On Starter and up, serious visitors post to Slack.", href: "/product/analytics" },
    { k: "Prices on the page", t: "indigo" as const, d: "Start on the free Trial. Paid plans are a flat monthly price with no overage fees. You upgrade from Billing.", href: "/pricing" },
  ],
};
