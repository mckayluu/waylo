import { HOW } from "@/lib/pages/site";
import { InfoPage, metaFor } from "@/lib/pages/render";
export const metadata = metaFor(HOW);
export default function Page() { return <InfoPage d={HOW} />; }
