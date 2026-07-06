import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, CheckCircle2, QrCode, FlaskRound, ShieldCheck,
  Clock, Award, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";

const BATCH_DB = {
  "CL-BPC157-2401": {
    product: "BPC-157",
    dose: "5mg",
    batchId: "CL-BPC157-2401",
    status: "verified",
    testDate: "January 14, 2024",
    lab: "Analytical Reference Labs (ARL), Phoenix AZ",
    purity: 99.4,
    endotoxin: "<0.1 EU/mg",
    heavyMetals: "Pass — Pb <0.1 ppm, As <0.05 ppm, Hg <0.02 ppm, Cd <0.02 ppm",
    method: "HPLC-UV + LC-MS/MS",
    custodyTimeline: [
      { date: "Dec 28, 2023", event: "Raw material received from supplier", actor: "Cattleya Labs QC" },
      { date: "Jan 3, 2024",  event: "Synthesis initiated — lyophilization batch CL-BPC-2401", actor: "Production" },
      { date: "Jan 10, 2024", event: "Batch sealed and sent to third-party lab", actor: "QC / Logistics" },
      { date: "Jan 14, 2024", event: "Third-party testing completed — PASS", actor: "ARL Laboratory" },
      { date: "Jan 16, 2024", event: "COA issued and QR code assigned", actor: "QC Manager" },
      { date: "Jan 18, 2024", event: "Released for fulfillment", actor: "Fulfillment" },
    ],
  },
  "CL-TB500-2402": {
    product: "TB-500",
    dose: "5mg",
    batchId: "CL-TB500-2402",
    status: "verified",
    testDate: "February 9, 2024",
    lab: "ProSci Testing Labs, San Diego CA",
    purity: 99.1,
    endotoxin: "<0.1 EU/mg",
    heavyMetals: "Pass — all heavy metals below detection limits",
    method: "HPLC-UV + Mass Spectrometry confirmation",
    custodyTimeline: [
      { date: "Jan 20, 2024", event: "Raw material received", actor: "QC" },
      { date: "Jan 28, 2024", event: "Synthesis and lyophilization completed", actor: "Production" },
      { date: "Feb 5, 2024",  event: "Sample sent to ProSci Testing Labs", actor: "QC / Logistics" },
      { date: "Feb 9, 2024",  event: "Third-party testing completed — PASS", actor: "ProSci Labs" },
      { date: "Feb 11, 2024", event: "COA issued — released for fulfillment", actor: "QC Manager" },
    ],
  },
};

const DEMO_BATCHES = ["CL-BPC157-2401", "CL-TB500-2402"];

function TimelineItem({ item, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 mt-1" aria-hidden="true" />
        {!isLast && <div className="w-px flex-1 bg-border mt-1" aria-hidden="true" />}
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{item.date}</p>
        <p className="text-sm text-foreground mt-0.5">{item.event}</p>
        <p className="text-[11px] text-primary/60 mt-0.5">{item.actor}</p>
      </div>
    </div>
  );
}

