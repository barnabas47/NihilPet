import React from 'react';

export interface ActiveStatusEffect {
  id: string;
  name: string;
  durationSeconds: number;
  type: 'buff' | 'debuff' | 'legendary';
}

interface RightTelemetryPanelProps {
  timeRemainingSeconds: number;
  statusEffects: ActiveStatusEffect[];
  logs: string[];
  hexRegisters: { addr: string; val: string }[];
  score?: number;
  highScore?: number;
  unlockedCount?: number;
  totalAchievements?: number;
  onOpenAchievements?: () => void;
  timeDeltaNotice?: { text: string; isPenalty: boolean } | null;
}

export const RightTelemetryPanel: React.FC<RightTelemetryPanelProps> = ({
  timeRemainingSeconds,
  statusEffects,
  logs,
  hexRegisters,
  score = 0,
  highScore = 0,
  unlockedCount = 0,
  totalAchievements = 16,
  onOpenAchievements,
  timeDeltaNotice = null,
}) => {
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const sessionProgress = ((360 - timeRemainingSeconds) / 360) * 100;

  return (
    <aside className="w-full h-full flex flex-col justify-between p-3.5 bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl font-mono text-xs select-none">
      
      {/* 1. Header & Live Score / Entropy Clock */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-neutral-400 text-[10px]">
          <span className="font-bold uppercase tracking-wider text-neutral-300">
            SYSTEM TELEMETRY
          </span>
          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 font-pixel text-[8px] hover:bg-amber-400/30 cursor-pointer transition-all"
            type="button"
            title="Open Trophy Compendium"
          >
            <span>[TROPHIES: {unlockedCount}/{totalAchievements}]</span>
          </button>
        </div>

        {/* Live Score & Record Readout */}
        <div className="mt-2.5 p-2.5 bg-[#08090c] border border-white/10 rounded-xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
              ENTROPY SCORE
            </span>
            <span className="font-pixel text-base text-amber-400 font-bold tracking-tight">
              {score.toLocaleString()} PTS
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
              BEST RECORD
            </span>
            <span className="font-pixel text-xs text-neutral-300 font-bold">
              {highScore.toLocaleString()} PTS
            </span>
          </div>
        </div>

        {/* Entropy Countdown Clock */}
        <div className="mt-2.5 p-2.5 bg-[#08090c] border border-white/10 rounded-xl">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest mb-1">
            <span>ENTROPY COUNTDOWN</span>
            <span className={timeRemainingSeconds < 60 ? 'text-rose-400 font-bold' : 'text-neutral-400'}>
              {timeRemainingSeconds < 60 ? 'CRITICAL' : 'DRAINING'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`font-pixel text-lg font-bold tracking-wider ${
                  timeDeltaNotice?.isPenalty
                    ? 'text-rose-400 animate-pulse'
                    : timeRemainingSeconds < 60
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              >
                {formattedTime}
              </span>
              {timeDeltaNotice && (
                <span
                  className={`font-pixel text-[9px] px-1.5 py-0.5 rounded border font-bold animate-bounce ${
                    timeDeltaNotice.isPenalty
                      ? 'bg-rose-950/90 text-rose-300 border-rose-500 shadow-sm'
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-sm'
                  }`}
                >
                  {timeDeltaNotice.text}
                </span>
              )}
            </div>
            <span className="text-[9px] text-neutral-500 font-mono">
              / 06:00 MAX
            </span>
          </div>

          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-2 border border-white/5">
            <div
              className={`h-full transition-all duration-1000 ${
                timeRemainingSeconds < 60 ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${100 - sessionProgress}%` }}
            />
          </div>
        </div>

        {/* 2. Active Status Effects Tray */}
        <div className="mt-3 p-2.5 bg-[#08090c] border border-white/10 rounded-xl">
          <div className="flex justify-between items-center text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5">
            <span>ACTIVE STATUS EFFECTS</span>
            <span className="text-neutral-400">[{statusEffects.length}]</span>
          </div>

          {statusEffects.length === 0 ? (
            <div className="text-[10px] text-neutral-600 italic py-1 text-center">
              No active modifiers.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {statusEffects.map((effect) => (
                <div
                  key={effect.id}
                  className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between font-mono ${
                    effect.type === 'legendary'
                      ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 font-bold'
                      : effect.type === 'buff'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <span className="truncate">{effect.name}</span>
                  <span className="font-pixel text-[8px] flex-shrink-0 ml-1">
                    {effect.durationSeconds}s
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Live Hex Registers Dump */}
      <div className="my-2 p-2.5 bg-[#08090c] border border-white/10 rounded-xl">
        <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">
          CPU REGISTERS (HEX)
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] font-mono text-neutral-400">
          {hexRegisters.slice(0, 4).map((reg, idx) => (
            <div key={idx} className="flex justify-between border-b border-white/5 py-0.5">
              <span className="text-neutral-600">{reg.addr}</span>
              <span className="text-emerald-500/90 font-bold">{reg.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Event Log Stream */}
      <div className="flex-1 min-h-[110px] max-h-[130px] p-2 bg-[#060a06] border border-emerald-900/40 rounded-xl flex flex-col justify-between overflow-hidden">
        <div className="text-[8px] font-pixel text-emerald-500/80 pb-1 border-b border-emerald-900/30">
          EVENT_LOG // RAW TTY
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar text-[9px] font-mono text-emerald-400 space-y-1 pt-1">
          {logs.slice(-4).map((log, idx) => (
            <div key={idx} className="leading-tight opacity-90 truncate">
              {log}
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};
