"use client";

import { use, useState } from "react";
import { CHARACTERS } from "../../../constants";
import { Character } from "../../../types";

const AccordionItem = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 text-gray-900">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="font-medium">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`bg-gray-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-40 opacity-100 p-4 border-t border-gray-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
};

export default function CharacterPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const character: Character | undefined = CHARACTERS.find(
    (c: Character) => c.id === slug
  );

  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!character) {
    return <div className="p-10 text-xl">Character not found</div>;
  }

  const handleGenerateVideo = () => {
    if (!message.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setVideoUrl(null);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* STEP 2 PILLS — ONLY SHOWN ON GENERATE VIDEO PAGE */}
        <div className="col-span-2 mb-6">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button
                className="px-6 py-2 rounded-full text-sm font-medium text-gray-600"
              >
                Step 1 : Pick a Character
              </button>
              <button
                className="px-6 py-2 rounded-full text-sm font-medium bg-white shadow-sm text-gray-900"
              >
                Step 2 : Generate a video
              </button>
            </div>
          </div>
        </div>

        {/* LEFT — CHARACTER PREVIEW */}
        <div className="w-full max-w-sm mx-auto lg:max-w-none">
          <div className="relative aspect-[9/16] bg-gray-100 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">

            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className={`absolute inset-0 ${character.color} flex items-center justify-center`}>
                  <span className="text-[8rem] md:text-[10rem] drop-shadow-xl">
                    {character.image}
                  </span>
                </div>
              </>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 z-20">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium">Generating preview...</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — MESSAGE INPUT AND FAQ */}
        <div className="flex flex-col gap-8 lg:pt-4">
          <div>
            <label className="block text-gray-900 text-lg font-medium mb-4">Type your message</label>
            <div className="relative">
              <textarea
                className="w-full h-48 bg-white border border-gray-200 text-gray-900 rounded-2xl p-6 text-lg shadow-sm resize-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                placeholder="Hey John, I wish you a happy birthday!"
                maxLength={100}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isGenerating}
              />
              <span className="absolute bottom-4 right-4 text-gray-500 text-sm">
                {message.length}/100
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating || !message.trim()}
            className={`w-full text-white text-xl font-bold py-4 rounded-xl shadow-lg ${
              isGenerating || !message.trim()
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isGenerating ? "Generating..." : `Generate video with ${character.name}`}
          </button>

          <div className="space-y-2 mt-4">
            <AccordionItem title="What will I actually get?">
              You will get a personalized video of {character.name} speaking your message.
            </AccordionItem>

            <AccordionItem title="Do I need to pay before seeing the video?">
              No, you can preview for free.
            </AccordionItem>

            <AccordionItem title="Will I be able to download or share it?">
              Yes, once generated you can download or share it.
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
}
