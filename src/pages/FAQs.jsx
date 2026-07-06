import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What are research peptides?",
    a: "Peptides are short chains of amino acids that act as signaling molecules in biological systems. The compounds we supply are synthetic research peptides, provided as lyophilized (freeze-dried) powder strictly for laboratory and research use. Each product page includes detailed information on the specific peptide, its studied mechanisms, and the published literature."
  },
  {
    q: "What purity do your peptides meet?",
    a: "All our peptides are manufactured to ≥99% purity, verified through independent third-party HPLC and mass spectrometry analysis. Certificates of Analysis are available for every batch."
  },
  {
    q: "Are your products for human consumption?",
    a: "No. All products are intended solely for research and laboratory use. They are not intended for human or animal consumption, therapeutic use, or diagnostic use."
  },
  {
    q: "How should I store peptides?",
    a: "Lyophilized peptides should be stored at -20°C for long-term stability (up to 24 months). After reconstitution, store at 4°C for up to 2 weeks or -20°C for up to 6 months."
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes, we offer free shipping on all orders over $200. All orders are shipped with proper temperature considerations to maintain product integrity."
  },
  {
    q: "Can I see the Certificate of Analysis (COA)?",
    a: "Yes. Batch-specific COA documents are available for all products. You can request them through our COA Search page or contact our support team."
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept Zelle and cryptocurrency (BTC, ETH, USDC and more). For Zelle, payment instructions are shown after you place your order. Crypto payments are confirmed automatically. Card payments are coming in a future update."
  },
];

export default function FAQs() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
        className="text-center mb-14"
      >
        <h1 className="font-display text-3xl lg:text-4xl font-light">
          Frequently Asked <span className="text-primary">Questions</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          Everything you need to know about our research peptides.
        </p>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border rounded-lg px-5 data-[state=open]:bg-secondary/30"
          >
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}