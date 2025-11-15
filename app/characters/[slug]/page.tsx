"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CharacterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  // Fix back/forward caching bug
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as any;
    if (nav?.type === "back_forward") {
      window.location.reload();
    }
  }, []);

  const characters = [
    { name: "Santa Claus", slug: "santa" },
    { name: "Alien", slug: "alien" },
    { name: "Monk", slug: "monk" },
    { name: "Tribal Man", slug: "tribal-man" },
  ];

  const character = characters.find((c) => c.slug === slug) || characters[0];

  // Load saved message on mount
  useEffect(() => {
    const savedMessage = localStorage.getItem("user_message");
    const savedCharacter = localStorage.getItem("selected_character");

    if (savedCharacter === slug && savedMessage) {
      setMessage(savedMessage);
    }
  }, [slug]);

  // Save message when updated
  useEffect(() => {
    if (message.trim()) {
      localStorage.setItem("user_message", message);
      localStorage.setItem("selected_character", character.slug);
    }
  }, [message, character.slug]);

  function handleGenerate() {
    if (!message.trim()) {
      alert("Write a message first");
      return;
    }
    setShowPayment(true);
  }

  async function redirectToStripe() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        character: character.slug,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Stripe error");
    }
  }

  return (
    <main>

      <button onClick={() => router.push("/characters")}>
        Back
      </button>

      <h1>Step 2 of 2</h1>
      <h2>Generate video for: {character.name}</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={100}
      />

      <p>{message.length}/100</p>

      <button onClick={handleGenerate}>Generate video</button>

      {showPayment && (
        <div onClick={() => setShowPayment(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <h2>Complete your payment</h2>
            <p>3.99 USD</p>

            <button onClick={redirectToStripe}>Pay now</button>
            <button onClick={() => setShowPayment(false)}>Cancel</button>
          </div>
        </div>
      )}

    </main>
  );
}
