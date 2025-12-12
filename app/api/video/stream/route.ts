import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const videoId = url.searchParams.get("id");
  const filename = url.searchParams.get("filename"); 
  
  if (!videoId || !UUID_REGEX.test(videoId)) {
    // Returns 404 if ID is missing or invalid UUID format
    return NextResponse.json({ error: "Invalid video ID" }, { status: 404 });
  }

  const supabase = supabaseServer();
  
  // 1. Fetch the video record to get the storage path
  const { data: row, error: dbError } = await supabase
    .from("videos")
    .select("video_url, status")
    .eq("id", videoId)
    .single();
  
  if (dbError) {
    console.error("Database error fetching video:", dbError);
  }

  if (!row || row.status !== "finished" || !row.video_url) {
    // Returns 404 if video ID is valid but record is not found, not finished, or has no URL
    return NextResponse.json({ error: "Video file not found or still processing" }, { status: 404 });
  }

  // 2. Generate a fresh signed URL
  const signedUrlTTL = 3600; 

  const { data: signedData, error: signedError } = await supabase.storage
    .from("videos")
    .createSignedUrl(row.video_url, signedUrlTTL);

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
  }

  // 3. Proxy the request, forwarding the crucial Range header
  const proxyHeaders = new Headers();
  const clientHeaders = req.headers;

  if (clientHeaders.has('range')) {
    proxyHeaders.set('Range', clientHeaders.get('range') as string);
  }
  if (clientHeaders.has('accept')) {
      proxyHeaders.set('Accept', clientHeaders.get('accept') as string);
  }
  
  const proxyRes = await fetch(signedData.signedUrl, {
    headers: proxyHeaders, 
  });

  if (!proxyRes.ok || !proxyRes.body) {
    return NextResponse.json({ error: "Failed to stream video from storage" }, { status: 500 });
  }

  // 4. Return necessary streaming headers
  const responseHeaders = new Headers(proxyRes.headers);

  const headersToKeep = [
    'content-type', 
    'content-length', 
    'content-range', 
    'accept-ranges', 
    'cache-control',
    'etag'
  ];

  const finalHeaders = new Headers();
  for (const key of headersToKeep) {
    if (responseHeaders.has(key)) {
      finalHeaders.set(key, responseHeaders.get(key) as string);
    }
  }

  // Set Content-Disposition (inline for streaming, attachment for download)
  if (filename) {
    const isDownload = url.searchParams.has('filename');
    
    const contentDisposition = isDownload 
        ? `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
        : finalHeaders.get('Content-Disposition') || 'inline'; 
        
    finalHeaders.set('Content-Disposition', contentDisposition);
  } else {
    finalHeaders.set('Content-Disposition', 'inline');
  }
  
  return new NextResponse(proxyRes.body, {
    status: proxyRes.status,
    headers: finalHeaders,
  });
}