function BatchResult({ batch }) {
  const [timelineOpen, setTimelineOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="mt-8 space-y-5">

      {/* Status banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${batch.status === "verified" ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
        role="alert" aria-live="polite">
        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${batch.status === "verified" ? "text-green-600" : "text-amber-600"}`} aria-hidden="true" />
        <div>
          <p className={`text-sm font-bold ${batch.status === "verified" ? "text-green-800" : "text-amber-800"}`}>
            {batch.status === "verified" ? "Batch Verified — Third-Party Tested" : "Verification Pending"}
          </p>
          <p className={`text-[11px] ${batch.status === "verified" ? "text-green-700" : "text-amber-700"}`}>
            Batch ID: {batch.batchId} · {batch.product} {batch.dose} · Tested {batch.testDate}
          </p>
        </div>
      </div>

      {/* Testing grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Award,       label: "Purity",          value: `${batch.purity}%`,  color: "text-green-700 bg-green-50 border-green-200" },
          { icon: FlaskRound,  label: "Method",          value: batch.method.split("+")[0].trim(), color: "text-blue-700 bg-blue-50 border-blue-200" },
          { icon: ShieldCheck, label: "Endotoxin",       value: batch.endotoxin,     color: "text-purple-700 bg-purple-50 border-purple-200" },
          { icon: AlertCircle, label: "Heavy Metals",    value: "Pass",              color: "text-green-700 bg-green-50 border-green-200" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`p-4 rounded-xl border ${color}`}>
            <Icon className="w-4 h-4 mb-2" aria-hidden="true" />
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
            <p className="text-sm font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-border/60 p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">Testing Details</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Testing Laboratory</dt>
            <dd className="text-foreground">{batch.lab}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Test Date</dt>
            <dd className="text-foreground">{batch.testDate}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Analytical Method</dt>
            <dd className="text-foreground">{batch.method}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Heavy Metal Panel</dt>
            <dd className="text-foreground">{batch.heavyMetals}</dd>
          </div>
        </dl>
      </div>

      {/* QR section */}
      <div className="bg-secondary/30 rounded-xl border border-border/60 p-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-xl bg-white border border-border/60 flex items-center justify-center flex-shrink-0">
          <QrCode className="w-8 h-8 text-primary/60" aria-label="QR code placeholder" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">QR Code Verification</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Each vial includes a QR code linking to this batch record. Scan the label to verify authenticity and view the complete COA documentation.
          </p>
        </div>
      </div>

      {/* Chain of custody */}
      <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
        <button
          onClick={() => setTimelineOpen(!timelineOpen)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
          aria-expanded={timelineOpen}
          aria-controls="custody-timeline"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground">Chain-of-Custody Timeline</span>
          </div>
          {timelineOpen
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          }
        </button>
        <AnimatePresence>
          {timelineOpen && (
            <motion.div
              id="custody-timeline"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-2">
                {batch.custodyTimeline.map((item, i) => (
                  <TimelineItem key={i} item={item} isLast={i === batch.custodyTimeline.length - 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}

export default function COASearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const found = BATCH_DB[query.trim().toUpperCase()];
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">COA Transparency</span>
        <h1 className="font-display text-3xl lg:text-4xl font-light">
          Batch <span className="text-primary italic">Verification</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
          Enter your batch ID or lot number to access third-party testing results, purity data, heavy metal panels, and full chain-of-custody records.
        </p>
      </motion.div>

      {/* Search */}
      <div className="flex gap-3">
        <label htmlFor="batch-search" className="sr-only">Enter batch ID or lot number</label>
        <Input
          id="batch-search"
          placeholder="Enter batch ID (e.g. CL-BPC157-2401)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-12 rounded-xl"
          aria-label="Batch ID search input"
        />
        <Button
          onClick={handleSearch}
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
          aria-label="Search batch records"
        >
          <Search className="w-4 h-4 mr-2" aria-hidden="true" />
          Verify
        </Button>
      </div>

      {/* Demo hints */}
      <p className="text-[11px] text-muted-foreground mt-3 text-center">
        Sample batch IDs for demo:{" "}
        {DEMO_BATCHES.map((id, i) => (
          <span key={id}>
            <button
              onClick={() => { setQuery(id); }}
              className="text-primary hover:underline font-medium"
              aria-label={`Use batch ID ${id}`}
            >
              {id}
            </button>
            {i < DEMO_BATCHES.length - 1 && ", "}
          </span>
        ))}
      </p>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && <BatchResult key={result.batchId} batch={result} />}
        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
            exit={{ opacity: 0 }}
            className="mt-10 text-center py-14 bg-secondary/30 rounded-xl border border-border/60"
            role="alert"
          >
            <AlertCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
            <p className="text-muted-foreground text-sm font-medium">No batch record found for "{query}"</p>
            <p className="text-[11px] text-muted-foreground mt-1">Please check the ID on your vial label, or contact support.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}