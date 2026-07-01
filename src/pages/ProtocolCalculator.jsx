import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, FlaskRound, Mail, CheckCircle2, Sparkles } from "lucide-react";
// Custom protocol wizard is deferred to a later release — see the "coming soon" card below.
// import ProtocolWizard from "@/components/protocol/ProtocolWizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ReconstitutionCalculator() {
  const [peptideAmount, setPeptideAmount] = useState("");
  const [peptideUnit, setPeptideUnit] = useState("mg");
  const [bacWater, setBacWater] = useState("");
  const [doseAmount, setDoseAmount] = useState("");
  const [doseUnit, setDoseUnit] = useState("mcg");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const pa = parseFloat(peptideAmount);
    const bw = parseFloat(bacWater);
    const da = parseFloat(doseAmount);
    if (!pa || !bw || !da) return;

    // Normalize everything to mg
    const totalMg = peptideUnit === "mcg" ? pa / 1000 : pa;
    const doseMg  = doseUnit   === "mcg" ? da / 1000 : da;

    const concMgPerMl = totalMg / bw;              // mg/mL
    const volumePerDoseMl = doseMg / concMgPerMl;  // mL
    const volumePerDoseUnits = volumePerDoseMl * 100; // U-100 syringe units
    const totalDoses = Math.floor(totalMg / doseMg);

    setResult({
      concMgPerMl: concMgPerMl.toFixed(3),
      concMcgPerMl: (concMgPerMl * 1000).toFixed(1),
      volumeMl: volumePerDoseMl.toFixed(3),
      volumeUnits: volumePerDoseUnits.toFixed(1),
      totalDoses,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
      <div className="px-6 py-5 border-b border-border/60 bg-secondary/30">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Reconstitution Calculator</h2>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Enter your peptide details to calculate exact syringe volume.</p>
      </div>

      <div className="px-6 py-6 space-y-5">
        {/* Step 1 */}
        <div>
          <label className="text-xs font-bold text-foreground block mb-2">
            Step 1 — Total Peptide Amount
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="e.g. 5"
              value={peptideAmount}
              onChange={(e) => setPeptideAmount(e.target.value)}
              className="h-10"
              aria-label="Peptide amount"
            />
            <div className="flex rounded-lg border border-border/60 overflow-hidden flex-shrink-0">
              {["mg", "mcg"].map((u) => (
                <button
                  key={u}
                  onClick={() => setPeptideUnit(u)}
                  aria-pressed={peptideUnit === u}
                  className={`w-12 h-10 text-xs font-bold transition-all ${peptideUnit === u ? "bg-primary text-white" : "bg-white text-muted-foreground hover:text-foreground"}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <label htmlFor="bac-water" className="text-xs font-bold text-foreground block mb-2">
            Step 2 — BAC Water Volume (mL)
          </label>
          <Input
            id="bac-water"
            type="number"
            placeholder="e.g. 2"
            value={bacWater}
            onChange={(e) => setBacWater(e.target.value)}
            className="h-10"
            aria-label="Bacteriostatic water volume in mL"
          />
        </div>

        {/* Step 3 */}
        <div>
          <label className="text-xs font-bold text-foreground block mb-2">
            Step 3 — Desired Dose Per Injection
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="e.g. 250"
              value={doseAmount}
              onChange={(e) => setDoseAmount(e.target.value)}
              className="h-10"
              aria-label="Target dose per injection"
            />
            <div className="flex rounded-lg border border-border/60 overflow-hidden flex-shrink-0">
              {["mcg", "mg"].map((u) => (
                <button
                  key={u}
                  onClick={() => setDoseUnit(u)}
                  aria-pressed={doseUnit === u}
                  className={`w-12 h-10 text-xs font-bold transition-all ${doseUnit === u ? "bg-primary text-white" : "bg-white text-muted-foreground hover:text-foreground"}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={calculate} className="w-full h-10 bg-primary hover:bg-primary/85 text-white text-sm font-bold" aria-label="Calculate injection volume">
          <Calculator className="w-4 h-4 mr-2" aria-hidden="true" /> Calculate
        </Button>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3"
            role="region" aria-label="Calculation results">
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Results</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Concentration", value: `${result.concMgPerMl} mg/mL`, sub: `${result.concMcgPerMl} mcg/mL` },
                { label: "Volume per Dose", value: `${result.volumeMl} mL`, sub: `${result.volumeUnits} units (U-100)` },
                { label: "Total Doses / Vial", value: result.totalDoses, sub: "at target dose" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-white rounded-lg p-3 border border-primary/10">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="text-lg font-bold text-primary">{value}</p>
                  <p className="text-[10px] text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Draw to the <strong>{result.volumeUnits}-unit mark</strong> on a U-100 syringe for each injection.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function RequestProtocolForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", peptide: "", goal: "", notes: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" aria-hidden="true" />
        <h3 className="font-bold text-green-800 text-sm mb-1">Protocol Request Received</h3>
        <p className="text-[11px] text-green-700">We'll prepare a custom research protocol guide and send it to your email within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
      <div className="px-6 py-5 border-b border-border/60 bg-secondary/30">
        <div className="flex items-center gap-2">
          <FlaskRound className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Request a Custom Protocol</h2>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Free custom research guide — we'll send it to your inbox.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4" aria-label="Request custom protocol form">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="req-name" className="text-xs font-bold text-foreground block mb-1.5">Name</label>
            <Input id="req-name" placeholder="Your name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10" required aria-required="true" />
          </div>
          <div>
            <label htmlFor="req-email" className="text-xs font-bold text-foreground block mb-1.5">Email</label>
            <Input id="req-email" type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-10" required aria-required="true" />
          </div>
        </div>
        <div>
          <label htmlFor="req-peptide" className="text-xs font-bold text-foreground block mb-1.5">Peptide / Compound</label>
          <Input id="req-peptide" placeholder="e.g. BPC-157, CJC-1295 + Ipamorelin blend" value={form.peptide}
            onChange={(e) => setForm({ ...form, peptide: e.target.value })} className="h-10" required aria-required="true" />
        </div>
        <div>
          <label htmlFor="req-goal" className="text-xs font-bold text-foreground block mb-1.5">Research Goal</label>
          <select id="req-goal" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
            className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            required aria-required="true">
            <option value="">Select a goal…</option>
            <option>Recovery & tissue repair</option>
            <option>Growth hormone / anti-aging</option>
            <option>Metabolic / weight management</option>
            <option>Cognitive enhancement</option>
            <option>Hormonal health</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="req-notes" className="text-xs font-bold text-foreground block mb-1.5">Additional Notes (optional)</label>
          <textarea id="req-notes" placeholder="Any specific requirements, vial sizes, or protocol preferences…"
            value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
            aria-label="Additional notes for protocol request" />
        </div>
        <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/85 text-white text-sm font-bold">
          <Mail className="w-4 h-4 mr-2" aria-hidden="true" /> Request My Protocol
        </Button>
      </form>
    </div>
  );
}

// Placeholder for the deferred custom-protocol wizard.
function CustomProtocolComingSoon() {
  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
      <div className="px-6 py-5 border-b border-border/60 bg-secondary/30">
        <div className="flex items-center gap-2">
          <FlaskRound className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Custom Protocol</h2>
        </div>
      </div>
      <div className="px-6 py-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base mb-1">Coming Soon</h3>
          <p className="text-[12px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Personalised research protocols tailored to your goals, biomarkers, and experience
            are on the way. In the meantime, use the reconstitution calculator or reach out via
            our contact page.
          </p>
        </div>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
        >
          <Mail className="w-3.5 h-3.5" /> Contact us
        </a>
      </div>
    </div>
  );
}

export default function ProtocolCalculator() {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24 space-y-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">Tools & Protocols</span>
        <h1 className="font-display text-3xl lg:text-4xl font-light text-foreground mb-3">
          Protocol <span className="text-primary italic">Calculator</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Calculate exact injection volumes for any peptide, vial size, and target dose.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReconstitutionCalculator />
        <CustomProtocolComingSoon />
      </div>

      <div className="text-center text-[11px] text-muted-foreground leading-relaxed border-t border-border/40 pt-8">
        For research purposes only. Not medical advice. Consult a qualified professional for human therapeutic guidance.
      </div>
    </div>
  );
}