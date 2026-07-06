import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const TERMS = [
  // A
  { term: "Amino Acid", category: "Biochemistry", definition: "The fundamental building blocks of peptides and proteins. There are 20 standard amino acids, each with a unique side chain that determines its chemical properties. Peptides are formed by linking amino acids together via peptide bonds." },
  { term: "Angiogenesis", category: "Biology", definition: "The physiological process through which new blood vessels form from pre-existing vessels. Investigated in TB-500 and BPC-157 research as a potential mechanism contributing to tissue repair." },
  { term: "Anxiolytic", category: "Pharmacology", definition: "Having the property of reducing anxiety. Used to describe compounds like Selank that are investigated in preclinical models for anxiolytic-like effects, typically mediated through GABA or serotonin pathways." },
  { term: "Area Under the Curve (AUC)", category: "Pharmacokinetics", definition: "A measurement of total drug exposure over time, representing the integral of the concentration-time curve. Used in pharmacokinetic studies to compare bioavailability between compounds or routes of administration." },

  // B
  { term: "BAC Water (Bacteriostatic Water)", category: "Reconstitution", definition: "Sterile water containing 0.9% benzyl alcohol as a preservative. The benzyl alcohol inhibits microbial growth, allowing a reconstituted peptide vial to be used for multiple doses over 25–30 days without contamination. Not the same as sterile water (which has no preservative)." },
  { term: "BDNF (Brain-Derived Neurotrophic Factor)", category: "Neuroscience", definition: "A protein belonging to the neurotrophin family that supports the growth, maintenance, and survival of neurons. Investigated as a biomarker of neuroprotective and cognitive-enhancing effects in Semax and related peptide research." },
  { term: "Bioavailability", category: "Pharmacokinetics", definition: "The fraction of an administered dose that reaches systemic circulation unchanged. Subcutaneous and intramuscular injection typically provide much higher bioavailability for peptides than oral administration, which subjects compounds to first-pass metabolism and enzymatic degradation." },
  { term: "Binding Affinity", category: "Pharmacology", definition: "The strength of the interaction between a ligand (such as a peptide) and its target receptor. Measured as Kd (dissociation constant) — a lower Kd indicates stronger binding. Relevant when comparing analogues like Ipamorelin vs. GHRP-6 at the ghrelin receptor." },

  // C
  { term: "Certificate of Analysis (COA)", category: "Quality Control", definition: "A document issued by a laboratory certifying the results of quality testing on a specific batch of a compound. For research peptides, a COA typically includes purity percentage (HPLC), identity confirmation (MS), endotoxin testing, and heavy metal screening. Each batch should have a unique, independently verified COA." },
  { term: "Chain of Custody", category: "Quality Control", definition: "A documented record tracking the handling, transfer, and storage of a sample or product from manufacturing through delivery. Used in COA verification to confirm that testing integrity was maintained throughout the supply chain." },
  { term: "Concentration (mg/mL)", category: "Reconstitution", definition: "The amount of peptide dissolved per unit volume of solvent after reconstitution. Calculated as: total peptide (mg) ÷ BAC water added (mL). Determines the injection volume required to deliver a specific dose. Example: a 5 mg peptide reconstituted in 2 mL = 2.5 mg/mL concentration." },
  { term: "Cortisol", category: "Endocrinology", definition: "A glucocorticoid steroid hormone produced by the adrenal cortex in response to stress and low blood-glucose concentration. Relevant in GH secretagogue research because some compounds (GHRP-2, GHRP-6) co-stimulate cortisol release, while Ipamorelin shows relative selectivity for GH without significant cortisol elevation." },
  { term: "Cytoprotection", category: "Biology", definition: "The protection of cells from noxious agents or conditions, including stress, toxins, and ischemia. BPC-157 is investigated in preclinical models for potential cytoprotective effects in gastrointestinal tissue, partly attributed to nitric oxide pathway interactions." },

  // D
  { term: "DAC (Drug Affinity Complex)", category: "Pharmacology", definition: "A modification to peptides like CJC-1295 that creates a covalent bond with serum albumin, dramatically extending the half-life from minutes to approximately 7–8 days. CJC-1295 with DAC and CJC-1295 without DAC (also called Mod GRF 1-29) have meaningfully different pharmacokinetic profiles." },
  { term: "Degradation", category: "Stability", definition: "The breakdown of a peptide into smaller fragments or amino acids, reducing or eliminating its biological activity. Caused by enzymatic cleavage (proteases), heat, UV light, oxidation, and mechanical agitation. Stable storage conditions and proper reconstitution technique are designed to minimize degradation." },
  { term: "Dose-Response Curve", category: "Pharmacology", definition: "A graph that shows the relationship between dose administered and the magnitude of the biological effect observed. Most peptides exhibit a bell-shaped or sigmoidal dose-response curve, meaning effects plateau or decrease at very high doses — 'more' is not always 'better.'" },

  // E
  { term: "eNOS (Endothelial Nitric Oxide Synthase)", category: "Biochemistry", definition: "An enzyme responsible for producing nitric oxide (NO) in endothelial cells lining blood vessels. Upregulation of eNOS is associated with vasodilation and vascular health. Investigated as part of the proposed mechanism of action for BPC-157 in preclinical studies." },
  { term: "Endotoxin", category: "Quality Control", definition: "Lipopolysaccharides (LPS) derived from the outer membrane of gram-negative bacteria. Contamination with endotoxins can produce significant inflammatory responses in biological research models. Research-grade peptides should be tested for endotoxin levels (EU/mg), with results reported on the COA." },
  { term: "Enzyme", category: "Biochemistry", definition: "A biological catalyst — typically a protein — that accelerates a specific chemical reaction without being consumed. Proteases are enzymes that degrade peptides; understanding enzymatic activity is essential for peptide stability, reconstitution, and storage protocols." },

  // F
  { term: "First-Pass Metabolism", category: "Pharmacokinetics", definition: "The metabolic process by which a substance is significantly reduced in concentration before reaching systemic circulation, primarily occurring in the liver after oral absorption. This is the primary reason most research peptides have poor oral bioavailability and are typically administered parenterally." },

  // G
  { term: "GH Axis (Growth Hormone Axis)", category: "Endocrinology", definition: "The hormonal signaling pathway involving growth hormone releasing hormone (GHRH), growth hormone (GH), and insulin-like growth factor 1 (IGF-1). Key target for peptides including CJC-1295, Sermorelin, Ipamorelin, and GHRP-2/6, each acting at different points in this cascade." },
  { term: "GHK-Cu (Copper Peptide)", category: "Compound", definition: "A naturally occurring copper complex of the tripeptide glycine-histidine-lysine. Investigated in skin biology research for potential roles in wound healing, collagen synthesis, and tissue remodeling. One of the most studied peptides in dermatological research contexts." },
  { term: "Ghrelin Receptor (GHS-R)", category: "Receptor Biology", definition: "The growth hormone secretagogue receptor (type 1a) — the target of ghrelin and synthetic GHRPs including Ipamorelin, GHRP-2, and GHRP-6. Activation stimulates GH release from the pituitary. Ipamorelin shows high selectivity for this receptor with minimal off-target effects." },
  { term: "GLP-1 (Glucagon-Like Peptide-1)", category: "Endocrinology", definition: "An incretin hormone secreted from intestinal L-cells in response to nutrient ingestion. GLP-1 stimulates insulin secretion, suppresses glucagon, slows gastric emptying, and reduces appetite. Semaglutide and tirzepatide are synthetic GLP-1 receptor agonists that mimic and extend these effects." },

  // H
  { term: "Half-Life", category: "Pharmacokinetics", definition: "The time required for the plasma concentration of a compound to decrease by 50%. Determines dosing frequency. Short half-life compounds (e.g., native GHRH: ~7 minutes) require frequent dosing or chemical modifications (DAC, PEGylation) to extend activity. Long half-life compounds (semaglutide: ~1 week) allow once-weekly dosing." },
  { term: "Heavy Metals Panel", category: "Quality Control", definition: "A set of analytical tests measuring the concentration of potentially toxic metallic elements — typically lead (Pb), arsenic (As), mercury (Hg), and cadmium (Cd) — in a compound. COAs for research peptides should include heavy metal results with pass/fail thresholds." },
  { term: "HPLC (High-Performance Liquid Chromatography)", category: "Analytical Chemistry", definition: "An analytical technique used to separate, identify, and quantify components in a mixture. The gold standard method for measuring peptide purity. The purity percentage on a COA (e.g., '≥99% purity') is typically determined by HPLC-UV analysis." },

  // I
  { term: "IC50", category: "Pharmacology", definition: "The half-maximal inhibitory concentration — the concentration of a compound required to inhibit a specific biological process by 50%. Used to compare the potency of different compounds at the same target." },
  { term: "IGF-1 (Insulin-Like Growth Factor 1)", category: "Endocrinology", definition: "A hormone structurally similar to insulin, primarily produced in the liver in response to GH stimulation. IGF-1 LR3 is a synthetic, modified form with extended half-life (~20–30 hours vs. ~15 minutes for native IGF-1), investigated for anabolic and metabolic research applications." },
  { term: "iNOS (Inducible Nitric Oxide Synthase)", category: "Biochemistry", definition: "An enzyme produced in macrophages and other immune cells in response to inflammatory stimuli. iNOS generates large amounts of nitric oxide associated with immune response. In BPC-157 research, attenuation of iNOS is investigated as part of potential anti-inflammatory mechanisms." },
  { term: "Intramuscular (IM) Injection", category: "Administration", definition: "Injection directly into muscle tissue, allowing faster absorption than subcutaneous injection. Used for some peptide protocols (HCG, certain GH protocols). Requires a longer needle and different injection technique than subcutaneous administration." },

  // L
  { term: "LC-MS/MS (Liquid Chromatography-Tandem Mass Spectrometry)", category: "Analytical Chemistry", definition: "A highly sensitive analytical technique that combines chromatographic separation with mass spectrometric detection. Used for identity confirmation of peptides on COAs — can verify the exact molecular weight and fragmentation pattern of a compound, confirming its identity with high confidence." },
  { term: "Lyophilization (Freeze-Drying)", category: "Manufacturing", definition: "A preservation process that removes water from a product (in this case, a peptide solution) under frozen conditions using vacuum sublimation. Produces a stable dry powder (lyophilized cake) that is far more resistant to degradation than a liquid solution. Research peptides are supplied in lyophilized form for this reason." },

  // M
  { term: "Mass Spectrometry (MS)", category: "Analytical Chemistry", definition: "An analytical technique that measures the mass-to-charge ratio (m/z) of ions to identify and quantify compounds. Used alongside HPLC for peptide identity confirmation on COAs. Can detect minor impurities, degradation products, and adulteration that purity-only HPLC may miss." },
  { term: "Mechanism of Action (MoA)", category: "Pharmacology", definition: "The specific biochemical interaction through which a compound produces its biological effect. Understanding MoA is critical for predicting compound interactions, designing research protocols, and interpreting study results. For example, CJC-1295's MoA is GHRH receptor agonism, while Ipamorelin's MoA is ghrelin receptor agonism." },
  { term: "Melanocortin Receptor", category: "Receptor Biology", definition: "A family of 5 G protein-coupled receptors (MC1R–MC5R) with roles in pigmentation, energy homeostasis, sexual function, and inflammation. PT-141 (bremelanotide) and Melanotan II are melanocortin receptor agonists. PT-141 primarily targets MC3R and MC4R, mediating its studied effects on sexual arousal pathways." },

  // N
  { term: "Nitric Oxide (NO)", category: "Biochemistry", definition: "A gaseous signaling molecule with roles in vasodilation, immune function, and cell signaling. Produced by nitric oxide synthase (NOS) enzymes. Investigated as a central element of BPC-157's proposed mechanism of action in preclinical studies, particularly related to vascular and tissue repair effects." },
  { term: "Neuropeptide", category: "Neuroscience", definition: "A peptide that functions as a signaling molecule in the nervous system. Examples include Semax (ACTH/MSH analogue), Selank (tuftsin analogue), and various endorphins. Neuropeptides regulate mood, cognition, pain perception, and sleep." },

  // P
  { term: "Peptide Bond", category: "Biochemistry", definition: "A covalent chemical bond formed between the carboxyl group (–COOH) of one amino acid and the amino group (–NH₂) of another, releasing a water molecule. The backbone of all peptides and proteins is a chain of peptide bonds linking amino acids in sequence." },
  { term: "Pharmacokinetics (PK)", category: "Pharmacokinetics", definition: "The study of how a compound moves through a biological system — absorption, distribution, metabolism, and elimination (ADME). Key PK parameters include half-life, Cmax (peak concentration), Tmax (time to peak), and AUC. PK data determines dosing frequency and route of administration." },
  { term: "Prolactin", category: "Endocrinology", definition: "A hormone produced by the pituitary gland with roles in lactation, immune function, and various metabolic processes. Co-stimulated by some GHRP compounds (notably GHRP-6 and GHRP-2). Ipamorelin demonstrates relative selectivity for GH secretion without significant prolactin elevation, which is considered a research advantage." },
  { term: "Proteolysis", category: "Biochemistry", definition: "The breakdown of proteins or peptides by proteolytic enzymes (proteases). Peptides administered orally are typically subject to extensive proteolysis in the gastrointestinal tract, which is the primary reason most research peptides have poor oral bioavailability and are administered subcutaneously or intramuscularly." },
  { term: "Purity (%)", category: "Quality Control", definition: "The percentage of the target compound relative to all substances detected in a sample, typically measured by HPLC. Research-grade peptides should typically be ≥98% pure, with premium suppliers targeting ≥99%. Lower purity means a higher proportion of unknown impurities, which complicates research interpretation." },

  // R
  { term: "Receptor Agonist", category: "Pharmacology", definition: "A compound that binds to a receptor and activates it, mimicking the effect of the natural ligand. Most research peptides are receptor agonists — for example, semaglutide is a GLP-1 receptor agonist that mimics and exceeds the activity of native GLP-1." },
  { term: "Receptor Antagonist", category: "Pharmacology", definition: "A compound that binds to a receptor but does not activate it, blocking the receptor from being activated by its natural ligand. Used in research to determine the role of specific receptors by selectively blocking them." },
  { term: "Reconstitution", category: "Reconstitution", definition: "The process of dissolving a lyophilized (freeze-dried) peptide powder in a liquid diluent (typically bacteriostatic water) to create an injectable solution. The volume of diluent added determines the final concentration. Proper reconstitution technique is essential for peptide stability and accurate dosing." },

  // S
  { term: "Selectivity", category: "Pharmacology", definition: "The degree to which a compound acts on one specific target relative to others. High selectivity means fewer off-target effects. Ipamorelin is noted for its high selectivity for the ghrelin receptor and relative lack of effect on cortisol and prolactin, compared to less selective GHRP compounds." },
  { term: "Stability", category: "Stability", definition: "The ability of a compound to maintain its chemical structure and biological activity over time under given conditions. Peptide stability depends on temperature, pH, light exposure, moisture, and mechanical stress. Lyophilized peptides are generally far more stable than reconstituted solutions." },
  { term: "Subcutaneous (SubQ) Injection", category: "Administration", definition: "Injection into the subcutaneous tissue layer beneath the skin and above the muscle. The most common route for research peptide administration. Provides slower, more sustained absorption than intramuscular injection. Typically performed using short, fine-gauge insulin needles (29–31G) at a 45° or 90° angle." },
  { term: "Synergy", category: "Pharmacology", definition: "When two compounds used together produce an effect greater than the sum of their individual effects. The CJC-1295 + Ipamorelin combination is studied for potential synergy in GH release because they act on complementary receptors (GHRH-R and GHS-R) in the same GH secretion pathway." },

  // T
  { term: "Thymosin Beta-4 (Tβ4)", category: "Biology", definition: "A naturally occurring 43-amino acid peptide involved in cell migration, proliferation, and tissue repair. TB-500 is a synthetic fragment of Tβ4 (specifically the Ac-SDKP sequence region), investigated in preclinical models for its potential roles in tissue repair and angiogenesis." },
  { term: "Titration", category: "Dosing", definition: "The practice of starting at a lower dose and gradually increasing it over time to find the minimum effective dose while monitoring for adverse effects. Recommended in research protocols for GLP-1 agonists (semaglutide, tirzepatide) to minimize gastrointestinal side effects." },

  // U
  { term: "U-100 Syringe", category: "Equipment", definition: "An insulin syringe calibrated so that 100 units equals 1 mL. Each unit mark on the syringe equals 0.01 mL. The most common syringe type used in peptide research protocols. The 'units' on the syringe are volume markers only — the dose depends on the concentration of the reconstituted peptide solution." },

  // V
  { term: "VEGF (Vascular Endothelial Growth Factor)", category: "Biology", definition: "A signal protein that stimulates the formation of blood vessels (angiogenesis). Elevated VEGF expression is investigated as a biomarker of angiogenic activity in TB-500/thymosin beta-4 preclinical studies, particularly in cardiac and wound healing models." },
];

