"use client";

import React from 'react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick?: (char: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, isSelected, onClick }) => (
  <div 
    className="flex flex-col items-start w-full group/card cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(character);
    }}
  >
    <div className={`
      w-full mb-3 text-left transition-transform duration-200 
      ${isSelected ? 'scale-105' : 'group-hover/card:scale-105'}
    `}>
      <div className={`
        ${character.color} 
        rounded-2xl w-full aspect-[2/3] flex items-center justify-center text-6xl relative overflow-hidden
        ${isSelected ? 'ring-4 ring-offset-2 ring-indigo-500' : ''}
      `}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(45deg, white 0px, white 10px, transparent 10px, transparent 20px)`,
          backgroundSize: '20px 20px'
        }}></div>
        <span className="relative z-10">{character.image}</span>
      </div>
    </div>
    <h3 className="font-bold text-base mb-1 text-gray-900">{character.name}</h3>
    <p className="text-sm text-gray-600 line-clamp-2">{character.description}</p>
  </div>
);