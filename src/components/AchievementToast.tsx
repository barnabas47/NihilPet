import React from 'react';
import { Achievement } from '../lib/achievements';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  if (!achievement) return null;

  return (
    <div
      onClick={onDismiss}
      className="fixed top-5 right-5 z-50 flex items-center gap-3 p-3 bg-[#0a0c10] border-2 border-amber-400 rounded-xl shadow-[0_10px_35px_rgba(251,191,36,0.4)] select-none font-mono cursor-pointer animate-bounce max-w-sm"
      title="Click to dismiss"
    >
      {/* 8-bit Trophy Badge */}
      <div className="w-10 h-10 rounded-lg bg-amber-400/20 border border-amber-400 flex items-center justify-center font-pixel text-amber-300 text-xs font-bold flex-shrink-0">
        {achievement.icon}
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 text-[9px] font-pixel text-amber-400 uppercase tracking-widest">
          <span>ACHIEVEMENT UNLOCKED!</span>
          <span>+{achievement.points} PTS</span>
        </div>
        <span className="font-bold text-xs text-white truncate mt-0.5">
          {achievement.title}
        </span>
        <span className="text-[10px] text-neutral-400 truncate leading-tight">
          {achievement.description}
        </span>
      </div>
    </div>
  );
};
