import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, FlaskRound, Layers, Brain, Zap,
  Activity, Heart, Dumbbell, Moon, Search, ChevronRight, Mic, X, Sparkles, Loader2, Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_PEPTIDES } from "@/components/stack/peptideData";
import RecentStudies from "@/components/research/RecentStudies";
import RegulatoryNews from "@/components/research/RegulatoryNews";
import QuickStartGuides from "@/components/research/QuickStartGuides";
import ComparisonTable from "@/components/research/ComparisonTable";
import ResearchSidebar from "@/components/research/ResearchSidebar";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";
import SearchResults from "@/components/search/SearchResults";
import SearchFilters from "@/components/search/SearchFilters";
import { useSearchEngine } from "@/hooks/useSearchEngine";
import { addRecentSearch, getTrendingSearches } from "@/lib/searchStorage";

const VIAL_IMG = "/images/product-vial.png";

const POPULAR_STACKS = [
  { name: "Recovery Foundation",    peptides: ["BPC-157", "TB-500"],          goal: "Soft-tissue signaling research",    category: "Recovery",  color: "bg-green-50 border-green-200 text-green-800" },
  { name: "GH Axis Research",       peptides: ["CJC-1295", "Ipamorelin"],     goal: "Growth hormone pulse research",     category: "Hormonal",  color: "bg-blue-50 border-blue-200 text-blue-800" },
  { name: "Metabolic Investigation", peptides: ["Semaglutide", "IGF-1 LR3"], goal: "Metabolic signaling pathways",      category: "Fat Loss",  color: "bg-orange-50 border-orange-200 text-orange-800" },
  { name: "Cognitive Exploration",  peptides: ["Semax", "Selank"],            goal: "Nootropic & anxiolytic signaling",  category: "Cognitive", color: "bg-purple-50 border-purple-200 text-purple-800" },
];

const CATEGORIES = [
  { id: "recovery",  label: "Healing & Recovery",  icon: Activity,   count: 2, desc: "Cytoprotection, wound healing signaling, tissue repair models" },
  { id: "metabolic", label: "Metabolic Research",   icon: TrendingUp, count: 3, desc: "GLP-1 agonism, insulin signaling, body composition studies" },
  { id: "cognitive", label: "Cognition & Mood",     icon: Brain,      count: 2, desc: "Nootropic peptides, BDNF modulation, anxiolytic mechanisms" },
  { id: "hormonal",  label: "Hormonal & Longevity", icon: Heart,      count: 4, desc: "GH axis, GHRH analogues, anti-aging hormone research" },
  { id: "muscle",    label: "Muscle & Anabolism",   icon: Dumbbell,   count: 3, desc: "IGF-1 signaling, nitrogen retention, myofibrillar research" },
  { id: "sleep",     label: "Sleep & Circadian",    icon: Moon,       count: 2, desc: "GH secretion timing, sleep architecture, recovery models" },
];

