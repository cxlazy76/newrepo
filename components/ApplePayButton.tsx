"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function ApplePayButton() {
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    async function setup() {
      const stripe = await stripePromise;
      if (!stripe) return;

      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: { label: "AI Greeting Video", amount: 399 },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const canPay = await pr.canMakePayment();

      if (canPay && canPay.applePay) {
        setPaymentRequest(pr);

        pr.on("paymentmethod", async (event: any) => {
          const res = await fetch("/api/payment", {
            method: "POST",
          });

          const { clientSecret } = await res.json();

          const stripe = await stripePromise;

          const { error } = await stripe!.confirmCardPayment(clientSecret, {
            payment_method: event.paymentMethod.id,
          });

          event.complete(error ? "fail" : "success");
        });
      }
    }

    setup();
  }, []);

  const handleClick = async () => {
    if (!paymentRequest) return;
    await paymentRequest.show();
  };

  return (
    <button onClick={handleClick}>
      <img src="/payment/apple-pay.svg" alt="apple-pay" />
    </button>
  );
}
