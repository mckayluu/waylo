import Link from "next/link";
import { Wordmark } from "./Header";
export function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Product", [["Features", "/features"], ["Use cases", "/use-cases"], ["Pricing", "/pricing"], ["FAQ", "/faq"], ["Live demo", "/demo"]]],
    ["Docs", [["Docs home", "/docs"], ["Install guide", "/docs/install"], ["Embed modes", "/docs/embed-modes"], ["JavaScript API", "/docs/install#api"]]],
    ["Account", [["Sign in", "/admin/login"], ["Dashboard", "/admin"], ["Request access", "mailto:hello@waylo.ai?subject=Waylo%20access"]]],
    ["Legal", [["Terms", "/terms"], ["Privacy", "/privacy"]]],
  ];
  return (
    <footer className="relative bg-stone-950 text-stone-300"><div className="w-accent-line" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-5">
        <div><Wordmark invert /><p className="mt-3 text-sm text-stone-400">AI website chat with cited answers, intent signals, and lead handoff to Slack and your CRM.</p></div>
        {cols.map(([h, links]) => (
          <div key={h}><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{h}</p>
            <ul className="mt-3 space-y-2 text-sm">{links.map(([l, href]) => <li key={l}><Link href={href} className="text-stone-400 hover:text-amber-300">{l}</Link></li>)}</ul></div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">© {new Date().getFullYear()} Waylo. All rights reserved.</div>
    </footer>
  );
}
