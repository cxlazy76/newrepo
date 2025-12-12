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
  
  // Forward Range header for video seeking/streaming
  const proxyHeaders = new Headers();
  const clientHeaders = req.headers;

  if (clientHeaders.has('range')) {
    proxyHeaders.set('Range', clientHeaders.get('range') as string);
  }
  // Forward other relevant headers (Accept, Accept-Encoding, etc.)
  if (clientHeaders.has('accept')) {
      proxyHeaders.set('Accept', clientHeaders.get('accept') as string);
  }
  
  const proxyRes = await fetch(signedData.signedUrl, {
    headers: proxyHeaders, // Use the forwarded headers
  });

  if (!proxyRes.ok || !proxyRes.body) {
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }

  // Ensure correct headers are returned to the client for streaming
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

  // Set Content-Disposition to inline for streaming, unless a filename is explicitly provided for download
  if (filename) {
    // This block handles if this route is used for download as well (via filename query param)
    const isDownload = url.pathname.includes('/api/video/stream') && url.searchParams.has('filename');
    
    const contentDisposition = isDownload 
        ? `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
        : finalHeaders.get('Content-Disposition') || 'inline'; 
        
    finalHeaders.set('Content-Disposition', contentDisposition);
  } else {
    // Default to inline for standard streaming
    finalHeaders.set('Content-Disposition', 'inline');
  }
  
  // Use the original status (206 Partial Content or 200 OK)
  return new NextResponse(proxyRes.body, {
    status: proxyRes.status,
    headers: finalHeaders,
  });
}