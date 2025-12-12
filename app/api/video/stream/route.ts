import { NextResponse, NextRequest } from "next/server"; // Import NextRequest for better header handling
import { supabaseServer } from "@/lib/supabaseServer";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Change req: Request to req: NextRequest to allow access to headers
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const videoId = url.searchParams.get("id");
  // FIX: Retrieve the desired filename for Content-Disposition
  // NOTE: This parameter is *only* for the Content-Disposition header.
  const filename = url.searchParams.get("filename"); 
  
  if (!videoId || !UUID_REGEX.test(videoId)) {
    return NextResponse.json({ error: "Invalid video ID" }, { status: 404 });
  }

  const supabase = supabaseServer();
  
  // 1. Fetch the video record to get the storage path
  const { data: row } = await supabase
    .from("videos")
    .select("video_url, status")
    .eq("id", videoId)
    .single();

  if (!row || row.status !== "finished" || !row.video_url) {
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

  // FIX: Forward Range header for video seeking/streaming
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

  // FIX: List of crucial headers to keep for streaming
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

  // FIX: Control Content-Disposition based on the presence of the 'filename' parameter
  if (filename) {
    // If filename is present, treat it as a download and force attachment
    // Using RFC 6266 filename* for non-ASCII characters support
    const contentDisposition = `attachment; filename="${filename.replace(/"/g, '')}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
    finalHeaders.set('Content-Disposition', contentDisposition);
  } else {
    // Default to inline for streaming (video preview)
    finalHeaders.set('Content-Disposition', 'inline');
  }
  
  // Use the original status (206 Partial Content or 200 OK)
  return new NextResponse(proxyRes.body, {
    status: proxyRes.status,
    headers: finalHeaders,
  });
}