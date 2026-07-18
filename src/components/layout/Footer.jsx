import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/apiClient";

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || status === "submitting") return;

    setStatus("submitting");
    try {
      await api.newsletter.subscribe(email);
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("[newsletter] subscribe failed:", err);
      setStatus("error");
    }
  };

  return (
    <div className="md:col-span-1">
      <h2 className="text-xs font-body font-semibold uppercase tracking-widest mb-4 text-white/40">Stay in the Loop</h2>
      <p className="text-sm text-white/60 leading-relaxed mb-4">
        Get notified about restocks, new peptides, and research updates.
      </p>
      {status === "success" ? (
        <p className="text-sm text-primary font-medium">✓ You're subscribed. Thanks!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full px-3 py-2 rounded-md bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {status === "submitting" ? "Subscribing..." : "Subscribe"}
          </button>
          {status === "error" && (
            <p className="text-xs text-red-300">Something went wrong. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/cattleya-logo.jpg"
                alt=""
                aria-hidden="true"
                className="w-10 h-10 object-contain rounded-sm brightness-200 opacity-80"
              />
              <p className="font-body text-xl font-bold tracking-widest uppercase text-primary">
                CATTLEYA <span className="font-normal text-white/60">labs</span>
              </p>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              The peak of biological refinement. Premium research peptides manufactured under rigorous quality standards.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Shop links">
            <h2 className="text-xs font-body font-semibold uppercase tracking-widest mb-4 text-white/40">Shop</h2>
            <ul className="space-y-2.5">
              <li><Link to="/shop" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Shop All</Link></li>
              <li><Link to="/catalog" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Peptide Catalog</Link></li>
              <li><Link to="/coa" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">COA Search</Link></li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company links">
            <h2 className="text-xs font-body font-semibold uppercase tracking-widest mb-4 text-white/40">Company</h2>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">About the Lab</Link></li>
              <li><Link to="/faqs" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">FAQs</Link></li>
              <li><Link to="/contact" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Contact Us</Link></li>
            </ul>
          </nav>

          {/* Learn */}
          <nav aria-label="Learn links">
            <h2 className="text-xs font-body font-semibold uppercase tracking-widest mb-4 text-white/40">Learn</h2>
            <ul className="space-y-2.5">
              <li><Link to="/guide" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Beginner's Guide</Link></li>
              <li><Link to="/protocol" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Protocol Calculator</Link></li>
              <li><Link to="/supplies" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Supplies Guide</Link></li>
              <li><Link to="/glossary" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Glossary</Link></li>
              <li><Link to="/research" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Research Hub</Link></li>
              <li><Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">My Account</Link></li>
              <li><a href="mailto:support@cattleyalabs.com" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">support@cattleyalabs.com</a></li>
            </ul>
          </nav>

          {/* Newsletter */}
          <NewsletterSignup />
        </div>

        {/* Ambassador CTA */}
        <div className="mt-12 py-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40 mb-2">Interested in partnering with us?</p>
          <Link to="/ambassador"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span aria-hidden="true">✦</span> Become an Ambassador
          </Link>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-4">
          <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-5 text-xs text-white/40">
            <Link to="/privacy" className="hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Privacy Policy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Terms of Service</Link>
            <span aria-hidden="true">·</span>
            <Link to="/cookies" className="hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Cookie Policy</Link>
          </nav>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Cattleya Labs. All rights reserved. For research use only.
            </p>
            <p className="text-xs text-white/30 max-w-xl text-center md:text-right leading-relaxed">
              Products are intended solely for in vitro and laboratory research. Not for human or animal consumption. Not evaluated by the FDA.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}