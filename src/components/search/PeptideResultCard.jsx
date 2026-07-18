import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";

const VIAL_IMG = "/images/product-vial.png";

const GOAL_COLORS = {
  recovery: "bg-green-50 text-green-700 border-green-200",
  muscle: "bg-blue-50 text-blue-700 border-blue-200",
  fat_loss: "bg-orange-50 text-orange-700 border-orange-200",
  cognitive: "bg-purple-50 text-purple-700 border-purple-200",
  hormonal: "bg-pink-50 text-pink-700 border-pink-200",
  sleep: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function PeptideResultCard({ peptide, rank }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: rank * 0.05 }}>
      <Link to={`/peptide/${peptide.id}`}
        className="group flex items-start gap-4 p-4 rounded-xl border border-border/60 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all">
        <img src={VIAL_IMG} alt={peptide.name}
          className="w-12 h-12 object-contain flex-shrink-0 rounded-xl bg-secondary/50 p-1.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{peptide.name}</h3>
              <p className="text-[10px] text-muted-foreground">{peptide.dose} per vial</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{peptide.tagline}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {peptide.goals?.slice(0, 3).map(g => (
              <span key={g} className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${GOAL_COLORS[g] || "bg-secondary text-foreground border-border/60"}`}>
                {g.replace("_", " ")}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{peptide.halfLife?.split("(")[0].trim()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}