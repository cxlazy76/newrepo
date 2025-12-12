// stream route ts (with added logging for debugging)
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const videoId = url.searchParams.get("id");
  const filename = url.searchParams.get("filename"); 
  
  if (!videoId || !UUID_REGEX.test(videoId)) {
    console.error("Invalid video ID format or missing.");
    return NextResponse.json({ error: "Invalid video ID" }, { status: 404 });
  }

  const supabase = supabaseServer();
  
  // 1. Fetch the video record to get the storage path
  const { data: row, error: dbError } = await supabase
    .from("videos")
    .select("video_url, status")
    .eq("id", videoId)
    .single();
  
  if (dbError || !row || row.status !== "finished" || !row.video_url) {
    console.error("DB Lookup Failed or Video not ready. ID:", videoId, "Error:", dbError, "Row:", row);
    return NextResponse.json({ error: "Video file not found or still processing" }, { status: 404 });
  }
  
  // **DEBUG LOGGING ADDED HERE**
  console.log("Video ID found. Storage Path in DB:", row.video_url);

  // 2. Generate a fresh signed URL
  const signedUrlTTL = 3600; 

  const { data: signedData, error: signedError } = await supabase.storage
    .from("videos") // **CRUCIAL: Ensure this is the correct bucket name, e.g., 'videos'**
    .createSignedUrl(row.video_url, signedUrlTTL);

  if (signedError || !signedData?.signedUrl) {
    // **DEBUG LOGGING ADDED HERE**
    console.error("Signed URL generation failed. Path used:", row.video_url, "Error:", signedError);
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
  }

  // **DEBUG LOGGING ADDED HERE**
  console.log("Signed URL generated successfully. Attempting to fetch...");
  
  // 3. Proxy the request, forwarding the crucial Range header
  // ... (rest of the proxy logic remains the same)
  
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
    // **DEBUG LOGGING ADDED HERE**
    console.error(`Failed to stream video from storage. Status: ${proxyRes.status} URL: ${signedData.signedUrl}`);
    return NextResponse.json({ error: "Failed to stream video from storage" }, { status: 500 });
  }

  // 4. Return necessary streaming headers
  // ... (rest of the successful response logic remains the same)

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