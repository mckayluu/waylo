import { MarketingPage } from "@/components/marketing/Page";
import { Section } from "@/components/marketing/Section";
import { TryWaylo } from "@/components/try/TryWaylo";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta("/try", "Try Waylo on your own site", "Paste your website address and chat with your own site in about a minute. No account, no card, nothing saved.");
export default function Try() {
  return <MarketingPage eyebrow="Try it" crumb="Try it" title="Chat with your own website in a minute" sub="Paste your URL. Waylo reads your sitemap and up to 20 public pages, then answers questions with links to the pages it used." answer="Waylo's instant try crawls up to 20 public pages of any website and lets you ask 12 questions with cited answers, without an account. Nothing is stored and the preview expires after an hour. Start a free trial to keep the site and index up to 100 pages.">
    <Section className="pt-8"><div className="mx-auto max-w-3xl"><TryWaylo /></div>
      <ul className="mx-auto mt-6 grid max-w-3xl gap-3 text-sm text-warm-600 sm:grid-cols-3">
        <li><strong className="block text-warm-900">No account</strong>Nothing to sign up for until you want to keep it.</li>
        <li><strong className="block text-warm-900">Nothing saved</strong>Pages and chats live in memory for an hour, then they're gone.</li>
        <li><strong className="block text-warm-900">Keep it in one click</strong>Start a trial and we bring the pages we read into your workspace.</li>
      </ul></Section>
  </MarketingPage>;
}
