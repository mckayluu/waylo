import { Badge } from "./ui";
export function Tag({ s }: { s: string }) {
  return <Badge tone={s === "high-intent" ? "rose" : ["pricing", "demo", "ready-to-buy", "enterprise"].includes(s) ? "rasp" : "navy"}>{s}</Badge>;
}
