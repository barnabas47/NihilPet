import React, { useState } from 'react';
import { PetMood } from '../lib/types';
import { NihilPetSprite, NihilHat } from './NihilPetSprite';
import { CrtStaticNoise } from './CrtStaticNoise';
import { IconBattery, IconSkinTag, IconFeed, IconPoke, IconVoid, IconShock } from './RetroIcons';
import { soundEngine } from '../lib/soundEngine';
import { LcdPalette, LCD_THEMES } from './WardrobeModal';

export interface FeedbackPillData {
  text: string;
  type: 'penalty' | 'bonus' | 'alert' | 'legendary';
}

export interface ActiveQte {
  type: 'feed_frenzy' | 'clear_airway' | 'ground_arc' | 'anchor_void';
  title: string;
  instruction: string;
  targetKey: 'feed' | 'poke' | 'shock' | 'void';
  currentCount: number;
  requiredCount: number;
  timeRemaining: number;
  totalTime: number;
}

interface TamagotchiDeviceProps {
  isPoweredOn: boolean;
  onPowerOn: () => void;
  mood: PetMood;
  despair: number;
  thought: string;
  activeHat: NihilHat;
  activeStatusText: string;
  onCycleHat: () => void;
  onFeed: () => void;
  onPoke: () => void;
  onContemplateVoid: () => void;
  onShock: () => void;
  isHypercube?: boolean;
  isOverclocked?: boolean;
  isVomiting?: boolean;
  isKnockedOut?: boolean;
  isHiccuping?: boolean;
  feedbackPill?: FeedbackPillData | null;
  fuseCooldownSeconds?: number;
  isCriticalDespair?: boolean;
  criticalDespairCountdown?: number;
  onOpenWardrobe?: () => void;
  activePalette?: LcdPalette;
  petName?: string;
  activeQte?: ActiveQte | null;
}

