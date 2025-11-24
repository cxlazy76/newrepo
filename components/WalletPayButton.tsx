"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function WalletPayButton() {
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
        requestPayerEmail: true
      });

      const canPay = await pr.canMakePayment();
      if (canPay) {
        setPaymentRequest(pr);

        fetch("/api/log/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_name: "wallet_can_use",
            session_id: null,
            metadata: null
          })
        });

        pr.on("paymentmethod", async (event: any) => {
          fetch("/api/log/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_name: "wallet_payment_started",
              session_id: null,
              metadata: null
            })
          });

          const res = await fetch("/api/payment", {
            method: "POST"
          });

          const { clientSecret } = await res.json();
          const stripeClient = await stripePromise;

          const { error } = await stripeClient!.confirmCardPayment(
            clientSecret,
            {
              payment_method: event.paymentMethod.id
            }
          );

          if (error) {
            fetch("/api/log/event", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event_name: "wallet_payment_failed",
                session_id: null,
                metadata: { message: error.message }
              })
            });

            event.complete("fail");
            return;
          }

          fetch("/api/log/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_name: "wallet_payment_succeeded",
              session_id: null,
              metadata: null
            })
          });

          event.complete("success");
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
      Pay with Wallet
    </button>
  );
}
