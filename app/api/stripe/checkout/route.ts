import Stripe from "stripe";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limiter";
import { headers } from "next/headers";
import { getIp } from "@/lib/get-ip";
import { jsonError } from "@/lib/api";
import { sanitize, isInvalidMessage } from "@/lib/validation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const hdrs = await headers();
  const ip = getIp(hdrs);

  const allowed = await rateLimit(ip, "checkout", 10, 60);
  if (!allowed) {
    await new Promise(res => setTimeout(res, 50));
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON");

  const cleanMessage = sanitize(body.message);
  const cleanCharacter = sanitize(body.character);

  if (!cleanMessage || !cleanCharacter)
    return jsonError("Missing message or character");

  if (isInvalidMessage(cleanMessage))
    return jsonError("Message invalid");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 399,
          product_data: { name: `Custom Video: ${cleanCharacter}` }
        },
        quantity: 1
      }
    ],
    metadata: {
      message: cleanMessage,
      character: cleanCharacter,
      customer_ip: ip,
      customer_ua: hdrs.get("user-agent")
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/characters/${cleanCharacter}`,
  });

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/log/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name: "stripe_session_created",
      session_id: session.id,
      metadata: {
        character: cleanCharacter
      }
    })
  });

  return NextResponse.json({ url: session.url });
}
