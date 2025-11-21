"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const session_id = params.get("session_id");

  const [status, setStatus] = useState<"error" | "processing" | "ready">("processing");
  const [videoUrl, setVideoUrl] = useState("");

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
        const u = await fetch(`/api/video/url?id=${data.id}`);
        if (!u) {
          setStatus("error");
          return;
        }

        const j = await u.json();
        setVideoUrl(j.signedUrl);
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
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("message:")) localStorage.removeItem(k);
      });
    }
  }, [status]);

  if (status === "error") return <main>Error</main>;

  if (status === "ready")
    return (
      <main>
        <video data-testid="video" src={videoUrl} controls></video>
      </main>
    );

  return <main>Processing</main>;
}