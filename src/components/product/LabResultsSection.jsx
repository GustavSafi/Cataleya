import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { api } from "@/api/apiClient";
import { FileText, Upload, ExternalLink, Loader2, ShieldCheck, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LabResultsSection({ productId, productName }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ lab_name: "", batch_number: "", test_date: "", purity_percent: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const [user, setUser] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    loadResults();
    if (api.auth.isLoggedIn()) {
      api.auth.me().then(setUser).catch(() => {});
    }
  }, [productId]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await api.labResults.filter({ product_id: productId, is_visible: true });
      setResults(data);
    } catch {
      // API unavailable — show the empty state rather than a perpetual spinner.
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) return;
    setUploading(true);
    const { file_url } = await api.uploadFile(pdfFile);
    await api.labResults.create({
      product_id: productId,
      product_name: productName,
      lab_name: form.lab_name,
      batch_number: form.batch_number,
      test_date: form.test_date,
      purity_percent: parseFloat(form.purity_percent) || null,
      pdf_url: file_url,
      is_visible: true,
    });
    setForm({ lab_name: "", batch_number: "", test_date: "", purity_percent: "" });
    setPdfFile(null);
    setShowForm(false);
    setUploading(false);
    loadResults();
  };

  const isAdmin = user?.role === "admin";

  return (
    <section className="mt-10 pt-8 border-t border-border/50" aria-labelledby="lab-results-heading">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 id="lab-results-heading" className="text-sm font-bold uppercase tracking-widest text-foreground">
            Third-Party Purity Lab Results
          </h2>
        </div>
        {isAdmin && !showForm && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}
            className="text-xs gap-1.5 h-7 border-border/60">
            <Plus className="w-3.5 h-3.5" /> Upload COA
          </Button>
        )}
      </div>

      {/* Admin upload form */}
      {isAdmin && showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="mb-5 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Upload New Lab Report</p>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Lab Name</label>
              <Input placeholder="e.g. Janoshik Analytical" value={form.lab_name}
                onChange={e => setForm(f => ({ ...f, lab_name: e.target.value }))} className="h-8 text-xs" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Batch #</label>
              <Input placeholder="e.g. LOT-2025-001" value={form.batch_number}
                onChange={e => setForm(f => ({ ...f, batch_number: e.target.value }))} className="h-8 text-xs" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Test Date</label>
              <Input type="date" value={form.test_date}
                onChange={e => setForm(f => ({ ...f, test_date: e.target.value }))} className="h-8 text-xs" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Purity %</label>
              <Input type="number" placeholder="e.g. 99.2" value={form.purity_percent}
                onChange={e => setForm(f => ({ ...f, purity_percent: e.target.value }))} className="h-8 text-xs" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">PDF Report</label>
            <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
              onChange={e => setPdfFile(e.target.files[0])} />
            <button onClick={() => fileRef.current.click()}
              className="flex items-center gap-2 text-xs text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-primary/5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              {pdfFile ? pdfFile.name : "Choose PDF file"}
            </button>
          </div>
          <Button size="sm" onClick={handleUpload} disabled={uploading || !pdfFile}
            className="text-xs h-8">
            {uploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Uploading…</> : "Save Lab Result"}
          </Button>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading lab results…
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-8 rounded-xl border border-border/40 bg-secondary/20">
          <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Lab results will appear here as they become available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {results.map((r) => (
            <motion.a
              key={r.id}
              href={r.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border/60 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all text-center"
              aria-label={`View lab report from ${r.lab_name || "lab"} — ${r.test_date || ""}`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <FileText className="w-6 h-6 text-red-500" aria-hidden="true" />
              </div>
              <div className="w-full">
                <p className="text-[11px] font-bold text-foreground truncate">{r.lab_name || "Lab Report"}</p>
                {r.purity_percent && (
                  <p className="text-[13px] font-bold text-green-600">{r.purity_percent}% Pure</p>
                )}
                {r.batch_number && (
                  <p className="text-[10px] text-muted-foreground truncate">{r.batch_number}</p>
                )}
                {r.test_date && (
                  <p className="text-[10px] text-muted-foreground">{r.test_date}</p>
                )}
              </div>
              <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </motion.a>
          ))}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground mt-3">
        All lab results are conducted by independent third-party testing facilities. For research verification only.
      </p>
    </section>
  );
}