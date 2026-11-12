// Hero art for inner marketing pages: a stock photo with one code-drawn card over it,
// the same collage language as the homepage hero. Photos are credited in /public/images/people/CREDITS.md.
// The people in the photos are not Waylo customers. Northpoint Ops is the fictional demo company.
import Image from "next/image";
import Link from "next/link";
import { SlackCard, ChatBubble, LeftCard, type ChatKey } from "./HomeVisuals";

export type PhotoKey = "phone" | "desk" | "twoWomen" | "salesTeam" | "headset" | "crafts" | "pair" | "headsets" | "laughing" | "cafe";
export const PEOPLE: Record<PhotoKey, { src: string; w: number; h: number; alt: string }> = {
  phone: { src: "/images/people/owner-phone-laptop.webp", w: 1000, h: 562, alt: "A woman on the phone at her laptop in a design studio" },
  desk: { src: "/images/people/owner-desk-laptop.webp", w: 1400, h: 934, alt: "A woman standing at a desk working on her laptop in a small office" },
  twoWomen: { src: "/images/people/marketing-two-women-laptop.webp", w: 900, h: 600, alt: "Two women talking at a laptop by a bright window" },
  salesTeam: { src: "/images/people/sales-team-laptop.webp", w: 900, h: 600, alt: "Four coworkers smiling around a laptop at a table" },
  headset: { src: "/images/people/support-headset.webp", w: 900, h: 600, alt: "A smiling woman wearing a headset at her computer" },
  crafts: { src: "/images/people/maker-desk-crafts.webp", w: 1200, h: 800, alt: "A woman working at a desk covered in craft supplies" },
  pair: { src: "/images/people/pair-laptops-table.webp", w: 1200, h: 800, alt: "Hands on a laptop and a phone at a shared work table" },
  headsets: { src: "/images/people/support-team-headsets.webp", w: 1200, h: 800, alt: "Two women wearing headsets in a bright office" },
  laughing: { src: "/images/people/team-laughing-table.webp", w: 1200, h: 800, alt: "Three people laughing together around a table" },
  cafe: { src: "/images/people/cafe-laptop.webp", w: 1200, h: 800, alt: "A smiling woman working on a laptop at a cafe" },
};
export type Overlay = "chat" | "slack" | "session" | "none";
export type HeroArt = { photo: PhotoKey; overlay?: Overlay; pos?: string; chat?: ChatKey };

export function PhotoTile({ photo, className = "", pos = "object-center", sizes = "(min-width:1024px) 560px, 100vw", priority = false }: { photo: PhotoKey; className?: string; pos?: string; sizes?: string; priority?: boolean }) {
  const p = PEOPLE[photo];
  return <div className="w-tile relative overflow-hidden"><Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes={sizes} priority={priority} className={`w-full object-cover ${pos} ${className}`} /></div>;
}

export function HeroCollage({ art }: { art: HeroArt }) {
  const o = art.overlay || "chat";
  return (
    <figure className="relative mx-auto w-full max-w-[520px]">
      <div className={`relative ${o === "none" ? "" : "pb-10 sm:pb-12"}`}>
        <div aria-hidden className="absolute -right-4 -top-5 h-24 w-24 rotate-6 rounded-[24px] bg-rasp-600" />
        <div aria-hidden className="absolute -bottom-1 left-6 h-14 w-14 -rotate-6 rounded-[14px] bg-blush" />
        <PhotoTile photo={art.photo} pos={art.pos} priority className="h-[240px] sm:h-[320px]" sizes="(min-width:1024px) 520px, 100vw" />
        {o === "chat" && <ChatBubble chat={art.chat} className="absolute -bottom-2 right-2 sm:-right-6" />}
        {o === "slack" && <SlackCard className="absolute -bottom-2 right-0 max-w-[300px] sm:-right-6" />}
        {o === "session" && <LeftCard className="absolute -bottom-2 right-2 sm:-right-6" />}
      </div>
      {o !== "none" && <figcaption className="mt-5 text-xs leading-5 text-white/65">{o === "slack" ? "Slack card" : o === "chat" ? "Chat card" : "Session card"} is an illustration · <Link href="/demo" className="underline hover:text-white">Northpoint Ops</Link> is fictional</figcaption>}
    </figure>
  );
}
