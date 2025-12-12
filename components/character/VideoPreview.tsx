"use client";

import React, { useRef, useState } from "react";
import { Play } from "lucide-react";

interface VideoPreviewProps {
  src: string;
  poster: string;
  style: React.CSSProperties;
}

export default function VideoPreview({ src, poster, style }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden bg-gray-100 aspect-9/16 max-w-full lg:max-w-none lg:w-auto"
      style={style}
    >
      <video
        ref={videoRef}
        src={src || ""}
        poster={poster}
        className="w-full h-full object-cover"
        playsInline
        muted
        onClick={togglePlay}
      />

      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
}
