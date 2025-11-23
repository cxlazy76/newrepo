import Stripe from "stripe";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limiter";
import { headers } from "next/headers";
import { getIp } from "@/lib/get-ip";
import { jsonError } from "@/lib/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const sanitize = (input: string) => {
  if (typeof input !== "string") return "";
  let x = input.replace(/<[^>]*>/g, "");
  x = x.replace(/\s+/g, " ").trim();
  if (x.length > 100) x = x.slice(0, 100);
  return x;
};

function invalidMessage(msg: string) {
  if (msg.length < 20) return true;
  if (!/[a-zA-Z]/.test(msg)) return true;
  if (/^(.)\1+$/.test(msg)) return true;
  if (/^[a-z]{2,}$/.test(msg) && msg.length < 25) return true;
  return false;
}

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

  if (invalidMessage(cleanMessage))
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

  await fetch("/api/log/event", {
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
