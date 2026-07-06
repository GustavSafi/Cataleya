import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { Star, Loader2, LogOut } from "lucide-react";

export default function Account() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Researcher Account</p>
        <h1 className="font-display text-3xl font-light text-foreground">
          Welcome, <span className="text-primary italic">{user?.full_name?.split(" ")[0] || "Researcher"}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
      </motion.div>

      {/* Loyalty — coming soon */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.05 }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Loyalty Rewards</span>
        </div>
        <p className="text-lg font-semibold text-foreground mb-1">Coming Soon</p>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          We're building a loyalty program where you'll earn points on every order to redeem for
          future discounts. It'll appear here once it's live.
        </p>
      </motion.div>

      {/* Account actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/60 bg-white p-5"
      >
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Account</h2>
        <div className="space-y-2 text-sm mb-5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since</span>
            <span className="text-foreground font-medium">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </motion.div>
    </div>
  );
}
