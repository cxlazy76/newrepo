"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import StepIndicator from "../../../components/StepIndicator";

import VideoPreview from "../../../components/character/VideoPreview";
import PaymentModal from "../../../components/character/PaymentModal";
import FAQItem from "../../../components/character/FAQItem";
import RelatedCharacters from "../../../components/character/RelatedCharacters";
import MessageForm from "../../../components/character/MessageForm";

import { CHARACTERS } from "../../../constants";

export default function CharacterDetailPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  const rightColumnRef = useRef<HTMLDivElement>(null);
  const topSpacerRef = useRef<HTMLDivElement>(null);

  const [videoStyle, setVideoStyle] = useState<React.CSSProperties>({});

  const character =
    CHARACTERS.find((c) => c.id === slug) || CHARACTERS[0];
  
  const storageKey = `message:${character.id}`; 

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setMessage(saved);
    else setMessage("");
  }, [storageKey]);
  
  const relatedCharacters = CHARACTERS.filter((c) => c.id !== character.id).slice(0, 6);

  const updateVideoHeight = () => {
    if (window.innerWidth < 1024) {
      setVideoStyle({});
      return;
    }

    if (rightColumnRef.current && topSpacerRef.current) {
      const rightHeight = rightColumnRef.current.offsetHeight;
      const topSpacerHeight = topSpacerRef.current.offsetHeight;
      const calculatedHeight = rightHeight - topSpacerHeight;

      if (calculatedHeight > 100) {
        const calculatedWidth = (calculatedHeight * 9) / 16;
        setVideoStyle({
          height: `${calculatedHeight}px`,
          width: `${calculatedWidth}px`
        });
        return;
      }
    }

    setVideoStyle({});
  };

  useEffect(() => {
    updateVideoHeight();
    window.addEventListener("resize", updateVideoHeight);
    return () => window.removeEventListener("resize", updateVideoHeight);
  }, []);

  const faqItems = [
    {
      q: "What will I actually get?",
      a: "Our AI creates a high-quality video where your chosen character speaks your message with realistic lip-sync and voice."
    },
    {
      q: "How long does it take?",
      a: "Most videos are generated in under 60 seconds. You'll receive a notification when it's ready."
    },
    {
      q: "Can I download the video?",
      a: "Absolutely! You own the video and can download it in HD to share on social media or send to friends."
    }
  ];

  function handleGenerateClick() {
    import("@/lib/ga").then((m) =>
      m.gaEvent("begin_checkout", {
        currency: "USD",
        value: 3.99,
        items: [
          {
            item_name: character.name,
            item_id: character.id
          }
        ]
      })
    );

    fetch("/api/log/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "checkout_started",
        metadata: { slug: character.id }
      })
    });

    setShowPayment(true);
  }

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center bg-white text-gray-900 font-sans min-h-screen pt-20 md:pt-24">

        <div className="w-full flex justify-center">
          <StepIndicator step={2} />
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-10 md:pb-24 lg:mt-8">

          <div className="flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-20">

            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
              <div ref={topSpacerRef} className="h-0 lg:h-[42px]" />

              <div className="w-[80%] lg:w-full flex justify-center lg:justify-start mt-4 lg:mt-0">
                <VideoPreview
                  key={character.id}
                  src={character.previewVideo || ""}
                  poster={character.image}
                  style={videoStyle}
                />
              </div>
            </div>

            <div ref={rightColumnRef} className="w-full lg:w-1/2 mx-auto lg:mx-0">

              <MessageForm
                characterName={character.name}
                message={message}
                setMessage={(value) => { 
                    setMessage(value);
                    localStorage.setItem(storageKey, value); 
                }}
                onGenerate={handleGenerateClick}
              />

              <div className="mt-12 pt-12 border-t border-gray-100">
                <h3 className="text-xl font-bold mb-6">Common Questions</h3>

                <div className="space-y-1">
                  {faqItems.map((item, i) => (
                    <FAQItem
                      key={i}
                      question={item.q}
                      answer={item.a}
                      onToggle={() => {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {relatedCharacters.length > 0 && (
            <RelatedCharacters
              related={relatedCharacters}
              onSelect={(clicked) => router.push(`/characters/${clicked.id}`)}
            />
          )}
        </div>
      </main>

      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            onClose={() => setShowPayment(false)}
            message={message}
            characterId={character.id}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}