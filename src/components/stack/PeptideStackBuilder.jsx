import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Zap } from "lucide-react";
import { ALL_PEPTIDES } from "./peptideData";
import { Link } from "react-router-dom";
import StackTray from "./StackTray";
import CompoundFilters from "./CompoundFilters";

const VIAL_IMG = "/images/product-vial.png";

function getHalfLifeClass(peptide) {
  const hl = peptide.halfLife || "";
  if (/week|day/i.test(hl)) return "long";
  return "short";
}

function getMechanismKeywords(peptide) {
  const m = (peptide.mechanism || "").toLowerCase();
  const tags = [];
  if (m.includes("ghrh") || m.includes("gh release") || m.includes("growth hormone")) tags.push("GH-axis");
  if (m.includes("glp-1") || m.includes("gip")) tags.push("GLP-1");
  if (m.includes("igf")) tags.push("IGF");
  if (m.includes("ghs-r") || m.includes("ghrelin")) tags.push("Ghrelin-R");
  if (m.includes("no system") || m.includes("nitric oxide")) tags.push("NO-pathway");
  if (m.includes("bdnf") || m.includes("nootropic") || m.includes("acth")) tags.push("Neuro");
  if (m.includes("melanocortin")) tags.push("Melanocortin");
  return tags;
}

function findConflicts(stack) {
  const conflicts = [];
  const classes = stack.map((p) => ({ id: p.id, name: p.name, class: getHalfLifeClass(p) }));
  const hasLong = classes.filter((c) => c.class === "long");
  const hasShort = classes.filter((c) => c.class === "short");
  if (hasLong.length > 0 && hasShort.length > 0) {
    conflicts.push({ type: "half-life", severity: "info",
      message: `Mixed half-lives: ${hasLong.map((c) => c.name).join(", ")} (days–weeks) vs. ${hasShort.map((c) => c.name).join(", ")} (hours). Research dosing protocols differ.` });
  }
  const allTags = stack.flatMap((p) => getMechanismKeywords(p).map((t) => ({ tag: t, name: p.name })));
  const tagGroups = {};
  allTags.forEach(({ tag, name }) => { if (!tagGroups[tag]) tagGroups[tag] = []; tagGroups[tag].push(name); });
  Object.entries(tagGroups).forEach(([tag, names]) => {
    if (names.length > 1) conflicts.push({ type: "mechanism", severity: "warning",
      message: `Overlapping mechanism (${tag}): ${names.join(" + ")} — additive pathway effects should be considered in research protocol design.` });
  });
  const hasCold = stack.filter((p) => p.storage?.includes("−80") || p.storage?.includes("acetic"));
  if (hasCold.length > 0 && stack.length > hasCold.length) {
    conflicts.push({ type: "storage", severity: "info",
      message: `${hasCold.map((p) => p.name).join(", ")} requires specialized storage. Other compounds use standard −20 °C.` });
  }
  const specialRecon = stack.filter((p) => p.reconstitution?.includes("acetic"));
  if (specialRecon.length > 0) {
    conflicts.push({ type: "reconstitution", severity: "warning",
      message: `${specialRecon.map((p) => p.name).join(", ")} requires acetic acid for reconstitution — not bacteriostatic water.` });
  }
  return conflicts;
}

