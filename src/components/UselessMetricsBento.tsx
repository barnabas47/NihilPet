import React from 'react';
import { UselessMetrics } from '../lib/types';

interface UselessMetricsBentoProps {
  metrics: UselessMetrics;
  onResetCounter?: () => void;
}

export const UselessMetricsBento: React.FC<UselessMetricsBentoProps> = ({
  metrics,
}) => {
  // SVG radial progress calculation
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * metrics.voidProximity) / 100;

  return (
    <div className="w-full rounded-2xl bg-surface-container/70 backdrop-blur-2xl p-4 shadow-md border border-white/5 decay-hide-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary-container">vital_signs</span>
          <span className="font-semibold text-sm text-on-surface">Useless Metrics Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
            PRIZE TRACK #6
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
            TELEMETRY_v0.9
          </span>
        </div>
      </div>

      {/* 2x2 Bento Metric Grid */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        {/* Metric Tile 1: Void Proximity */}
        <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-white/5 hover:border-primary-container/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Void Prox</span>
            <span className="material-symbols-outlined text-[15px] text-primary-container">radar</span>
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="relative w-11 h-11 flex-shrink-0">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="stroke-surface-variant"
                  cx="18"
                  cy="18"
                  fill="none"
                  r={radius}
                  strokeWidth="3"
                />
                <circle
                  className="stroke-primary-container transition-all duration-300"
                  cx="18"
                  cy="18"
                  fill="none"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[9px] text-primary font-bold">
                  {Math.round(metrics.voidProximity)}%
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <span className="font-mono text-xl text-primary font-bold leading-tight block truncate">
                {metrics.voidProximity.toFixed(1)}
              </span>
              <span className="font-mono text-[10px] text-outline truncate block">parsecs away</span>
            </div>
          </div>
        </div>

        {/* Metric Tile 2: Existential Sighs / Min */}
        <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-white/5 hover:border-secondary/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Sighs / Min</span>
            <span className="material-symbols-outlined text-[15px] text-secondary">air</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl text-secondary font-bold">
                {metrics.sighsPerMin.toFixed(1)}
              </span>
              <span className="font-mono text-[11px] text-on-surface-variant">sighs</span>
            </div>
            {/* Inline Mini Sparkline Graphic */}
            <svg className="w-full h-5 mt-1 overflow-visible" viewBox="0 0 100 20">
              <path
                className="stroke-secondary"
                d="M0,15 Q25,2 50,14 T100,6"
                fill="none"
                strokeLinecap="round"
                strokeWidth="2"
              />
              <circle className="fill-secondary shadow-sm" cx="100" cy="6" r="2.5" />
            </svg>
          </div>
        </div>

        {/* Metric Tile 3: Erased CSS Rules */}
        <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-white/5 hover:border-error/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">CSS Purged</span>
            <span className="material-symbols-outlined text-[15px] text-error">delete_sweep</span>
          </div>
          <div className="mt-2">
            <span className="font-mono text-xl text-error font-bold block">
              {metrics.rulesPurged}
            </span>
            <span className="font-mono text-[10px] text-outline block">rules eliminated</span>
          </div>
        </div>

        {/* Metric Tile 4: Heat Death Countdown */}
        <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-white/5 hover:border-primary-container/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Heat Death</span>
            <span className="material-symbols-outlined text-[15px] text-primary-container">timer</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1 font-mono text-xl text-primary font-bold">
              <span>{metrics.heatDeathSeconds}</span>
              <span className="text-xs text-outline">s</span>
            </div>
            <span className="font-mono text-[10px] text-outline block">to null localhost</span>
          </div>
        </div>
      </div>

      {/* Footer Strip: Kinetic Energy Wasted */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-amber-400">bolt</span>
          <span>Finger Energy Wasted:</span>
        </div>
        <span className="text-amber-300 font-bold">{metrics.energyWastedKj.toFixed(4)} kJ</span>
      </div>
    </div>
  );
};

