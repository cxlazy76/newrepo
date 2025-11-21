"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function ApplePayButton() {
  const [pr, setPr] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const stripe = await stripePromise;
      if (!stripe) return;

      const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "AI Greeting Video",
          amount: 399
        },
        requestPayerName: true,
        requestPayerEmail: true
      });

      const result = await paymentRequest.canMakePayment();

      if (result && result.applePay) {
        setPr(paymentRequest);

        paymentRequest.on("paymentmethod", async (event: any) => {
          const res = await fetch("/api/payment", { method: "POST" });
          const { clientSecret } = await res.json();

          const stripeConfirm = await stripe.confirmCardPayment(clientSecret, {
            payment_method: event.paymentMethod.id
          });

          event.complete(stripeConfirm.error ? "fail" : "success");
        });
      }
    }

    init();
  }, []);

  if (!pr) {
    return null;
  }

  return (
    <button onClick={() => pr.show()}>
      Pay with Apple Pay
    </button>
  );
}
