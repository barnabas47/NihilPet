import React, { useState, useEffect } from 'react';
import { PetMood } from '../lib/types';

export type NihilHat =
  | 'none'
  | 'beret'
  | 'party'
  | 'tinfoil'
  | 'clown'
  | 'cyber'
  | 'wizard'
  | 'pirate'
  | 'crown'
  | 'vr'
  | 'halo'
  | 'astro';

interface NihilPetSpriteProps {
  mood: PetMood;
  despair: number;
  hat?: NihilHat;
  isDizzy?: boolean;
  isEating?: boolean;
  isPoked?: boolean;
  isHypercube?: boolean;
  isOverclocked?: boolean;
  isVomiting?: boolean;
  isKnockedOut?: boolean;
  isHiccuping?: boolean;
  onClick?: () => void;
}

export const NihilPetSprite: React.FC<NihilPetSpriteProps> = ({
  mood,
  despair,
  hat = 'none',
  isDizzy = false,
  isEating = false,
  isPoked = false,
  isHypercube = false,
  isOverclocked = false,
  isVomiting = false,
  isKnockedOut = false,
  isHiccuping = false,
  onClick,
}) => {
  // Eye blink ticker (every 3.8s)
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // 1% Legendary Hypercube Mode
  if (isHypercube) {
    return (
      <div
        onClick={onClick}
        className="relative flex flex-col items-center justify-center cursor-pointer select-none py-2"
        title="4D Tesseract Manifestation"
      >
        <div className="w-20 h-20 relative flex items-center justify-center animate-spin">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-lcd-pixel-dark fill-none stroke-2">
            <rect x="15" y="15" width="70" height="70" />
            <rect x="35" y="35" width="30" height="30" />
            <line x1="15" y1="15" x2="35" y2="35" />
            <line x1="85" y1="15" x2="65" y2="35" />
            <line x1="15" y1="85" x2="35" y2="65" />
            <line x1="85" y1="85" x2="65" y2="65" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-lcd-pixel-dark font-bold">
            4D
          </div>
        </div>
        <div className="font-pixel text-[7px] text-lcd-pixel-dark mt-1 bg-lcd-pixel-light/40 px-1 rounded uppercase">
          TESSERACT ENTITY
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none py-1 group"
      title="Interact with entity"
    >
      {/* 1. Overhead Micro-badge Indicator */}
      <div className="h-5 flex items-center justify-center -mb-0.5 z-30">
        {isVomiting ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded animate-bounce">
            [BUFFER VOMIT]
          </span>
        ) : isKnockedOut ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded animate-pulse">
            [CONCUSSION KO]
          </span>
        ) : isHiccuping ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded animate-ping">
            [HIC!]
          </span>
        ) : isDizzy ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded animate-spin">
            [SPIN]
          </span>
        ) : isOverclocked ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded animate-pulse">
            [200% CLOCK]
          </span>
        ) : mood === 'despair' || despair > 70 ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded">
            [VOID CRITICAL]
          </span>
        ) : mood === 'bliss' ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded animate-bounce">
            [NIRVANA]
          </span>
        ) : mood === 'contemplating' ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded">
            [REFLECTING]
          </span>
        ) : isPoked ? (
          <span className="font-pixel text-[7px] text-lcd-pixel-dark bg-lcd-pixel-light/60 px-1 py-0.2 rounded">
            [POKED]
          </span>
        ) : (
          <div className="h-3" />
        )}
      </div>

      {/* 2. Main Animated Sprite Body */}
      <div
        className={`relative flex flex-col items-center transition-all duration-200 ${
          isKnockedOut
            ? 'rotate-90 translate-y-3'
            : isHiccuping
            ? '-translate-y-2'
            : isDizzy
            ? 'animate-spin'
            : isPoked
            ? 'scale-y-75 scale-x-125'
            : isEating
            ? 'animate-bounce'
            : isOverclocked
            ? 'animate-bounce scale-105'
            : mood === 'bliss'
            ? 'animate-bounce'
            : mood === 'contemplating'
            ? '-translate-y-2'
            : 'animate-float'
        }`}
      >
        {/* Contemplating Void Vortex Aura */}
        {mood === 'contemplating' && (
          <div className="absolute inset-0 -m-3 rounded-full border border-dashed border-lcd-pixel-mid/40 animate-spin pointer-events-none" />
        )}

        {/* --- HAT / COSTUME LAYER --- */}
        <div className="relative z-20 w-18 h-7 flex items-end justify-center pointer-events-none -mb-1">
          {hat === 'beret' && (
            <div className="relative -mb-0.5 flex items-center justify-center">
              <div className="w-13 h-4 bg-lcd-pixel-dark rounded-t-full rotate-[-12deg] shadow-sm flex items-center justify-center">
                <div className="w-1 h-1.5 bg-lcd-pixel-dark -mt-3.5 rounded-full" />
              </div>
            </div>
          )}

          {hat === 'party' && (
            <div className="relative mb-0 flex flex-col items-center">
              <div className="w-1.5 h-1.5 bg-lcd-pixel-mid rounded-full animate-ping" />
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[18px] border-b-lcd-pixel-dark relative -mt-0.5">
                <div className="absolute top-2 left-[-3px] w-1.5 h-0.5 bg-lcd-bg rotate-45" />
              </div>
            </div>
          )}

          {hat === 'tinfoil' && (
            <div className="relative mb-0 flex flex-col items-center">
              <div className="w-0.5 h-2 bg-lcd-pixel-dark animate-pulse" />
              <div className="w-1.5 h-1.5 bg-lcd-pixel-dark rounded-full -mt-0.5" />
              <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[14px] border-b-lcd-pixel-dark" />
            </div>
          )}

          {hat === 'clown' && (
            <div className="relative mb-0 flex items-end justify-center gap-0.5">
              <div className="w-3.5 h-4 bg-lcd-pixel-mid rounded-full -mr-1" />
              <div className="w-4 h-5 bg-lcd-pixel-dark rounded-full -mb-0.5" />
              <div className="w-3.5 h-4 bg-lcd-pixel-mid rounded-full -ml-1" />
            </div>
          )}

          {hat === 'cyber' && (
            <div className="relative mb-0.5 flex items-center justify-center">
              <div className="w-15 h-3 bg-lcd-pixel-dark rounded-xs border-b border-lcd-bg flex items-center justify-center shadow-xs">
                <span className="text-[6.5px] font-pixel text-lcd-bg tracking-tighter">VR-404</span>
              </div>
            </div>
          )}

          {hat === 'wizard' && (
            <div className="relative mb-0 flex flex-col items-center rotate-6">
              <div className="w-1.5 h-1.5 bg-lcd-pixel-mid rotate-45 animate-pulse" />
              <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[20px] border-b-lcd-pixel-dark" />
              <div className="w-15 h-1.5 bg-lcd-pixel-dark rounded-full -mt-0.5" />
            </div>
          )}

          {hat === 'pirate' && (
            <div className="relative mb-0 flex flex-col items-center">
              <div className="w-14 h-4.5 bg-lcd-pixel-dark rounded-t-lg relative flex items-center justify-center">
                <div className="w-3 h-2.5 bg-lcd-bg rounded-xs flex items-center justify-center">
                  <span className="text-[6.5px] font-pixel text-lcd-pixel-dark font-bold leading-none">☠</span>
                </div>
              </div>
              <div className="w-16 h-1.5 bg-lcd-pixel-dark rounded-full -mt-0.5" />
            </div>
          )}

          {hat === 'crown' && (
            <div className="relative mb-0 flex flex-col items-center">
              <div className="flex items-end gap-1">
                <div className="w-2.5 h-4 bg-lcd-pixel-dark rounded-t-xs" />
                <div className="w-3.5 h-5.5 bg-lcd-pixel-dark rounded-t-xs flex items-start justify-center pt-0.5">
                  <div className="w-1 h-1 bg-lcd-bg rounded-full" />
                </div>
                <div className="w-2.5 h-4 bg-lcd-pixel-dark rounded-t-xs" />
              </div>
              <div className="w-14 h-1 bg-lcd-pixel-dark" />
            </div>
          )}

          {hat === 'vr' && (
            <div className="relative mb-0.5 flex flex-col items-center">
              <div className="w-15 h-3.5 bg-lcd-pixel-dark rounded-xs flex items-center justify-between px-1 border-t border-lcd-bg shadow-xs">
                <div className="w-4 h-1.5 bg-lcd-bg rounded-xs animate-pulse" />
                <div className="w-4 h-1.5 bg-lcd-bg rounded-xs animate-pulse" />
              </div>
              <div className="w-3 h-0.5 bg-lcd-pixel-mid" />
            </div>
          )}

          {hat === 'halo' && (
            <div className="relative mb-1 flex flex-col items-center animate-bounce">
              <div className="w-12 h-2.5 border-2 border-lcd-pixel-dark rounded-[100%] bg-transparent" />
            </div>
          )}

          {hat === 'astro' && (
            <div className="relative mb-0 flex flex-col items-center">
              <div className="w-15 h-6.5 border-2 border-lcd-pixel-dark rounded-t-full bg-transparent flex items-center justify-center relative">
                <div className="w-7 h-3.5 bg-lcd-pixel-dark/30 rounded-full border border-lcd-pixel-dark flex items-start justify-end pr-0.5 pt-0.5">
                  <div className="w-1 h-1 bg-lcd-bg rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- PIXEL PET HEAD & EARS --- */}
        <div className="flex flex-col items-center relative z-10">
          <div className="flex justify-between w-14 px-1.5 mb-0.5">
            <div
              className={`w-2.5 h-2.5 bg-lcd-pixel-dark rounded-xs transition-transform duration-200 ${
                mood === 'contemplating' ? '-rotate-12 translate-y-0.5' : isPoked ? '-rotate-45' : ''
              }`}
            />
            <div
              className={`w-2.5 h-2.5 bg-lcd-pixel-dark rounded-xs transition-transform duration-200 ${
                mood === 'contemplating' ? 'rotate-12 translate-y-0.5' : isPoked ? 'rotate-45' : ''
              }`}
            />
          </div>

          <div
            className={`w-18 h-13 bg-lcd-pixel-dark rounded-xl flex flex-col items-center justify-between p-1.5 shadow-sm transition-all duration-200 ${
              mood === 'glitch' ? 'skew-x-6 opacity-75' : ''
            }`}
          >
            {/* EYES ROW */}
            <div className="flex justify-between w-13 px-1 pt-1 items-center">
              <div className="w-3.5 h-3.5 bg-lcd-bg rounded-xs flex items-center justify-center overflow-hidden">
                {isKnockedOut ? (
                  <span className="text-[10px] font-pixel text-lcd-pixel-dark font-bold leading-none">X</span>
                ) : isVomiting ? (
                  <span className="text-[9px] font-pixel text-lcd-pixel-dark leading-none">&gt;</span>
                ) : isDizzy ? (
                  <span className="text-[10px] font-pixel text-lcd-pixel-dark leading-none">@</span>
                ) : hat === 'pirate' ? (
                  <span className="text-[9px] font-pixel text-lcd-pixel-dark font-bold leading-none">#</span>
                ) : isBlinking ? (
                  <div className="w-2.5 h-0.5 bg-lcd-pixel-dark" />
                ) : isPoked ? (
                  <div className="w-2 h-2 bg-lcd-pixel-dark rounded-full" />
                ) : mood === 'despair' ? (
                  <div className="w-2 h-1 bg-lcd-pixel-dark mt-1" />
                ) : mood === 'bliss' ? (
                  <span className="text-[9px] font-bold text-lcd-pixel-dark leading-none">^</span>
                ) : (
                  <div
                    className={`w-2 h-2 bg-lcd-pixel-dark rounded-xs transition-transform ${
                      mood === 'contemplating' ? '-translate-y-0.5 translate-x-0.5' : ''
                    }`}
                  />
                )}
              </div>

              {hat === 'clown' && (
                <div className="w-2 h-2 bg-lcd-bg rounded-full border border-lcd-pixel-dark -mt-1" />
              )}

              <div className="w-3.5 h-3.5 bg-lcd-bg rounded-xs flex items-center justify-center overflow-hidden">
                {isKnockedOut ? (
                  <span className="text-[10px] font-pixel text-lcd-pixel-dark font-bold leading-none">X</span>
                ) : isVomiting ? (
                  <span className="text-[9px] font-pixel text-lcd-pixel-dark leading-none">&lt;</span>
                ) : isDizzy ? (
                  <span className="text-[10px] font-pixel text-lcd-pixel-dark leading-none">@</span>
                ) : isBlinking ? (
                  <div className="w-2.5 h-0.5 bg-lcd-pixel-dark" />
                ) : isPoked ? (
                  <div className="w-2 h-2 bg-lcd-pixel-dark rounded-full" />
                ) : mood === 'despair' ? (
                  <div className="w-2 h-1 bg-lcd-pixel-dark mt-1" />
                ) : mood === 'bliss' ? (
                  <span className="text-[9px] font-bold text-lcd-pixel-dark leading-none">^</span>
                ) : (
                  <div
                    className={`w-2 h-2 bg-lcd-pixel-dark rounded-xs transition-transform ${
                      mood === 'contemplating' ? '-translate-y-0.5 -translate-x-0.5' : ''
                    }`}
                  />
                )}
              </div>
            </div>

            {/* MOUTH ROW */}
            <div className="flex items-center justify-center h-2.5 mb-0.5 relative">
              {isVomiting ? (
                <div className="w-5 h-3 bg-lcd-bg rounded-b-lg border-t border-lcd-pixel-dark flex items-center justify-center" />
              ) : isEating ? (
                <div className="w-3.5 h-2 bg-lcd-bg rounded-full animate-ping" />
              ) : isDizzy ? (
                <span className="text-[9px] font-pixel text-lcd-bg leading-none">~</span>
              ) : mood === 'bliss' ? (
                <div className="w-3.5 h-1.5 bg-lcd-bg rounded-b-full" />
              ) : mood === 'despair' || despair > 70 ? (
                <div className="w-3.5 h-1 bg-lcd-bg rounded-t-full" />
              ) : isPoked ? (
                <div className="w-2 h-2 bg-lcd-bg rounded-full" />
              ) : (
                <div className="w-4 h-0.5 bg-lcd-bg rounded-full" />
              )}
            </div>
          </div>

          {/* BODY STUMPS */}
          <div className="flex gap-1.5 mt-0.5">
            <div className="w-3.5 h-3 bg-lcd-pixel-dark rounded-b-md" />
            <div className="w-4.5 h-3.5 bg-lcd-pixel-dark rounded-b-md" />
            <div className="w-3.5 h-3 bg-lcd-pixel-dark rounded-b-md" />
          </div>
        </div>

        {/* Vomit Puddle & Stream */}
        {isVomiting && (
          <div className="absolute top-12 flex flex-col items-center pointer-events-none z-30">
            <div className="w-2 h-6 bg-lcd-pixel-dark animate-bounce" />
            <div className="w-8 h-2 bg-lcd-pixel-dark rounded-full -mt-1" />
          </div>
        )}
      </div>

      {/* Shadow on LCD Floor */}
      <div className="w-14 h-1.5 bg-lcd-pixel-mid/35 rounded-full mt-2 animate-pulse-subtle" />
    </div>
  );
};
