import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, FlaskRound, Award, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import PeptideStackBuilder from "@/components/stack/PeptideStackBuilder";

const LOGO_URL = "https://media.base44.com/images/public/6a1f4949719273f90329fc44/a98525bef_IMG_1485.jpg";
const LAB_IMG = "https://media.base44.com/images/public/6a1f4949719273f90329fc44/71cdaa523_generated_8435cc3d.png";

// Most popular peptides with real names
const featuredProducts = [
  { id: "bpc157",    name: "BPC-157",      dose: "5mg",  price: 49.99,  tag: "Best Seller", reviews: 55 },
  { id: "tb500",     name: "TB-500",       dose: "5mg",  price: 44.99,  tag: "Top Rated",   reviews: 48 },
  { id: "semaglutide",name: "Semaglutide", dose: "5mg",  price: 89.99,  tag: "Popular",     reviews: 41 },
  { id: "tirzepatide",name: "Tirzepatide", dose: "5mg",  price: 99.99,  tag: "New",         reviews: 33 },
  { id: "pt141",     name: "PT-141",       dose: "10mg", price: 54.99,  tag: null,          reviews: 37 },
  { id: "cjc1295",   name: "CJC-1295",     dose: "5mg",  price: 59.99,  tag: null,          reviews: 29 },
  { id: "ipamorelin",name: "Ipamorelin",   dose: "5mg",  price: 39.99,  tag: null,          reviews: 44 },
  { id: "igf1lr3",   name: "IGF-1 LR3",    dose: "1mg",  price: 79.99,  tag: null,          reviews: 26 },
];

const tagColors = {
  "Best Seller": "bg-primary text-white",
  "Top Rated":   "bg-primary/80 text-white",
  "Popular":     "bg-primary/60 text-white",
  "New":         "bg-white border border-primary text-primary",
};

export default function Home() {
  const { addToCart } = useOutletContext() || {};

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section aria-labelledby="hero-heading" className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">

        {/* Soft pink background bloom */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-2xl" />
          {/* thin vertical vein lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, #8B2252 0px, #8B2252 0.5px, transparent 0.5px, transparent 120px)"
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Research Grade · ≥99% Purity
                </span>
              </div>

              <div>
                <h1 id="hero-heading" className="font-display text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] tracking-tight text-foreground">
                  Where Nature
                  <br />
                  <span className="text-primary font-normal italic">Blooms</span>
                  <br />
                  Into Science
                </h1>
              </div>

              <p className="text-base text-muted-foreground max-w-md leading-relaxed font-body">
                Premium research peptides crafted with the precision of a laboratory and the
                elegance of the Cattleya orchid. Every batch third-party verified.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/shop">
                  <Button className="h-12 px-8 bg-primary hover:bg-primary/85 text-white font-semibold text-sm uppercase tracking-wider shadow-lg shadow-primary/25">
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="ghost" className="h-12 px-6 text-primary hover:bg-primary/10 font-semibold text-sm uppercase tracking-wider">
                    About the Lab
                  </Button>
                </Link>
              </div>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-3 pt-2">
                {["≥99% Purity", "Third-Party Tested", "Free Shipping $200+", "COA Included"].map((chip) => (
                  <span key={chip} className="text-xs font-medium text-primary/80 bg-primary/8 border border-primary/20 rounded-full px-3 py-1">
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Logo / Flower side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15 }}
              className="flex justify-center order-1 lg:order-2"
            >
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl scale-110" />
                <img
                  src={LOGO_URL}
                  alt="Cattleya Labs"
                  className="relative z-10 w-72 h-72 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div role="list" aria-label="Trust indicators" className="border-y border-primary/15 bg-primary/5 py-4">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {[
              { icon: Shield,    label: "SSL Secure Checkout" },
              { icon: FlaskRound,label: "Third-Party Verified" },
              { icon: Truck,     label: "Free Shipping $200+" },
              { icon: Award,     label: "≥99% Purity Guaranteed" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} role="listitem" className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <section aria-labelledby="products-heading" className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">

          {/* Section header */}
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">
              Our Collection
            </span>
            <h2 id="products-heading" className="font-display text-3xl lg:text-4xl font-light text-foreground">
              Premium <span className="text-primary italic">Peptides</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
              Research-grade compounds with complete documentation — manufactured for precision science.
            </p>
            {/* decorative line */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16 bg-primary/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <div className="h-px w-16 bg-primary/30" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <Link to="/product/bpc-157" className="group block">
                  {/* Image card */}
                  <div className="relative rounded-xl overflow-hidden mb-3 border border-border/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:border-primary/30" style={{ paddingTop: "55%" }}>
                    {/* Blurry Cattleya background */}
                    <img
                      src={LOGO_URL}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-10"
                    />
                    <div className="absolute inset-0 bg-secondary/60" />

                    {/* Purity badge */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-primary text-[9px] font-bold px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-wider z-10">
                      ≥99%
                    </div>
                    {/* Tag badge */}
                    {product.tag && (
                      <div className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-10 ${tagColors[product.tag]}`}>
                        {product.tag}
                      </div>
                    )}

                    {/* Centered peptide name */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-2">
                      <p className="text-center font-display font-semibold text-foreground text-sm lg:text-base leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{product.dose}</p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 z-20">
                      <span className="text-[11px] font-semibold text-primary bg-white/90 px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                        View →
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                    <span className="text-[11px] text-muted-foreground ml-1">({product.reviews})</span>
                  </div>

                  {/* Price + CTA row */}
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-primary font-bold text-sm lg:text-base">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-semibold text-primary/70 uppercase tracking-wider group-hover:text-primary transition-colors">
                      Add →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View all CTA */}
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="outline" className="h-11 px-10 border-primary text-primary hover:bg-primary hover:text-white font-semibold text-sm uppercase tracking-widest transition-all">
                View Full Catalog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STACK BUILDER ── */}
      <PeptideStackBuilder onAddToCart={addToCart} />

      {/* ── WHY CATTLEYA ── */}
      <section aria-labelledby="why-heading" className="py-20 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <img
                src={LAB_IMG}
                alt="Laboratory"
                className="w-full rounded-2xl shadow-lg object-cover h-72 lg:h-96"
              />
            </div>
            <div className="space-y-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary/60">Why Choose Us</span>
                <h2 id="why-heading" className="font-display text-3xl lg:text-4xl font-light mt-2">
                  The <span className="text-primary italic">Standard</span> of<br />Research Excellence
                </h2>
              </div>
              <div className="space-y-5">
                {[
                  { icon: Shield,    title: "Third-Party Verified", desc: "Independent HPLC and MS testing on every batch, no exceptions." },
                  { icon: Award,     title: "≥99% Purity",          desc: "Manufacturing standards that exceed the research community's requirements." },
                  { icon: FlaskRound,title: "Full Documentation",   desc: "Lot-specific COA, MSDS, and storage guides available for every product." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="bg-primary/8 border border-primary/20 rounded-2xl px-8 lg:px-16 py-16 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <img src={LOGO_URL} alt="" className="w-20 h-20 object-contain mx-auto mb-6 opacity-70" />
            <h2 className="font-display text-2xl lg:text-3xl font-light mb-3">
              Ready to Start Your Research?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Browse our complete catalog of premium peptides — all backed by rigorous analytical documentation.
            </p>
            <Link to="/shop">
              <Button className="h-12 px-10 bg-primary hover:bg-primary/85 text-white font-semibold text-sm uppercase tracking-wider shadow-lg shadow-primary/20">
                Shop All Peptides
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}