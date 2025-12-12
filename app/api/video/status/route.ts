import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limiter";
import { getIp } from "@/lib/get-ip";

export async function GET(req: Request) {
  const hdrs = await headers();
  const ip = getIp(hdrs);

  const allowed = await rateLimit(ip, "status", 20, 60);
  if (!allowed) {
    await new Promise(res => setTimeout(res, 50));
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session_id = new URL(req.url).searchParams.get("session_id");
  if (!session_id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = supabaseServer();

  const { data: row } = await supabase
    .from("videos")
    .select("id, status, character")
    .eq("session_id", session_id)
    .single();

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: row.id,
    status: row.status,
    character: row.character, 
  });
}