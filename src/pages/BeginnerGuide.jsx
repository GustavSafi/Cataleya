import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, FlaskRound, Droplets, Calculator, Syringe, Thermometer, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SECTIONS = [
  {
    id: "what-are",
    icon: FlaskRound,
    color: "bg-primary/10 text-primary",
    title: "What Are Peptides?",
    intro: "Peptides are short chains of amino acids — the same building blocks that make up proteins. Chains of 2–50 amino acids are called peptides; longer chains are proteins.",
    content: `Your body produces thousands of peptides naturally — they act as signaling molecules, hormones, and biological regulators. You likely know several already: insulin (51 amino acids, regulates blood sugar), oxytocin (9 amino acids, involved in social bonding), and glucagon (29 amino acids, raises blood glucose).

When researchers discuss "research peptides," they're typically referring to synthetic versions of naturally occurring peptides — or novel analogues designed to mimic them — produced as lyophilized (freeze-dried) powders for laboratory use.

**Key concept:** Peptides work by binding to specific receptors on or inside cells, triggering a biological response. Think of it as a key (the peptide) fitting into a lock (the receptor) — each peptide has a specific target, a specific active dose range, and a specific half-life determining how long it remains active.`,
  },
  {
    id: "categories",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700",
    title: "Major Peptide Categories",
    intro: "Research peptides span a wide range of biological targets. Understanding the categories helps researchers select appropriate compounds.",
    content: `**Recovery & Tissue Repair**
BPC-157 (Body Protection Compound-157) and TB-500 (synthetic fragment of Thymosin Beta-4) are the most commonly researched compounds in this category. Both are studied in preclinical models for their potential roles in wound healing, tendon/ligament repair, gut healing, and inflammation modulation.

**Growth Hormone Secretagogues**
Two sub-groups:
- *GHRH analogues* (amplify GH release pulses): CJC-1295 (with/without DAC), Sermorelin, Tesamorelin
- *GHRPs / Ghrelin mimetics* (trigger GH through ghrelin receptor): GHRP-2, GHRP-6, Ipamorelin, Hexarelin

These are often combined (e.g., CJC-1295 + Ipamorelin) because they work through complementary pathways for potentially synergistic GH release.

**Metabolic & Weight Management**
GLP-1 receptor agonists are the fastest-growing research category. Key compounds: Semaglutide (active ingredient in Ozempic/Wegovy), Tirzepatide (dual GIP/GLP-1 agonist, Mounjaro/Zepbound), and Retatrutide (triple agonist). These are among the most heavily studied in current clinical medicine.

**Cognitive & Neuropeptides**
Semax, Selank, and related compounds are studied for BDNF modulation, anxiolytic mechanisms, and neuroprotective effects. Most research is preclinical at present.

**Hormonal & Sexual Health**
Includes PT-141 (FDA-approved bremelanotide), HCG, and Kisspeptin-10, which interact with reproductive and sexual health pathways.`,
  },
  {
    id: "supplied",
    icon: Thermometer,
    color: "bg-amber-100 text-amber-700",
    title: "How Peptides Are Supplied",
    intro: "Research peptides arrive as lyophilized (freeze-dried) powder in sealed glass vials. They must be reconstituted before use.",
    content: `**The vial:** A glass vial sealed with a rubber stopper and aluminum crimp cap. The label shows the compound name and total amount (e.g., "BPC-157 5mg"). The white powder at the bottom is the lyophilized peptide.

**Why powder?** Peptides are far more stable as a dry powder than in liquid, giving them a much longer shelf life (months to years under proper storage). Once reconstituted, most peptides are only stable for 25–30 days at refrigerator temperature.

**Storage — lyophilized:**
- Ideal: 2–8°C (standard refrigerator)
- Acceptable: Room temperature for short periods (weeks)
- Long-term: Most lyophilized powders handle freezing well
- Avoid: Direct sunlight, heat above 25°C, humid environments

**Storage — after reconstitution:**
- Always refrigerate at 2–8°C
- Never freeze reconstituted solutions — ice crystals can break peptide bonds
- Mark the reconstitution date on the vial
- Use within 25–30 days (depending on compound)`,
  },
  {
    id: "reconstitution",
    icon: Droplets,
    color: "bg-cyan-100 text-cyan-700",
    title: "Reconstitution Step-by-Step",
    intro: "Reconstitution is the single most critical practical skill in peptide research. Here's the complete process.",
    content: `**What you need:**
- Peptide vial (lyophilized powder)
- Bacteriostatic water (BAC water) — sterile water with 0.9% benzyl alcohol as preservative
- Insulin syringe (U-100, 1 mL)
- Alcohol swabs

**Why BAC water?** The benzyl alcohol preservative prevents bacterial growth, allowing you to use one reconstituted vial for multiple doses over 25–30 days. Plain sterile water has no preservative — you'd need to use the entire vial within 24–48 hours.

**Exception:** IGF-1 LR3 requires dilute acetic acid (0.6%), not BAC water. Always check the specific compound's reconstitution notes.

**The process:**
1. Wipe the rubber stopper of both the peptide vial and BAC water vial with an alcohol swab
2. Draw the desired BAC water volume into the syringe (the amount you add determines concentration — more water = more dilute = more liquid per dose)
3. Insert the needle into the peptide vial at an angle and inject BAC water slowly down the inner wall of the glass — not directly onto the powder
4. Remove the needle and gently swirl the vial (never shake) for 1–2 minutes until the powder fully dissolves
5. Some peptides may take up to 10 minutes to dissolve — this is normal
6. Refrigerate immediately`,
  },
  {
    id: "measurements",
    icon: Calculator,
    color: "bg-green-100 text-green-700",
    title: "Units & Measurements Explained",
    intro: "Unit confusion is the #1 source of errors. There are three measurement systems in play — here's how they work.",
    content: `**Weight: mg and mcg**
mg (milligrams) and mcg (micrograms) measure peptide quantity by weight.
*1 mg = 1,000 mcg* — confusing these creates a 1,000-fold error.
Some peptides are dosed in mg (semaglutide: 0.25 mg); others in mcg (Ipamorelin: 200 mcg).

**Volume: mL and syringe "units"**
mL (milliliters) measures liquid volume. On a standard U-100 insulin syringe:
- 100 units = 1 mL
- Each "unit" = 0.01 mL
These are volume marks, not dose marks. They tell you nothing about peptide amount until you know the concentration.

**Potency: IU (International Units)**
IU measures biological potency — primarily for HGH (≈3 IU per 1 mg) and HCG. IU are *not* the same as syringe units. "2 IU of HGH" specifies potency, not a syringe marking.

**Worked example:**
You have a 5 mg BPC-157 vial. You add 2 mL BAC water.
- Concentration = 5 mg ÷ 2 mL = **2.5 mg/mL**
- Target dose = 250 mcg = 0.25 mg
- Volume needed = 0.25 mg ÷ 2.5 mg/mL = **0.10 mL = 10 units** on a U-100 syringe

Use the Reconstitution Calculator on this site to do this math automatically.

**Syringe types:**
- U-100 (1 mL): 100 units = 1 mL, each unit = 0.01 mL. Most common for peptides.
- U-100 (0.5 mL): Same scale but only holds 50 units — easier to read for small volumes.
- U-50 / U-20: Less common; finer graduations for very small doses.`,
  },
  {
    id: "injection",
    icon: Syringe,
    color: "bg-rose-100 text-rose-700",
    title: "Injection Technique",
    intro: "Most peptide research protocols use subcutaneous (SubQ) injection — into the fatty tissue layer just beneath the skin.",
    content: `**Subcutaneous (SubQ) Injection — Standard for Most Peptides**

SubQ injection is performed by inserting the needle into pinched skin at a 45° angle (or 90° for shorter needles). Common injection sites:
- Lower abdomen (2 inches from navel) — most common, easy to pinch
- Outer thigh
- Upper arm (outer, not inner)

**Step-by-step technique:**
1. Wash hands thoroughly. Prepare a clean surface.
2. Draw the calculated dose volume from the reconstituted vial (after wiping stopper with alcohol swab).
3. Tap the syringe and push out air bubbles.
4. Select and clean the injection site with an alcohol swab. Allow to dry completely (30 seconds).
5. Pinch a fold of skin between thumb and index finger.
6. Insert the needle at 45° (or 90° if using a 5/16″ or shorter needle) in a smooth, confident motion.
7. Release the skin fold. Pull back slightly on the plunger — if blood appears, withdraw and choose a new site.
8. Inject slowly and steadily.
9. Withdraw smoothly. Apply gentle pressure with a clean swab — do not rub.
10. Dispose of the needle immediately in a sharps container.

**Intramuscular (IM) — Less Common**
Some protocols specify IM injection directly into muscle tissue (quads, glutes, deltoid). IM provides faster absorption than SubQ. Requires a slightly longer needle and different technique — consult specific protocol guidance.

**Rotate injection sites** to avoid tissue buildup. Maintain a log of sites used.`,
  },
  {
    id: "safety",
    icon: ShieldCheck,
    color: "bg-red-50 text-red-700",
    title: "Safety Considerations",
    intro: "Every compound carries potential risks. These principles apply across all research peptides.",
    content: `**Side effects vary by compound**
There is no universal peptide side effect profile. Common themes include injection site reactions (redness, swelling, itching), headaches, nausea, and fatigue. GH-related peptides may cause water retention, joint pain, and glucose tolerance changes. GLP-1 agonists commonly cause GI effects (nausea, constipation, reduced appetite). Review individual compound profiles.

**Dose matters — more is not better**
Peptides have dose-response curves where effectiveness plateaus and side effects increase. Follow evidence-based dosing ranges from published literature — not community hearsay about "megadosing."

**Research-use-only products are not pharmaceutical grade**
Peptides sold as "for research use only" are not subject to pharmaceutical manufacturing oversight. A Certificate of Analysis (COA) is not equivalent to FDA-regulated quality control. Verify purity, sterility, and accurate labeling from your source. Use our COA Verification tool to confirm batch data.

**Legal considerations**
Not all peptides are in the same legal category. Some (semaglutide, HGH) are prescription drugs. Many research peptides exist in legal gray areas. Nearly all performance-related peptides are prohibited by WADA. See our FAQ for specifics.

**Essential supplies checklist:**
- Peptide vials stored in refrigerator
- Bacteriostatic water (10 mL or 30 mL vials)
- Insulin syringes — U-100, 29–31 gauge needles
- Alcohol swabs (70% IPA)
- Sharps container for safe needle disposal
- Refrigerator space for reconstituted vials
- Labels or tape for marking reconstitution dates`,
  },
];

