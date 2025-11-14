import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { session_id, video_url } = await req.json();

    if (!session_id || !video_url) {
      return NextResponse.json(
        { error: "Missing session_id or video_url" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!
    );

    await supabase
      .from("videos")
      .update({
        status: "ready",
        video_url,
      })
      .eq("session_id", session_id);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
