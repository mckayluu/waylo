import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/Prose";
export const metadata: Metadata = { title: "Privacy Policy — Waylo" };
export default function Privacy() {
  return <LegalPage title="Privacy Policy" updated="November 3, 2026">
    <p>This policy explains what information Waylo collects, how we use it, and your choices. It covers two groups: <b>customers</b> (businesses that use Waylo and their team members) and <b>visitors</b> (people who chat with a Waylo widget on a customer’s website). For visitor data, the customer is the controller and Waylo processes it on their behalf.</p>
    <h2>Information we collect</h2>
    <ul>
      <li><b>Chat transcripts:</b> messages visitors send and the assistant’s replies, plus thumbs-up/down feedback.</li>
      <li><b>Contact details:</b> name, email, and message when a visitor uses the Contact form, books a demo, or asks to talk to a person.</li>
      <li><b>Visitor identifier:</b> a random ID stored in the browser’s localStorage as <code>waylo_vid</code>, used to connect a visitor’s chats and page views. It doesn’t contain personal information on its own.</li>
      <li><b>Journey data:</b> pages viewed on the customer’s site, timestamps, referrer, and basic browser info.</li>
      <li><b>Admin accounts:</b> names, emails, roles, and securely hashed passwords for customer team members, plus a session cookie to keep you signed in.</li>
      <li><b>Site content:</b> public pages we crawl from the customer’s site to answer questions.</li>
    </ul>
    <h2>How we use it</h2><ul><li>To answer visitor questions and show sources;</li><li>To show transcripts, journeys, signals, and leads to the customer;</li><li>To send notifications to destinations the customer configures (Slack, CRM webhooks);</li><li>To secure, maintain, and improve the Service.</li></ul><p>We don’t sell personal information and don’t use visitor data for our own advertising.</p>
    <h2>Cookies and local storage</h2><p>The widget uses localStorage (<code>waylo_vid</code>) and may keep chat history in the browser. The admin dashboard uses a session cookie. Clearing browser storage removes these.</p>
    <h2>Subprocessors</h2><ul><li><b>OpenAI</b> (when configured) — receives chat messages and relevant site content to generate answers. Per OpenAI’s API terms, API data isn’t used to train their models by default.</li><li><b>Hosting provider</b> — stores and serves the application and database.</li><li><b>Customer-chosen integrations</b> — Slack, CRMs, or other webhook endpoints receive the data the customer sends there.</li></ul>
    <h2>Retention</h2><p>We keep transcripts, leads, and journey data for as long as the customer’s account is active, or until the customer deletes them. After an account closes we delete Customer Data within 90 days, except backups, which roll off within a further 30 days, or where law requires longer retention.</p>
    <h2>Security</h2><p>We use reasonable safeguards including encrypted connections, hashed passwords, and role-based access. No system is perfectly secure.</p>
    <h2>Your rights</h2><p>Depending on where you live, you may have rights to access, correct, delete, or export your data. Visitors should contact the website owner first; we’ll help them respond. Customers can email us directly.</p>
    <h2>Children</h2><p>Waylo isn’t directed to children under 16 and we don’t knowingly collect their data.</p>
    <h2>Changes</h2><p>We’ll post updates here and change the date above. Material changes will be communicated to customers.</p>
    <h2>Contact</h2><p>Email <a href="mailto:hello@waylo.ai">hello@waylo.ai</a>.</p>
  </LegalPage>;
}
