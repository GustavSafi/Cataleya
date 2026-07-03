import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartSlideIn from "./CartSlideIn";

const CART_STORAGE_KEY = "cattleya_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Guard against corrupted/old data shapes.
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.id && typeof i.price === "number") : [];
  } catch {
    return [];
  }
}

export default function SiteLayout() {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(loadCart);
  const [discreet, setDiscreet] = useState(false);

  // Persist the cart so it survives page reloads.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage unavailable (e.g. private mode) — cart just won't persist.
    }
  }, [cartItems]);

  const handleUpdateQty = (id, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, qty } : i))
      );
    }
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + product.qty } : i
        );
      }
      return [...prev, product];
    });
    setCartOpen(true);
  };

  const clearCart = () => setCartItems([]);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        cartCount={cartItems.reduce((sum, i) => sum + i.qty, 0)}
        onCartClick={() => setCartOpen(true)}
      />
      <main id="main-content" tabIndex={-1} className="pt-16 lg:pt-20 outline-none">
        <Outlet context={{ addToCart, cartItems, discreet, clearCart }} />
      </main>
      <Footer />
      <CartSlideIn
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onAddToCart={addToCart}
        discreet={discreet}
        onDiscreetChange={setDiscreet}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
