import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/Prose";
export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };
export default function Terms() {
  return <LegalPage title="Terms of Service" updated="November 3, 2026">
    <p>These Terms govern your use of Waylo (the “Service”), operated by Waylo (“we”, “us”). By creating an account, embedding the widget, or using the Service, you agree to these Terms.</p>
    <h2>1. The Service</h2><p>Waylo provides an AI chat assistant for websites, along with visitor tracking, lead capture, handoff, integrations, and an admin dashboard. Features may change as we improve the product.</p>
    <h2>2. Accounts</h2><p>You’re responsible for your account credentials and for everything that happens under your account, including actions by members you invite. Tell us promptly about any unauthorized use.</p>
    <h2>3. Your content and data</h2><p>You own the content you provide and the data collected through your widget (“Customer Data”). You grant us a limited license to host, process, and transmit it solely to run the Service. You’re responsible for having the rights and any required notices or consents (for example, a privacy notice on your site) to collect visitor data through Waylo.</p>
    <h2>4. Acceptable use</h2><p>You agree not to:</p><ul><li>use the Service for anything illegal, deceptive, harassing, or harmful;</li><li>crawl or ingest sites you don’t own or have permission to use;</li><li>collect sensitive data (such as health, payment card, or government ID data) through the chat;</li><li>attempt to break, overload, reverse-engineer, or bypass limits or security of the Service;</li><li>resell the Service without our written permission.</li></ul><p>We may suspend accounts that violate these rules.</p>
    <h2>5. AI-generated answers</h2><p>Answers are generated automatically and can be incomplete or wrong. You’re responsible for reviewing your guidance and content and for how you rely on answers. Don’t use Waylo as the sole source for legal, medical, financial, or safety-critical information.</p>
    <h2>6. Third-party services</h2><p>The Service may use third parties such as AI model providers and hosting, and may send data to destinations you configure (like Slack or your CRM). Your use of those services is governed by their terms.</p>
    <h2>7. Fees</h2><p>Paid plans are billed as agreed in your order or invoice. Early access prices may change with reasonable notice. Fees are non-refundable except where required by law or stated otherwise in writing.</p>
    <h2>8. Termination</h2><p>You can stop using the Service at any time. We may suspend or end access for breach of these Terms or non-payment. After termination, we may delete Customer Data per our Privacy Policy; ask us before then if you need an export.</p>
    <h2>9. Disclaimers</h2><p>THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTIES OF ANY KIND, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We don’t guarantee the Service will be uninterrupted or error-free.</p>
    <h2>10. Limitation of liability</h2><p>To the maximum extent permitted by law, we aren’t liable for indirect, incidental, special, consequential, or punitive damages, or lost profits or data. Our total liability for any claim is limited to the amount you paid us in the 12 months before the claim.</p>
    <h2>11. Changes</h2><p>We may update these Terms. If changes are material, we’ll give notice by email or in the product. Continued use after changes take effect means you accept them.</p>
    <h2>12. Contact</h2><p>Questions? Email <a href="mailto:hello@waylo.ai">hello@waylo.ai</a>.</p>
  </LegalPage>;
}