function SectionCard({ section }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`section-${section.id}`}
        className="w-full flex items-start gap-4 px-6 py-5 hover:bg-secondary/20 transition-colors text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${section.color}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-foreground">{section.title}</h2>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{section.intro}</p>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" aria-hidden="true" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" aria-hidden="true" />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`section-${section.id}`}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-border/40"
          >
            <div className="px-6 py-5 text-[12px] text-muted-foreground leading-relaxed space-y-3">
              {section.content.split("\n\n").map((para, i) => {
                const lines = para.split("\n");
                return (
                  <div key={i}>
                    {lines.map((line, j) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return <p key={j} className="font-bold text-foreground text-xs mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
                      }
                      if (line.startsWith("- *")) {
                        return <p key={j} className="ml-4 mt-0.5">• <em>{line.replace(/^- \*/, "").replace(/\*:/, ":")}</em></p>;
                      }
                      if (line.startsWith("- ")) {
                        return <p key={j} className="ml-4 mt-0.5">• {line.slice(2)}</p>;
                      }
                      if (line.startsWith("*")) {
                        return <p key={j} className="ml-4 mt-0.5">• {line.slice(1).trim()}</p>;
                      }
                      if (line.trim()) {
                        // inline bold
                        const parts = line.split(/\*\*(.*?)\*\*/g);
                        return (
                          <p key={j} className="mt-1">
                            {parts.map((part, pi) =>
                              pi % 2 === 1 ? <strong key={pi} className="text-foreground">{part}</strong> : part
                            )}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BeginnerGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">Start Here</span>
        <h1 className="font-display text-3xl lg:text-5xl font-light text-foreground mb-4">
          Beginner's Guide to <span className="text-primary italic">Research Peptides</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Everything a researcher needs to understand peptides — what they are, how they work, how to reconstitute them, how to read syringes, and how to stay safe.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-3">
        {SECTIONS.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05 }}
          >
            <SectionCard section={section} />
          </motion.div>
        ))}
      </div>

      {/* Tools CTA */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Reconstitution Calculator", desc: "Calculate exact injection volumes", href: "/protocol", icon: Calculator },
          { label: "Protocol Supplies", desc: "Get a full supplies list", href: "/supplies", icon: FlaskRound },
          { label: "COA Verification", desc: "Verify your batch purity", href: "/coa", icon: ShieldCheck },
        ].map(({ label, desc, href, icon: Icon }) => (
          <Link key={label} to={href}
            className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all group"
            aria-label={label}>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{label}</p>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary ml-auto transition-colors" aria-hidden="true" />
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-center text-[11px] text-muted-foreground leading-relaxed border-t border-border/40 pt-6">
        Educational disclaimer: This guide is for research and educational purposes only. Not medical advice, diagnosis, or treatment guidance.
        Peptides intended for human therapeutic use require a prescription and physician oversight.
      </p>
    </div>
  );
}