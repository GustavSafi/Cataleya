import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, BookOpen, ShoppingCart } from "lucide-react";
import PeptideQuickGuide from "@/components/shop/PeptideQuickGuide";
import { ALL_PEPTIDES } from "@/components/stack/peptideData";

const productImage = "https://media.base44.com/images/public/6a1f4949719273f90329fc44/71cdaa523_generated_8435cc3d.png";

// In-stock items first, then preorder (out-of-stock) items.
const products = [...ALL_PEPTIDES].sort((a, b) => Number(b.inStock) - Number(a.inStock));

export default function Shop() {
  const { addToCart } = useOutletContext() || {};

  const handleAdd = (product) => {
    addToCart?.({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImage,
      qty: 1,
      preorder: product.inStock === false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
      <div className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-3 block">Full Catalog</span>
        <h1 className="font-display text-3xl lg:text-4xl font-light text-foreground">
          Peptide <span className="text-primary italic">Collection</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
          Research-grade peptides with ≥99% purity. Every batch third-party tested with full COA.
        </p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="h-px w-16 bg-primary/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="h-px w-16 bg-primary/30" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.5) }}
            className="group"
          >
            {/* Image + title link through to the research page */}
            <Link to={`/peptide/${product.id}`} aria-label={`View ${product.name} research profile`}>
              <div className="bg-secondary/40 rounded-xl overflow-hidden aspect-square mb-3 relative border border-border/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:border-primary/30">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/90 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-wider">
                  ≥99%
                </div>
                {!product.inStock && (
                  <div className="absolute top-2.5 right-2.5 bg-foreground/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Preorder
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {product.name} <span className="text-muted-foreground font-normal text-xs">{product.dose}</span>
              </h3>
            </Link>

            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>

            <div className="flex items-center justify-between mt-1.5 mb-2.5">
              <span className="text-primary font-bold text-sm">${product.price.toFixed(2)}</span>
              {!product.inStock && (
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Out of stock</span>
              )}
            </div>

            {/* Two actions: research or buy */}
            <div className="flex gap-2">
              <Link
                to={`/peptide/${product.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg border border-border/70 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" /> Research
              </Link>
              <button
                onClick={() => handleAdd(product)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-white text-[11px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> {product.inStock ? "Add" : "Preorder"}
              </button>
            </div>

            <PeptideQuickGuide productId={product.id} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
