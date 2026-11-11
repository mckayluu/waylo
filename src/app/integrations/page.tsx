import { INTEGRATIONS } from "@/lib/pages/site";
import { InfoPage, metaFor } from "@/lib/pages/render";
export const metadata = metaFor(INTEGRATIONS);
export default function Page() { return <InfoPage d={INTEGRATIONS} />; }
