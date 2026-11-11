"use client";
import { useEffect, useRef, useState } from "react";
type C = { title: string; url: string };
const citeHref = (u: string) => { if (/^https?:\/\//i.test(u) || u.startsWith("mailto:")) return u; const base = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "https://waylo-j5hv.onrender.com"); try { return new URL(u.startsWith("/") ? u : `/${u}`, base).href; } catch { return u; } };
type M = { id?: string; role: "visitor" | "bot"; text: string; citations?: C[]; feedback?: "up" | "down"; streaming?: boolean };
type B = { botName: string; accent: string; greeting: string; published?: boolean; paused?: boolean };

// Tiny safe markdown: **bold**, `code`, "- " bullets, paragraphs.
function inline(s: string, k: string) {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, i) =>
    p.startsWith("**") ? <strong key={k + i}>{p.slice(2, -2)}</strong> : p.startsWith("`") ? <code key={k + i} className="rounded bg-stone-200/70 px-1 text-[12px]">{p.slice(1, -1)}</code> : p);
}
function Md({ text }: { text: string }) {
  return <>{text.split(/\n{2,}/).map((blk, i) => {
    const lines = blk.split("\n");
    if (lines.every((l) => /^\s*[-*] /.test(l))) return <ul key={i} className="my-1 ml-4 list-disc space-y-0.5">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*] /, ""), `${i}-${j}`)}</li>)}</ul>;
    return <p key={i} className="my-1">{lines.map((l, j) => <span key={j}>{j > 0 && <br />}{inline(l, `${i}-${j}`)}</span>)}</p>;
  })}</>;
}

const SITE = () => (typeof location !== "undefined" && new URLSearchParams(location.search).get("site")) || "default";
const api = (path: string) => `${path}?site=${encodeURIComponent(SITE())}`;
// Waylo's own site is fully self-serve: no "talk to a person" / "book a demo"; trial + instant try instead. Customer workspaces unchanged.
const SELF = () => SITE() === "default";
const LS = (k: string) => `${k}:${SITE()}`; // per-site so chats never cross workspaces in the shared widget origin

