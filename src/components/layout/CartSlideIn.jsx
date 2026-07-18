import React from "react";
import { X, Minus, Plus, ShoppingCart, EyeOff, Eye, PlusCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const BAC_WATER = {
  id: "bac-water-10ml",
  name: "Bacteriostatic Water 10mL",
  price: 12.99,
  image: "/images/product-vial.png",
  qty: 1,
};

export default function CartSlideIn({ open, onClose, items, onUpdateQty, onRemove, onAddToCart, discreet, onDiscreetChange, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const hasPeptide = items.some((i) => i.id !== BAC_WATER.id);
  const hasBacWater = items.some((i) => i.id === BAC_WATER.id);
  const hasPreorder = items.some((i) => i.preorder);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-display text-xl font-light">Your Cart</h2>
              <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b border-border/50">
                      <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {item.name}
                          {item.preorder && (
                            <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 align-middle">
                              Preorder
                            </span>
                          )}
                        </h4>
                        <p className="text-primary font-semibold text-sm mt-1">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQty(item.id, item.qty - 1)}
                            className="w-6 h-6 border border-border rounded flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.qty + 1)}
                            className="w-6 h-6 border border-border rounded flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors self-start"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* BAC Water add-on upsell */}
                  {hasPeptide && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl border-2 p-3 transition-all ${hasBacWater ? "border-primary/40 bg-primary/5" : "border-dashed border-border/60 bg-secondary/20"}`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        {hasBacWater ? "✓ Add-on included" : "Recommended add-on"}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg border border-border/40 flex-shrink-0 overflow-hidden">
                          <img src={BAC_WATER.image} alt="Bacteriostatic Water" className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-tight">Bacteriostatic Water 10mL</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Required to reconstitute your peptide</p>
                          <p className="text-primary font-bold text-xs mt-0.5">${BAC_WATER.price.toFixed(2)}</p>
                        </div>
                        {hasBacWater ? (
                          <div className="flex items-center gap-1 text-primary flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToCart(BAC_WATER)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors flex-shrink-0"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            Add
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                </div>
                {total >= 200 && (
                  <p className="text-xs text-primary font-medium">✓ Free shipping applied</p>
                )}
                {/* Discreet shipping toggle */}
                <button
                  onClick={() => onDiscreetChange(!discreet)}
                  aria-pressed={discreet}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    discreet ? "border-primary bg-primary/5" : "border-border/60 bg-secondary/20"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${discreet ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                    {discreet ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">Discreet Shipping</p>
                    <p className="text-[10px] text-muted-foreground">
                      {discreet ? "✓ Plain packaging — no brand markings" : "Plain packaging with no company name or product details"}
                    </p>
                  </div>
                </button>
                {hasPreorder && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                    Your order includes preorder items. These will ship once back in stock.
                  </p>
                )}
                <Button onClick={onCheckout} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  {hasPreorder ? "Confirm Preorder" : "Secure Checkout"} {discreet && "· Discreet"}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}