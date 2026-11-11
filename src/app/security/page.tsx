import { SECURITY } from "@/lib/pages/site";
import { InfoPage, metaFor } from "@/lib/pages/render";
export const metadata = metaFor(SECURITY);
export default function Page() { return <InfoPage d={SECURITY} />; }
