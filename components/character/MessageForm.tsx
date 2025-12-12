"use client";

import React, { useState, useCallback } from "react";

function sanitize(input: string): string {
  if (typeof input !== "string") return "";
  let x = input.replace(/<[^>]*>/g, "");
  x = x.replace(/\s+/g, " ").trim();
  if (x.length > 100) x = x.slice(0, 100);
  return x;
}

function looksNonsense(word: string): boolean {
  if (!/[aeiou]/i.test(word)) return true;
  if (/^(.)\1{2,}$/i.test(word)) return true;
  if (word.length > 12) return true;
  if (/[^a-z]/i.test(word)) return true;
  return false;
}

function isInvalidMessage(msg: string): boolean {
  const m = msg.replace(/\s+/g, " ").trim();
  if (m.length < 40) return true;

  const letters = (m.match(/[a-zA-Z]/g) || []).length;
  if (letters < 10) return true;

  const digits = (m.match(/[0-9]/g) || []).length;
  if (digits / m.length > 0.2) return true;

  const freq: Record<string, number> = {};
  for (const ch of m) freq[ch] = (freq[ch] || 0) + 1;
  const max = Math.max(...Object.values(freq));
  if (max / m.length > 0.25) return true;

  if (!m.includes(" ")) return true;

  const words = m.split(" ").filter(Boolean);
  if (words.length < 6) return true;

  const nonsenseCount = words.filter(w => looksNonsense(w.toLowerCase())).length;
  if (nonsenseCount / words.length > 0.4) return true;

  const punctuation = m.match(/[.!?,]/g) || [];
  if (punctuation.length === 0) {
    if (words.length < 12) return true;
  }

  return false;
}

interface MessageFormProps {
  characterName: string;
  message: string;
  setMessage: (value: string) => void;
  onGenerate: () => void;
}

const MAX_LENGTH = 100;

export default function MessageForm({
  characterName,
  message,
  setMessage,
  onGenerate
}: MessageFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    const limitedValue = rawValue.slice(0, MAX_LENGTH);
    setMessage(limitedValue);

    if (error) {
        setError(null);
    }
  }, [setMessage, error]);

  const handleGenerate = useCallback(() => {
    const sanitizedMessage = sanitize(message);
    
    if (isInvalidMessage(sanitizedMessage)) {
        setError("Your message is too short or appears to be nonsensical. Please write a full, meaningful message of at least 40 characters.");
        return;
    }

    setError(null);
    onGenerate();
  }, [message, onGenerate]);

  const isButtonDisabled = message.length === 0 || !!error;

  return (
    <div className="bg-white rounded-3xl p-1 mt-0 lg:mt-8">
      <label
        htmlFor="message"
        className="block text-lg font-bold text-gray-900 mb-3"
      >
        What should {characterName} say?
      </label>

      <div className="relative">
        <textarea
          id="message"
          value={message}
          onChange={handleChange}
          placeholder="Hey John, I hope you have an amazing birthday filled with joy!"
          maxLength={MAX_LENGTH}
          className="w-full min-h-[180px] p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-all text-lg leading-relaxed resize-none shadow-inner"
        />

        <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-400 bg-white/50 px-2 py-1 rounded-md backdrop-blur-sm">
          {message.length}/{MAX_LENGTH}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8">
        <button
          onClick={handleGenerate}
          disabled={isButtonDisabled}
          className="group relative w-full overflow-hidden rounded-2xl bg-[#E5FF00] py-5 px-8 font-bold text:black shadow-[0_4px_0_0_#b7cc00] transition-all hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-1"
        >
          <span className="relative z-10 text-xl flex items-center justify-center">
            Generate Video
          </span>
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          100% Satisfaction Guarantee. Instant delivery.
        </p>
      </div>
    </div>
  );
}