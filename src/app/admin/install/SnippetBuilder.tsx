"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { CopyButton } from "../settings/CopyButton";

export function SnippetBuilder({ url, site = "default", initialOpen = false }: { url: string; site?: string; initialOpen?: boolean }) {
  const [open, setOpen] = useState(!!initialOpen);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const r = useRouter();

  // Keep toggle in sync when the server re-renders with a new saved value (router.refresh / hard reload).
  useEffect(() => { setOpen(!!initialOpen); }, [initialOpen]);

  const s = `<script src="${url}/waylo.js" data-site="${site}"${open ? ' data-open="true"' : ""} async></script>`;

  async function flip() {
    if (busy) return;
    const n = !open;
    setBusy(true); setOpen(n); setErr(""); setSaved(false);
    const res = await api<{ openOnLoad?: boolean }>("/api/settings", { method: "PUT", json: { openOnLoad: n } });
    if (!res.ok) {
      setBusy(false); setOpen(!n); setErr(res.error || "Couldn’t save"); return;
    }
    // Re-read so we never trust a partial/empty PUT body (and catch store race).
    const check = await api<{ openOnLoad?: boolean }>("/api/settings");
    const confirmed = check.ok ? !!check.data.openOnLoad : !!res.data.openOnLoad;
    if (confirmed !== n) {
      setBusy(false); setOpen(confirmed); setErr("Save didn’t stick — try again"); return;
    }
    setOpen(confirmed); setBusy(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    r.refresh();
  }

  return (<div>
    <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-warm-700">
      <button type="button" role="switch" aria-checked={open} aria-busy={busy} disabled={busy} onClick={flip}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${open ? "bg-navy-600" : "bg-warm-300"} ${busy ? "opacity-70" : ""}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition ${open ? "left-5" : "left-0.5"}`} />
      </button>
      <span>
        <b>Open chat on page load</b> — visitors see the chat open automatically (adds <code>data-open=&quot;true&quot;</code>).
        {busy && <span className="ml-2 text-warm-500">Saving…</span>}
        {saved && <span className="ml-2 text-navy-700">Saved to workspace</span>}
        {err && <span className="ml-2 text-rose-600">{err}</span>}
      </span>
    </label>
    <div className="relative"><pre className="overflow-x-auto rounded-md bg-navy-900 p-4 pr-24 text-sm text-navy-100">{s}</pre><div className="absolute right-2 top-2 rounded bg-card px-2 py-0.5"><CopyButton text={s} /></div></div>
    <p className="mt-2 text-xs text-warm-500">Bound to workspace id <code className="font-mono">{site}</code>. Preference is saved on this workspace — re-copy the snippet if you already pasted an older one on your site.</p>
  </div>);
}