export const TamagotchiDevice: React.FC<TamagotchiDeviceProps> = ({
  isPoweredOn,
  onPowerOn,
  mood,
  despair,
  thought,
  activeHat,
  activeStatusText,
  onCycleHat,
  onFeed,
  onPoke,
  onContemplateVoid,
  onShock,
  isHypercube = false,
  isOverclocked = false,
  isVomiting = false,
  isKnockedOut = false,
  isHiccuping = false,
  feedbackPill = null,
  fuseCooldownSeconds = 0,
  isCriticalDespair = false,
  criticalDespairCountdown = 0,
  onOpenWardrobe,
  activePalette = 'dmg',
  petName = 'Nihil-chan',
  activeQte = null,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isDizzy, setIsDizzy] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isPoked, setIsPoked] = useState(false);

  // Calculate Will to Live hearts (0-4)
  const willHearts = Math.max(0, Math.min(4, Math.floor((100 - despair) / 25)));

  const handlePokeClick = () => {
    soundEngine.playBoing();
    setIsPoked(true);
    setTimeout(() => setIsPoked(false), 300);

    setClickCount((c) => {
      const next = c + 1;
      if (next >= 5) {
        setIsDizzy(true);
        soundEngine.playSadTrombone();
        setTimeout(() => setIsDizzy(false), 2500);
        return 0;
      }
      return next;
    });
    onPoke();
  };

  const handleFeedClick = () => {
    setIsEating(true);
    setTimeout(() => setIsEating(false), 1200);
    onFeed();
  };

  const hatLabels: Record<NihilHat, string> = {
    none: '01-DMG',
    beret: '02-BERET',
    party: '03-PARTY',
    tinfoil: '04-FOIL',
    clown: '05-CLOWN',
    cyber: '06-CYBER',
    wizard: '07-WIZARD',
    pirate: '08-PIRATE',
    crown: '09-CROWN',
    vr: '10-VR90',
    astro: '11-ASTRO',
    halo: '12-HALO',
  };

  const currentTheme = LCD_THEMES[activePalette] || LCD_THEMES.dmg;

  return (
    <div className="relative w-full max-w-md h-full flex flex-col justify-between p-4 bg-[#14161c] border-2 border-[#2b2e38] rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_2px_2px_rgba(255,255,255,0.12)] select-none font-mono">
      
      {/* 1. Top Bezel Hardware Bar */}
      <div className="flex items-center justify-between px-2 pt-0.5 pb-2 border-b border-white/10 text-neutral-400 text-[10px]">
        {/* BIOS Identifier */}
        <div className="flex items-center gap-1.5 font-bold tracking-wider text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span>NP-88</span>
        </div>

        {/* DEDICATED SKIN BUTTON NEAR BIOS (Opens Wardrobe) */}
        <button
          onClick={() => {
            soundEngine.playPoke();
            if (onOpenWardrobe) onOpenWardrobe();
            else onCycleHat();
          }}
          className="px-2.5 py-1 bg-[#20242e] hover:bg-[#282d3a] border border-white/20 rounded font-pixel text-[8px] text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
          type="button"
          title="Open Wardrobe & Re-skin Menu"
        >
          <IconSkinTag className="w-3 h-3 text-cyan-400" />
          <span>SKIN: {hatLabels[activeHat] || activeHat.toUpperCase()}</span>
        </button>

        {/* Battery Indicator */}
        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
          <IconBattery className="w-3.5 h-3.5 text-emerald-400" />
          <span>85%</span>
        </div>
      </div>

      {/* 2. Specialized Dot-Matrix LCD Screen with Dynamic Palette */}
      <div
        className="relative w-full flex-1 min-h-[290px] my-2 rounded-2xl border-4 overflow-hidden shadow-[inset_0_4px_16px_rgba(0,0,0,0.5)] transition-colors duration-300"
        style={{
          backgroundColor: currentTheme.bg,
          borderColor: `${currentTheme.pixelDark}66`,
        }}
      >
        
        {!isPoweredOn ? (
          <CrtStaticNoise onPowerOn={onPowerOn} />
        ) : (
          <div
            className="relative z-10 flex flex-col justify-between h-full p-3 transition-colors duration-300"
            style={{ color: currentTheme.pixelDark }}
          >
            {/* CRT scanline overlay effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 crt-scanlines" />

            {/* LCD Header Vitals */}
            <div
              className="flex items-center justify-between pb-1.5 border-b font-bold text-[10px]"
              style={{ borderColor: `${currentTheme.pixelDark}40` }}
            >
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < willHearts ? 'opacity-100' : 'opacity-30'}`}
                    style={{ color: currentTheme.pixelDark }}
                  >
                    {i < willHearts ? '♥' : '♡'}
                  </span>
                ))}
                <span className="ml-1 tracking-tighter text-[8px] uppercase font-pixel">WILL</span>
              </div>
              <div
                className="px-2 py-0.5 rounded text-[8px] tracking-wider uppercase font-pixel"
                style={{
                  backgroundColor: currentTheme.pixelDark,
                  color: currentTheme.bg,
                }}
              >
                {activeQte ? '⚠️ QTE ALERT' : activeStatusText}
              </div>
            </div>

            {/* URGENT QUICK-TIME EVENT (QTE) BANNER */}
            {activeQte && (
              <div
                className="py-1 px-2 rounded-md font-pixel text-[8px] tracking-tight text-center my-0.5 border-2 animate-pulse shadow-md"
                style={{
                  backgroundColor: currentTheme.pixelDark,
                  color: currentTheme.bg,
                  borderColor: currentTheme.pixelMid,
                }}
              >
                <div className="flex items-center justify-between text-[7px] uppercase font-bold text-amber-300 mb-0.5">
                  <span>⚡ {activeQte.title}</span>
                  <span className="font-mono text-[8px]">{activeQte.timeRemaining.toFixed(1)}s</span>
                </div>
                <div className="text-[7.5px] uppercase tracking-wider mb-1">
                  {activeQte.instruction} [{activeQte.currentCount}/{activeQte.requiredCount}]
                </div>
                {/* Progress bar */}
                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-100"
                    style={{
                      width: `${(activeQte.currentCount / activeQte.requiredCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Critical Despair Alert Banner */}
            {!activeQte && isCriticalDespair && (
              <div
                className="py-1 px-2 rounded-md font-pixel text-[8px] tracking-tight text-center my-1 animate-pulse"
                style={{
                  backgroundColor: currentTheme.pixelDark,
                  color: currentTheme.bg,
                }}
              >
                ⚠️ VOID COLLAPSE IN {criticalDespairCountdown}s! FEED NOW!
              </div>
            )}

            {/* Middle Stage: Dialogue Bubble & Sprite */}
            <div className="relative flex-1 flex flex-col items-center justify-center py-1">
              {/* Dialogue Box with Pet Name Header */}
              <div
                className="w-full max-w-[270px] px-3 py-1.5 rounded-lg text-[9px] tracking-tight font-mono text-center relative mb-1.5 shadow-sm"
                style={{
                  backgroundColor: currentTheme.pixelDark,
                  color: currentTheme.bg,
                }}
              >
                <div className="font-pixel text-[7px] uppercase tracking-wider mb-0.5 opacity-80">
                  [{petName}]
                </div>
                <span className="line-clamp-2 leading-tight">
                  "{thought}"
                </span>
                <div
                  className="w-2 h-2 absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45"
                  style={{ backgroundColor: currentTheme.pixelDark }}
                />
              </div>

              {/* Floating Dynamic Feedback Pill (Arcade Status / Time Penalty / Bonus) */}
              {feedbackPill && (
                <div
                  className={`my-1 px-2.5 py-0.5 rounded-md font-pixel text-[8px] tracking-wider uppercase shadow-md animate-bounce z-20 ${
                    feedbackPill.type === 'penalty'
                      ? 'bg-[#2a0606] text-[#ff7777] border border-[#ff3333]'
                      : feedbackPill.type === 'bonus'
                      ? 'bg-[#062606] text-[#66ff66] border border-[#22cc22]'
                      : feedbackPill.type === 'legendary'
                      ? 'bg-[#261f04] text-[#ffd700] border-2 border-[#ffcc00] font-bold'
                      : 'bg-[#261a04] text-[#ffbb33] border border-[#ffaa00]'
                  }`}
                >
                  {feedbackPill.text}
                </div>
              )}

              {/* Nihil-chan Sprite */}
              <div className="mt-0.5">
                <NihilPetSprite
                  mood={mood}
                  despair={despair}
                  hat={activeHat}
                  isDizzy={isDizzy}
                  isEating={isEating}
                  isPoked={isPoked}
                  isHypercube={isHypercube}
                  isOverclocked={isOverclocked}
                  isVomiting={isVomiting}
                  isKnockedOut={isKnockedOut}
                  isHiccuping={isHiccuping}
                  onClick={handlePokeClick}
                />
              </div>
            </div>

            {/* LCD Screen Footer */}
            <div className="flex justify-between items-center text-[9px] pt-1.5 text-[#0f380f] font-mono border-t border-[#0f380f]/30">
              <span>RAM: 16KB</span>
              <span className="font-pixel text-[8px]">
                {despair >= 80 ? 'DISSOLVING' : 'Z80: OK'}
              </span>
              <span>ENTROPY: {despair}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Primary Hardware Action Controls (FEED, POKE, VOID, JOLT) */}
      <div className="grid grid-cols-4 gap-2 my-1.5">
        {/* Button A: Feed */}
        <button
          onClick={handleFeedClick}
          disabled={!isPoweredOn || isKnockedOut || isVomiting}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#20242e] hover:bg-[#282e3b] active:translate-y-0.5 border border-white/10 shadow-[0_4px_0_#0a0b0e] active:shadow-none transition-all cursor-pointer disabled:opacity-40 ${
            activeQte?.targetKey === 'feed'
              ? 'ring-4 ring-amber-400 animate-bounce scale-105 z-20 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
              : isCriticalDespair
              ? 'ring-2 ring-emerald-400 animate-pulse'
              : ''
          }`}
          type="button"
          title="Inject compressed bytecode carbohydrates"
        >
          <div className="w-7 h-7 rounded-full bg-[#14171e] flex items-center justify-center text-emerald-400">
            <IconFeed className="w-3.5 h-3.5" />
          </div>
          <span className="font-pixel text-[8px] text-neutral-300">
            {activeQte?.targetKey === 'feed'
              ? `SPAM! [${activeQte.currentCount}/${activeQte.requiredCount}]`
              : isVomiting
              ? 'VOMITING'
              : isCriticalDespair
              ? 'FEED NOW!'
              : 'FEED'}
          </span>
        </button>

        {/* Button B: Poke */}
        <button
          onClick={handlePokeClick}
          disabled={!isPoweredOn || isKnockedOut}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#20242e] hover:bg-[#282e3b] active:translate-y-0.5 border border-white/10 shadow-[0_4px_0_#0a0b0e] active:shadow-none transition-all cursor-pointer disabled:opacity-40 ${
            activeQte?.targetKey === 'poke'
              ? 'ring-4 ring-cyan-400 animate-bounce scale-105 z-20 shadow-[0_0_15px_rgba(34,211,238,0.8)]'
              : ''
          }`}
          type="button"
          title="Somatic tactile contact"
        >
          <div className="w-7 h-7 rounded-full bg-[#14171e] flex items-center justify-center text-cyan-400">
            <IconPoke className="w-3.5 h-3.5" />
          </div>
          <span className="font-pixel text-[8px] text-neutral-300">
            {activeQte?.targetKey === 'poke'
              ? `TAP! [${activeQte.currentCount}/${activeQte.requiredCount}]`
              : isKnockedOut
              ? 'COMA'
              : `POKE${clickCount > 0 ? `*${clickCount}` : ''}`}
          </span>
        </button>

        {/* Button X: Void */}
        <button
          onClick={onContemplateVoid}
          disabled={!isPoweredOn || isKnockedOut}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#20242e] hover:bg-[#282e3b] active:translate-y-0.5 border border-white/10 shadow-[0_4px_0_#0a0b0e] active:shadow-none transition-all cursor-pointer disabled:opacity-40 ${
            activeQte?.targetKey === 'void'
              ? 'ring-4 ring-purple-400 animate-bounce scale-105 z-20 shadow-[0_0_15px_rgba(192,132,252,0.8)]'
              : ''
          }`}
          type="button"
          title="Gaze into cosmic void"
        >
          <div className="w-7 h-7 rounded-full bg-[#14171e] flex items-center justify-center text-purple-400">
            <IconVoid className="w-3.5 h-3.5" />
          </div>
          <span className="font-pixel text-[8px] text-neutral-300">
            {activeQte?.targetKey === 'void' ? 'ANCHOR!' : 'VOID'}
          </span>
        </button>

        {/* Button Y: Jolt/Shock */}
        <button
          onClick={onShock}
          disabled={!isPoweredOn || isKnockedOut || fuseCooldownSeconds > 0}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#2b181b] hover:bg-[#3a1d22] active:translate-y-0.5 border border-rose-500/30 shadow-[0_4px_0_#14080a] active:shadow-none transition-all cursor-pointer disabled:opacity-40 ${
            activeQte?.targetKey === 'shock'
              ? 'ring-4 ring-rose-500 animate-bounce scale-105 z-20 shadow-[0_0_15px_rgba(244,63,94,0.8)]'
              : ''
          }`}
          type="button"
          title="Hardware voltage shock disruption"
        >
          <div className="w-7 h-7 rounded-full bg-[#1e0f11] flex items-center justify-center text-rose-400">
            <IconShock className="w-3.5 h-3.5" />
          </div>
          <span className="font-pixel text-[8px] text-rose-300 font-bold">
            {activeQte?.targetKey === 'shock'
              ? 'GROUND!'
              : fuseCooldownSeconds > 0
              ? `FUSE ${fuseCooldownSeconds}s`
              : 'JOLT'}
          </span>
        </button>
      </div>

      {/* 4. Secondary D-Pad & Rubber Pill Buttons */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between px-3">
        {/* Cross D-Pad */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div className="absolute w-14 h-4.5 bg-[#252a35] border border-white/10 rounded-sm" />
          <div className="absolute w-4.5 h-14 bg-[#252a35] border border-white/10 rounded-sm" />
          <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-[#1a1d24]" />
        </div>

        {/* Pill Buttons: SELECT and START */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              soundEngine.playPoke();
              if (onOpenWardrobe) onOpenWardrobe();
              else onCycleHat();
            }}
            className="flex flex-col items-center gap-1 cursor-pointer group"
            type="button"
            title="Open Wardrobe & Re-skin Menu"
          >
            <div className="w-9 h-3 bg-[#282c37] group-hover:bg-[#353a49] group-active:scale-95 rounded-full border border-white/15 rotate-[-25deg] shadow-inner" />
            <span className="text-[8px] font-pixel text-cyan-400 tracking-tighter">SELECT</span>
          </button>

          <button
            onClick={onPowerOn}
            className="flex flex-col items-center gap-1 cursor-pointer group"
            type="button"
          >
            <div className="w-9 h-3 bg-[#282c37] group-hover:bg-[#353a49] rounded-full border border-white/15 rotate-[-25deg] shadow-inner" />
            <span className="text-[8px] font-pixel text-neutral-500 tracking-tighter">
              {isPoweredOn ? 'RESET' : 'START'}
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};
