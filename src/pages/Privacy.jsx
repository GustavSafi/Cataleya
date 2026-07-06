import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Section = ({ title, children }) => (
  <section className="mb-10" aria-labelledby={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}>
    <h2 id={`section-${title.replace(/\s+/g, "-").toLowerCase()}`} className="text-base font-bold text-foreground mb-3 font-display">{title}</h2>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
  </section>
);

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Legal</span>
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-light mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Effective Date: January 1, 2024 · Last Updated: June 1, 2024</p>

        <Section title="1. Introduction">
          <p>Cattleya Labs ("we," "us," or "our") operates this website and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard information you provide when you visit our website or place an order.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong>Information you provide:</strong> Name, email address, mailing address, phone number, and payment information when creating an account or placing an order.</p>
          <p><strong>Automatic data:</strong> IP address, browser type, device identifiers, pages visited, referral URLs, and session duration via cookies and similar technologies.</p>
          <p><strong>Communications:</strong> Messages sent via contact forms or email.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc list-inside space-y-1">
            <li>To process and fulfill orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To respond to customer service requests</li>
            <li>To send marketing communications (with consent)</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="4. Cookies & Tracking">
          <p>We use essential cookies for site functionality, analytics cookies (e.g., Google Analytics) to understand usage patterns, and marketing cookies for targeted advertising where consent is provided. You may manage cookie preferences via our Cookie Settings tool or your browser settings.</p>
        </Section>

        <Section title="5. Data Sharing">
          <p>We do not sell your personal information. We share data with:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Payment providers (e.g. cryptocurrency payment processors) for transaction processing</li>
            <li>Shipping carriers for order fulfillment</li>
            <li>Service providers under data processing agreements</li>
            <li>Law enforcement when legally required</li>
          </ul>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain personal data for as long as necessary to fulfill the purposes outlined in this policy, typically 3 years for transaction records and 1 year for marketing data (or until consent is withdrawn).</p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p className="mt-2">To submit a data deletion request, email <a href="mailto:privacy@cattleyalabs.com" className="text-primary hover:underline">privacy@cattleyalabs.com</a> with subject line "Data Deletion Request."</p>
        </Section>

        <Section title="8. California Privacy Rights (CCPA)">
          <p>California residents have additional rights under the California Consumer Privacy Act, including the right to know what personal information is collected, the right to delete personal information, and the right to opt out of the sale of personal information. We do not sell personal information. To exercise rights, contact us at privacy@cattleyalabs.com.</p>
        </Section>

        <Section title="9. Security">
          <p>We implement industry-standard security measures including SSL/TLS encryption for data in transit, secure payment processing via PCI-DSS compliant providers, and access controls for internal data systems.</p>
        </Section>

        <Section title="10. Contact">
          <p>For privacy-related inquiries: <a href="mailto:privacy@cattleyalabs.com" className="text-primary hover:underline">privacy@cattleyalabs.com</a></p>
        </Section>
      </motion.div>
    </div>
  );
}