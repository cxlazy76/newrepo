"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState("loading");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 1️⃣ Read session_id from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");

    if (!id) {
      setStatus("error");
      return;
    }

    // Start polling
    pollStatus(id);
  }, []);

  // 2️⃣ Poll /api/video-status every 2 seconds
  async function pollStatus(sessionId: string) {
    try {
      const res = await fetch(`/api/video-status?session_id=${sessionId}`);
      const data = await res.json();

      if (data.status === "ready" && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setStatus("ready");

        // Clear prompt from localStorage
        localStorage.removeItem("user_message");
        localStorage.removeItem("selected_character");

        return;
      }

      // Still processing → continue polling
      setTimeout(() => pollStatus(sessionId), 2000);
    } catch (err) {
      setStatus("error");
    }
  }

  // 3️⃣ Prepare blob
  async function prepareBlob() {
    if (!videoUrl) return null;

    const res = await fetch(videoUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return { blob, url };
  }

  // 4️⃣ Download
  async function downloadVideo() {
    const prepared = await prepareBlob();
    if (!prepared) return;

    const a = document.createElement("a");
    a.href = prepared.url;
    a.download = "video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // 5️⃣ Share
  async function shareVideo() {
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

  // 6️⃣ Copy Link
  async function copyLink() {
    if (!videoUrl) return;
    await navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // ========== UI STATES ==========

  if (status === "error") {
    return (
      <main>
        <h1>Error getting your video</h1>
        <p>Try checking your email or contact support.</p>
      </main>
    );
  }

  if (status === "loading") {
    return (
      <main>
        <h1>Your video is being generated…</h1>
        <p>This usually takes about 5–15 seconds.</p>
      </main>
    );
  }

  if (!videoUrl) {
    return (
      <main>
        <h1>No video available</h1>
        <p>If you paid, please contact support.</p>
      </main>
    );
  }

  // ========== FINAL UI ==========

  return (
    <main>
      <h1>Your video is ready!</h1>

      <video src={videoUrl} controls style={{ maxWidth: "100%", marginTop: 20 }} />

      <div style={{ marginTop: 20 }}>
        <button onClick={downloadVideo}>Download Video</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={shareVideo}>Share Video</button>
        <button onClick={copyLink} style={{ marginLeft: 10 }}>
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </main>
  );
}
