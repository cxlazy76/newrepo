import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { video_path } = await req.json();

  if (!video_path) {
    return NextResponse.json({ error: "Missing video_path" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  const ONE_YEAR = 60 * 60 * 24 * 365;

  const { data, error } = await supabase
    .storage
    .from("videos")
    .createSignedUrl(video_path, ONE_YEAR);

  if (error || !data) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}