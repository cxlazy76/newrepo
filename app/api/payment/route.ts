import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST() {
  const intent = await stripe.paymentIntents.create({
    amount: 399,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({
    clientSecret: intent.client_secret,
  });
}