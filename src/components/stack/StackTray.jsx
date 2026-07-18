import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, BookOpen, FlaskRound, Zap, AlertTriangle, Clock, Thermometer, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const VIAL_IMG = "/images/product-vial.png";

const severityStyle = {
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};
const severityIcon = { warning: AlertTriangle, info: Clock };

function downloadStackPDF(stack, conflicts, stackMechTags, storageTypes, researchCategories) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 60;

  const line = () => { doc.setDrawColor(220, 200, 210); doc.line(margin, y, W - margin, y); y += 16; };
  const section = (title) => {
    if (y > 700) { doc.addPage(); y = 60; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.setTextColor(143, 50, 82);
    doc.text(title.toUpperCase(), margin, y);
    y += 14; line();
    doc.setTextColor(30, 30, 30);
  };

  // Title
  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(143, 50, 82);
  doc.text("Research Stack Summary", margin, y); y += 10;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(120, 100, 110);
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Cattleya Labs · For Research Use Only`, margin, y + 10);
  y += 30; line();

  // Compounds
  section("Compounds in Stack");
  stack.forEach((p, i) => {
    if (y > 720) { doc.addPage(); y = 60; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(30, 30, 30);
    doc.text(`${i + 1}. ${p.name}`, margin, y); y += 14;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(90, 80, 85);
    const details = [
      `Dose: ${p.dose}`,
      `Half-life: ${p.halfLife?.split("(")[0].trim() || "—"}`,
      `Price: $${p.price.toFixed(2)}`,
      `Storage: ${p.storage?.split(".")[0] || "—"}`,
    ];
    details.forEach((d) => { doc.text(d, margin + 14, y); y += 12; });
    doc.setTextColor(60, 60, 60);
    const wrapped = doc.splitTextToSize(p.tagline || "", W - margin * 2 - 14);
    doc.text(wrapped, margin + 14, y); y += wrapped.length * 12 + 8;
  });

  // Mechanisms
  if (stackMechTags.length > 0) {
    section("Active Mechanisms");
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
    doc.text(stackMechTags.join("  ·  "), margin, y); y += 20;
  }

  // Research Categories
  if (researchCategories.length > 0) {
    section("Research Categories");
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
    doc.text(researchCategories.map((c) => c.replace("_", " ")).join("  ·  "), margin, y); y += 20;
  }

  // Storage
  section("Storage Requirements");
  storageTypes.forEach((s) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
    doc.text(`• ${s}`, margin, y); y += 14;
  });
  y += 4;

  // Conflicts
  section("Protocol Analysis");
  if (conflicts.length === 0) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(30, 130, 70);
    doc.text("✓ No conflicts detected in this stack configuration.", margin, y); y += 20;
  } else {
    conflicts.forEach((c) => {
      if (y > 700) { doc.addPage(); y = 60; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(9);
      doc.setTextColor(c.severity === "warning" ? 160 : 50, c.severity === "warning" ? 100 : 100, 30);
      doc.text(`[${c.severity.toUpperCase()}]`, margin, y);
      doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60);
      const wrapped = doc.splitTextToSize(c.message, W - margin * 2 - 10);
      doc.text(wrapped, margin + 58, y); y += wrapped.length * 13 + 6;
    });
  }

  // Disclaimer
  if (y > 680) { doc.addPage(); y = 60; }
  y += 10; line();
  doc.setFont("helvetica", "italic"); doc.setFontSize(8); doc.setTextColor(150, 130, 140);
  const disclaimer = "This document is for research and educational purposes only. Not intended for human use, medical diagnosis, or treatment. Always consult applicable regulations before conducting peptide research.";
  const dLines = doc.splitTextToSize(disclaimer, W - margin * 2);
  doc.text(dLines, margin, y);

  doc.save(`cattleya-research-stack-${Date.now()}.pdf`);
}

export default function StackTray({
  stack, onRemove, onClear, onAddToCart,
  analyzerTab, setAnalyzerTab,
  conflicts, stackMechTags, researchCategories, storageTypes,
  suggestions, getSynergyNote, addToStack,
}) {
  const stackTotal = stack.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-2xl border border-border/60 shadow-lg overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 bg-foreground text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FlaskRound className="w-4 h-4 text-primary" aria-hidden="true" />
              <h3 className="text-sm font-bold uppercase tracking-widest">My Research Stack</h3>
            </div>
            <span className="text-xs font-semibold text-white/50">{stack.length}/5</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden" role="progressbar"
            aria-valuenow={stack.length} aria-valuemin={0} aria-valuemax={5} aria-label="Stack capacity">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${(stack.length / 5) * 100}%` }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          {/* Slot indicators */}
          <div className="flex gap-1.5 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${i < stack.length ? "bg-primary" : "bg-white/15"}`} />
            ))}
          </div>
        </div>

        {/* Stack items */}
        <div className="px-4 py-3 space-y-2 min-h-[120px]">
          <AnimatePresence>
            {stack.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-7 text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-3">
                  <img src={VIAL_IMG} alt="Empty stack" className="w-10 h-10 object-contain opacity-30" />
                </div>
                <p className="text-xs text-muted-foreground">Click any compound to add it to your stack</p>
              </motion.div>
            )}
            {stack.map((peptide, idx) => (
              <motion.div
                key={peptide.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24, height: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-3 bg-secondary/40 rounded-xl px-3 py-2.5 border border-border/50 hover:border-primary/30 transition-colors group"
              >
                {/* Numbered vial */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-border/60 shadow-sm">
                    <img src={VIAL_IMG} alt={peptide.name} className="w-full h-full object-contain p-0.5" />
                  </div>
                  <span className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{peptide.name}</p>
                  <p className="text-[10px] text-muted-foreground">{peptide.dose} · <span className="text-primary font-semibold">${peptide.price.toFixed(2)}</span></p>
                </div>
                <button onClick={() => onRemove(peptide.id)} aria-label={`Remove ${peptide.name}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all flex-shrink-0">
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Analyzer tabs */}
        {stack.length > 0 && (
          <div className="border-t border-border/60">
            <div className="flex">
              {[
                { id: "conflicts", label: "Analysis", icon: AlertTriangle },
                { id: "storage",   label: "Storage",  icon: Thermometer },
                { id: "suggest",   label: "Suggest",  icon: Zap },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setAnalyzerTab(id)} aria-pressed={analyzerTab === id}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                    analyzerTab === id ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  <Icon className="w-3 h-3" aria-hidden="true" />{label}
                </button>
              ))}
            </div>

            <div className="px-4 py-3">
              {analyzerTab === "conflicts" && (
                <div className="space-y-2">
                  {stackMechTags.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Active Mechanisms</p>
                      <div className="flex flex-wrap gap-1">
                        {stackMechTags.map((t) => (
                          <span key={t} className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {researchCategories.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Research Categories</p>
                      <div className="flex flex-wrap gap-1">
                        {researchCategories.map((c) => (
                          <span key={c} className="text-[9px] font-bold bg-secondary text-foreground px-1.5 py-0.5 rounded capitalize">{c.replace("_", " ")}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {conflicts.length === 0 ? (
                    <div className="flex items-center gap-2 text-[11px] text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      ✓ No conflicts detected
                    </div>
                  ) : (
                    conflicts.map((c, i) => {
                      const Icon = severityIcon[c.severity];
                      return (
                        <div key={i} className={`text-[11px] rounded-lg px-3 py-2 border ${severityStyle[c.severity]} leading-relaxed`}>
                          <div className="flex items-start gap-1.5">
                            <Icon className="w-3 h-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <p>{c.message}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {analyzerTab === "storage" && (
                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Storage Requirements</p>
                  {storageTypes.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-[11px] text-foreground">
                      <Thermometer className="w-3 h-3 text-primary flex-shrink-0" aria-hidden="true" />{s}
                    </div>
                  ))}
                  <div className="mt-2 space-y-1.5">
                    {stack.map((p) => (
                      <div key={p.id} className="text-[10px] text-muted-foreground border-l-2 border-primary/20 pl-2">
                        <span className="font-bold text-foreground">{p.name}:</span> {p.storage?.split(".")[0]}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analyzerTab === "suggest" && (
                <div className="space-y-2">
                  {suggestions.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">No further compatible compounds.</p>
                  ) : (
                    suggestions.slice(0, 3).map((s) => {
                      const note = getSynergyNote(s);
                      return (
                        <button key={s.id} onClick={() => addToStack(s)} disabled={stack.length >= 5}
                          aria-label={`Add ${s.name} to stack`}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all disabled:opacity-40 group">
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-foreground">{s.name}</p>
                            {note && <p className="text-[10px] text-primary/70 truncate">{note}</p>}
                          </div>
                          <ChevronRight className="w-3 h-3 text-primary/40 group-hover:text-primary flex-shrink-0" aria-hidden="true" />
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        {stack.length > 0 && (
          <div className="px-4 pb-4 pt-3 border-t border-border/60 bg-secondary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">Stack Total</span>
              <span className="text-lg font-bold text-primary">${stackTotal.toFixed(2)}</span>
            </div>
            <Button onClick={() => stack.forEach((p) => onAddToCart?.({ ...p, qty: 1 }))}
              className="w-full h-10 bg-primary hover:bg-primary/85 text-white text-xs font-bold uppercase tracking-wider"
              aria-label="Add all stack compounds to cart">
              <ShoppingCart className="w-3.5 h-3.5 mr-2" aria-hidden="true" /> Add Stack to Cart
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadStackPDF(stack, conflicts, stackMechTags, storageTypes, researchCategories)}
              className="w-full h-9 mt-2 border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 text-xs font-bold uppercase tracking-wider"
              aria-label="Download stack as PDF summary">
              <Download className="w-3.5 h-3.5 mr-2" aria-hidden="true" /> Download PDF Summary
            </Button>
            <div className="flex items-center justify-between mt-2">
              <button onClick={onClear} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                Clear stack
              </button>
              <Link to="/research" className="text-[11px] text-primary hover:underline flex items-center gap-0.5">
                <BookOpen className="w-3 h-3" aria-hidden="true" /> Research Hub
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}