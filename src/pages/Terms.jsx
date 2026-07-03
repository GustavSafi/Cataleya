import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const Section = ({ title, children }) => (
  <section className="mb-10" aria-labelledby={`tos-${title.replace(/\s+/g, "-").toLowerCase()}`}>
    <h2 id={`tos-${title.replace(/\s+/g, "-").toLowerCase()}`} className="text-base font-bold text-foreground mb-3 font-display">{title}</h2>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
  </section>
);

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Legal</span>
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-light mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Effective Date: January 1, 2024 · Last Updated: June 1, 2024</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10" role="note" aria-label="Important research-use disclaimer">
          <p className="text-sm font-bold text-amber-800 mb-1">Research Use Only</p>
          <p className="text-sm text-amber-700 leading-relaxed">All products sold by Cattleya Labs are intended strictly for in vitro and laboratory research purposes. These products are not intended for human consumption, veterinary use, or any application outside of scientific research. They have not been evaluated by the FDA.</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing this website or purchasing products, you agree to be bound by these Terms of Service. If you do not agree, do not use this website.</p>
        </Section>

        <Section title="2. Eligibility">
          <p>You must be at least 18 years of age and a qualified researcher, licensed professional, or institutional buyer to purchase from Cattleya Labs. By completing a purchase, you represent that you meet these qualifications.</p>
        </Section>

        <Section title="3. Permitted Use">
          <p>Products are sold exclusively for lawful, in vitro laboratory and scientific research. You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Use products for human or veterinary consumption</li>
            <li>Resell products for non-research purposes</li>
            <li>Use products in violation of applicable law</li>
            <li>Make therapeutic claims based on product use</li>
          </ul>
        </Section>

        <Section title="4. Orders & Payment">
          <p>All prices are in USD. Orders are subject to acceptance and product availability. We reserve the right to cancel orders at our discretion. We currently accept payment via Zelle and cryptocurrency; payment instructions are provided at checkout, and orders are confirmed once payment is received.</p>
        </Section>

        <Section title="5. Shipping & Returns">
          <p>Products are shipped with cold-chain packaging where required. Due to the research-grade nature of our products, all sales are final unless the product arrives damaged or there is an error in fulfillment. Contact us within 48 hours of receipt for damaged shipments.</p>
        </Section>

        <Section title="6. Disclaimer of Warranties">
          <p>Products are provided "as is" for research purposes. We make no warranties regarding fitness for any specific research application. Third-party COA data is provided for transparency and does not constitute a warranty beyond stated purity levels.</p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>Cattleya Labs shall not be liable for any indirect, incidental, or consequential damages arising from product use. Our total liability in any matter shall not exceed the purchase price of the relevant product.</p>
        </Section>

        <Section title="8. Governing Law">
          <p>These Terms are governed by the laws of the State of [State], without regard to conflict-of-law provisions.</p>
        </Section>

        <Section title="9. Contact">
          <p>For terms-related questions: <a href="mailto:legal@cattleyalabs.com" className="text-primary hover:underline">legal@cattleyalabs.com</a></p>
        </Section>
      </motion.div>
    </div>
  );
}