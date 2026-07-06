import React, { useState, useEffect } from "react";
import { useParams, Link, useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FlaskRound, Clock, Thermometer, Droplets, BookOpen, Microscope, AlertTriangle, FileText, ChevronRight, ArrowLeft, Zap, Activity, ShoppingCart
} from "lucide-react";
import { ALL_PEPTIDES } from "@/components/stack/peptideData";
import { trackPeptideView } from "@/components/research/ResearchSidebar";
import LabResultsSection from "@/components/product/LabResultsSection";

const PRODUCT_IMAGE = "https://media.base44.com/images/public/6a1f4949719273f90329fc44/71cdaa523_generated_8435cc3d.png";

const DISCLAIMER = "For research and educational purposes only. Not for human use. Not evaluated by the FDA. All information is derived from published scientific literature.";

// Converts a citation string into a PubMed search URL
const CitationLink = ({ citation }) => {
  if (!citation || citation.toLowerCase().includes("no citation")) {
    return <span className="text-[11px] text-primary/70 italic font-medium">{citation}</span>;
  }
  const query = encodeURIComponent(citation.replace(/\s+/g, " ").trim());
  const url = `https://pubmed.ncbi.nlm.nih.gov/?term=${query}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[11px] text-primary/70 italic font-medium hover:text-primary hover:underline transition-colors"
      aria-label={`Search PubMed for: ${citation}`}
    >
      {citation} ↗
    </a>
  );
};

const SectionCard = ({ icon: Icon, title, children, accent = false }) => (
  <div className={`rounded-2xl border p-6 ${accent ? "border-primary/30 bg-primary/5" : "border-border/60 bg-white"}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
      </div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">{title}</h2>
    </div>
    {children}
  </div>
);

const StudyCard = ({ study, index }) => (
  <div className="border border-border/60 rounded-xl p-5 bg-secondary/20">
    <div className="flex items-start gap-3 mb-3">
      <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5" aria-label={`Study ${index + 1}`}>
        {index + 1}
      </span>
      <h3 className="text-sm font-semibold text-foreground leading-relaxed">{study.objective}</h3>
    </div>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      <div>
        <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Sample Size</dt>
        <dd className="text-foreground">{study.sampleSize}</dd>
      </div>
      <div>
        <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Key Findings</dt>
        <dd className="text-foreground">{study.findings}</dd>
      </div>
      <div>
        <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Limitations</dt>
        <dd className="text-muted-foreground">{study.limitations}</dd>
      </div>
      <div>
        <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Citation</dt>
        <dd><CitationLink citation={study.citation} /></dd>
      </div>
    </dl>
  </div>
);

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "storage", label: "Storage & Handling" },
  { id: "animal", label: "Animal Studies" },
  { id: "human", label: "Human Studies" },
  { id: "summaries", label: "Study Summaries" },
  { id: "safety", label: "Safety & Side Effects" },
  { id: "research", label: "Ongoing Research" },
];

