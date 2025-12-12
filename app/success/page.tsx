"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Download, Facebook, Share2, Twitter } from "lucide-react";

// --- START: New Utility Functions (Placeholder) ---

// Replace with your actual domain retrieval logic
const getDomain = () => {
  // Use VERCEL_URL in Vercel, or fallback to localhost during development
  // In a real app, you might use 'window.location.origin' on the client.
  // For server-side rendering concerns, you'd fetch from env vars.
  return typeof window !== 'undefined' ? window.location.origin : 'https://example.com'; 
};

// Placeholder for human-readable filename logic
// In a real app, you would fetch this name from the database using videoId
const VIDEO_FILENAME = "santa-claus.mp4"; 

// Helper function to handle clipboard copy
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
// --- END: New Utility Functions ---

function SuccessContent() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload();
      }
    };
  }, []);

  const params = useSearchParams();
  const session_id = params.get("session_id");

  // State to hold the video's UUID/ID, NOT the signed URL.
  const [videoId, setVideoId] = useState(""); 
  const [status, setStatus] = useState<"error" | "processing" | "ready">("processing");

  useEffect(() => {
    import("@/lib/log").then(m => m.logView("/success"));
  }, []);

  useEffect(() => {
    if (!session_id) {
      setStatus("error");
      return;
    }

    let active = true;
    let attempts = 0;

    const delays = [1000, 1500, 2000, 3000, 5000, 8000, 13000, 20000];

    const poll = async () => {
      attempts++;
      if (attempts > 30) {
        setStatus("error");
        return;
      }

      const res = await fetch(`/api/video/status?session_id=${session_id}`);
      if (!res.ok) { // Check res.ok for better error handling
        setStatus("error");
        return;
      }

      const data = await res.json();
      if (!active) return;

      if (data.status === "error") {
        setStatus("error");
        return;
      }

      if (data.status === "finished") {
        // FIX: The URL API is now only needed to get the video ID from the session ID.
        // It no longer returns a signed URL to the client.
        // NOTE: The /api/video/url route is currently not used in this polling logic.
        // The /api/video/status already returns data.id which is the video UUID.
        setVideoId(data.id);
        setStatus("ready");
        return;
      }

      const delay = delays[Math.min(attempts - 1, delays.length - 1)];
      setTimeout(poll, delay);
    };

    poll();

    return () => {
      active = false;
    };
  }, [session_id]);

  useEffect(() => {
    if (status === "ready") {
      import("@/lib/ga").then((m) =>
        m.gaEvent("purchase", {
          currency: "USD",
          value: 3.99,
          transaction_id: session_id,
          items: [
            { item_name: "AI Greeting Video", item_id: session_id }
          ]
        })
      );

      fetch("/api/log/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: "video_finished",
          session_id,
          metadata: null
        })
      });

      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("message:")) localStorage.removeItem(k);
      });
    }
  }, [status, session_id]);

  if (status === "error") return <main>Error</main>;
  if (status === "processing") return <main>Processing</main>;
  
  // FIX: Status === "ready" block
  if (status === "ready" && videoId) {
    // 1. Public streaming URL (proxies to /api/video/stream internally)
    // The 'filename' parameter is omitted to instruct the API to use 'inline' Content-Disposition for streaming.
    const publicStreamUrl = `/stream?id=${videoId}`; 
    
    // 2. Download URL: uses the public stream endpoint but adds the 'filename' parameter.
    // The /api/video/stream route will use this to set the Content-Disposition: attachment
    const downloadUrl = `/stream?id=${videoId}&filename=${encodeURIComponent(VIDEO_FILENAME)}`;

    // 3. Full Public Share URL: uses the final domain and the public stream endpoint.
    const fullShareUrl = `${getDomain()}/stream?id=${videoId}`;


    return (
      <main className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Your Video is Ready!</h1>

        {/* Video Preview: Use the public /stream URL */}
        <video 
            data-testid="video" 
            src={publicStreamUrl} 
            controls 
            className="w-full max-w-xl aspect-video bg-black rounded-lg"
            autoPlay 
        ></video>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {/* Download Button */}
          <a
            href={downloadUrl}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Download Video"
          >
            <Download size={20} />
            Download Video
          </a>

          {/* Share Link Button */}
          <button
            onClick={() => copyToClipboard(fullShareUrl)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Copy Share Link"
          >
            <Copy size={20} />
            Share Link
          </button>
        </div>
        
        {/* Social Share Icons */}
        <div className="flex gap-4 mt-6">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <Facebook size={24} className="text-blue-600 hover:opacity-80 transition-opacity" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullShareUrl)}&text=Check out my new AI-generated video!`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X (Twitter)"
          >
            <Twitter size={24} className="text-blue-400 hover:opacity-80 transition-opacity" />
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'AI Greeting Video',
                  text: 'Check out my new AI-generated video!',
                  url: fullShareUrl,
                }).catch((error) => console.error('Error sharing', error));
              } else {
                copyToClipboard(fullShareUrl);
              }
            }}
            aria-label="Share via system dialog"
          >
            <Share2 size={24} className="text-gray-600 hover:opacity-80 transition-opacity" />
          </button>
        </div>
      </main>
    );
  }
  
  return <main>Processing</main>; // Fallback if ready but videoId is missing
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main>Processing</main>}>
      <SuccessContent />
    </Suspense>
  );
}