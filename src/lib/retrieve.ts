// Keyword retrieval (BM25-lite over page chunks). Falls back to mock knowledge if nothing crawled.
import { listPages } from "./store";
import { findRelevant } from "./knowledge";
export type Source = { title: string; url: string; summary: string };
const STOP = new Set("the a an is are was were what how do does can i you we our your to of and or for in on it its with be my me about this that from at by as will would should could have has had any there their them they us".split(" "));
export const terms = (s: string) => (s.toLowerCase().match(/[a-z0-9$]+/g) || []).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/(ies)$/, "y").replace(/(?<!s)s$/, ""));

type Chunk = { url: string; title: string; text: string; tf: Map<string, number>; len: number };
let cache: { key: string; chunks: Chunk[]; df: Map<string, number>; avg: number } | null = null;
async function index() {
  const pages = (await listPages()); const key = pages.map((p) => p.id + p.updatedAt).join("|");
  if (cache?.key === key) return cache;
  const chunks: Chunk[] = [];
  for (const p of pages) {
    const paras = p.text.split("\n"); let buf = "";
    const push = () => { if (buf.trim().length > 40) { const t = terms(p.title + " " + buf); const tf = new Map<string, number>(); t.forEach((w) => tf.set(w, (tf.get(w) || 0) + 1)); chunks.push({ url: p.url, title: p.title, text: buf.trim(), tf, len: t.length }); } buf = ""; };
    for (const para of paras) { if ((buf + para).length > 900) push(); buf += para + "\n"; } push();
  }
  const df = new Map<string, number>(); chunks.forEach((c) => c.tf.forEach((_, w) => df.set(w, (df.get(w) || 0) + 1)));
  cache = { key, chunks, df, avg: chunks.reduce((n, c) => n + c.len, 0) / Math.max(1, chunks.length) };
  return cache;
}
function bestSentences(text: string, q: Set<string>, max = 3) {
  const sents = text.replace(/\n+/g, ". ").split(/(?<=[.!?])\s+/).map((s) => s.replace(/^\.\s*/, "").trim()).filter((s) => s.length > 25 && s.length < 400);
  const scored = sents.map((s, i) => ({ s, i, n: new Set(terms(s).filter((w) => q.has(w))).size })).filter((x) => x.n > 0);
  return scored.sort((a, b) => b.n - a.n || a.i - b.i).slice(0, max).sort((a, b) => a.i - b.i).map((x) => x.s.replace(/\.\.$/, ".")).join(" ");
}
export async function hasCrawl() { return (await listPages()).length > 0; }
export async function retrieve(question: string, max = 3): Promise<Source[]> {
  if (!(await hasCrawl())) return findRelevant(question, max).map(({ title, url, summary }) => ({ title, url, summary }));
  const { chunks, df, avg } = (await index()); const q = terms(question); if (!q.length) return [];
  const N = chunks.length, k1 = 1.2, b = 0.75;
  const scored = chunks.map((c) => ({ c, s: q.reduce((sum, w) => { const f = c.tf.get(w) || 0; if (!f) return sum; const idf = Math.log(1 + (N - df.get(w)! + 0.5) / (df.get(w)! + 0.5)); return sum + idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * c.len / avg)); }, 0) + q.filter((w) => terms(c.title).includes(w)).length * 1.5 }))
    .filter((x) => x.s > 0.8).sort((a, b) => b.s - a.s);
  const out: Source[] = []; const seen = new Set<string>(); const qs = new Set(q);
  for (const { c } of scored) { if (seen.has(c.url)) continue; seen.add(c.url);
    const summary = bestSentences(c.text, qs) || c.text.slice(0, 300);
    out.push({ title: c.title, url: c.url, summary }); if (out.length >= max) break; }
  return out;
}
export function sourcesPrompt(src: Source[]) {
  return src.map((s, i) => `[${i + 1}] ${s.title} (${s.url})\n${s.summary}`).join("\n\n") || "(no matching pages)";
}
/** For the OpenAI path: give the model more context per source than the mock snippet. */
export async function retrieveForLLM(question: string, max = 4) {
  if (!(await hasCrawl())) return retrieve(question, max);
  const { chunks } = (await index()); const hits = (await retrieve(question, max));
  return hits.map((h) => ({ ...h, summary: chunks.filter((c) => c.url === h.url).map((c) => c.text).join("\n").slice(0, 2500) }));
}
