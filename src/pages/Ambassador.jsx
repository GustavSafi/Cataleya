import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/api/apiClient";

// Follower minimums calculated for ~1,000 avg engagements
// Avg engagement rates: TikTok ~5.96%, Instagram ~1.22%, Twitter ~0.045%, Snapchat ~3%
const PLATFORMS = [
  {
    id: "tiktok",
    name: "TikTok",
    minFollowers: "17,000+",
    minNum: 17000,
    rate: "~5.96% avg engagement",
    color: "bg-black text-white",
    iconBg: "bg-black",
    desc: "TikTok's high organic reach makes it our top-performing ambassador channel.",
  },
  {
    id: "instagram",
    name: "Instagram",
    minFollowers: "82,000+",
    minNum: 82000,
    rate: "~1.22% avg engagement",
    color: "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
    iconBg: "bg-pink-500",
    desc: "Reels and Stories drive strong product awareness for our visual catalog.",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    minFollowers: "2,200,000+",
    minNum: 2200000,
    rate: "~0.045% avg engagement",
    color: "bg-foreground text-white",
    iconBg: "bg-foreground",
    desc: "High-volume audience required due to lower platform engagement rates.",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    minFollowers: "34,000+",
    minNum: 34000,
    rate: "~3% avg engagement",
    color: "bg-yellow-400 text-black",
    iconBg: "bg-yellow-400",
    desc: "Snap's loyal audience creates strong repeat engagement for niche content.",
  },
];

const COMMISSION_TIERS = [
  { tier: "Starter",    commission: "5%",  desc: "Starting commission on all referred purchases" },
  { tier: "Rising",     commission: "7%",  desc: "Unlock when referral purchases exceed $500/mo" },
  { tier: "Established",commission: "10%", desc: "Unlock when referral purchases exceed $2,000/mo" },
  { tier: "Elite",      commission: "15%", desc: "Invite-only for top performers with 6+ months of consistent referrals" },
];

export default function Ambassador() {
  const [submitted, setSubmitted] = useState(false);
  const [platform, setPlatform] = useState("");
  const [form, setForm] = useState({ name: "", email: "", handle: "", followers: "", content: "" });

  const selectedPlatformData = PLATFORMS.find((p) => p.id === platform);

  const meetsRequirement = () => {
    if (!selectedPlatformData || !form.followers) return null;
    const num = parseInt(form.followers.replace(/,/g, ""));
    return num >= selectedPlatformData.minNum;
  };

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setError("");
    setSending(true);
    try {
      await api.forms.submit("ambassador", form.email, {
        name: form.name,
        platform,
        handle: form.handle,
        followers: form.followers,
        content: form.content,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong — please try again.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-5" aria-hidden="true" />
        <h2 className="font-display text-2xl font-light text-foreground mb-2">Application Received</h2>
        <p className="text-sm text-muted-foreground">We review applications within 3–5 business days. You'll receive an email with next steps if you're approved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24 space-y-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">Partnership Program</span>
        <h1 className="font-display text-3xl lg:text-5xl font-light text-foreground mb-4">
          Become an <span className="text-primary italic">Ambassador</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Partner with Cattleya Labs and earn commission on every referred purchase. Start at 5% — grow as your referrals grow.
        </p>
      </motion.div>

      {/* Commission tiers */}
      <section aria-labelledby="tiers-heading">
        <h2 id="tiers-heading" className="text-sm font-bold uppercase tracking-widest text-foreground mb-5 text-center">Commission Tiers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMMISSION_TIERS.map((tier, i) => (
            <div key={tier.tier} className={`p-5 rounded-2xl border text-center ${i === 0 ? "border-primary/30 bg-primary/5" : "border-border/60 bg-white"}`}>
              <div className={`text-3xl font-bold mb-1 ${i === 0 ? "text-primary" : "text-foreground"}`}>{tier.commission}</div>
              <p className="text-xs font-bold text-foreground mb-1">{tier.tier}</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform requirements */}
      <section aria-labelledby="platforms-heading">
        <h2 id="platforms-heading" className="text-sm font-bold uppercase tracking-widest text-foreground mb-2">Platform Requirements</h2>
        <p className="text-[11px] text-muted-foreground mb-5">Minimums calculated to ensure an average of 1,000+ engagements per post based on platform-specific engagement rates.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORMS.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border border-border/60 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${p.iconBg} text-white flex-shrink-0`}>
                  {p.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{p.rate}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-foreground mb-1">{p.minFollowers}</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section aria-labelledby="apply-heading">
        <h2 id="apply-heading" className="text-sm font-bold uppercase tracking-widest text-foreground mb-6 text-center">Apply Now</h2>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-border/60 overflow-hidden">
          <form onSubmit={handleSubmit} className="px-6 py-7 space-y-5" aria-label="Ambassador application form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amb-name" className="text-xs font-bold text-foreground block mb-1.5">Full Name</label>
                <Input id="amb-name" placeholder="Your name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10" required aria-required="true" />
              </div>
              <div>
                <label htmlFor="amb-email" className="text-xs font-bold text-foreground block mb-1.5">Email</label>
                <Input id="amb-email" type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-10" required aria-required="true" />
              </div>
            </div>

            {/* Platform select */}
            <div>
              <label htmlFor="amb-platform" className="text-xs font-bold text-foreground block mb-1.5">Primary Platform</label>
              <select id="amb-platform" value={platform} onChange={(e) => setPlatform(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                required aria-required="true">
                <option value="">Select a platform…</option>
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — requires {p.minFollowers}</option>
                ))}
              </select>
            </div>

            {platform && (
              <motion.div initial={{ opacity: 0, y: -6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amb-handle" className="text-xs font-bold text-foreground block mb-1.5">@Handle / Profile URL</label>
                  <Input id="amb-handle" placeholder="@username" value={form.handle}
                    onChange={(e) => setForm({ ...form, handle: e.target.value })} className="h-10" required aria-required="true" />
                </div>
                <div>
                  <label htmlFor="amb-followers" className="text-xs font-bold text-foreground block mb-1.5">
                    Follower Count
                    {selectedPlatformData && <span className="text-muted-foreground font-normal ml-1">({selectedPlatformData.minFollowers} min)</span>}
                  </label>
                  <Input id="amb-followers" placeholder="e.g. 25000" value={form.followers}
                    onChange={(e) => setForm({ ...form, followers: e.target.value })} className="h-10" required aria-required="true"
                    aria-describedby={meetsRequirement() === false ? "follower-warning" : undefined} />
                  {meetsRequirement() === false && (
                    <p id="follower-warning" className="text-[10px] text-amber-600 mt-1" role="alert">
                      Below the minimum for {selectedPlatformData?.name}. You may still apply and we'll review on a case-by-case basis.
                    </p>
                  )}
                  {meetsRequirement() === true && (
                    <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Meets the minimum requirement
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            <div>
              <label htmlFor="amb-content" className="text-xs font-bold text-foreground block mb-1.5">Tell us about your content</label>
              <textarea id="amb-content" placeholder="What topics do you cover? Who is your audience? Why are you interested in partnering with Cattleya Labs?"
                value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24"
                required aria-required="true" aria-label="Tell us about your content" />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
            )}
            <Button type="submit" disabled={sending} className="w-full h-11 bg-primary hover:bg-primary/85 text-white font-bold">
              {sending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Submitting...</>
              ) : (
                <>Submit Application <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></>
              )}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}