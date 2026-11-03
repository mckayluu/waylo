"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { CopyButton } from "../settings/CopyButton";

export function SnippetBuilder({ url, site = "default", initialOpen = false }: { url: string; site?: string; initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const r = useRouter();
  const s = `<script src="${url}/waylo.js" data-site="${site}"${open ? ' data-open="true"' : ""} async></script>`;
  async function flip() {
    if (busy) return;
    const n = !open;
    setBusy(true); setOpen(n); setErr(""); setSaved(false);
    const res = await api<{ openOnLoad?: boolean }>("/api/settings", { method: "PUT", json: { openOnLoad: n } });
    setBusy(false);
    if (!res.ok) { setOpen(!n); setErr(res.error); return; }
    setOpen(!!res.data.openOnLoad); setSaved(true); setTimeout(() => setSaved(false), 1500); r.refresh();
  }
  return (<div>
    <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-stone-700">
      <button type="button" role="switch" aria-checked={open} aria-busy={busy} disabled={busy} onClick={flip}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${open ? "bg-teal-600" : "bg-stone-300"} ${busy ? "opacity-70" : ""}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${open ? "left-5" : "left-0.5"}`} />
      </button>
      <span><b>Open chat on page load</b> — the chat panel opens automatically when visitors land (adds <code>data-open=&quot;true&quot;</code>).{saved && <span className="ml-2 text-teal-700">Saved</span>}{err && <span className="ml-2 text-rose-600">{err}</span>}</span>
    </label>
    <div className="relative"><pre className="overflow-x-auto rounded-xl bg-stone-900 p-4 pr-24 text-sm text-teal-200">{s}</pre><div className="absolute right-2 top-2"><CopyButton text={s} /></div></div>
    <p className="mt-2 text-xs text-stone-500">Bound to workspace id <code className="font-mono">{site}</code>. Re-copy after changing this toggle.</p>
  </div>);
}
