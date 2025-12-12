"use client";

import React, { useMemo, useState, UIEvent } from "react";
import { CharacterCard } from "../../components/CharacterCard"; // adjust if needed
import { Character } from "../../types";

interface RelatedCharactersProps {
  related: Character[];
  onSelect: (char: Character) => void;
}

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunked: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

export default function RelatedCharacters({
  related,
  onSelect
}: RelatedCharactersProps) {
  const itemsPerPage = 6;
  const [mobilePageIndex, setMobilePageIndex] = useState(0);

  const mobileChunks = useMemo(() => chunkArray(related, 2), [related]);

  const desktopCharacters = related.slice(0, itemsPerPage);

  const handleMobileScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== mobilePageIndex) setMobilePageIndex(newIndex);
  };

  return (
    <div className="mt-14 lg:mt-40">
      <h3 className="text-2xl font-bold mb-4">Try other characters</h3>

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
              className="min-w-full shrink-0 snap-center flex"
            >
              {chunk.map((char) => (
                <div key={char.id} className="w-1/2 px-3">
                  <CharacterCard
                    character={char}
                    isSelected={false}
                    onClick={() => onSelect(char)}
                  />
                </div>
              ))}

              {chunk.length === 1 && <div className="w-1/2 px-3" />}
            </div>
          ))}
        </div>

        {/* Slider Dots */}
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
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:block relative">
        <div className="grid grid-cols-6 gap-8">
          {desktopCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isSelected={false}
              onClick={() => onSelect(char)}
            />
          ))}

          {desktopCharacters.length < itemsPerPage &&
            Array.from({
              length: itemsPerPage - desktopCharacters.length
            }).map((_, i) => (
              <div key={`empty-${i}`} className="invisible" />
            ))}
        </div>
      </div>
    </div>
  );
}