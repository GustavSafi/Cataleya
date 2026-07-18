import React, { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Star, Minus, Plus, Shield, Truck, Droplets, FlaskRound, ThumbsUp, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const VIAL_IMG = "/images/product-vial.png";

const product = {
  id: "bac-water-10ml",
  name: "Bacteriostatic Water 10mL",
  price: 12.99,
  image: VIAL_IMG,
};

const WHY_ITEMS = [
  {
    icon: FlaskRound,
    title: "What is Bacteriostatic Water?",
    body: "Bacteriostatic Water (BAC Water) is sterile water containing 0.9% benzyl alcohol. The benzyl alcohol acts as a preservative that inhibits bacterial growth, making the solution safe for repeated use over a multi-dose vial — unlike plain sterile water which must be discarded after a single draw.",
  },
  {
    icon: Droplets,
    title: "Why Do I Need It?",
    body: "Peptides like BPC-157 are shipped as a freeze-dried (lyophilised) powder. Before use, this powder must be dissolved — a process called reconstitution. BAC Water is the standard solvent of choice because it is sterile, bacterially stable, and safe for subcutaneous injection.",
  },
  {
    icon: Info,
    title: "How to Use It",
    body: "Draw the required volume of BAC Water into an insulin syringe, inject slowly down the side of the vial (not directly onto the peptide powder), and gently swirl — never shake. Store the reconstituted vial refrigerated at 2–8 °C and use within 30 days.",
  },
  {
    icon: ThumbsUp,
    title: "Why Ours?",
    body: "Our BAC Water is USP-grade, 0.9% benzyl alcohol, supplied in sealed 10mL rubber-stopper vials. Each vial is quality-checked for sterility and clarity before dispatch — so you can focus on your research with confidence.",
  },
];

const SPECS = [
  { label: "Volume", value: "10 mL" },
  { label: "Preservative", value: "0.9% Benzyl Alcohol" },
  { label: "Grade", value: "USP Sterile" },
  { label: "Container", value: "Sealed rubber-stopper vial" },
  { label: "Storage", value: "Room temperature until opened; refrigerate after first use" },
  { label: "Shelf life", value: "30 days after first puncture" },
  { label: "Use with", value: "BPC-157, TB-500, CJC-1295, Ipamorelin & all lyophilised peptides" },
];

const STEPS = [
  "Wipe the vial stopper of both your peptide and BAC Water with an alcohol swab and let dry for 10 seconds.",
  "Using an insulin syringe, draw the required volume of BAC Water (e.g. 2 mL for a 5 mg BPC-157 vial).",
  "Insert the needle into your peptide vial and inject the BAC Water slowly down the inner glass wall — never directly onto the powder.",
  "Gently swirl the vial in a circular motion until the powder is fully dissolved. Do not shake.",
  "The solution should be clear and colourless. Label with today's date and store refrigerated.",
  "Reconstituted peptide remains stable for up to 30 days when refrigerated.",
];

export default function BacWaterPage() {
  const { addToCart } = useOutletContext();
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...product, qty });
  };

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-16">

        {/* Product hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">

          {/* Image */}
          <div className="flex items-center justify-center bg-secondary/30 rounded-2xl border border-border/60 aspect-square max-h-[480px]">
            <img src={VIAL_IMG} alt="Bacteriostatic Water 10mL vial" className="w-3/4 object-contain" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-muted-foreground font-body">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-foreground">Shop</Link>
              <span>/</span>
              <span className="text-foreground">Bacteriostatic Water</span>
            </nav>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 bg-primary/8 px-2 py-0.5 rounded-full">Research Supply</span>
              <h1 className="font-display text-3xl lg:text-4xl font-light tracking-tight text-foreground mt-2">
                Bacteriostatic Water <span className="text-primary italic">10mL</span>
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <span className="text-sm text-muted-foreground">(5.0) · 38 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">Per 10mL vial</span>
            </div>

            <div className="h-px bg-border" />

            {/* Short description */}
            <p className="text-sm text-foreground/80 leading-relaxed">
              USP-grade sterile water with 0.9% benzyl alcohol — the essential solvent for reconstituting lyophilised peptides. Each sealed 10mL vial provides enough diluent for multiple peptide vials and remains stable for 30 days after first use.
            </p>

            {/* Key features */}
            <ul className="space-y-2">
              {["0.9% benzyl alcohol preservative", "USP-grade sterility", "Sealed rubber-stopper vial", "Compatible with all lyophilised peptides"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="h-px bg-border" />

            {/* Quantity + Add to Cart */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-md">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-medium border-x border-border">{qty}</span>
                  <button onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleAddToCart}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider text-sm">
                    Add to Cart
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-md bg-secondary/50">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-semibold">Secure Checkout</p>
                  <p className="text-[10px] text-muted-foreground">SSL Encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-secondary/50">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-semibold">Free Shipping</p>
                  <p className="text-[10px] text-muted-foreground">Orders over $200</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-12 text-[11px] text-amber-800 leading-relaxed">
          <strong>Research use only.</strong> This product is intended solely for in vitro and laboratory research. Not for human or veterinary use, not for therapeutic or diagnostic purposes. Not evaluated by the FDA.
        </div>

        {/* Why / What / How cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {WHY_ITEMS.map(({ icon: Icon, title, body }) => (
            <motion.div key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border/60 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>

        {/* Reconstitution steps */}
        <div className="mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Step-by-Step Reconstitution Guide</h2>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border/60 bg-secondary/20">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[13px] text-foreground/80 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specs table */}
        <div className="mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">Product Specifications</h2>
          <div className="rounded-2xl border border-border/60 overflow-hidden">
            {SPECS.map(({ label, value }, i) => (
              <div key={label} className={`flex items-start gap-4 px-6 py-4 ${i % 2 === 0 ? "bg-secondary/20" : "bg-white"}`}>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-40 flex-shrink-0">{label}</span>
                <span className="text-sm text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to supplies guide */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h3 className="font-display text-xl font-light text-foreground mb-2">Building Your Research Kit?</h3>
          <p className="text-sm text-muted-foreground mb-5">Use our Protocol Supplies Calculator to figure out exactly how much BAC Water and how many syringes you need for your entire research cycle.</p>
          <Link to="/supplies">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-10 text-sm font-semibold">
              Open Supplies Calculator
            </Button>
          </Link>
        </div>

      </section>
    </div>
  );
}