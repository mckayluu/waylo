import Link from "next/link";
import { Wordmark } from "./Header";
export function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Product", [["Features", "/#features"], ["How it works", "/#how"], ["Pricing", "/pricing"], ["Live demo", "/demo"]]],
    ["Account", [["Sign in", "/admin/login"], ["Dashboard", "/admin"], ["Request access", "mailto:hello@waylo.ai?subject=Waylo%20access"]]],
    ["Legal", [["Terms", "/terms"], ["Privacy", "/privacy"]]],
  ];
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-4">
        <div><Wordmark /><p className="mt-3 text-sm text-stone-500">Website conversations, turned into sales signals.</p></div>
        {cols.map(([h, links]) => (
          <div key={h}><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{h}</p>
            <ul className="mt-3 space-y-2 text-sm">{links.map(([l, href]) => <li key={l}><Link href={href} className="text-stone-600 hover:text-teal-700">{l}</Link></li>)}</ul></div>
        ))}
      </div>
      <div className="border-t border-stone-100 py-5 text-center text-xs text-stone-400">© {new Date().getFullYear()} Waylo. All rights reserved.</div>
    </footer>
  );
}