export default function PeptideStackBuilder({ onAddToCart }) {
  const [activeGoal, setActiveGoal]       = useState("all");
  const [halfLifeFilter, setHalfLifeFilter] = useState("all");
  const [priceFilter, setPriceFilter]     = useState("all");
  const [stack, setStack]                 = useState([]);
  const [analyzerTab, setAnalyzerTab]     = useState("conflicts");

  const stackIds = stack.map((s) => s.id);
  const compatibleIds = [...new Set(stack.flatMap((s) => s.compatible).filter((id) => !stackIds.includes(id)))];

  const filtered = ALL_PEPTIDES.filter((p) => {
    if (stackIds.includes(p.id)) return false;
    if (activeGoal !== "all" && !p.goals.includes(activeGoal)) return false;
    if (halfLifeFilter === "short" && getHalfLifeClass(p) !== "short") return false;
    if (halfLifeFilter === "long"  && getHalfLifeClass(p) !== "long")  return false;
    if (priceFilter === "under50" && p.price >= 50) return false;
    if (priceFilter === "50to80"  && (p.price < 50 || p.price > 80)) return false;
    if (priceFilter === "over80"  && p.price <= 80) return false;
    return true;
  });

  const suggestions = ALL_PEPTIDES.filter((p) => compatibleIds.includes(p.id) && !stackIds.includes(p.id));

  const addToStack = (peptide) => {
    if (stack.length >= 5) return;
    setStack((prev) => [...prev, peptide]);
  };

  const getSynergyNote = (peptide) => {
    for (const s of stack) {
      if (s.synergy?.[peptide.id]) return s.synergy[peptide.id];
      if (peptide.synergy?.[s.id]) return peptide.synergy[s.id];
    }
    return null;
  };

  const conflicts       = findConflicts(stack);
  const stackMechTags   = [...new Set(stack.flatMap(getMechanismKeywords))];
  const researchCategories = [...new Set(stack.flatMap((p) => p.goals))];
  const storageTypes    = [...new Set(stack.map((p) => {
    if (p.storage?.includes("−80")) return "−80 °C ultra-cold";
    if (p.storage?.includes("−20")) return "−20 °C freezer";
    return "2–8 °C refrigerator";
  }))];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30 border-t border-border/50" aria-labelledby="stack-builder-heading">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">PCPartPicker for Peptides</span>
          <h2 id="stack-builder-heading" className="font-display text-3xl lg:text-4xl font-light text-foreground">
            Build Your <span className="text-primary italic">Research Stack</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            Filter by goal, half-life, and price — click to add compounds — get instant analysis of conflicts, overlaps, and storage.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16 bg-primary/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="h-px w-16 bg-primary/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Filters + Browse */}
          <div className="lg:col-span-2 space-y-6">

            {/* Multi-filter system */}
            <div className="bg-white rounded-2xl border border-border/60 p-5">
              <CompoundFilters
                activeGoal={activeGoal}     setActiveGoal={setActiveGoal}
                halfLifeFilter={halfLifeFilter} setHalfLifeFilter={setHalfLifeFilter}
                priceFilter={priceFilter}   setPriceFilter={setPriceFilter}
              />
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-bold text-foreground">{filtered.length}</span> of {ALL_PEPTIDES.length - stack.length} compounds
              </p>
              {stack.length > 0 && (
                <Link to="/research" className="text-xs text-primary hover:underline font-semibold">
                  Compare in Research Hub →
                </Link>
              )}
            </div>

            {/* Compound card grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list" aria-label="Available compounds">
              <AnimatePresence mode="popLayout">
                {filtered.map((peptide) => {
                  const synergy   = getSynergyNote(peptide);
                  const isCompat  = compatibleIds.includes(peptide.id);
                  return (
                    <motion.button
                      key={peptide.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.18 }}
                      onClick={() => addToStack(peptide)}
                      disabled={stack.length >= 5}
                      role="listitem"
                      aria-label={`Add ${peptide.name} to stack${isCompat && stack.length > 0 ? " — compatible" : ""}`}
                      className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 group bg-white hover:shadow-md ${
                        isCompat && stack.length > 0
                          ? "border-primary/50 hover:border-primary hover:shadow-primary/10"
                          : "border-border/60 hover:border-primary/30"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {/* Compatible badge */}
                      {isCompat && stack.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                          <Zap className="w-2.5 h-2.5" aria-hidden="true" /> Synergy
                        </span>
                      )}

                      {/* Vial image */}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-11 h-11 bg-secondary/60 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <img src={VIAL_IMG} alt={peptide.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{peptide.name}</p>
                          <p className="text-[10px] text-muted-foreground">{peptide.dose}</p>
                          <p className="text-[9px] text-muted-foreground/70">{peptide.halfLife?.split("(")[0].trim()}</p>
                        </div>
                      </div>

                      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
                        {synergy || peptide.tagline}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">${peptide.price.toFixed(2)}</span>
                        <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors" aria-hidden="true">
                          <Plus className="w-3 h-3 text-primary group-hover:text-white transition-colors" />
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-12 text-sm text-muted-foreground">
                  No compounds match the selected filters.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Stack Tray */}
          <div className="lg:col-span-1">
            <StackTray
              stack={stack}
              onRemove={(id) => setStack((prev) => prev.filter((p) => p.id !== id))}
              onClear={() => setStack([])}
              onAddToCart={onAddToCart}
              analyzerTab={analyzerTab}
              setAnalyzerTab={setAnalyzerTab}
              conflicts={conflicts}
              stackMechTags={stackMechTags}
              researchCategories={researchCategories}
              storageTypes={storageTypes}
              suggestions={suggestions}
              getSynergyNote={getSynergyNote}
              addToStack={addToStack}
            />
          </div>
        </div>
      </div>
    </section>
  );
}