const CATEGORIES = [...new Set(TERMS.map((t) => t.category))].sort();

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedTerm, setExpandedTerm] = useState(null);

  const filtered = useMemo(() => {
    return TERMS.filter((t) => {
      const matchesSearch =
        !search ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "all" || t.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory]);

  // Group by first letter
  const grouped = useMemo(() => {
    return filtered.reduce((acc, term) => {
      const letter = term.term[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(term);
      return acc;
    }, {});
  }, [filtered]);

  const activeLetters = Object.keys(grouped).sort();

  const categoryColors = {
    "Biochemistry": "bg-blue-100 text-blue-700",
    "Pharmacokinetics": "bg-purple-100 text-purple-700",
    "Pharmacology": "bg-violet-100 text-violet-700",
    "Quality Control": "bg-green-100 text-green-700",
    "Reconstitution": "bg-cyan-100 text-cyan-700",
    "Endocrinology": "bg-orange-100 text-orange-700",
    "Biology": "bg-emerald-100 text-emerald-700",
    "Neuroscience": "bg-indigo-100 text-indigo-700",
    "Analytical Chemistry": "bg-teal-100 text-teal-700",
    "Stability": "bg-amber-100 text-amber-700",
    "Administration": "bg-rose-100 text-rose-700",
    "Manufacturing": "bg-slate-100 text-slate-700",
    "Equipment": "bg-gray-100 text-gray-700",
    "Dosing": "bg-pink-100 text-pink-700",
    "Receptor Biology": "bg-lime-100 text-lime-700",
    "Compound": "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-secondary/40 border-b border-border/60">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">Reference</span>
            <h1 className="font-display text-3xl lg:text-5xl font-light text-foreground mb-4">
              Scientific <span className="text-primary italic">Glossary</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              Definitions for terms used across compound profiles, study summaries, COA reports, and protocol guides — so every researcher starts on equal footing.
            </p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <label htmlFor="glossary-search" className="sr-only">Search glossary terms</label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="glossary-search"
                placeholder="Search terms or definitions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-11 rounded-2xl border-border/60 bg-white"
                aria-label="Search glossary"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 pb-24">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
          <button
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
              activeCategory === "all"
                ? "bg-primary text-white border-primary"
                : "bg-white text-muted-foreground border-border/60 hover:border-primary/40 hover:text-primary"
            }`}
          >
            All ({TERMS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted-foreground border-border/60 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* A–Z quick jump */}
        {!search && (
          <nav aria-label="Jump to letter" className="flex flex-wrap gap-1 mb-8">
            {ALPHABET.map((letter) => {
              const active = activeLetters.includes(letter);
              return (
                <a
                  key={letter}
                  href={active ? `#letter-${letter}` : undefined}
                  aria-label={active ? `Jump to terms starting with ${letter}` : undefined}
                  aria-disabled={!active}
                  className={`w-7 h-7 flex items-center justify-center rounded text-[11px] font-bold transition-all ${
                    active
                      ? "text-primary hover:bg-primary hover:text-white cursor-pointer border border-primary/30"
                      : "text-muted-foreground/30 cursor-default"
                  }`}
                >
                  {letter}
                </a>
              );
            })}
          </nav>
        )}

        {/* Stats row */}
        <p className="text-[11px] text-muted-foreground mb-6">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> of {TERMS.length} terms
          {activeCategory !== "all" && <span> in <span className="font-bold text-primary">{activeCategory}</span></span>}
          {search && <span> matching "<span className="font-bold text-primary">{search}</span>"</span>}
        </p>

        {/* Term groups */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p className="text-sm">No terms found. Try a different search.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {activeLetters.map((letter) => (
              <section key={letter} id={`letter-${letter}`} aria-labelledby={`heading-${letter}`}>
                <div className="flex items-center gap-4 mb-4">
                  <h2 id={`heading-${letter}`}
                    className="font-display text-3xl font-light text-primary/40 leading-none w-8 flex-shrink-0">
                    {letter}
                  </h2>
                  <div className="flex-1 h-px bg-border/60" aria-hidden="true" />
                </div>

                <dl className="space-y-2">
                  {grouped[letter].map((item) => {
                    const isOpen = expandedTerm === item.term;
                    const colorClass = categoryColors[item.category] || "bg-secondary text-foreground";
                    return (
                      <div key={item.term} className="border border-border/50 rounded-xl overflow-hidden bg-white hover:border-primary/25 transition-colors">
                        <button
                          onClick={() => setExpandedTerm(isOpen ? null : item.term)}
                          aria-expanded={isOpen}
                          aria-controls={`def-${item.term.replace(/\s+/g, "-")}`}
                          className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-secondary/20 transition-colors"
                        >
                          <dt className="flex-1 text-sm font-bold text-foreground">{item.term}</dt>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:block ${colorClass}`}>
                            {item.category}
                          </span>
                          {isOpen
                            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                          }
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              id={`def-${item.term.replace(/\s+/g, "-")}`}
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-border/40"
                            >
                              <dd className="px-5 py-4 text-[12px] text-muted-foreground leading-relaxed bg-secondary/10">
                                {item.definition}
                              </dd>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </dl>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}