"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Play } from "lucide-react";

export function HeroAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl = "https://cdn.pixabay.com/download/audio/2022/01/20/audio_51a2d677d2.mp3?filename=success-fanfare-trumpets-6185.mp3";
  
  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasInteracted]);

  const toggleAudio = () => {
    setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
      
      {!hasInteracted && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs px-5 py-3 rounded-full shadow-2xl animate-pulse whitespace-nowrap">
          🔊 Click to hear our Grand Welcome
        </div>
      )}

      <button
        onClick={toggleAudio}
        className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-[#FFA500] to-yellow-400 rounded-full shadow-[0_0_30px_rgba(255,165,0,0.5)] hover:scale-110 transition-transform duration-300 overflow-hidden border-2 border-white/40"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isPlaying ? (
          <Volume2 className="w-7 h-7 text-[#000080]" />
        ) : (
          <Play className="w-7 h-7 text-[#000080] ml-1" />
        )}
      </button>

      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        className="hidden"
      />
    </div>
  );
}
