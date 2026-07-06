import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Droplets, Syringe, ShieldCheck } from "lucide-react";

const PROTOCOL_WEEKS = [8, 12, 16];

const DOSING_DATA = {
  8:  { vials: 6,  syringes: 56,  bacWater: 2, swabBoxes: 2, mgUsed: 25.2 },
  12: { vials: 9,  syringes: 84,  bacWater: 3, swabBoxes: 2, mgUsed: 42.0 },
  16: { vials: 12, syringes: 112, bacWater: 4, swabBoxes: 3, mgUsed: 58.8 },
};

const SUPPLY_CATEGORIES = [
  {
    id: "swabs",
    icon: ShieldCheck,
    label: "Alcohol Swabs",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    desc: "70% isopropyl alcohol prep pads for sterilizing vial stoppers and injection sites.",
    items: [
      {
        name: "PDI Swab-A-Prep Wipes (200-count)",
        brand: "PDI",
        note: "70% IPA, individually wrapped, medical-grade",
        url: "https://www.amazon.com/s?k=alcohol+prep+pads+200+count+70+isopropyl",
        img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&h=120&fit=crop&q=80",
      },
      {
        name: "Dynarex Alcohol Swabs (100-count)",
        brand: "Dynarex",
        note: "Individually wrapped, sterile, latex-free",
        url: "https://www.amazon.com/s?k=dynarex+alcohol+swabs+100+count",
        img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&h=120&fit=crop&q=80",
      },
    ],
  },
  {
    id: "bacwater",
    icon: Droplets,
    label: "Bacteriostatic Water",
    color: "bg-cyan-50 border-cyan-200",
    iconColor: "text-cyan-600",
    desc: "Sterile water with 0.9% benzyl alcohol — essential for multi-dose peptide reconstitution.",
    items: [
      {
        name: "Cattleya Labs — Bacteriostatic Water 10mL",
        brand: "Cattleya Labs",
        note: "0.9% benzyl alcohol, USP-grade sterile, sealed vial",
        url: "/product/bac-water",
        img: "https://media.base44.com/images/public/6a1f4949719273f90329fc44/71cdaa523_generated_8435cc3d.png",
        internal: true,
      },
    ],
  },
  {
    id: "syringes",
    icon: Syringe,
    label: "Insulin Syringes",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
    desc: "U-100 insulin syringes with fine gauge needles for subcutaneous injections.",
    items: [
      {
        name: "BD Ultra-Fine III Syringes 31G 1mL (100-count)",
        brand: "BD",
        note: "31G × 5/16″, U-100, thin wall for reduced pain",
        url: "https://www.amazon.com/s?k=BD+insulin+syringes+31+gauge+1ml+100+count",
        img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&h=120&fit=crop&q=80",
      },
      {
        name: "Easy Comfort Insulin Syringes 29G 0.5mL (100-count)",
        brand: "Easy Comfort",
        note: "29G × 1/2″, 0.5mL barrel, good for small volumes",
        url: "https://www.amazon.com/s?k=insulin+syringes+29+gauge+0.5ml+100+count",
        img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&h=120&fit=crop&q=80",
      },
      {
        name: "Ultimed 30G 0.3mL Insulin Syringes (100-count)",
        brand: "Ultimed",
        note: "30G × 5/16″, ultra-fine for minimal discomfort",
        url: "https://www.amazon.com/s?k=ultimed+insulin+syringes+30+gauge",
        img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&h=120&fit=crop&q=80",
      },
    ],
  },
];

function SupplyCard({ item, supplyColor }) {
  const inner = (
    <>
      <img
        src={item.img}
        alt={item.name}
        className="w-12 h-12 rounded-lg object-contain flex-shrink-0 border border-border/40 bg-white p-1"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{item.name}</p>
        <p className="text-[10px] text-muted-foreground">{item.brand}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.note}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" aria-hidden="true" />
    </>
  );

  const cls = `flex items-center gap-3 p-3.5 rounded-xl border ${supplyColor} hover:shadow-md transition-all group bg-white`;

  if (item.internal) {
    return <Link to={item.url} aria-label={`View ${item.name}`} className={cls}>{inner}</Link>;
  }
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${item.name} on Amazon`} className={cls}>
      {inner}
    </a>
  );
}

export default function SuppliesGuide() {
  const [selectedWeeks, setSelectedWeeks] = useState(8);
  const data = DOSING_DATA[selectedWeeks];

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24 space-y-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">Research Supplies</span>
        <h1 className="font-display text-3xl lg:text-4xl font-light text-foreground mb-3">
          Protocol <span className="text-primary italic">Supplies Calculator</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Calculate exactly what you need for a BPC-157 daily research protocol. Select your duration and get a complete supply list with supplier links.
        </p>
      </motion.div>

      {/* Duration selector */}
      <section aria-labelledby="duration-heading">
        <h2 id="duration-heading" className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
          Select Protocol Duration
        </h2>
        <div className="flex gap-3 flex-wrap" role="group" aria-label="Select protocol duration in weeks">
          {PROTOCOL_WEEKS.map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeeks(w)}
              aria-pressed={selectedWeeks === w}
              className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                selectedWeeks === w
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-white text-foreground border-border/60 hover:border-primary hover:text-primary"
              }`}
            >
              {w} Weeks
            </button>
          ))}
        </div>

        {/* Quantities grid */}
        <motion.div
          key={selectedWeeks}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
        >
          {[
            { label: "BPC-157 Vials (5mg)", value: `${data.vials} vials`, sub: `${data.mgUsed}mg used`, color: "bg-primary/5 border-primary/20" },
            { label: "Insulin Syringes (U-100)", value: `${data.syringes} syringes`, sub: "1 per day", color: "bg-purple-50 border-purple-200" },
            { label: "BAC Water (10mL bottles)", value: `${data.bacWater} bottles`, sub: `${data.bacWater * 10}mL total`, color: "bg-cyan-50 border-cyan-200" },
            { label: "Alcohol Swabs", value: `${data.swabBoxes} × 100-count`, sub: "2 swabs/day", color: "bg-blue-50 border-blue-200" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className={`p-4 rounded-xl border ${color}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Titration note */}
        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
          <strong>Titration protocol:</strong> Quantities calculated for a daily subcutaneous injection protocol with gradual titration. Weeks 1–2: lower dose to assess response. Weeks 3+: standard dose. Consult published protocols and qualified professionals for specific dosing guidance. For research use only.
        </div>
      </section>

      {/* Supply categories */}
      {SUPPLY_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <section key={cat.id} aria-labelledby={`${cat.id}-heading`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cat.color}`}>
                <Icon className={`w-4 h-4 ${cat.iconColor}`} aria-hidden="true" />
              </div>
              <div>
                <h2 id={`${cat.id}-heading`} className="text-sm font-bold text-foreground">{cat.label}</h2>
                <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map((item) => (
                <SupplyCard key={item.name} item={item} supplyColor={cat.color} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Disclaimer */}
      <div className="text-center text-[11px] text-muted-foreground leading-relaxed border-t border-border/40 pt-8">
        Supplier links are provided for informational purposes only. Cattleya Labs is not affiliated with Amazon or any listed supplier.
        Always verify product specifications before purchase. For research use only — not medical advice.
      </div>
    </div>
  );
}