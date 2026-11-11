import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Shell } from "@/components/marketing/Section";
import { pageMeta } from "@/lib/seo";
import { ContactForm } from "./ContactForm";
import Link from "next/link";
export const metadata = pageMeta("/contact", "Contact Waylo", "Get in touch with McKay about early access, a setup call, a custom plan, or a question about Waylo. Or start a free trial — no card required.");
export default function Contact() {
  return <Shell><Header /><main>
    <section className="w-gradient relative overflow-hidden px-5 pb-16 pt-10 text-white sm:pt-12"><div className="w-grid-bg absolute inset-0 opacity-60" aria-hidden /><div className="relative mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="text-xs text-white/70"><Link href="/" className="hover:text-white">Home</Link> / <span>Contact</span></nav>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-amber-300">Contact</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Talk to McKay</h1>
      <p className="mt-4 max-w-2xl text-lg text-white/85">Questions, a setup call, a custom plan, or a security review — send a note and you’ll hear back from the founder. You can also <Link href="/signup" className="underline decoration-amber-300/80 underline-offset-4 hover:text-white">start a free trial</Link> without waiting.</p>
    </div></section>
    <div className="mx-auto max-w-xl px-5 py-12"><ContactForm /></div>
  </main><Footer /></Shell>;
}
