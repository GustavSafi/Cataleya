import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FlaskRound, FileText, BookOpen, Calculator, HelpCircle, Layers, Loader2, ArrowRight, Search } from "lucide-react";
import FeaturedSnippet from "@/components/search/FeaturedSnippet";
import PeptideResultCard from "@/components/search/PeptideResultCard";
import ContentResultCard from "@/components/search/ContentResultCard";
import ResearchStudiesPanel from "@/components/search/ResearchStudiesPanel";

const VIAL_IMG = "/images/product-vial.png";

const TYPE_ICONS = {
  page: BookOpen,
  article: FileText,
  faq: HelpCircle,
  stack: Layers,
  calculator: Calculator,
};

export default function SearchResults({ query, results, featuredSnippet, relatedSearches, aiAnswer, researchStudies, isLoading, onRelatedClick }) {
  const hasResults = results && (results.directPeptides?.length > 0 || results.contentResults?.length > 0);
  const isGoalBased = !!results?.detectedGoal;

  if (isLoading && !hasResults) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mb-3" />
        <p className="text-sm">Searching knowledge base…</p>
      </div>
    );
  }

  if (!hasResults && !isLoading) {
    return (
      <div className="text-center py-16">
        <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-sm font-semibold text-foreground mb-1">No results found for "{query}"</p>
        <p className="text-xs text-muted-foreground mb-6">Try a different spelling, a symptom, or browse the Research Hub.</p>
        <Link to="/research" className="text-xs font-semibold text-primary hover:underline">Browse Research Hub →</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Featured Snippet */}
      <FeaturedSnippet snippet={featuredSnippet} aiAnswer={aiAnswer} />

      {/* Goal-based educational header */}
      {isGoalBased && results.goalData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-secondary/40 rounded-xl border border-border/60 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">Research Area Detected</p>
          <p className="text-sm font-bold text-foreground">{results.goalData.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Showing educational content and related compounds for this research goal.</p>
        </motion.div>
      )}

      {/* Two-column layout: content + peptides */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Educational content */}
        {results.contentResults?.length > 0 && (
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Educational Content
            </h2>
            {results.contentResults.map((item, i) => (
              <ContentResultCard key={i} item={item} />
            ))}
          </div>
        )}

        {/* Right: Peptide compounds */}
        {results.directPeptides?.length > 0 && (
          <div className={results.contentResults?.length > 0 ? "lg:col-span-3" : "lg:col-span-5"}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-3">
              <FlaskRound className="w-3.5 h-3.5" /> Research Compounds
            </h2>
            <div className={`grid gap-3 ${results.directPeptides.length === 1 ? "grid-cols-1 max-w-md" : "grid-cols-1 sm:grid-cols-2"}`}>
              {results.directPeptides.map((p, i) => (
                <PeptideResultCard key={p.id} peptide={p} rank={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Research Studies */}
      <ResearchStudiesPanel studies={researchStudies} query={query} />

      {/* Related searches */}
      {relatedSearches?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4 border-t border-border/60">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Search className="w-3.5 h-3.5" /> Related Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedSearches.map((s) => (
              <button key={s} onClick={() => onRelatedClick(s)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary/60 border border-border/60 text-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
                {s}
                <ArrowRight className="w-3 h-3 opacity-50" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}