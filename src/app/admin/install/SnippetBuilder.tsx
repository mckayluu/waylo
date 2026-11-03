"use client";
import { useState } from "react";
import { CopyButton } from "../settings/CopyButton";

export function SnippetBuilder({ url, site = "default" }: { url: string; site?: string }) {
  const [open, setOpen] = useState(false);
  const s = `<script src="${url}/waylo.js" data-site="${site}"${open ? ' data-open="true"' : ""} async></script>`;
  return (<div>
    <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-stone-700">
      <button type="button" role="switch" aria-checked={open} onClick={() => setOpen(!open)}
        className={`relative h-6 w-11 rounded-full transition ${open ? "bg-teal-600" : "bg-stone-300"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${open ? "left-5" : "left-0.5"}`} />
      </button>
      <span><b>Open chat on page load</b> — the chat panel opens automatically when visitors land (adds <code>data-open=&quot;true&quot;</code>).</span>
    </label>
    <div className="relative"><pre className="overflow-x-auto rounded-xl bg-stone-900 p-4 pr-24 text-sm text-teal-200">{s}</pre><div className="absolute right-2 top-2"><CopyButton text={s} /></div></div>
    <p className="mt-2 text-xs text-stone-500">Bound to workspace id <code className="font-mono">{site}</code>.</p>
  </div>);
}
