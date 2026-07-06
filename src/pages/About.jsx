import React from "react";
import { motion } from "framer-motion";
import { Shield, FlaskRound, Award, Microscope } from "lucide-react";

const orchidImage = "https://media.base44.com/images/public/6a1f4949719273f90329fc44/1b3bafd5a_generated_dfedd1c0.png";
const labImage = "https://media.base44.com/images/public/6a1f4949719273f90329fc44/ce03c6828_generated_dc9b69cf.png";

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={orchidImage} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
            className="font-display text-4xl lg:text-5xl font-light mb-6"
          >
            About <span className="text-primary">Cattleya</span> Labs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground leading-relaxed"
          >
            Where the organic elegance of the Cattleya orchid intersects with the rigorous precision
            of life sciences. We deliver premium research peptides manufactured under the most
            stringent quality standards in the industry.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Shield, title: "Uncompromising Purity", desc: "Every product achieves ≥99% purity through advanced synthesis and multi-stage purification." },
              { icon: FlaskRound, title: "Third-Party Verified", desc: "Independent HPLC and mass spectrometry analysis validates every single batch we produce." },
              { icon: Award, title: "Lot-Level Traceability", desc: "Complete documentation chain from synthesis to shipping for full research compliance." },
              { icon: Microscope, title: "Research-First", desc: "Products designed exclusively for qualified laboratory settings and controlled research workflows." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white rounded-xl border border-border/50 shadow-sm"
              >
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl overflow-hidden">
            <img src={labImage} alt="Laboratory" className="w-full h-64 lg:h-80 object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}