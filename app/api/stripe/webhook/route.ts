import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // IMPORTANT for raw body and stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

// Supabase client for server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export async function POST(req: Request) {
  try {
    // FIX: headers() must be awaited
    const h = await headers();
    const sig = h.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
    }

    // Stripe requires RAW BODY
    const rawBody = await req.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature mismatch: ${err.message}` },
        { status: 400 }
      );
    }

    // 🔥 PAYMENT COMPLETED
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const message = session.metadata?.message ?? "";
      const character = session.metadata?.character ?? "";

      // Update Supabase row
      await supabase
        .from("videos")
        .update({
          status: "paid",
          message,
          character,
        })
        .eq("session_id", session.id);

      // Trigger n8n workflow
      await fetch(process.env.N8N_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.id,
          message,
          character,
        }),
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
