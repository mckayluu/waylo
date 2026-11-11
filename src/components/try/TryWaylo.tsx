"use client";
import { useEffect, useRef, useState } from "react";
type S = { id: string; host: string; siteName: string; status: "running" | "done" | "error"; found: number; message?: string; pages: { title: string; url: string }[]; total: number; suggestions: string[]; repliesLeft: number };
type M = { role: "visitor" | "bot"; text: string; citations?: { title: string; url: string }[]; streaming?: boolean };
function Md({ text }: { text: string }) {
  return <>{text.split(/\n{2,}/).map((blk, i) => { const lines = blk.split("\n"); const inl = (s: string, k: string) => s.split(/(\*\*[^*]+\*\*)/g).map((p, j) => p.startsWith("**") ? <strong key={k + j}>{p.slice(2, -2)}</strong> : p);
    return lines.every((l) => /^\s*[-*] /.test(l)) ? <ul key={i} className="my-1 ml-4 list-disc">{lines.map((l, j) => <li key={j}>{inl(l.replace(/^\s*[-*] /, ""), `${i}${j}`)}</li>)}</ul> : <p key={i} className="my-1">{lines.map((l, j) => <span key={j}>{j > 0 && <br />}{inl(l, `${i}${j}`)}</span>)}</p>; })}</>;
}
/** Paste a URL → Waylo reads ~20 pages → chat with your own site. No account; nothing is saved. */
export function TryWaylo({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState(""); const [s, setS] = useState<S | null>(null); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<M[]>([]); const [q, setQ] = useState(""); const [asking, setAsking] = useState(false); const [left, setLeft] = useState<number | null>(null);
  const [secs, setSecs] = useState(0); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [msgs]);
  useEffect(() => { const id = new URLSearchParams(location.search).get("try"); if (id) poll(id); }, []);
  async function poll(id: string) {
    setBusy(true); const t0 = Date.now();
    for (let i = 0; i < 90; i++) {
      const r = await fetch(`/api/try?id=${encodeURIComponent(id)}`); const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j.error || "Something went wrong"); setBusy(false); return; }
      setS(j); setSecs(Math.round((Date.now() - t0) / 1000));
      if (j.status !== "running") { setBusy(false); setLeft(j.repliesLeft); if (j.status === "error") setErr(j.message || "We couldn't read that site."); return; }
      await new Promise((ok) => setTimeout(ok, 1500));
    }
    setBusy(false);
  }
  async function start(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setS(null); setMsgs([]); if (!url.trim()) return;
    setBusy(true);
    const r = await fetch("/api/try", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setErr(j.error || "Couldn't start"); setBusy(false); return; }
    history.replaceState(null, "", `${location.pathname}?try=${j.id}${location.hash}`);
    poll(j.id);
  }
  async function ask(text: string) {
    if (!s || !text.trim() || asking) return; setQ(""); setAsking(true);
    const hist = msgs.map(({ role, text }) => ({ role, text }));
    setMsgs((m) => [...m, { role: "visitor", text }, { role: "bot", text: "", streaming: true }]);
    const patch = (p: Partial<M>) => setMsgs((m) => { const c = [...m]; c[c.length - 1] = { ...c[c.length - 1], ...p }; return c; });
    try {
      const r = await fetch("/api/try/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: s.id, text, history: hist }) });
      if (!r.ok || !r.body) { const j = await r.json().catch(() => ({})); patch({ text: j.error || "Something went wrong.", streaming: false }); if (j.limit) setLeft(0); setAsking(false); return; }
      const rd = r.body.getReader(); const dec = new TextDecoder(); let buf = "", acc = "";
      for (;;) { const { done, value } = await rd.read(); if (done) break; buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n"); buf = parts.pop()!;
        for (const p of parts) { const ev = p.match(/^event: (\w+)/)?.[1]; const d = p.match(/data: (.*)$/m)?.[1]; if (!ev || !d) continue; const data = JSON.parse(d);
          if (ev === "delta") { acc += data.t; patch({ text: acc }); } else if (ev === "done") { patch({ text: data.reply, citations: data.citations, streaming: false }); if (typeof data.repliesLeft === "number") setLeft(data.repliesLeft); } } }
    } catch { patch({ text: "Something went wrong.", streaming: false }); }
    setAsking(false);
  }
  const signup = s ? `/signup?try=${encodeURIComponent(s.id)}` : "/signup";
  return <div className={`rounded-md border border-warm-200 bg-white text-left text-warm-800 shadow-xl ${compact ? "p-4" : "p-5 sm:p-6"}`} data-try-waylo>
    {(!s || s.status === "error") && <form onSubmit={start} className="flex flex-col gap-2 sm:flex-row">
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourcompany.com" aria-label="Your website" className="min-w-0 flex-1 rounded-md border border-warm-300 px-4 py-3 text-base outline-none focus:border-navy-600" />
      <button disabled={busy} className="rounded-md bg-navy-700 px-5 py-3 font-semibold text-white hover:bg-navy-800 disabled:opacity-60">{busy ? "Starting…" : "Try it on my site"}</button>
    </form>}
    {!s && !err && <p className="mt-2 text-xs text-warm-500">No account, no card. Waylo reads up to 20 public pages and you can ask it 12 questions. Nothing is saved; the preview expires in an hour.</p>}
    {err && <p className="mt-2 text-sm text-rasp-700">{err}</p>}
    {s?.status === "running" && <div className="py-2">
      <p className="font-medium">Reading {s.host}…</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-warm-100"><div className="h-full bg-navy-600 transition-all" style={{ width: `${Math.max(6, (s.found / 20) * 100)}%` }} /></div>
      <p className="mt-1.5 text-xs text-warm-500">{s.found} of up to 20 pages · {secs}s · sitemap first, then links</p>
    </div>}
    {s?.status === "done" && <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-warm-100 pb-3">
        <div><p className="font-semibold">Chat with {s.siteName}</p><p className="text-xs text-warm-500">Read {s.total} pages of {s.host} in {secs}s · answers cite those pages</p></div>
        <a href={signup} className="rounded-md bg-rasp-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rasp-700">Start free trial with this site →</a>
      </div>
      <div className={`${compact ? "max-h-72" : "max-h-96"} space-y-3 overflow-y-auto py-3 text-sm`}>
        {msgs.length === 0 && <div className="flex flex-wrap gap-2">{s.suggestions.map((x) => <button key={x} onClick={() => ask(x)} className="rounded-full border border-warm-300 px-3 py-1 text-xs hover:border-navy-600">{x}</button>)}</div>}
        {msgs.map((m, i) => m.role === "visitor" ? <div key={i} className="flex justify-end"><div className="max-w-[85%] rounded-md rounded-br-sm bg-navy-700 px-3.5 py-2 text-white">{m.text}</div></div> :
          <div key={i} className="border-l-2 border-navy-600 pl-3 leading-relaxed">{m.text ? <Md text={m.text} /> : <p className="animate-pulse text-xs text-warm-500">Looking through {s.host}…</p>}
            {!!m.citations?.length && <div className="mt-2 flex flex-wrap gap-1.5">{m.citations.map((c, j) => <a key={j} href={c.url} target="_blank" rel="noreferrer nofollow" className="rounded-md border border-warm-300 px-2 py-0.5 text-xs hover:border-navy-600"><span className="mr-1 font-mono text-[10px] font-semibold text-navy-700">{j + 1}</span>{c.title}</a>)}</div>}</div>)}
        <div ref={end} />
      </div>
      {left === 0 ? <div className="rounded-md bg-rasp-50 p-3 text-sm text-rasp-950">That's the free preview. <a href={signup} className="font-semibold underline">Start your free trial</a> and we'll bring {s.host} with you: 100 pages, 500 replies, 14 days, no card.</div> :
      <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Ask ${s.siteName} anything…`} className="min-w-0 flex-1 rounded-md border border-warm-300 px-3 py-2 text-sm outline-none focus:border-navy-600" /><button disabled={asking || !q.trim()} className="rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Ask</button></form>}
      <p className="mt-2 text-[11px] text-warm-500">{left ?? 12} questions left in this preview · <button onClick={() => { setS(null); setMsgs([]); setErr(""); history.replaceState(null, "", location.pathname); }} className="underline">try another site</button></p>
    </div>}
  </div>;
}
