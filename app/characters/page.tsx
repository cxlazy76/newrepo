"use client";

import React, { useState, useMemo, UIEvent } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import StepIndicator from "../../components/StepIndicator";
import { CharacterCard } from "../../components/CharacterCard";
import { CHARACTERS } from "../../constants";
import { useRouter } from "next/navigation";
import { Character } from "../../types";
import { Sparkles } from "lucide-react";

interface SectionProps {
  title: string;
  characters: Character[];
  selectedCharacter: Character | null;
  onSelect: (char: Character) => void;
}

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunked: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-6 ml-1">
    <h2 className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tight">
      {title}
    </h2>
  </div>
);

const CharacterSection: React.FC<SectionProps> = ({
  title,
  characters,
  selectedCharacter,
  onSelect
}) => {
  const itemsPerDesktopRow = 6;
  const desktopCharacters = characters.slice(0, itemsPerDesktopRow);

  const [mobilePageIndex, setMobilePageIndex] = useState(0);
  const mobileChunks = useMemo(() => chunkArray(characters, 2), [characters]);

  if (characters.length === 0) return null;

  const handleMobileScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== mobilePageIndex) setMobilePageIndex(newIndex);
  };

  return (
    <div className="mb-14 lg:mb-20 relative z-1">
      <SectionHeader title={title} />

      {/* MOBILE SLIDER */}
      <div className="block md:hidden relative w-full">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full pt-10 pb-6 -mt-4 hide-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            overscrollBehaviorX: "contain",
            WebkitOverflowScrolling: "touch"
          }}
          onScroll={handleMobileScroll}
        >
          {mobileChunks.map((chunk, slideIndex) => (
            <div
              key={slideIndex}
              // Conditional padding ensures the first card starts and the last card ends aligned with the page's px-4 container.
              className="min-w-full shrink-0 snap-center flex justify-between px-2 gap-5"

            >
              {chunk.map((char) => (
                // ADJUSTED: Reduced inner padding to px-2 to make cards wider and reduce the gap
                <div key={char.id} className="w-1/2 px-2"> 
                  <CharacterCard
                    character={char}
                    isSelected={selectedCharacter?.id === char.id}
                    onClick={onSelect}
                  />
                </div>
              ))}

              {chunk.length === 1 && <div className="w-1/2" />}
            </div>
          ))}
        </div>

        {/* Slider Dots */}
        {mobileChunks.length > 1 && (
            <div className="flex justify-center items-center gap-3 mt-0 mb-8 h-4">
            {mobileChunks.map((_, index) => {
                const isActive = mobilePageIndex === index;
                return (
                <div
                    key={index}
                    className={`rounded-full transition-all duration-300 ease-out ${
                    isActive
                        ? "bg-gray-800 w-2 h-2 scale-110 opacity-100"
                        : "bg-gray-300 w-2 h-2 scale-100 opacity-60"
                    }`}
                />
                );
            })}
            </div>
        )}
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:block relative px-2">
        <div className="grid grid-cols-6 gap-8">
          {desktopCharacters.map((character) => (
            <div 
              key={character.id}
              onClick={(e) => e.stopPropagation()}
            >
              <CharacterCard
                character={character} 
                isSelected={selectedCharacter?.id === character.id}
                onClick={onSelect}
              />
            </div>
          ))}

          {/* Spacer */}
          {desktopCharacters.length < itemsPerDesktopRow &&
            Array.from({ length: itemsPerDesktopRow - desktopCharacters.length }).map(
              (_, i) => <div key={`empty-${i}`} className="invisible" />
            )}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const trendingCharacters = CHARACTERS.filter((c) => c.category === "trending");
  const christmasTheme = CHARACTERS.filter((c) => c.category === "christmas");
  const roastFriend = CHARACTERS.filter((c) => c.category === "roast");

  const goToSlugPage = () => {
    if (selectedCharacter) router.push(`/characters/${selectedCharacter.id}`);
  };

  const handleBackgroundClick = () => {
    if (selectedCharacter) {
      setSelectedCharacter(null);
    }
  };

  return (
    <>
      <Navbar />

      <main
        onClick={handleBackgroundClick}
        className="flex flex-col items-center bg-white text-gray-900 font-sans w-full pt-20 md:pt-24 min-h-screen"
      >
        <div className="w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
          <StepIndicator step={1} />
        </div>

        {/* Main content wrapper with correct mobile padding (px-4) */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 pb-32">
          
          <CharacterSection
            title="Trending Characters"
            characters={trendingCharacters}
            selectedCharacter={selectedCharacter}
            onSelect={setSelectedCharacter}
          />

          <CharacterSection
            title="Christmas Theme"
            characters={christmasTheme}
            selectedCharacter={selectedCharacter}
            onSelect={setSelectedCharacter}
          />

          <CharacterSection
            title="Roast Your Friend"
            characters={roastFriend}
            selectedCharacter={selectedCharacter}
            onSelect={setSelectedCharacter}
          />

          {selectedCharacter && (
            <div 
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 md:px-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={goToSlugPage}
                className="w-full bg-[#E5FF00] text-black text-lg px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(229,255,0,0.4)] hover:-translate-y-1 transition-all duration-300 font-[900] tracking-tight border-2 border-transparent flex items-center justify-center gap-2"
              >
                Continue with {selectedCharacter.name}
                <Sparkles size={20} className="fill-black/10" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}