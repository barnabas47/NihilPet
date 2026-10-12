import React from 'react';
import { Achievement } from '../lib/achievements';

interface AchievementModalProps {
  isOpen: boolean;
  achievements: Achievement[];
  totalScore: number;
  onClose: () => void;
  onResetAchievements?: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  achievements,
  totalScore,
  onClose,
  onResetAchievements,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionPct = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono">
      <div className="max-w-4xl w-full max-h-[88vh] bg-[#0c0e14] border-2 border-amber-500/80 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-amber-400 text-sm font-bold">[TROPHIES]</span>
            <span className="text-xs text-neutral-300 font-bold uppercase tracking-wider">
              ACHIEVEMENT COMPENDIUM
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-pixel text-xs text-emerald-400">
              SCORE: {totalScore.toLocaleString()} PTS
            </span>
            <button
              onClick={onClose}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
              type="button"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="my-3 p-2.5 bg-[#07080c] border border-white/5 rounded-xl flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
              COMPLETION RATE
            </span>
            <span className="font-pixel text-sm text-amber-300 font-bold">
              {unlockedCount} / {achievements.length} UNLOCKED ({completionPct}%)
            </span>
          </div>
          <div className="flex-1 max-w-xs h-2 bg-neutral-800 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* 16 Achievements Grid (No truncation, fully readable cards) */}
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-3 my-2 pr-1">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                item.unlocked
                  ? 'bg-amber-950/20 border-amber-500/50 text-amber-200 shadow-sm'
                  : 'bg-[#08090d] border-white/5 text-neutral-500 opacity-60'
              }`}
            >
              {/* Icon Box */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-pixel text-xs font-bold flex-shrink-0 ${
                  item.unlocked
                    ? 'bg-amber-400/20 border border-amber-400 text-amber-300'
                    : 'bg-neutral-900 border border-neutral-700 text-neutral-600'
                }`}
              >
                {item.unlocked ? item.icon : '[?]'}
              </div>

              {/* Title & Description with full wrap */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`font-bold text-xs leading-snug break-words ${item.unlocked ? 'text-white' : 'text-neutral-400'}`}>
                    {item.title}
                  </span>
                  <span className="text-[9px] font-pixel text-amber-400 font-bold flex-shrink-0 ml-1">
                    +{item.points}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed text-neutral-300 break-words font-mono">
                  {item.description}
                </p>
                {item.unlocked && item.unlockedAt && (
                  <span className="text-[8px] font-pixel text-amber-400/70 mt-1">
                    UNLOCKED AT {item.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
          <div className="flex items-center gap-2">
            <span>PROGRESS PERSISTED TO MEMORY MATRIX</span>
            {onResetAchievements && (
              <button
                onClick={() => {
                  if (window.confirm('Reset all achievement progression on this machine?')) {
                    onResetAchievements();
                  }
                }}
                className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 hover:border-rose-500 text-[8px] text-neutral-400 hover:text-rose-400 cursor-pointer transition-all"
                type="button"
                title="Clear saved progression on this device"
              >
                [RESET PROGRESS]
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-pixel text-[9px] font-bold rounded cursor-pointer"
            type="button"
          >
            [ RESUME GAMEPLAY ]
          </button>
        </div>

      </div>
    </div>
  );
};
