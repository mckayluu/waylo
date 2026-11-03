import { getGuidance } from "@/lib/store";
import { GuidanceEditor } from "./GuidanceEditor";
export const dynamic = "force-dynamic";
export default async function Page() { return <GuidanceEditor initial={(await getGuidance())} />; }
