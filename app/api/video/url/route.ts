import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const videoId = url.searchParams.get("id");
  
  if (!videoId || !UUID_REGEX.test(videoId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = supabaseServer();
  
  const { data: row } = await supabase
    .from("videos")
    .select("video_url, status")
    .eq("id", videoId)
    .single();

  if (!row || row.status !== "finished" || !row.video_url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const signedUrlTTL = 3600; 

  const { data: signedData, error: signedError } = await supabase.storage
    .from("videos")
    .createSignedUrl(row.video_url, signedUrlTTL);

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: signedData.signedUrl,
  });
}