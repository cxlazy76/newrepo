import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const videoId = url.searchParams.get("id");
  const filename = url.searchParams.get("filename"); 
  
  if (!videoId || !UUID_REGEX.test(videoId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = supabaseServer();
  
  // 1. Fetch the video record to get the storage path
  const { data: row } = await supabase
    .from("videos")
    .select("video_url, status")
    .eq("id", videoId)
    .single();

  if (!row || row.status !== "finished" || !row.video_url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 2. Generate a fresh signed URL (or re-use a cached one)
  const signedUrlTTL = 3600; // 1 hour

  const { data: signedData, error: signedError } = await supabase.storage
    .from("videos")
    .createSignedUrl(row.video_url, signedUrlTTL);

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
  }

  // 3. Proxy the request
  const proxyRes = await fetch(signedData.signedUrl);

  if (!proxyRes.ok || !proxyRes.body) {
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }

  const headers = new Headers(proxyRes.headers);

  // Control the filename via Content-Disposition header
  if (filename) {
    // Force attachment for download
    const contentDisposition = `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
    headers.set('Content-Disposition', contentDisposition);
  }
  
  // Pass through original headers and stream the body
  return new NextResponse(proxyRes.body, {
    status: proxyRes.status,
    headers: headers,
  });
}