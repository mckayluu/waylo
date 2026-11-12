// Responder: uses OpenAI if OPENAI_API_KEY is set, otherwise a mock grounded responder.
import { getGuidance, getSettings, type Citation, type Message, type Fact } from "./store";
import { findRelevant } from "./knowledge";
import { DEMO_PAGES, findDemo } from "./demoKnowledge";
import { isDemoSite } from "./tenant";
import { retrieve, retrieveForLLM, sourcesPrompt, hasCrawl, isWayloWs, hasPricingContent } from "./retrieve";
import { retrievalQuestion } from "./markdown";
import { tryCtx } from "./trycontext";

export type Answer = { text: string; citations: Citation[] };
function absUrl(url: string) {
  if (!url || /^https?:\/\//i.test(url) || url.startsWith("mailto:")) return url;
  const base = (process.env.WAYLO_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://waylo-j5hv.onrender.com").replace(/\/$/, "");
  return url.startsWith("/") ? base + url : base + "/" + url;
}
// Strip generic "check the website / contact us" filler from known answers.
const FILLER = /\s*(?:[,;—-]\s*|\.\s*)?(?:(?:for more (?:info(?:rmation)?|details)[^.!?]*?)?(?:please |feel free to |you can |you may |or )*(?:check|visit|see|refer to) (?:our|the) website[^.!?\n]*|(?:please |feel free to |you can )?(?:contact|reach out to) us directly[^.!?\n]*)[.!?]?/gi;
export function stripFiller(t: string) { return t.replace(FILLER, (m) => (/^\s*\./.test(m) ? "." : "")).replace(/[,;]?\s+(?:so|and|or|but|then)\s*(?=[.!?]|\n|$)/gi, "").replace(/[ \t]+\n/g, "\n").replace(/([^.!?\n*)])\s*$/, "$1.").trim(); }
// On known answers, drop closers that push the Contact tab (e.g. "For custom plans..., please reach out through the Contact tab.").
const CONTACT_CLOSER = /(?:^|(?<=[.!?\n]))\s*[^.!?\n]*\b(?:contact tab|reach out|get in touch|contact (?:us|the team|our team|sales))\b[^.!?\n]*[.!?]?\s*$/i;
export function stripContactCloser(t: string) { let prev; do { prev = t; t = t.replace(CONTACT_CLOSER, "").trim(); } while (t !== prev && t.length); return t || prev; }
const UNKNOWN_RE = /couldn'?t find|don'?t have (that|this)|not sure|can'?t quote/i;
const GREETING_RE = /^(hi|hello|hey|thanks|thank you|ok|okay|cool|great|got it|cheers)\b/i;
function isGreeting(s: string) {
  const t = s.trim();
  return GREETING_RE.test(t) && t.split(/\s+/).length <= 8;
}
function priorCitations(history: Message[]): Citation[] {
  for (let i = history.length - 1; i >= 0; i--) {
    const m = history[i];
    if (m.role === "bot" && m.citations?.length) return m.citations.slice(0, 3);
  }
  return [];
}
/** Follow-ups like "and for Growth?" must still get their own chips. Prefer the model's SOURCES, then retrieved pages (using the history-expanded query), then citations from the previous grounded answer. Greetings and "I don't know" stay uncited. */
export function ensureCitations(a: Answer, opts: { question: string; retrieved?: { title: string; url: string }[]; history?: Message[]; builtIn?: { title: string; url: string }[] }): Answer {
  if (!a.text || isGreeting(opts.question) || isGreeting(a.text)) return { ...a, citations: [] };
  const unknown = UNKNOWN_RE.test(a.text);
  if (unknown) return { ...a, citations: a.citations || [] };
  if (a.citations.length) return a;
  const retrieved = opts.retrieved?.length ? cite(opts.retrieved.slice(0, 3)) : [];
  if (retrieved.length) return { ...a, citations: retrieved };
  if (opts.builtIn?.length) return { ...a, citations: cite(opts.builtIn.slice(0, 3)) };
  const prior = priorCitations(opts.history || []);
  if (prior.length) return { ...a, citations: prior };
  return a;
}
/** Ensure known answers carry a citation chip from built-in knowledge (e.g. Pricing & Plans) and no Contact closer. */
async function finalize(a: Answer, question: string, retrievalQ: string, retrieved: { title: string; url: string }[], history: Message[]): Promise<Answer> {
  const builtIn = (await isWayloWs()) ? findRelevant(retrievalQ, 2) : [];
  const out = ensureCitations(a, { question, retrieved, history, builtIn });
  const unknown = UNKNOWN_RE.test(out.text);
  return { text: out.citations.length && !unknown ? stripContactCloser(out.text) : out.text, citations: out.citations };
}
const cite = (ps: { title: string; url: string }[]) => ps.map(({ title, url }) => ({ title, url: absUrl(url) }));

const STOP = new Set("the a an is are was what how do does can i you we our your to of and or for in on it with be my me about".split(" "));
const words = (s: string) => (s.toLowerCase().match(/[a-z0-9$]+/g) || []).filter((w) => w.length > 2 && !STOP.has(w));
// Facts whose words overlap the question (mock retrieval).
function matchFacts(text: string, facts: Fact[]) {
  const q = new Set(words(text));
  return facts.filter((f) => words(f.text).some((w) => q.has(w) || q.has(w.replace(/s$/, ""))));
}
export async function guidancePrompt() {
  const t = tryCtx(); if (t) return `COMPANY: ${t.siteName}`;
  const g = (await getGuidance()); const st = (await getSettings());
  return [
    `COMPANY: ${st.siteName}` + (st.companyProfile ? `\nCOMPANY PROFILE (authoritative):\n${st.companyProfile}` : ""),
    g.facts.length && `AUTHORITATIVE FACTS (override knowledge pages if they conflict):\n${g.facts.map((f) => "- " + f.text).join("\n")}`,
    g.rules.length && `RULES (always obey):\n${g.rules.map((r) => "- " + r.text).join("\n")}`,
    g.skills.length && `SKILLS (playbooks; follow when the visitor's intent matches):\n${g.skills.map((k) => `- ${k.name}: ${k.instructions}`).join("\n")}`,
  ].filter(Boolean).join("\n\n");
}

async function mock(text: string, signals: string[], hasEmail: boolean): Promise<Answer> {
  const g = (await getGuidance()); const facts = matchFacts(text, g.facts);
  const noPricing = g.rules.some((r) => /pric/i.test(r.text) && /(never|don'?t|do not)/i.test(r.text));
  let rel = (await retrieve(text));
  const st = (await getSettings());
  if (st.companyProfile && /\b(who are you|about (you|the company|us)|what (do|does) (you|they|the company) do|company|tell me about)\b/i.test(text))
    return { text: `**About ${st.siteName}:** ${st.companyProfile}`, citations: [] };
  // A "never quote pricing" rule must not hide prices that are actually on crawled pages.
  if (noPricing && !rel.some(hasPricingContent)) rel = rel.filter((k) => k.url !== "/docs/pricing" && !/pric/i.test(k.title));
  const skill = g.skills.find((k) => words(k.name).some((w) => new Set(words(text)).has(w)));
  const tail = skill ? `\n\n_${skill.instructions}_` : "";
  if (facts.length) {
    const out = facts.map((f) => f.text).join("\n\n") + (rel.length ? "\n\n" + rel.map((k) => k.summary).join("\n\n") : "");
    return { text: out + tail, citations: cite(rel) };
  }
  if (noPricing && signals.includes("pricing") && !rel.some(hasPricingContent))
    return { text: "I can't quote pricing here — leave your details in the **Contact** tab and the team will send exact numbers." + tail, citations: [] };
  if (/^(hi|hello|hey)\b/i.test(text.trim()) && rel.length === 0)
    return { text: "Hi! I can help with:\n- **Pricing** and plans\n- **Installing** the sidebar\n- **Booking a demo**\n\nWhat would you like to know?", citations: [] };
  if (rel.length === 0)
    return { text: "I couldn't find that in our knowledge yet. Tell me a bit more, or use the **Contact** tab and the team will follow up.", citations: [] };
  let out = (await hasCrawl()) ? rel.map((k, i) => `${k.summary} [${i + 1}]`).join("\n\n") : rel.map((k) => k.summary).join("\n\n");
  if (signals.includes("demo") || signals.includes("pricing"))
    out += hasEmail ? "\n\nThanks — the team will follow up shortly." : "";
  return { text: out + tail, citations: cite(rel) };
}

export type OnDelta = (t: string) => void | Promise<void>;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function simulate(text: string, onDelta: OnDelta) {
  for (const tok of text.match(/\s*\S+/g) || []) { await onDelta(tok); await sleep(18 + Math.random() * 22); }
}
async function systemPrompt(src: { title: string; url: string; summary: string }[]) {
  const waylo = await isWayloWs(); const name = waylo ? "Waylo" : tryCtx()?.siteName || (await getSettings()).siteName || "this company";
  const sourcedPrices = src.some(hasPricingContent);
  const pricing = waylo
    ? " For pricing, the only current plans are Trial ($0, 14 days, no card, 500 AI replies), Starter ($79/mo, 3,000 replies), and Growth ($249/mo, 3 sites, 15,000 replies). No plan has a seat or team-member limit: teammates are invited from Members with Owner, Editor or Viewer roles; never mention a Free tier, $49 plan, or Enterprise tier. Waylo is fully self-serve: there are no sales calls, setup calls, demos with a person, or founder contact. When a visitor wants to try or buy, point them to the free trial at /signup or pasting their URL on the homepage; for help, the docs at /docs."
    : sourcedPrices
      ? " SOURCES include pricing or plan information. If the visitor asks what a plan costs or how much something is, answer with the figures in SOURCES and cite them. Do not refuse a pricing question when SOURCES contain the answer. Never invent prices that are not in SOURCES or the guidance. You are not Waylo and must not describe Waylo's product unless it appears in SOURCES. Always write at least one sentence before the SOURCES line."
      : " Never quote prices, plans or facts that are not in SOURCES or the guidance; you are not Waylo and must not describe Waylo's product. Always write at least one sentence before the SOURCES line, even when the answer is not available.";
  return `You are ${name}'s concise website assistant. Answer ONLY using the SOURCES below (pages from this website) plus the company guidance. If unsure, say so briefly${waylo ? " and suggest the docs at /docs or starting the free trial at /signup" : " and point the visitor to the **Contact** tab"} — When SOURCES or guidance answer the question, give the answer and STOP — NEVER add "check the website", "visit the website", "contact us directly", "visit the Contact tab", or any similar filler. ${waylo ? "Never suggest contacting the team, booking a call, or the Contact tab." : "Only mention the **Contact** tab when the answer is genuinely missing from SOURCES."}${pricing} Prefer concrete facts from SOURCES over hedging. Use short markdown (bold, bullet lists). After the answer, on a final line write SOURCES: followed by the numbers of the sources you used, comma separated (e.g. SOURCES: 1,3), or SOURCES: none. Follow-up questions still need that SOURCES line with the numbers you used — never write SOURCES: none when the answer came from SOURCES, even if the same facts appeared in earlier turns.\n\n${(await guidancePrompt())}\n\nSOURCES:\n${sourcesPrompt(src)}`;
}
function parse(raw: string, src: { title: string; url: string }[]): Answer {
  const m = raw.match(/\n?SOURCES:\s*([^\n]*)\s*$/i);
  const nums = m ? (m[1].match(/\d+/g) || []).map(Number) : [];
  return { text: stripFiller((m ? raw.slice(0, m.index) : raw).trim()), citations: cite(nums.map((n) => src[n - 1]).filter(Boolean).slice(0, 3)) };
}

/** Last 6 turns (up to 12 messages) for the model. Current question is already in history. */
function llmHistory(history: Message[]) {
  return history.slice(-12).map((m) => ({ role: (m.role === "visitor" ? "user" : "assistant") as "user" | "assistant", content: m.text }));
}

/** Read an OpenAI SSE chat stream, holding back a trailing "SOURCES:" line from onDelta. */
async function readOpenAiStream(r: Response, onDelta: OnDelta, signal?: AbortSignal): Promise<string> {
  const reader = r.body!.getReader(); const dec = new TextDecoder(); let buf = "", raw = "", emitted = 0;
  const emit = async () => {
    const cut = raw.search(/\n?\s*S(O(U(R(C(E(S(:)?)?)?)?)?)?)?\s*$/i);
    const safe = (cut >= 0 ? raw.slice(0, cut) : raw);
    const stop = raw.search(/\n\s*SOURCES:/i); const upto = stop >= 0 ? Math.min(stop, safe.length) : safe.length;
    if (upto > emitted) { await onDelta(raw.slice(emitted, upto)); emitted = upto; }
  };
  try {
    for (;;) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read(); if (done) break;
      buf += dec.decode(value, { stream: true }); const lines = buf.split("\n"); buf = lines.pop()!;
      for (const l of lines) {
        if (!l.startsWith("data:")) continue; const d = l.slice(5).trim(); if (d === "[DONE]") continue;
        try { raw += JSON.parse(d).choices?.[0]?.delta?.content || ""; } catch {}
      }
      await emit();
    }
  } catch (e) {
    if (!signal?.aborted && !(e instanceof DOMException && e.name === "AbortError")) throw e;
  } finally { try { reader.releaseLock(); } catch {} }
  return raw;
}

/** Answer a visitor. If onDelta is given, text is streamed (real OpenAI streaming, or simulated for the mock). */
export async function respond(history: Message[], text: string, signals: string[], hasEmail: boolean, onDelta?: OnDelta, site?: string, signal?: AbortSignal): Promise<Answer> {
  if (isDemoSite(site)) return respondDemo(history, text, onDelta, signal);
  const key = process.env.OPENAI_API_KEY;
  const q = retrievalQuestion(history, text);
  const fallback = async () => { const a = (await mock(q, signals, hasEmail)); a.text = stripFiller(a.text); const f = await finalize(a, text, q, [], history); a.text = f.text; a.citations = f.citations; if (onDelta && !signal?.aborted) await simulate(a.text, onDelta); return a; };
  if (!key) return fallback();
  const src = (await retrieveForLLM(q));
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini", stream: !!onDelta,
        messages: [{ role: "system", content: (await systemPrompt(src)) }, ...llmHistory(history)],
      }),
      signal,
    });
    if (!r.ok) throw new Error(`OpenAI ${r.status}`);
    if (!onDelta) { const j = await r.json(); const raw = j.choices?.[0]?.message?.content; const a = raw ? await finalize(parse(raw, src), text, q, src, history) : undefined; return a?.text ? a : (await fallback()); }
    const raw = await readOpenAiStream(r, onDelta, signal);
    if (!raw) return signal?.aborted ? { text: "", citations: [] } : fallback();
    const a = await finalize(parse(raw, src), text, q, src, history);
    if (!a.text && !signal?.aborted) return fallback();
    return a;
  } catch (e) {
    if (signal?.aborted) return { text: "", citations: [] };
    return fallback();
  }
}

