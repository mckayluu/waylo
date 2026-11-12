import Link from "next/link";
import { MarketingPage, CTA } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { Shot } from "@/components/marketing/Shots";
import { JsonLd, crumbsLd, pageMeta, orgLd } from "@/lib/seo";
export const metadata = pageMeta("/about", "About Waylo", "Waylo is a small, self-serve company. We build AI chat for B2B and SaaS websites that answers from your own pages and links the page behind each answer.");
export default function About() {
  return <MarketingPage eyebrow="About" crumb="About" title="Why we built Waylo" sub="Waylo is a small, self-serve company. One founder builds it, and the product does the selling." answer="Waylo is an early-access product built by a solo founder. It is AI chat for B2B and SaaS websites. It answers from your published pages and the facts you add, links its sources, flags buying intent, and can alert your team in Slack.">
    <JsonLd data={[orgLd, crumbsLd([["About", "/about"]])]} />
    <Section className="w-band-paper py-16"><div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="max-w-2xl space-y-5 text-[17px] leading-8 text-warm-700">
        <p>Buyers ask the same questions on almost every B2B website. Does it work with our CRM? Is there SSO? What does it cost for ten people? The answer is usually on the site somewhere, a few clicks too deep.</p>
        <p>Most website chat makes you choose. A person on live chat gives good answers, but only while someone is online. An AI bot is always there, but it can tell a buyer you integrate with a tool you don’t. We wanted chat that stays on all night and only says what your own site says.</p>
        <p>So that is what Waylo does. It reads your public pages and answers visitor questions with a link to the page behind each answer. When the site doesn’t cover something, it says so. It also notices buying signals like pricing, security, or demo questions. When a visitor looks ready to buy, leaves their details, or asks for a person, it tells your team in Slack.</p>
        <p>It’s built for marketing and sales teams at B2B and SaaS companies, where buyers ask the same handful of questions before they’ll talk to anyone. You can set it up yourself in an afternoon. We don’t offer calls or onboarding sessions, so if a step is confusing, we fix the step.</p>
        <p>We’re early. Waylo runs on a free hosting tier and Stripe is still in test mode. The app uses Next.js and Postgres on Supabase, it’s hosted on Render, and OpenAI writes the replies. We have no customer logos to show yet, so you won’t see any here.</p>
        <p className="pt-2 text-base"><Link href="/how-it-works" className="font-semibold text-navy-700 hover:underline">See how it works</Link> · <Link href="/security" className="font-semibold text-navy-700 hover:underline">Security and data</Link> · <Link href="/changelog" className="font-semibold text-navy-700 hover:underline">Changelog</Link></p></div>
      <div className="relative self-start"><div aria-hidden className="absolute -right-4 -top-4 h-20 w-20 rotate-6 rounded-[20px] bg-rasp-600" /><Shot k="answer" className="relative" /></div>
    </div></Section>
    <section className="w-band-paper px-5 py-16"><CTA /></section>
  </MarketingPage>;
}
