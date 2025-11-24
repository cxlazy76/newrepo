"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import WalletPayButton from "@/components/WalletPayButton";

const sanitize = (input: string) => {
  if (typeof input !== "string") return "";
  let x = input.replace(/<[^>]*>/g, "");
  if (x.length > 100) x = x.slice(0, 100);
  return x;
};

export default function CharacterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  const characters = [
    { name: "Santa Claus", slug: "santa" },
    { name: "Alien", slug: "alien" },
    { name: "Monk", slug: "monk" },
    { name: "Tribal Man", slug: "tribal-man" }
  ];

  const character = characters.find((c) => c.slug === slug) || characters[0];
  const storageKey = `message:${character.slug}`;

  useEffect(() => {
    import("@/lib/ga").then((m) =>
      m.gaEvent("character_view", {
        character: character.slug
      })
    );

    fetch("/api/log/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "character_view",
        metadata: { slug: character.slug }
      })
    });

    import("@/lib/log").then((m) =>
      m.logView(`/characters/${character.slug}`)
    );
  }, [character.slug]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setMessage(saved);
    else setMessage("");
  }, [storageKey]);

  const [hasLoggedMessageEvent, setHasLoggedMessageEvent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const clean = sanitize(e.target.value);
    setMessage(clean);
    localStorage.setItem(storageKey, clean);

    if (!hasLoggedMessageEvent && clean.length >= 5) {
      setHasLoggedMessageEvent(true);

      import("@/lib/ga").then((m) =>
        m.gaEvent("message_written", {
          character: character.slug,
          length: clean.length
        })
      );

      fetch("/api/log/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: "message_written",
          metadata: {
            slug: character.slug,
            length: clean.length
          }
        })
      });
    }
  };

  function isInvalidMessage(msg: string) {
    const normalized = msg.replace(/\s+/g, " ").trim();
    if (normalized.length < 20) return true;
    if (!/[a-zA-Z]/.test(normalized)) return true;
    if (/^(.)\1+$/.test(normalized)) return true;
    if (/^[a-z]{2,}$/.test(normalized) && normalized.length < 25) return true;
    return false;
  }

  function handleGenerate() {
    if (isInvalidMessage(message)) {
      alert("Write a longer, meaningful message.");
      return;
    }

    import("@/lib/ga").then((m) =>
      m.gaEvent("begin_checkout", {
        currency: "USD",
        value: 3.99,
        items: [
          {
            item_name: character.name,
            item_id: character.slug
          }
        ]
      })
    );

    fetch("/api/log/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "checkout_started",
        metadata: { slug: character.slug }
      })
    });

    setShowPayment(true);
  }

  async function redirectToStripe() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        character: character.slug
      })
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert("Stripe error");
  }

  return (
    <main>
      <button onClick={() => router.push("/characters")}>Back</button>

      <h1>Step 2 of 2</h1>
      <h2>Generate video for: {character.name}</h2>

      <textarea
        value={message}
        onChange={handleChange}
        maxLength={100}
        placeholder="Hey John, wishing you a happy birthday!"
      />

      <p>{message.length}/100</p>

      <button onClick={handleGenerate}>Generate video</button>

      {showPayment && (
        <div onClick={() => setShowPayment(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <h2>Complete your payment</h2>
            <p>3.99 USD</p>

            <WalletPayButton />

            <button onClick={redirectToStripe}>Pay now</button>
            <button onClick={() => setShowPayment(false)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}