/** /demo Northpoint Ops site: answer only from DEMO_PAGES knowledge (never Waylo plans, crawl, or workspace guidance). */
async function respondDemo(history: Message[], text: string, onDelta?: OnDelta, signal?: AbortSignal): Promise<Answer> {
  const q = retrievalQuestion(history, text);
  const rel = findDemo(q);
  const mockDemo = async (): Promise<Answer> => {
    const a: Answer = rel.length ? { text: rel.map((k) => k.summary).join("\n\n"), citations: cite(rel) }
      : /^(hi|hello|hey)\b/i.test(text.trim()) ? { text: "Hi! I can help with Northpoint Ops **pricing**, **features**, **customers**, or how to **contact sales**.", citations: [] }
      : { text: "I couldn't find that on the Northpoint Ops site. Try asking about pricing, features, or customers — or use the **Contact** tab.", citations: [] };
    if (onDelta && !signal?.aborted) await simulate(a.text, onDelta); return a;
  };
  const key = process.env.OPENAI_API_KEY; if (!key) return mockDemo();
  const src = DEMO_PAGES;
  const sys = `You are the concise website assistant for Northpoint Ops (field service scheduling software). Answer ONLY from the SOURCES below (pages of the Northpoint Ops website). You are not Waylo; never mention Waylo plans or prices. Give exact numbers from SOURCES. If the answer isn't in SOURCES, say so briefly and point to the **Contact** tab; otherwise answer and stop without filler. Use short markdown. After the answer, on a final line write SOURCES: followed by the numbers used, comma separated, or SOURCES: none. Follow-up questions still need that SOURCES line with the numbers you used — never write SOURCES: none when the answer came from SOURCES, even if the same facts appeared in earlier turns.\n\nSOURCES:\n${src.map((k, i) => `[${i + 1}] ${k.title} (${k.url}): ${k.summary}`).join("\n")}`;
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", stream: !!onDelta, messages: [{ role: "system", content: sys }, ...llmHistory(history)] }), signal });
    if (!r.ok) throw new Error(String(r.status));
    if (!onDelta) {
      const raw = (await r.json()).choices?.[0]?.message?.content; if (!raw) return mockDemo();
      const a = ensureCitations(parse(raw, src), { question: text, retrieved: rel, history });
      return a;
    }
    const raw = await readOpenAiStream(r, onDelta, signal);
    if (!raw) return signal?.aborted ? { text: "", citations: [] } : mockDemo();
    const a = ensureCitations(parse(raw, src), { question: text, retrieved: rel, history });
    return a;
  } catch { if (signal?.aborted) return { text: "", citations: [] }; return mockDemo(); }
}
