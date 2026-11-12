// Safe, no-HTML markdown for widget replies: paragraphs, bold, lists, links, inline code.
import type { ReactNode } from "react";

const safeHref = (raw: string) => {
  const u = raw.trim();
  if (!u || /^\s*javascript:/i.test(u) || /^\s*data:/i.test(u)) return null;
  if (/^https?:\/\//i.test(u) || u.startsWith("mailto:") || u.startsWith("/")) return u;
  if (/^www\./i.test(u)) return "https://" + u;
  return null;
};

function inline(s: string, k: string): ReactNode[] {
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<)]+)/g;
  const out: ReactNode[] = [];
  let last = 0, i = 0, m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={k + i}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={k + i} className="rounded bg-stone-200/70 px-1 text-[12px]">{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("[")) {
      const mm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      const href = safeHref(mm[2]);
      out.push(href ? <a key={k + i} href={href} target={href.startsWith("/") ? undefined : "_blank"} rel={href.startsWith("/") ? undefined : "noreferrer"} className="underline decoration-stone-300 underline-offset-2 hover:decoration-stone-500">{mm[1]}</a> : mm[1]);
    } else {
      const href = safeHref(tok);
      out.push(href ? <a key={k + i} href={href} target="_blank" rel="noreferrer" className="underline decoration-stone-300 underline-offset-2 hover:decoration-stone-500 break-all">{tok}</a> : tok);
    }
    i++; last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function isUl(l: string) { return /^\s*[-*] /.test(l); }
function isOl(l: string) { return /^\s*\d+[.)]\s+/.test(l); }

export function SafeMd({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return <>{blocks.map((blk, i) => {
    const lines = blk.split("\n").filter((l, n, a) => l.length > 0 || (n > 0 && n < a.length - 1));
    if (!lines.length) return null;
    if (lines.every(isUl)) return <ul key={i} className="my-1.5 ml-4 list-disc space-y-0.5">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*] /, ""), `${i}-${j}`)}</li>)}</ul>;
    if (lines.every(isOl)) return <ol key={i} className="my-1.5 ml-4 list-decimal space-y-0.5">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""), `${i}-${j}`)}</li>)}</ol>;
    // Tight list mixed into a paragraph block: render list lines as a list, other lines as text.
    if (lines.some(isUl) || lines.some(isOl)) {
      const parts: ReactNode[] = [];
      let buf: string[] = [], kind: "ul" | "ol" | "p" | "" = "";
      const flush = () => {
        if (!buf.length) return;
        const key = `${i}-${parts.length}`;
        if (kind === "ul") parts.push(<ul key={key} className="my-1 ml-4 list-disc space-y-0.5">{buf.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*] /, ""), key + j)}</li>)}</ul>);
        else if (kind === "ol") parts.push(<ol key={key} className="my-1 ml-4 list-decimal space-y-0.5">{buf.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""), key + j)}</li>)}</ol>);
        else parts.push(<p key={key} className="my-1">{buf.map((l, j) => <span key={j}>{j > 0 && <br />}{inline(l, key + j)}</span>)}</p>);
        buf = [];
      };
      for (const l of lines) {
        const k: "ul" | "ol" | "p" = isUl(l) ? "ul" : isOl(l) ? "ol" : "p";
        if (k !== kind) { flush(); kind = k; }
        buf.push(l);
      }
      flush();
      return <div key={i}>{parts}</div>;
    }
    return <p key={i} className="my-1">{lines.map((l, j) => <span key={j}>{j > 0 && <br />}{inline(l, `${i}-${j}`)}</span>)}</p>;
  })}</>;
}

/** Recent visitor turns plus the new question, so follow-ups like "and for Growth?" still retrieve the right pages. */
export function retrievalQuestion(history: { role: string; text: string }[], text: string) {
  const prior = history.filter((m) => m.role === "visitor").map((m) => m.text.trim()).filter(Boolean);
  const earlier = prior.length && prior[prior.length - 1] === text.trim() ? prior.slice(-4, -1) : prior.slice(-3);
  if (!earlier.length) return text;
  return `${earlier.join(" ")} ${text}`.replace(/\s+/g, " ").trim().slice(0, 800);
}
