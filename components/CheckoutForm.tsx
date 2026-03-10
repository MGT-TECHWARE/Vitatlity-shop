"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

export default function CheckoutForm({
  orderId,
}: {
  clientSecret: string;
  orderId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation/${orderId}`,
      },
    });

    if (submitError) {
      setError(submitError.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold font-heading">Payment</h2>

      {error && (
        <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
