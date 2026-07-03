import React, { useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Bitcoin, Landmark, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api/apiClient";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems = [], discreet = false, clearCart } = useOutletContext() || {};

  const [form, setForm] = useState({
    email: "", full_name: "",
    line1: "", line2: "", city: "", state: "", zip: "", country: "United States",
  });
  const [paymentMethod, setPaymentMethod] = useState("zelle");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <ShoppingBag className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-light mb-2">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mb-6">Add something from the shop before checking out.</p>
        <Link to="/shop" className="text-primary font-semibold text-sm hover:underline">Browse the shop →</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const order = await api.orders.create({
        email: form.email,
        full_name: form.full_name,
        shipping_address: {
          line1: form.line1, line2: form.line2 || undefined,
          city: form.city, state: form.state, zip: form.zip, country: form.country,
        },
        items: cartItems.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        discreet,
        payment_method: paymentMethod,
      });

      if (paymentMethod === "crypto") {
        const { hosted_url } = await api.orders.cryptoCheckout(order.id);
        clearCart?.();
        window.location.href = hosted_url;
      } else {
        clearCart?.();
        navigate(`/order/${order.id}`);
      }
    } catch (err) {
      setError(err.message || "Could not place order");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-light mb-2">Checkout</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {cartItems.length} item{cartItems.length > 1 ? "s" : ""} · <span className="font-semibold text-primary">${total.toFixed(2)}</span>
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required className="h-11" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shipping Address</h2>
            <div className="space-y-4">
              <Input placeholder="Address line 1" value={form.line1} onChange={(e) => set("line1", e.target.value)} required className="h-11" />
              <Input placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => set("line2", e.target.value)} className="h-11" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} required className="h-11 col-span-2 sm:col-span-1" />
                <Input placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} required className="h-11" />
                <Input placeholder="ZIP" value={form.zip} onChange={(e) => set("zip", e.target.value)} required className="h-11" />
                <Input placeholder="Country" value={form.country} onChange={(e) => set("country", e.target.value)} required className="h-11" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("zelle")}
                aria-pressed={paymentMethod === "zelle"}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${paymentMethod === "zelle" ? "border-primary bg-primary/5" : "border-border/60 bg-secondary/20"}`}
              >
                <Landmark className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-foreground">Zelle</p>
                  <p className="text-[11px] text-muted-foreground">Pay via bank transfer</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("crypto")}
                aria-pressed={paymentMethod === "crypto"}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${paymentMethod === "crypto" ? "border-primary bg-primary/5" : "border-border/60 bg-secondary/20"}`}
              >
                <Bitcoin className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-foreground">Crypto</p>
                  <p className="text-[11px] text-muted-foreground">BTC, ETH, USDC & more</p>
                </div>
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary flex-shrink-0"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-primary font-medium underline"
              >
                Terms of Service
              </Link>{" "}
              and confirm these products are for research use only, not for human or animal consumption.
            </span>
          </label>

          <Button type="submit" className="w-full h-12 font-medium" disabled={loading || !agreedToTerms}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Placing order...
              </>
            ) : (
              `Place Order · $${total.toFixed(2)}`
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
