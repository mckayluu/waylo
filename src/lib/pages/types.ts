import type { ShotKey } from "@/components/marketing/Shots";
export type Tone = "teal" | "amber" | "indigo";
export type Block =
  | { t: "prose"; id?: string; eyebrow?: string; h: string; p: string[]; aside?: { title: string; items: string[]; tone?: Tone } }
  | { t: "shot"; id?: string; eyebrow?: string; h: string; p: string[]; shot: ShotKey; flip?: boolean; bullets?: [string, string][] }
  | { t: "shots"; id?: string; eyebrow?: string; h: string; sub?: string; keys: ShotKey[] }
  | { t: "spec"; id?: string; eyebrow?: string; h: string; sub?: string; rows: [string, string][] }
  | { t: "steps"; id?: string; eyebrow?: string; h: string; sub?: string; items: [string, string][] }
  | { t: "code"; id?: string; eyebrow?: string; h: string; p: string[]; code: string; label?: string }
  | { t: "table"; id?: string; eyebrow?: string; h: string; sub?: string; head: string[]; rows: string[][]; note?: string }
  | { t: "limits"; id?: string; h?: string; items: string[] }
  | { t: "qa"; id?: string; eyebrow?: string; h: string; sub?: string; items: [string, string, string][] }
  | { t: "slack"; id?: string; eyebrow?: string; h: string; p: string[] }
  | { t: "split"; id?: string; eyebrow?: string; h: string; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { t: "faq"; id?: string; h?: string; items: [string, string][] };
export type InfoDef = {
  path: string; crumb: string; parent?: [string, string]; eyebrow: string; title: string; sub: string; answer: string;
  metaTitle: string; metaDesc: string; hero?: ShotKey; blocks: Block[]; related?: [string, string, string][]; updated?: string;
};
export type ArticleDef = {
  slug: string; title: string; metaDesc: string; dek: string; readMin: number; updated: string; tag: string;
  sections: { h: string; p?: string[]; list?: string[]; ordered?: boolean; code?: string; table?: { head: string[]; rows: string[][] }; tip?: string }[];
  faqs?: [string, string][];
};
