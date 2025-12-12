import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick?: (char: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, isSelected, onClick }) => (
  <div 
    className="flex flex-col items-start w-full group/card cursor-pointer scale-[1.09] md:scale-100"
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(character);
    }}
  >
    <div className={`
      w-full mb-3 text-left transition-transform duration-200 
      ${isSelected ? 'scale-103' : 'md:group-hover/card:scale-103'}
    `}>
      <div className={`
        rounded-2xl w-full aspect-2/3 flex items-center justify-center relative overflow-hidden
        ${isSelected ? 'ring-4 ring-offset-2 ring-[#e5ff00]' : ''}
      `}>
        {/* Render the Image component */}
        <Image
          src={character.image}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 180px, 200px" // Optimized sizes for responsive loading
          className="object-cover"
          priority={character.category === 'trending'} // Prioritize loading trending characters
        />
        
        {/* Optional: Keep the background pattern for visual effect behind the image or remove it entirely */}
        {/*
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 10px, transparent 10px, transparent 20px)`,
            backgroundSize: '20px 20px'
          }}
        ></div>
        */}

      </div>
    </div>
    <h3 className="font-bold text-base mb-1 text-gray-900">{character.name}</h3>
    <p className="text-sm text-gray-600 line-clamp-2">{character.description}</p>
  </div>
);