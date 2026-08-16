import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/api/apiClient";

// Local stand-in for the payment gateway's hosted card page. Only reachable while
// the backend has CARD_PROVIDER unset/stub. Deliberately collects no card details —
// with a real gateway the customer is redirected to the gateway's own page and this
// site never touches card data.
export default function DevCardStub() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      await api.orders.simulatePaid(id);
      navigate(`/order/${id}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <CreditCard className="w-7 h-7 text-primary" />
      </div>
      <h1 className="font-display text-xl font-light mb-2">Dev Card Checkout (Stub)</h1>
      <p className="text-sm text-muted-foreground mb-6">
        This page stands in for the payment gateway's hosted card page while
        <code className="mx-1 px-1.5 py-0.5 bg-secondary rounded text-xs">CARD_PROVIDER</code>
        is unset on the backend. Once a merchant account and gateway are in place, customers
        are redirected to the gateway instead — card details are never entered on this site.
      </p>
      <Button onClick={handleSimulate} disabled={loading} className="h-11 px-6">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Simulate Successful Payment
      </Button>
    </div>
  );
}
