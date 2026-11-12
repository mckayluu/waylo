import Link from "next/link";
import { snippet as mkSnippet } from "@/lib/embed";
import { getBranding, getSettings, currentWs } from "@/lib/store";
import { GeneralForm } from "./GeneralForm";
import { BrandingForm } from "./BrandingForm";
import { PageHeader, Card } from "../ui";
import { CopyButton } from "./CopyButton";
export const dynamic = "force-dynamic";
export default async function Settings() {
  const b = (await getBranding());
  const st = await getSettings();
  const WS = await currentWs(); const snippet = mkSnippet(WS, !!st.openOnLoad);
  return (<>
    <PageHeader title="Settings" sub="Workspace details, chat branding and install settings." actions={<Link href="/admin/install" className="w-btn-ghost">Install guide</Link>} />
    <div className="w-accent-line mb-4" />
    <div className="mb-4"><Card title="General"><GeneralForm initial={st} /></Card></div>
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3"><Card title="Sidebar branding"><BrandingForm initial={b} /></Card></div>
      <div className="space-y-4 lg:col-span-2">
        <Card title="Install" actions={<CopyButton text={snippet} />}>
          <p className="mb-2 text-sm text-warm-600"><span className="w-badge-support mr-1.5">data-site=&quot;{WS}&quot;</span>Paste before <code className="rounded bg-warm-100 px-1 text-xs">&lt;/body&gt;</code>. Waylo docks as a full-height sidebar. <Link href="/admin/install" className="font-medium text-navy-700 hover:underline">Full install guide →</Link></p>
          <pre className="overflow-x-auto rounded-lg bg-[#0d1b1e] p-3 text-[11px] leading-relaxed text-navy-100">{snippet}</pre>
        </Card>
      </div>
    </div>
  </>);
}
