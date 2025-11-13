"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main>
      <h1>Generate personalized AI greetings in seconds</h1>

      <p>Pick a character → Type a message → Generate a video</p>

      <button onClick={() => router.push("/characters")}>
        Create video
      </button>

      <p>Trusted by thousands of users worldwide</p>
    </main>
  );
}
