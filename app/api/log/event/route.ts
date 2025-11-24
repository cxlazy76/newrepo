import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { headers } from "next/headers";
import { getIp } from "@/lib/get-ip";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.event_name) {
    return NextResponse.json({ error: "Missing event_name" }, { status: 400 });
  }

  const hdrs = await headers();
  const supabase = supabaseServer();

  await supabase.from("analytics_events").insert({
    event_name: body.event_name,
    session_id: body.session_id || null,
    path: body.metadata?.path || null,
    character: body.metadata?.character || null,
    message_length: body.metadata?.length || null,
    metadata: body.metadata || null,
    ip: getIp(hdrs),
    ua: hdrs.get("user-agent") || ""
  });

  return NextResponse.json({ ok: true });
}