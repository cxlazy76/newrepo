"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const router = useRouter();
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;

    fetch("/api/log/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/" })
    });
  }, []);

  return (
    <main>
      <h1>Generate personalized AI greetings in seconds</h1>
      <p>Pick a character → Type a message → Generate a video</p>
      <button onClick={() => router.push("/characters")}>Create video</button>
      <p>Trusted by thousands of users worldwide</p>
    </main>
  );
}
