"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

// --- UI Components (Required to be intact) ---

const DownloadButton = ({ videoId, filename }: { videoId: string, filename: string }) => {
  // Points to the API route, including the desired filename for the server to use in Content-Disposition
  return (
    <a 
      href={`/api/video/stream?id=${videoId}&filename=${encodeURIComponent(filename)}`} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      Download Video
    </a>
  );
};

const ShareButton = ({ shareUrl }: { shareUrl: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy}>
      {copied ? "Copied!" : "Share Link"}
    </button>
  );
};

const SocialShareIcons = ({ shareUrl }: { shareUrl: string }) => {
  const encodedUrl = encodeURIComponent(shareUrl);
  const title = encodeURIComponent("Check out my custom AI video!");
  
  return (
    <div>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`} target="_blank" rel="noopener noreferrer">Twitter</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">Facebook</a>
      {/* Add other social links as needed */}
    </div>
  );
};

// --- Main Content Component ---

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

  const [status, setStatus] = useState<"error" | "processing" | "ready">("processing");
  const [videoId, setVideoId] = useState("");
  const [characterName, setCharacterName] = useState("");

  useEffect(() => {
    // Placeholder for logging
    // import("@/lib/log").then(m => m.logView("/success"));
  }, []);

  // FIX: Generate the public, user-facing URL for the video player and sharing
  const publicStreamUrl = useMemo(() => {
    if (videoId) {
      return `${window.location.origin}/stream?id=${videoId}`;
    }
    return "";
  }, [videoId]);

  // FIX: Generate the human-readable filename based on the character name
  const downloadFilename = useMemo(() => {
    if (characterName) {
      const slug = characterName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
      return `${slug}.mp4`;
    }
    return `video-${videoId}.mp4`;
  }, [characterName, videoId]);


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

      // Fetch status which now includes the video ID and character name (see status route fix)
      const res = await fetch(`/api/video/status?session_id=${session_id}`);
      if (!res) {
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
        const { id, character } = data;

        if (!id || !character) {
          setStatus("error");
          return;
        }

        setVideoId(id);
        setCharacterName(character);
        
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
      // Placeholder for tracking
      /*
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
      */
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("message:")) localStorage.removeItem(k);
      });
    }
  }, [status, session_id]);

  if (status === "error") return <main>Error</main>;
  if (status === "ready")
    return (
      <main>
        {/* FIX: Use the public /stream URL for the video source */}
        <video data-testid="video" src={publicStreamUrl} controls></video>
        
        {/* The download link sends the desired filename to the API */}
        <DownloadButton videoId={videoId} filename={downloadFilename} />
        
        {/* Share buttons use the public URL */}
        <ShareButton shareUrl={publicStreamUrl} />
        <SocialShareIcons shareUrl={publicStreamUrl} />
      </main>
    );

  return <main>Processing</main>;
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main>Processing</main>}>
      <SuccessContent />
    </Suspense>
  );
}