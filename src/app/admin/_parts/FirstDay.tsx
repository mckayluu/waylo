import Link from "next/link";
// Day-one empty state: real next steps + a clearly labeled example. Example content is never mixed into real data.
export function FirstDay({ title, body, ws, steps, example }: { title: string; body: string; ws: string; steps?: ("install" | "chat" | "contact" | "crawl")[]; example?: React.ReactNode }) {
  const preview = `/widget?site=${encodeURIComponent(ws)}`;
  const all = {
    crawl: <Link key="crawl" href="/admin/content" className="w-btn-ghost">Crawl your site</Link>,
    install: <Link key="install" href="/admin/install" className="w-btn">Install the snippet</Link>,
    chat: <a key="chat" href={preview} target="_blank" rel="noreferrer" className="w-btn-ghost">Send a test chat ↗</a>,
    contact: <a key="contact" href={preview} target="_blank" rel="noreferrer" className="w-btn-ghost">Try the Contact tab ↗</a>,
  };
  return <div className="px-6 py-8">
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">✦</div>
      <p className="mt-3 font-medium text-stone-800">{title}</p><p className="mt-1 text-sm text-stone-500">{body}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">{(steps || ["install", "chat"]).map((k) => all[k])}</div>
      <p className="mt-2 text-xs text-stone-400">Test chats from the preview show up here too, so you can see the whole loop before going live.</p>
    </div>
    {example && <div className="relative mx-auto mt-6 max-w-3xl rounded-xl border border-dashed border-stone-300 bg-stone-50/60 p-4 pt-6" aria-label="Example, not your data">
      <span className="absolute -top-2.5 left-4 rounded-full bg-white px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 ring-1 ring-stone-200">Example · not your data</span>
      <div className="pointer-events-none select-none opacity-70">{example}</div>
    </div>}
  </div>;
}
