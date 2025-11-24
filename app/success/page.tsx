"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const params = useSearchParams();
  const session_id = params.get("session_id");

  const [status, setStatus] = useState<"error" | "processing" | "ready">("processing");
  const [videoUrl, setVideoUrl] = useState("");

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
  if (status === "ready")
    return (
      <main>
        <video data-testid="video" src={videoUrl} controls></video>
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