export default function Widget() {
  const [b, setB] = useState<B>({ botName: "Waylo", accent: "#0f766e", greeting: "Hi! Ask me anything." });
  const [tab, setTab] = useState<"chat" | "contact">("chat");
  const [msgs, setMsgs] = useState<M[]>([]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false); const [menu, setMenu] = useState(false);
  const [cid, setCid] = useState<string | null>(null); const [vid, setVid] = useState<string | null>(null); const end = useRef<HTMLDivElement>(null);
  const [ho, setHo] = useState<"" | "ask" | "sending" | "sent">(""); const [hoEmail, setHoEmail] = useState(""); const [hoNote, setHoNote] = useState("");
  async function requestHuman(e?: React.FormEvent) {
    e?.preventDefault(); setHo("sending");
    try {
      const r = await fetch(api("/api/handoff"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: cid, visitorId: vid, email: hoEmail || undefined, note: hoNote || undefined }) });
      if (!r.ok) throw new Error(); setHo("sent"); localStorage.setItem(LS("waylo_handoff"), "1");
    } catch { setHo("ask"); }
  }
  const [form, setForm] = useState({ name: "", email: "", message: "", consent: false });
  const [fstate, setFstate] = useState<"" | "sending" | "sent" | string>("");

  useEffect(() => {
    fetch(api("/api/branding")).then((r) => r.json()).then(setB).catch(() => {});
    setCid(localStorage.getItem(LS("waylo_cid")));
    const fromUrl = new URLSearchParams(location.search).get("vid");
    let v = fromUrl || localStorage.getItem(LS("waylo_vid"));
    if (!v) v = "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem(LS("waylo_vid"), v); setVid(v);
    if (localStorage.getItem(LS("waylo_handoff"))) setHo("sent");
    try { setMsgs((JSON.parse(localStorage.getItem(LS("waylo_msgs")) || "[]") as M[]).filter((m) => m.text).map((m) => ({ ...m, streaming: false }))); } catch {}
  }, []);
  useEffect(() => { localStorage.setItem(LS("waylo_msgs"), JSON.stringify(msgs)); end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  async function ask(text: string) {
    if (!text || busy) return;
    setInput(""); setBusy(true);
    setMsgs((m) => [...m, { role: "visitor", text }, { role: "bot", text: "", streaming: true }]);
    const patch = (p: Partial<M>) => setMsgs((m) => { const c = [...m]; c[c.length - 1] = { ...c[c.length - 1], ...p }; return c; });
    try {
      const r = await fetch(api("/api/chat"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: cid, text, visitorId: vid, stream: true }) });
      if (!r.ok || !r.body) throw new Error();
      const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = "", acc = "";
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true }); const evs = buf.split("\n\n"); buf = evs.pop()!;
        for (const ev of evs) {
          const name = ev.match(/^event: (.+)$/m)?.[1]; const data = JSON.parse(ev.match(/^data: (.+)$/m)?.[1] || "{}");
          if (name === "meta") { setCid(data.conversationId); localStorage.setItem(LS("waylo_cid"), data.conversationId); patch({ id: data.messageId }); }
          else if (name === "delta") { acc += data.t; patch({ text: acc }); }
          else if (name === "done") { patch({ text: data.reply, citations: data.citations, streaming: false }); if (data.paused) setB((x) => ({ ...x, paused: true })); }
        }
      }
      patch({ streaming: false });
    } catch { patch({ text: "Sorry, something went wrong.", streaming: false }); }
    setBusy(false);
  }
  async function rate(i: number, v: "up" | "down") {
    const m = msgs[i]; if (!m.id || !cid) return; const next = m.feedback === v ? null : v;
    setMsgs((all) => all.map((x, j) => j === i ? { ...x, feedback: next ?? undefined } : x));
    fetch(api("/api/feedback"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: cid, messageId: m.id, feedback: next }) });
  }
  function clear() { localStorage.removeItem(LS("waylo_handoff")); setHo(""); setMsgs([]); setCid(null); localStorage.removeItem(LS("waylo_cid")); localStorage.removeItem(LS("waylo_msgs")); setMenu(false); }
  async function submit(intent: "message" | "demo") {
    if (!form.name || !form.email || !form.message) return setFstate("Please fill in all required fields.");
    if (!form.consent) return setFstate("Please accept the privacy notice.");
    setFstate("sending");
    const r = await fetch(api("/api/leads"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, intent, conversationId: cid }) });
    if (r.ok) { setFstate("sent"); setForm({ name: "", email: "", message: "", consent: false }); } else setFstate((await r.json()).error || "Could not send.");
  }
  const a = b.accent;
  const field = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500";

  return (
    <div className="flex h-screen flex-col bg-stone-50 font-sans text-stone-800" style={{ fontFamily: "ui-sans-serif, 'Segoe UI', system-ui" }}>
      {b.published === false && <div className="bg-amber-50 px-4 py-1.5 text-center text-[11px] font-medium text-amber-800">Preview only — not published yet</div>}
      <header className="px-5 pb-3 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white" style={{ background: a }}>{b.botName[0]}</div>
            <div><p className="font-semibold leading-tight">{b.botName}</p><p className="flex items-center gap-1 text-xs text-stone-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Online now</p></div>
          </div>
          <div className="relative">
            <button onClick={() => setMenu(!menu)} className="rounded-full px-2 py-1 text-lg text-stone-500 hover:bg-stone-200" aria-label="Menu">⋮</button>
            {menu && <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-stone-200 bg-white py-1 text-sm shadow-lg">{!SELF() && <button onClick={() => { setTab("chat"); setHo(ho === "sent" ? "sent" : "ask"); setMenu(false); }} className="block w-full px-3 py-2 text-left hover:bg-stone-100">Talk to a person</button>}<button onClick={clear} className="block w-full px-3 py-2 text-left hover:bg-stone-100">Clear history</button></div>}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 border-b border-stone-200 text-sm">
          {(["chat", "contact"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="-mb-px border-b-2 pb-2 font-medium transition" style={{ borderColor: tab === t ? a : "transparent", color: tab === t ? a : "#78716c" }}>{t === "chat" ? "AI Chat" : "Contact"}</button>))}
        </div>
      </header>

      {tab === "chat" ? (<>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-3">
          <div className="text-sm leading-relaxed"><Md text={b.greeting} /></div>
          {msgs.length === 0 && <div className="flex flex-wrap gap-2">{(SELF() ? ["How much does it cost?", "How do I install it?", "Is there a free trial?"] : ["How much does it cost?", "How do I install it?", "Can I book a demo?"]).map((q) =>
            <button key={q} onClick={() => ask(q)} className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs hover:border-stone-500">{q}</button>)}</div>}
          {msgs.map((m, i) => m.role === "visitor" ? (
            <div key={i} className="flex justify-end"><div className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-white" style={{ background: a }}>{m.text}</div></div>
          ) : (
            <div key={i} className="border-l-2 pl-3 text-sm leading-relaxed" style={{ borderColor: a }}>
              {m.text ? <Md text={m.text} /> : <p className="animate-pulse text-xs text-stone-500">Looking up answers…</p>}{m.streaming && m.text && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse align-middle" style={{ background: a }} />}
              {!!m.citations?.length && <div className="mt-2 flex flex-wrap gap-1.5">{m.citations.map((c, j) =>
                <a key={j} href={citeHref(c.url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2 py-0.5 text-xs hover:border-stone-500">
                  <span className="font-mono text-[10px] font-semibold" style={{ color: a }}>{j + 1}</span>{c.title}</a>)}</div>}
              {m.id && !m.streaming && <div className="mt-1.5 flex gap-1 text-xs text-stone-400">{(["up", "down"] as const).map((v) =>
                <button key={v} onClick={() => rate(i, v)} aria-label={v} className={`rounded px-1.5 py-0.5 hover:bg-stone-200 ${m.feedback === v ? "bg-stone-200 text-stone-700" : ""}`}>{v === "up" ? "👍" : "👎"}</button>)}</div>}
            </div>))}
          <div ref={end} />
        </div>
        {ho === "sent" ? <div className="mx-4 mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs" style={{ background: a + "14", color: a }}><span className="h-2 w-2 animate-pulse rounded-full" style={{ background: a }} /><span><strong>We&apos;ll be with you soon.</strong> A teammate has been notified{hoEmail ? ` and will reply to ${hoEmail}` : ""}.</span></div>
        : ho ? <form onSubmit={requestHuman} className="mx-4 mb-2 space-y-2 rounded-xl border border-stone-200 bg-white p-3 text-sm">
            <div className="flex items-center justify-between"><p className="font-medium">Talk to a person</p><button type="button" onClick={() => setHo("")} className="text-stone-400 hover:text-stone-700" aria-label="Close">×</button></div>
            <input type="email" placeholder="Your email (so we can reply)" value={hoEmail} onChange={(e) => setHoEmail(e.target.value)} className="w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm outline-none focus:border-stone-500" />
            <input placeholder="What do you need help with? (optional)" value={hoNote} onChange={(e) => setHoNote(e.target.value)} className="w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm outline-none focus:border-stone-500" />
            <button disabled={ho === "sending"} className="w-full rounded-lg py-1.5 text-sm font-medium text-white disabled:opacity-50" style={{ background: a }}>{ho === "sending" ? "Requesting…" : "Request a person"}</button>
          </form>
        : SELF() ? <div className="mx-4 mb-1.5 flex justify-end gap-3 text-xs font-medium"><a href="/try" target="_top" className="text-stone-500 hover:text-stone-800">Try it on your site</a><a href="/signup" target="_top" style={{ color: a }} className="hover:underline">Start free trial →</a></div>
        : <div className="mx-4 mb-1.5 flex justify-end"><button onClick={() => setHo("ask")} className="text-xs font-medium text-stone-500 hover:text-stone-800">🙋 Talk to a person</button></div>}
        {b.paused ? <div className="mx-4 mb-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">AI answers are paused right now. <button onClick={() => setTab("contact")} className="font-semibold underline">Leave a message</button> and the team will reply by email.</div> :
        <form onSubmit={(e) => { e.preventDefault(); ask(input.trim()); }} className="mx-4 mb-2 flex items-center gap-2 rounded-2xl border border-stone-300 bg-white p-1.5 pl-3 focus-within:border-stone-500">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything…" className="flex-1 bg-transparent text-sm outline-none" />
          <button disabled={busy || !input.trim()} className="rounded-xl px-3.5 py-1.5 text-sm font-medium text-white disabled:opacity-40" style={{ background: a }}>Send</button>
        </form>}
      </>) : (
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-3 text-sm">
          {fstate === "sent" ? <div className="rounded-xl bg-white p-4 text-center"><p className="font-medium">Thanks — we got it!</p><p className="mt-1 text-stone-500">Someone will reply by email soon.</p><button onClick={() => setFstate("")} className="mt-3 text-xs underline">Send another</button></div> : <>
            <p className="text-stone-600">{SELF() ? "Account or billing question? Leave a message and we'll reply by email. Most answers are in the docs, or just ask the AI Chat." : "Leave a note or book a demo and we'll get back to you."}</p>
            <label className="block">Name*<input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="block">Email*<input type="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="block">Message*<textarea rows={4} className={field} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <label className="flex items-start gap-2 text-xs text-stone-600"><input type="checkbox" className="mt-0.5" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />I agree that my details may be stored so the team can contact me.</label>
            {fstate && fstate !== "sending" && <p className="text-xs text-red-600">{fstate}</p>}
            <div className="flex gap-2 pt-1">
              <button disabled={fstate === "sending"} onClick={() => submit("message")} className="flex-1 rounded-xl border px-3 py-2 font-medium" style={{ borderColor: a, color: a }}>Leave a message</button>
              {SELF() ? <a href="/signup" target="_top" className="flex-1 rounded-xl px-3 py-2 text-center font-medium text-white" style={{ background: a }}>Start free trial</a> : <button disabled={fstate === "sending"} onClick={() => submit("demo")} className="flex-1 rounded-xl px-3 py-2 font-medium text-white" style={{ background: a }}>Book a demo</button>}
            </div>{SELF() && <a href="/try" target="_top" className="block text-center text-xs font-medium text-stone-500 hover:text-stone-800">Or try Waylo on your own site, no signup →</a>}</>}
        </div>)}
      <p className="pb-3 text-center text-[11px] tracking-wide text-stone-400">{/^(northpoint-demo|acme-demo)$/i.test(SITE()) ? "Northpoint Ops · answers from this site" : "waylo · answers from this site"}</p>
    </div>
  );
}
