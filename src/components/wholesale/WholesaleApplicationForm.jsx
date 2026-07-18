import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, Globe, CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/api/apiClient";

const TIERS = ["Wholesale", "Preferred Partner", "Enterprise", "White Label"];
const TYPES = ["Research Company", "Laboratory", "University", "Reseller / Distributor", "Biotech Firm", "Clinic", "Other"];
const VOLUMES = ["Under $5,000/year", "$5,000–$20,000/year", "$20,000–$50,000/year", "$50,000–$100,000/year", "$100,000+/year"];

export default function WholesaleApplicationForm() {
  const [form, setForm] = useState({
    companyName: "", contactName: "", email: "", phone: "", website: "",
    orgType: "", annualVolume: "", tier: "", interestedIn: [], notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleInterest = (item) => {
    setForm(f => ({
      ...f,
      interestedIn: f.interestedIn.includes(item)
        ? f.interestedIn.filter(i => i !== item)
        : [...f.interestedIn, item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setError("");
    setSending(true);
    try {
      const { email, ...rest } = form;
      await api.forms.submit("wholesale", email, rest);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong — please try again.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <section id="apply" className="py-20 bg-primary/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-green-200 p-12">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">Application Received</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Thank you! Our wholesale team will review your application and respond within <strong>24 business hours</strong> at <strong>{form.email}</strong>.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              For urgent inquiries: <a href="mailto:wholesale@cattleyalabs.com" className="text-primary font-semibold">wholesale@cattleyalabs.com</a>
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-20 bg-secondary/20">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-3 block">Get Started</span>
          <h2 className="font-display text-3xl font-light text-foreground mb-3">
            Apply for a <span className="text-primary italic">Wholesale Account</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Complete the form below. Approvals typically within 24 hours. You'll receive pricing confirmation and account credentials by email.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
          {/* Contact info */}
          <div className="px-8 pt-8 pb-6 border-b border-border/60">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-5 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-primary" /> Organization Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Company Name *</label>
                <Input placeholder="Acme Research Inc." value={form.companyName}
                  onChange={e => set("companyName", e.target.value)} className="h-10" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Contact Name *</label>
                <Input placeholder="Dr. Jane Smith" value={form.contactName}
                  onChange={e => set("contactName", e.target.value)} className="h-10" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  <Mail className="w-3 h-3 inline mr-1" />Business Email *
                </label>
                <Input type="email" placeholder="purchasing@company.com" value={form.email}
                  onChange={e => set("email", e.target.value)} className="h-10" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  <Phone className="w-3 h-3 inline mr-1" />Phone
                </label>
                <Input placeholder="+1 (555) 000-0000" value={form.phone}
                  onChange={e => set("phone", e.target.value)} className="h-10" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  <Globe className="w-3 h-3 inline mr-1" />Website
                </label>
                <Input placeholder="https://yourcompany.com" value={form.website}
                  onChange={e => set("website", e.target.value)} className="h-10" />
              </div>
            </div>
          </div>

          {/* Account details */}
          <div className="px-8 py-6 border-b border-border/60">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-5">Account Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Organization Type *</label>
                <select value={form.orgType} onChange={e => set("orgType", e.target.value)} required
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="">Select…</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Est. Annual Volume *</label>
                <select value={form.annualVolume} onChange={e => set("annualVolume", e.target.value)} required
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="">Select…</option>
                  {VOLUMES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Tier of Interest</label>
                <select value={form.tier} onChange={e => set("tier", e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="">Select…</option>
                  {TIERS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="px-8 py-6 border-b border-border/60">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Interested In (select all that apply)</p>
            <div className="flex flex-wrap gap-2">
              {["Bulk Pricing", "White Label", "Custom Batches", "API Access", "Drop Shipping", "Dedicated Account Manager"].map((item) => (
                <button type="button" key={item} onClick={() => toggleInterest(item)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${form.interestedIn.includes(item) ? "bg-primary text-white border-primary" : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="px-8 py-6">
            <label className="text-xs font-semibold text-foreground block mb-1.5">Additional Notes</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
              placeholder="Tell us about your research, specific peptides needed, volume requirements, or any questions…"
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24" />
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
            )}
            <Button type="submit" disabled={sending} className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold mt-4">
              {sending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Submit Wholesale Application</>
              )}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              We respond within 24 business hours. Direct inquiries: <a href="mailto:wholesale@cattleyalabs.com" className="text-primary font-semibold">wholesale@cattleyalabs.com</a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}