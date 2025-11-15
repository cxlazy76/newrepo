"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const session_id = params.get("session_id");

  const [created, setCreated] = useState(false);
  const [status, setStatus] = useState("pending");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (!session_id || created) return;

    fetch("/api/videos/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id })
    }).then(() => {
      setCreated(true);
    });
  }, [session_id, created]);

  useEffect(() => {
    if (!created) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/videos/status?session_id=${session_id}`);
      const data = await res.json();

      if (data.status === "finished") {
        setStatus("finished");
        setVideoUrl(data.video_url);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [created, session_id]);

  return (
    <main>
      <h1>Payment successful</h1>

      {status !== "finished" && <p>Generating video...</p>}

      {status === "finished" && (
        <div>
          <p>Video ready</p>
          <p>{videoUrl}</p>
        </div>
      )}
    </main>
  );
}
