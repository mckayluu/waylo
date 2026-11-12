// Suggested questions for the widget empty state: configured first, then crawled pages, then generics.
export type SuggestPage = { title: string; url: string };

const SELF_DEFAULTS = ["How much does it cost?", "How do I install it?", "Is there a free trial?", "How does the crawl work?"];
const DEMO_DEFAULTS = ["How much is Pro per tech?", "What does Northpoint Ops do?", "Do you sync with QuickBooks?", "Can I book a walkthrough?"];
const GENERIC = ["How much does it cost?", "How does it work?", "Can I book a demo?"];

const RULES: [RegExp, string][] = [
  [/pric|plan|cost/i, "How much does it cost?"],
  [/install|setup|getting.?started/i, "How do I install it?"],
  [/how.?it.?works|how-it-works/i, "How does it work?"],
  [/feature/i, "What features are included?"],
  [/demo|contact|walkthrough/i, "Can I book a demo?"],
  [/faq|docs|help|guide/i, "Where can I find the docs?"],
];

export function cleanStarters(raw: unknown, max = 4): string[] {
  const list = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split("\n") : [];
  const out: string[] = [];
  for (const x of list) {
    const s = String(x || "").replace(/\s+/g, " ").trim().slice(0, 80);
    if (s && !out.includes(s)) out.push(s);
    if (out.length >= max) break;
  }
  return out;
}

export function starterSuggestions(opts: { configured?: unknown; pages?: SuggestPage[]; self?: boolean; demo?: boolean }): string[] {
  const configured = cleanStarters(opts.configured);
  if (configured.length) return configured;
  if (opts.demo) return DEMO_DEFAULTS;
  if (opts.self) return SELF_DEFAULTS;
  const qs: string[] = [];
  const pages = opts.pages || [];
  for (const [re, q] of RULES) {
    if (pages.some((p) => re.test(p.title || "") || re.test(p.url || "")) && !qs.includes(q)) qs.push(q);
    if (qs.length >= 4) return qs;
  }
  for (const p of pages) {
    const t = (p.title || "").replace(/\s*[|\-–—].*$/, "").trim();
    if (t.length < 4 || t.length > 40) continue;
    const q = /^(how |what |can |is |do )/i.test(t) ? t : `Tell me about ${t}`;
    if (!qs.includes(q)) qs.push(q);
    if (qs.length >= 4) break;
  }
  for (const d of GENERIC) {
    if (qs.length >= 3) break;
    if (!qs.includes(d)) qs.push(d);
  }
  return qs.slice(0, 4);
}

/** Large empty-state headline: short custom welcome, otherwise the ChatGPT-style default. */
const GENERIC_GREETING = /^(hi[!.,]?\s+)?((i['’]m\s+.+\s+ai assistant[.!]?\s*)?ask me anything\b.*)?$/i;
export function emptyHeadline(greeting?: string): string {
  const g = (greeting || "").replace(/\s+/g, " ").trim();
  if (!g || GENERIC_GREETING.test(g) || /^hi[!.,]?\s+i['’]m\s+/i.test(g) && /ask me anything/i.test(g)) return "What can I help you find?";
  const first = (g.split(/(?<=[.!?])\s+/)[0] || g).replace(/[.!?]+$/, "").trim();
  if (first.length >= 8 && first.length <= 70) return first;
  if (g.length <= 70) return g.replace(/[.!?]+$/, "").trim();
  return "What can I help you find?";
}
