"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const message = localStorage.getItem("user_message");
    const character = localStorage.getItem("selected_character");

    async function start() {
      try {
        const res = await fetch("/api/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, character }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Trigger failed");
          setLoading(false);
          return;
        }

        if (data.videoUrl && data.ready) {
          setVideoUrl(data.videoUrl);
          setLoading(false);
          return;
        }

        if (data.videoUrl) {
          const url = data.videoUrl;
          let attempt = 0;

          while (attempt < 60) {
            const statusRes = await fetch(
              `/api/trigger/status?videoUrl=${encodeURIComponent(url)}`
            );
            const status = await statusRes.json();

            if (status.ready) {
              setVideoUrl(url);
              setLoading(false);
              return;
            }

            attempt++;
            await new Promise((r) => setTimeout(r, 2000));
          }

          setError("Video generation timed out");
          setLoading(false);
          return;
        }

        setError("No video URL returned");
        setLoading(false);
      } catch (err: any) {
        setError(err?.message ?? String(err));
        setLoading(false);
      }
    }

    start();
  }, []);

  // 💥 Clears message ONLY after successful video generation
  useEffect(() => {
    if (videoUrl) {
      localStorage.removeItem("user_message");
      localStorage.removeItem("selected_character");
    }
  }, [videoUrl]);

  async function prepareBlob() {
    if (!videoUrl) return null;

    const res = await fetch(videoUrl);
    const blob = await res.blob();
    const local = URL.createObjectURL(blob);
    setBlobUrl(local);
    return { blob, local };
  }

  async function downloadVideo() {
    const prepared = await prepareBlob();
    if (!prepared) return;

    const a = document.createElement("a");
    a.href = prepared.local;
    a.download = "video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function shareVideo() {
    if (!videoUrl) return;

    const prepared = await prepareBlob();
    if (!prepared) return;

    const file = new File([prepared.blob], "video.mp4", { type: "video/mp4" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "My AI Video",
          text: "Check out this video!",
          files: [file],
        });
      } catch (e) {}
      return;
    }

    alert("Sharing not supported on this device");
  }

  async function copyLink() {
    if (!videoUrl) return;
    await navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (error)
    return (
      <main>
        <h1>Error</h1>
        <p>{error}</p>
      </main>
    );

  if (loading)
    return (
      <main>
        <h1>Generating your video…</h1>
      </main>
    );

  if (!videoUrl)
    return (
      <main>
        <h1>Done</h1>
        <p>No video available.</p>
      </main>
    );

  return (
    <main>
      <h1>Your video is ready</h1>

      <video
        src={videoUrl}
        controls
        style={{ maxWidth: "100%", marginTop: 20 }}
      />

      {/* Download button — separate line */}
      <div style={{ marginTop: 20 }}>
        <button onClick={downloadVideo}>Download Video</button>
      </div>

      {/* Share + Copy — separate line */}
      <div style={{ marginTop: 20 }}>
        <button onClick={shareVideo}>Share Video</button>
        <button onClick={copyLink} style={{ marginLeft: 10 }}>
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </main>
  );
}