export default function PeptideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext() || {};
  const peptide = ALL_PEPTIDES.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState("overview");

  // Go back to wherever the user came from (shop, research, etc.); fall back to the shop.
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/shop");
  };

  const handleAddToCart = () => {
    if (!peptide) return;
    addToCart?.({
      id: peptide.id,
      name: peptide.name,
      price: peptide.price,
      image: PRODUCT_IMAGE,
      qty: 1,
      preorder: peptide.inStock === false,
    });
  };

  useEffect(() => {
    if (id) trackPeptideView(id);
  }, [id]);

  if (!peptide) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl mb-4">Peptide not found</h1>
        <Link to="/research" className="text-primary underline">Back to Research Hub</Link>
      </div>
    );
  }

  const related = ALL_PEPTIDES.filter((p) => peptide.compatible.includes(p.id));

  return (
    <div className="bg-white min-h-screen">
      {/* Research disclaimer banner */}
      <div className="bg-primary/8 border-b border-primary/20 px-6 py-2.5 text-center" role="note" aria-label="Research disclaimer">
        <p className="text-[11px] text-primary/80 font-medium">{DISCLAIMER}</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        {/* Back nav — returns to the previous page (shop, research, etc.) */}
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="mb-10">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
            {/* Product image */}
            <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
              <div className="relative bg-secondary/40 rounded-2xl border border-border/50 aspect-square overflow-hidden">
                <img
                  src={PRODUCT_IMAGE}
                  alt={peptide.name}
                  className="w-full h-full object-contain p-6"
                />
                <div className="absolute top-3 left-3 bg-white/90 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-wider">
                  ≥99%
                </div>
                {peptide.inStock === false && (
                  <div className="absolute top-3 right-3 bg-foreground/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Preorder
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                {peptide.goals.map((g) => (
                  <span key={g} className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {g.replace("_", " ")}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-light text-foreground mb-2">{peptide.name}</h1>
              <p className="text-base text-muted-foreground max-w-2xl leading-relaxed mb-6">{peptide.tagline}</p>

              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary">${peptide.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{peptide.dose} / vial</p>
                  {peptide.inStock === false && (
                    <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mt-2 inline-block">
                      Out of stock — preorder available
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" /> {peptide.inStock === false ? "Preorder" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { icon: Clock,       label: "Half-Life",   value: peptide.halfLife },
              { icon: Thermometer, label: "Storage",     value: "See details below" },
              { icon: Droplets,    label: "Reconstitution", value: "Bacteriostatic water" },
              { icon: Activity,    label: "Research Stage", value: peptide.humanStudies?.[0]?.title?.includes("No") ? "Preclinical" : "Clinical data exists" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-secondary/40 rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                </div>
                <p className="text-xs font-semibold text-foreground leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tab nav */}
        <nav aria-label="Peptide information sections" className="flex overflow-x-auto gap-1 mb-8 pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab panels */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.2 }}
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-label={tabs.find((t) => t.id === activeTab)?.label}
        >
          {activeTab === "overview" && (
            <div className="space-y-5">
              <SectionCard icon={Microscope} title="Mechanism of Action">
                <p className="text-sm text-foreground leading-relaxed">{peptide.mechanism}</p>
              </SectionCard>
              <SectionCard icon={Zap} title="Known Research Combinations">
                <ul className="space-y-2" role="list">
                  {peptide.knownCombinations.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-foreground">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="space-y-5">
              <SectionCard icon={Thermometer} title="Storage Requirements">
                <p className="text-sm text-foreground leading-relaxed">{peptide.storage}</p>
              </SectionCard>
              <SectionCard icon={FlaskRound} title="Stability">
                <p className="text-sm text-foreground leading-relaxed">{peptide.stability}</p>
              </SectionCard>
              <SectionCard icon={Droplets} title="Reconstitution Guidance">
                <p className="text-sm text-foreground leading-relaxed">{peptide.reconstitution}</p>
              </SectionCard>
            </div>
          )}

          {activeTab === "animal" && (
            <div className="space-y-4">
              {peptide.animalStudies.map((study, i) => (
                <div key={i} className="border border-border/60 rounded-xl p-5 bg-white">
                  <h3 className="text-sm font-bold text-foreground mb-2">{study.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">{study.finding}</p>
                  <CitationLink citation={study.citation} />
                  </div>
                  ))}
                  </div>
                  )}

                  {activeTab === "human" && (
            <div className="space-y-4">
              {peptide.humanStudies.map((study, i) => (
                <div key={i} className="border border-border/60 rounded-xl p-5 bg-white">
                  <h3 className="text-sm font-bold text-foreground mb-2">{study.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">{study.finding}</p>
                  {study.limitations && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mt-2">
                      <strong>Limitations:</strong> {study.limitations}
                    </p>
                  )}
                  <CitationLink citation={study.citation} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "summaries" && (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 text-[11px] text-primary/80 mb-4">
                One-minute summaries of key published research. Studies are cited from peer-reviewed sources.
              </div>
              {peptide.studies.map((study, i) => <StudyCard key={i} study={study} index={i} />)}
            </div>
          )}

          {activeTab === "safety" && (
            <div className="space-y-5">
              <SectionCard icon={AlertTriangle} title="Safety Concerns" accent>
                <p className="text-sm text-foreground leading-relaxed">{peptide.safetyConcerns}</p>
              </SectionCard>
              <SectionCard icon={FileText} title="Side Effect Reports from Literature">
                <p className="text-sm text-foreground leading-relaxed">{peptide.sideEffects}</p>
              </SectionCard>
            </div>
          )}

          {activeTab === "research" && (
            <SectionCard icon={BookOpen} title="Ongoing Research Areas">
              <p className="text-sm text-foreground leading-relaxed">{peptide.ongoingResearch}</p>
            </SectionCard>
          )}
        </motion.div>

        <LabResultsSection productId={peptide.id} productName={peptide.name} />

        {/* Related compounds */}
        {related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-border/50" aria-labelledby="related-compounds-heading">
            <h2 id="related-compounds-heading" className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
              Related Compounds Studied in Combination
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/peptide/${r.id}`}
                  className="group p-4 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  aria-label={`View ${r.name} research profile`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{r.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{r.tagline}</p>
                  {peptide.synergy?.[r.id] && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary/70">
                      <Zap className="w-3 h-3" aria-hidden="true" /> {peptide.synergy[r.id]}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}