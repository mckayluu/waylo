// Keyword-based signal + theme detection. Later: replace/augment with LLM classification.
const SIGNAL_RULES: Record<string, RegExp> = {
  pricing: /\b(price|pricing|cost|how much|quote|plan|plans)\b/i,
  demo: /\b(demo|walkthrough|trial|book a call|meeting|talk to sales)\b/i,
  "ready-to-buy": /\b(buy|purchase|sign up|get started|contract|invoice)\b/i,
  enterprise: /\b(enterprise|sso|security|compliance|soc ?2|team of \d+|seats)\b/i,
  integration: /\b(integrat\w*|api|hubspot|salesforce|crm|zapier)\b/i,
  support: /\b(help|issue|broken|bug|not working|support)\b/i,
};
const HIGH_INTENT = ["pricing", "demo", "ready-to-buy", "enterprise"];

export function detectSignals(text: string): string[] {
  return Object.entries(SIGNAL_RULES).filter(([, r]) => r.test(text)).map(([k]) => k);
}
export function mergeSignals(existing: string[], found: string[]): string[] {
  const s = new Set([...existing, ...found]);
  if ([...s].filter((x) => HIGH_INTENT.includes(x)).length >= 2 || s.has("ready-to-buy")) s.add("high-intent");
  return [...s];
}
export function inferVisitorType(signals: string[]): string {
  if (signals.includes("enterprise")) return "Enterprise buyer";
  if (signals.includes("high-intent")) return "Hot prospect";
  if (signals.includes("support")) return "Existing customer";
  if (signals.some((s) => ["pricing", "demo", "integration"].includes(s))) return "Evaluator";
  return "Browser";
}
export const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
