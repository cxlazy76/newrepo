"use client";

import React, { useState, useRef, useEffect } from "react";
import { CharacterCard } from "../../components/CharacterCard";
import { CHARACTERS } from "../../constants";
import { Character } from "../../types";

const SectionHeader = ({
  title,
  showViewAll = false
}: {
  title: string;
  showViewAll?: boolean;
}) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    {showViewAll && (
      <button
        className="text-sm text-gray-600 hover:text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        View all
      </button>
    )}
  </div>
);

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

export default function Page() {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [message, setMessage] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);

  const trendingCharacters = CHARACTERS.filter((c: Character) => c.category === "trending");
  const christmasTheme = CHARACTERS.filter((c: Character) => c.category === "christmas");
  const roastFriend = CHARACTERS.filter((c: Character) => c.category === "roast");

  const scrollToPage = (pageIndex: number) => {
    if (carouselRef.current) {
      const itemWidth = 12 * 16;
      const gap = 1.5 * 16;
      const itemsPerPage = 5;
      const scrollAmount = (itemWidth + gap) * itemsPerPage;
      const scrollPosition = pageIndex * scrollAmount;

      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });

      setCurrentPage(pageIndex);
    }
  };

  const handleNextPage = () => scrollToPage(Math.min(currentPage + 1, 2));
  const handlePrevPage = () => scrollToPage(Math.max(currentPage - 1, 0));

  const handleCharacterSelect = (char: Character) => setSelectedCharacter(char);

  const handleScroll = () => {
    if (carouselRef.current) {
      const pageWidth = (192 + 24) * 5;
      const newPage = Math.round(carouselRef.current.scrollLeft / pageWidth);

      if (newPage !== currentPage) setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [currentPage]);

  const handleGenerateVideo = () => {
    setActiveStep(2);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="flex justify-center py-4">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveStep(1)}
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                activeStep === 1 ? "bg-white shadow-sm text-gray-900" : "text-gray-600"
              }`}
            >
              Step 1 : Pick a Character
            </button>

            <button
              onClick={() => setActiveStep(2)}
              disabled={!selectedCharacter}
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                activeStep === 2 ? "bg-white shadow-sm text-gray-900" : "text-gray-600"
              }`}
            >
              Step 2 : Generate a video
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {activeStep === 1 ? (
          <div className="space-y-16">
            <div>
              <SectionHeader title="Trending Characters" />
              <div className="flex items-center justify-center gap-4 relative">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="flex-shrink-0 bg-white shadow-lg rounded-full p-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="relative overflow-hidden rounded-2xl" style={{ width: "66rem", maxWidth: "100%" }}>
                  <div ref={carouselRef} className="overflow-x-auto py-4 scrollbar-hide scroll-smooth">
                    <div className="flex gap-6 min-w-max">
                      {trendingCharacters.map((character: Character) => (
                        <div key={character.id} className="w-48 flex-shrink-0">
                          <CharacterCard
                            character={character}
                            isSelected={selectedCharacter?.id === character.id}
                            onClick={handleCharacterSelect}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === 2}
                  className="flex-shrink-0 bg-white shadow-lg rounded-full p-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => scrollToPage(dot)}
                    className={`rounded-full ${
                      currentPage === dot ? "w-2 h-2 bg-gray-800" : "w-1.5 h-1.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader title="Christmas theme" showViewAll />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {christmasTheme.map((character: Character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isSelected={selectedCharacter?.id === character.id}
                    onClick={handleCharacterSelect}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader title="Roast your friend" showViewAll />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {roastFriend.map((character: Character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isSelected={selectedCharacter?.id === character.id}
                    onClick={handleCharacterSelect}
                  />
                ))}
              </div>
            </div>

            {selectedCharacter && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg"
                >
                  Next: Generate with {selectedCharacter.name}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div className="w-full max-w-sm mx-auto lg:max-w-none">
                <div className="relative aspect-[9/16] bg-gray-100 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  {selectedCharacter && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8rem] md:text-[10rem] drop-shadow-xl">
                        {selectedCharacter.image}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-8 lg:pt-4">
                <div>
                  <label className="block text-gray-900 text-lg font-medium mb-4">Type your message here:</label>
                  <div className="relative">
                    <textarea
                      className="w-full h-48 bg-white border border-gray-200 text-gray-900 rounded-2xl p-6 text-lg shadow-sm resize-none"
                      placeholder="Hey John, I wish you a happy birthday!"
                      maxLength={100}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <span className="absolute bottom-4 right-4 text-gray-500 text-sm font-medium">
                      {message.length}/100
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleGenerateVideo}
                    disabled={!message}
                    className={`w-full text-white text-xl font-bold py-4 rounded-xl shadow-lg ${
                      !message ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    Continue
                  </button>

                  <div className="space-y-2 mt-4">
                    <AccordionItem title="What will I actually get?">
                      You will get a personalized video of {selectedCharacter?.name}.
                    </AccordionItem>
                    <AccordionItem title="Do I need to pay before seeing the video?">
                      No, you can preview for free.
                    </AccordionItem>
                    <AccordionItem title="Will I be able to download or share it?">
                      Yes, once generated.
                    </AccordionItem>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
