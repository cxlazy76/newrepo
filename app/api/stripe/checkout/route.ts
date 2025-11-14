import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export async function POST(req: Request) {
  try {
    const { message, character } = await req.json();

    if (!message || !character) {
      return NextResponse.json(
        { error: "Missing message or character" },
        { status: 400 }
      );
    }

    // 1. Create Stripe Checkout Session with metadata
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `AI Greeting Video - ${character}` },
            unit_amount: 399,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/characters/${character}`,
      metadata: {
        message,
        character,
      },
    });

    // 2. Insert “pending” row in Supabase
    await supabase.from("videos").insert({
      session_id: session.id,
      message,
      character,
      status: "pending",
      video_url: null,
    });

    // 3. Redirect to Stripe
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
