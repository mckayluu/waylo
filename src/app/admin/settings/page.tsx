import Link from "next/link";
import { snippet as mkSnippet } from "@/lib/embed";
import { getBranding, getSettings } from "@/lib/store";
import { GeneralForm } from "./GeneralForm";
import { BrandingForm } from "./BrandingForm";
import { PageHeader, Card } from "../ui";
import { CopyButton } from "./CopyButton";
export const dynamic = "force-dynamic";
export default async function Settings() {
  const b = (await getBranding());
  const snippet = mkSnippet();
  return (<>
    <PageHeader title="Settings" sub="General details, sidebar branding and installation." />
    <div className="mb-6"><Card title="General"><GeneralForm initial={(await getSettings())} /></Card></div>
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3"><Card title="Sidebar branding"><BrandingForm initial={b} /></Card></div>
      <div className="space-y-6 lg:col-span-2">
        <Card title="Install" actions={<CopyButton text={snippet} />}>
          <p className="mb-3 text-sm text-stone-600">Paste before <code className="rounded bg-stone-100 px-1 text-xs">&lt;/body&gt;</code>. Waylo docks as a full-height sidebar. <Link href="/admin/install" className="font-medium text-teal-700 hover:underline">Full install guide →</Link></p>
          <pre className="overflow-x-auto rounded-lg bg-[#0d1b1e] p-4 text-[11px] leading-relaxed text-teal-100">{snippet}</pre>
        </Card>
      </div>
    </div>
  </>);
}
