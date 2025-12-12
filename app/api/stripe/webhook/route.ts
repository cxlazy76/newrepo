import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limiter";
import { getIp } from "@/lib/get-ip";
import { sanitize } from "@/lib/validation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const hdrs = await headers();
  const ip = getIp(hdrs);

  const allowed = await rateLimit(ip, "webhook", 5, 60);
  if (!allowed) {
    await new Promise(res => setTimeout(res, 50));
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature)
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = Buffer.from(await req.arrayBuffer());

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const session_id = session.id;
  const message = sanitize(session.metadata?.message ?? "");
  const character = sanitize(session.metadata?.character ?? "");
  const email = session.customer_details?.email;

  if (!session_id || !message || !character || !email) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { data: existing } = await supabase
    .from("videos")
    .select("id")
    .eq("session_id", session_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true });
  }

  await supabase.from("videos").insert({
    session_id,
    message,
    character,
    email,
    status: "paid",
    video_url: null,
    expires_at: null,
    ip_address: session.metadata?.customer_ip ?? null,
    user_agent: session.metadata?.customer_ua ?? null
  });

  await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.N8N_SECRET ?? ""
    },
    body: JSON.stringify({ session_id })
  });

  return NextResponse.json({ received: true });
}