export default function ResearchHub() {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: "all", purpose: "all", family: "all", admin: "all" });
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const trending = getTrendingSearches();

  const { results, featuredSnippet, relatedSearches, aiAnswer, researchStudies, isLoading } = useSearchEngine(query, filters);

  const commitSearch = (val) => {
    const v = (val || inputValue).trim();
    if (!v) return;
    addRecentSearch(v);
    setQuery(v);
    setInputValue(v);
    setShowAutocomplete(false);
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search not supported in this browser.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInputValue(text);
      commitSearch(text);
    };
    rec.start();
  };

  const clearSearch = () => {
    setInputValue("");
    setQuery("");
    inputRef.current?.focus();
  };

  const hasResults = query && results && (results.directPeptides?.length > 0 || results.contentResults?.length > 0);

  return (
    <div className="bg-white min-h-screen">
      {/* Disclaimer */}
      <div className="bg-primary/8 border-b border-primary/20 px-6 py-2.5 text-center" role="note">
        <p className="text-[11px] text-primary/80 font-medium">
          Research & Education Portal — For informational purposes only. Not medical advice. Not for human use.
        </p>
      </div>

      {/* Header + AI Search Bar */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary/60">AI-Powered Intelligence Dashboard</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-light text-foreground mb-3">
            Peptide <span className="text-primary italic">Research Hub</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Ask anything — natural language questions, compound names, symptoms, goals, or research topics.
          </p>
        </motion.div>

        {/* AI Search Input */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setShowAutocomplete(true); setQuery(e.target.value); }}
              onKeyDown={(e) => { if (e.key === "Enter") commitSearch(); if (e.key === "Escape") setShowAutocomplete(false); }}
              onFocus={() => setShowAutocomplete(true)}
              placeholder='Try "BPC-157 vs TB-500" or "best peptide for sleep recovery"…'
              className="h-14 pl-12 pr-28 text-base rounded-2xl border-border/60 focus:border-primary/60 shadow-sm"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {inputValue && (
                <button onClick={clearSearch} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={handleVoice}
                className={`p-2 rounded-xl transition-colors ${isListening ? "text-primary bg-primary/10 animate-pulse" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}>
                <Mic className="w-4 h-4" />
              </button>
              <Button onClick={() => commitSearch()} size="sm"
                className="bg-primary text-white hover:bg-primary/90 rounded-xl h-9 px-4 text-xs font-semibold">
                Search
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showAutocomplete && (
              <SearchAutocomplete
                query={inputValue}
                onSelect={(v) => { commitSearch(v); setInputValue(v); setShowAutocomplete(false); }}
                onClose={() => setShowAutocomplete(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Trending chips — only when no query */}
        {!query && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {trending.slice(0, 6).map((term, i) => (
              <button key={term} onClick={() => commitSearch(term)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-secondary/40 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all">
                <span className="text-[10px] text-muted-foreground font-bold">#{i + 1}</span>
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">

        {/* ── Active search results ── */}
        {query ? (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {isLoading && !hasResults
                  ? <span className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching…</span>
                  : <span>Results for <strong className="text-foreground">"{query}"</strong></span>
                }
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}
                className="text-xs gap-2 h-8 border-border/60">
                <Filter className="w-3.5 h-3.5" />
                Filters
                {Object.values(filters).some(v => v !== "all") && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <SearchFilters filters={filters} onChange={setFilters} />
                </motion.div>
              )}
            </AnimatePresence>

            <SearchResults
              query={query}
              results={results}
              featuredSnippet={featuredSnippet}
              relatedSearches={relatedSearches}
              aiAnswer={aiAnswer}
              researchStudies={researchStudies}
              isLoading={isLoading}
              onRelatedClick={(s) => { commitSearch(s); setInputValue(s); }}
            />
          </div>
        ) : (

          /* ── Hub browse content (no active search) ── */
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 space-y-14">

              {/* Trending + Recent Studies */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Popular stacks */}
                  <section aria-labelledby="stacks-heading">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
                      <h2 id="stacks-heading" className="text-sm font-bold uppercase tracking-widest text-foreground">Popular Stacks</h2>
                    </div>
                    <div className="space-y-3">
                      {POPULAR_STACKS.map((stack) => (
                        <div key={stack.name} className="p-4 rounded-xl border border-border/60 bg-white hover:border-primary/30 transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xs font-bold text-foreground">{stack.name}</h3>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${stack.color}`}>{stack.category}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {stack.peptides.map((p) => (
                              <span key={p} className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded-lg text-foreground">{p}</span>
                            ))}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{stack.goal}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="lg:col-span-3">
                  <RecentStudies />
                </div>
              </div>

              <RegulatoryNews />
              <ComparisonTable />

              {/* Research categories */}
              <section aria-labelledby="categories-heading">
                <div className="flex items-center gap-2 mb-5">
                  <Layers className="w-4 h-4 text-primary" aria-hidden="true" />
                  <h2 id="categories-heading" className="text-sm font-bold uppercase tracking-widest text-foreground">Research Categories</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => commitSearch(cat.id)}
                      className="p-4 rounded-xl border border-border/60 bg-secondary/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-left">
                      <div className="flex items-center gap-2 mb-1.5">
                        <cat.icon className="w-4 h-4 text-primary" aria-hidden="true" />
                        <h3 className="text-xs font-bold text-foreground">{cat.label}</h3>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{cat.desc}</p>
                      <p className="text-[10px] text-primary/60 mt-2 font-semibold">{cat.count} compounds</p>
                    </button>
                  ))}
                </div>
              </section>

              <QuickStartGuides />

              {/* All compounds */}
              <section aria-labelledby="all-compounds-heading">
                <div className="flex items-center gap-2 mb-5">
                  <FlaskRound className="w-4 h-4 text-primary" aria-hidden="true" />
                  <h2 id="all-compounds-heading" className="text-sm font-bold uppercase tracking-widest text-foreground">All Research Compounds</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {ALL_PEPTIDES.map((p) => (
                    <Link key={p.id} to={`/peptide/${p.id}`}
                      className="group p-4 rounded-xl border border-border/60 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all"
                      aria-label={`View ${p.name} research profile`}>
                      <div className="flex items-center gap-3 mb-2">
                        <img src={VIAL_IMG} alt={p.name} className="w-9 h-9 object-contain bg-secondary/50 rounded-lg p-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{p.name}</h3>
                          <p className="text-[9px] text-muted-foreground">{p.dose}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{p.tagline}</p>
                      <p className="text-[10px] font-semibold text-primary mt-2 flex items-center justify-between">
                        <span>{p.halfLife?.split("(")[0].trim()}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar */}
            <div className="hidden xl:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <ResearchSidebar />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}