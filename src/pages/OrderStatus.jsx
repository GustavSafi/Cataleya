import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Landmark, Bitcoin, CreditCard, Loader2 } from "lucide-react";
import { api } from "@/api/apiClient";

export default function OrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [zelle, setZelle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.orders.get(id), api.orders.paymentConfig()])
      .then(([orderData, configData]) => {
        setOrder(orderData);
        setZelle(configData.zelle);
      })
      .catch((err) => setError(err.message || "Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-light mb-2">Order not found</h1>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Link to="/shop" className="text-primary font-semibold text-sm hover:underline">Back to shop →</Link>
      </div>
    );
  }

  const isPaid = order.status === "paid";

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
        <div className="flex items-center gap-3 mb-2">
          {isPaid ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Clock className="w-6 h-6 text-amber-600" />
          )}
          <h1 className="font-display text-2xl font-light">
            {isPaid ? "Order Confirmed" : "Order Placed — Awaiting Payment"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Order reference: <span className="font-mono text-foreground">{order.id}</span>
        </p>

        {!isPaid && order.payment_method === "zelle" && zelle?.email && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm font-bold text-amber-800">Zelle Payment Instructions</h2>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed mb-3">
              Send <strong>${Number(order.total).toFixed(2)}</strong> via Zelle to:
            </p>
            <div className="bg-white rounded-lg border border-amber-200 p-3 text-sm space-y-1 mb-3">
              <p><span className="text-muted-foreground">Recipient:</span> <strong>{zelle.name}</strong></p>
              <p><span className="text-muted-foreground">Email:</span> <strong>{zelle.email}</strong></p>
              <p><span className="text-muted-foreground">Memo:</span> <strong className="font-mono">{order.id.slice(0, 8)}</strong></p>
            </div>
            <p className="text-xs text-amber-700">
              Please include the memo above so we can match your payment. We'll confirm your
              order by email once payment is received — this typically happens within a few hours.
            </p>
          </div>
        )}

        {!isPaid && order.payment_method === "crypto" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Bitcoin className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm font-bold text-amber-800">Awaiting Crypto Payment</h2>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              We're still waiting for your payment to confirm on-chain. This page will update
              automatically once it's received — feel free to close this tab.
            </p>
          </div>
        )}

        {!isPaid && order.payment_method === "card" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm font-bold text-amber-800">Awaiting Card Payment</h2>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              We haven't received confirmation of your card payment yet. If you closed the
              payment page before finishing, you can{" "}
              {order.card_hosted_url ? (
                <a href={order.card_hosted_url} className="font-semibold underline">
                  return to the secure payment page
                </a>
              ) : (
                "start the payment again from your cart"
              )}
              . This page updates automatically once payment clears.
            </p>
          </div>
        )}

        {isPaid && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 mb-8">
            <p className="text-sm text-green-800">
              Payment received — thank you! A confirmation has been sent to <strong>{order.email}</strong>.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-border/60 bg-white p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>{item.name} × {item.qty}</span>
                <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
