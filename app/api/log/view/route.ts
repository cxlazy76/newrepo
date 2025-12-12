import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { headers } from "next/headers";
import { getIp } from "@/lib/get-ip";

export async function POST(req: Request) {
  const hdrs = await headers();
  const ip = getIp(hdrs);
  const ua = hdrs.get("user-agent") || "";

  const body = await req.json().catch(() => null);
  if (!body?.path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const supabase = supabaseServer();

  await supabase.from("analytics_page_views").insert({
    path: body.path,
    session_id: body.session_id || null,
    ip,
    ua
  });

  return NextResponse.json({ ok: true });
}