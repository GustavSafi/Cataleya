import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, Plus, ChevronDown, ChevronUp, Clock, Thermometer, FlaskRound, Activity } from "lucide-react";
import { ALL_PEPTIDES } from "@/components/stack/peptideData";
import { Link } from "react-router-dom";

const VIAL_IMG = "/images/product-vial.png";

const ROWS = [
  { key: "halfLife",   label: "Half-Life",         icon: Clock },
  { key: "goals",      label: "Research Goals",     icon: Activity },
  { key: "mechanism",  label: "Mechanism Summary",  icon: FlaskRound, truncate: true },
  { key: "storage",    label: "Storage",            icon: Thermometer },
  { key: "price",      label: "Price / Vial",       icon: null },
  { key: "humanStudies", label: "Human Studies",    icon: null },
];

function getCellValue(peptide, key) {
  if (key === "goals") return peptide.goals.map((g) => g.replace("_", " ")).join(", ");
  if (key === "price") return `$${peptide.price.toFixed(2)}`;
  if (key === "humanStudies") return peptide.humanStudies?.[0]?.title?.includes("No") ? "Preclinical only" : "Clinical data available";
  if (key === "mechanism") return peptide.mechanism?.slice(0, 120) + "…";
  return peptide[key] || "—";
}

export default function ComparisonTable() {
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const addPeptide = (p) => {
    if (selected.length >= 4 || selected.find((s) => s.id === p.id)) return;
    setSelected((prev) => [...prev, p]);
    setPickerOpen(false);
  };

  const removePeptide = (id) => setSelected((prev) => prev.filter((p) => p.id !== id));

  const available = ALL_PEPTIDES.filter((p) => !selected.find((s) => s.id === p.id));

  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Research Comparison</h3>
        </div>
        <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
          {expanded ? <><ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> Collapse</> : <><ChevronDown className="w-3.5 h-3.5" aria-hidden="true" /> Expand</>}
        </button>
      </div>

      {/* Compound selector row */}
      <div className="px-5 py-4 border-b border-border/60 bg-secondary/20 overflow-visible">
        <div className="flex items-center gap-3 flex-wrap overflow-visible">
          <AnimatePresence>
            {selected.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-primary/25 shadow-sm">
                <img src={VIAL_IMG} alt={p.name} className="w-6 h-6 object-contain" />
                <span className="text-xs font-bold text-foreground">{p.name}</span>
                <button onClick={() => removePeptide(p.id)} aria-label={`Remove ${p.name} from comparison`}
                  className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {selected.length < 4 && (
            <div className="relative">
              <button onClick={() => setPickerOpen(!pickerOpen)}
                aria-expanded={pickerOpen} aria-haspopup="listbox"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-primary/30 text-xs text-primary/60 font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add compound
              </button>
              <AnimatePresence>
                {pickerOpen && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    role="listbox" aria-label="Select compound to compare"
                    className="absolute top-full left-0 mt-1 z-50 bg-white border border-border/60 rounded-xl shadow-xl min-w-[200px] max-h-64 overflow-y-auto">
                    {available.map((p) => (
                      <button key={p.id} onClick={() => addPeptide(p)} role="option" aria-selected={false}
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-primary/5 text-left transition-colors">
                        <FlaskRound className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.dose}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {selected.length === 0 && (
            <p className="text-[11px] text-muted-foreground">Select up to 4 compounds to compare side-by-side</p>
          )}
        </div>
      </div>

      {/* Comparison table */}
      {selected.length >= 2 && (
        <AnimatePresence>
          {(expanded || selected.length >= 2) && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs" aria-label="Compound comparison table">
                  <thead>
                    <tr className="border-b border-border/60 bg-secondary/30">
                      <th scope="col" className="text-left px-4 py-3 font-bold uppercase tracking-wider text-muted-foreground w-32">Property</th>
                      {selected.map((p) => (
                        <th key={p.id} scope="col" className="px-4 py-3 text-center">
                          <Link to={`/peptide/${p.id}`} className="font-bold text-primary hover:underline">{p.name}</Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row, ri) => {
                      const RowIcon = row.icon;
                      return (
                        <tr key={row.key} className={`border-b border-border/40 ${ri % 2 === 0 ? "bg-white" : "bg-secondary/15"}`}>
                          <td className="px-4 py-3 font-semibold text-foreground/70 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              {RowIcon && <RowIcon className="w-3 h-3 text-primary flex-shrink-0" aria-hidden="true" />}
                              {row.label}
                            </div>
                          </td>
                          {selected.map((p) => {
                            const val = getCellValue(p, row.key);
                            return (
                              <td key={p.id} className="px-4 py-3 text-center text-[11px] text-foreground leading-relaxed">
                                {row.key === "humanStudies" ? (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${val === "Preclinical only" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                                    {val}
                                  </span>
                                ) : row.key === "price" ? (
                                  <span className="font-bold text-primary">{val}</span>
                                ) : row.key === "mechanism" ? (
                                  <span className="text-muted-foreground" title={p.mechanism}>{val}</span>
                                ) : (
                                  <span className="text-muted-foreground">{val}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {selected.length === 1 && (
        <div className="px-5 py-4 text-[11px] text-muted-foreground text-center border-t border-border/40">
          Add at least one more compound to see the comparison
        </div>
      )}
    </div>
  );
}