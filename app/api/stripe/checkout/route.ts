import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const { message, character } = await req.json();

  if (!message || !character) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 399,
          product_data: {
            name: `Custom Video: ${character}`,
          },
        },
        quantity: 1,
      }
    ],
    metadata: { message, character },
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/characters/${character}`,
  });

  return NextResponse.json({ url: session.url });
}