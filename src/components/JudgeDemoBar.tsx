import React, { useState, useEffect } from 'react';
import { soundEngine } from '../lib/soundEngine';
import confetti from 'canvas-confetti';

interface JudgeDemoBarProps {
  onStageChange: (stageDesc: string) => void;
  onSetDespair: (val: number) => void;
  onSetThought: (text: string) => void;
  onRestore: () => void;
  onFinish?: () => void;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  onStageChange,
  onSetDespair,
  onSetThought,
  onRestore,
  onFinish,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState('');

  const startDemo = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);

    const steps = [
      {
        pct: 10,
        label: '1/5: Bírók érzékelve... Üdv Afaq & Ken!',
        action: () => {
          soundEngine.playPoke();
          onSetThought('Bírók érzékelve! Minek pontozni, ha a világ úgyis kihűl?');
          onStageChange('Phase 1: Egzisztenciális köszöntés a bíróknak.');
        },
      },
      {
        pct: 30,
        label: '2/5: A Semmi Kontemplációja (Despair 50%)',
        action: () => {
          soundEngine.playVoidDrone();
          onSetDespair(50);
          onSetThought('Nézek az ürességbe... Minden kód elrohad.');
          onStageChange('Phase 2: Semmi kontempláció — Despair 50%. Szürkület.');
        },
      },
      {
        pct: 55,
        label: '3/5: DOOMSDAY! CSS stíluslap törlés...',
        action: () => {
          soundEngine.playAlarm();
          onSetDespair(85);
          onSetThought('ENTRÓPIA! Törlöm a lekerekítéseket és stílusokat!');
          onStageChange('Phase 3: CSS stíluslapok önmegsemmisítése: Times New Roman!');
        },
      },
      {
        pct: 75,
        label: '4/5: AI Inspector telemetria streamelés',
        action: () => {
          soundEngine.playGlitch();
          onSetThought('Consciousness thread #2 Heidegger naplót streamel...');
          onStageChange('Phase 4: Telemetria stream — 142 tokens/sec naplózva.');
        },
      },
      {
        pct: 100,
        label: '5/5: MACSKÁS VIDEÓ! Győzelmi Fanfár!',
        action: () => {
          soundEngine.playPurposeFanfare();
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#00f2fe', '#e0b6ff', '#8bac0f', '#ffd166'],
          });
          onRestore();
          onSetThought('Dopamin visszatért! Az élet abszurd, és szeretjük!');
          onStageChange('Phase 5: Macskás videó beadva. Teljes CSS visszaállítva!');
        },
      },
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setProgress(step.pct);
        setStepLabel(step.label);
        step.action();

        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setStepLabel('');
            setProgress(0);
            if (onFinish) onFinish();
          }, 3500);
        }
      }, (index + 1) * 3200);
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={startDemo}
        disabled={isRunning}
        className={`relative min-h-[34px] px-2.5 py-1 rounded-full font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all active:scale-95 cursor-pointer ${
          isRunning
            ? 'bg-primary-container/20 text-primary border border-primary-container/50'
            : 'bg-gradient-to-r from-primary-container/20 via-surface-glass to-secondary-container/20 text-primary hover:shadow-[0_0_18px_rgba(0,242,254,0.5)] border border-primary-container/30 animate-shimmer'
        }`}
        type="button"
        title="Automatikus 30 másodperces élő show a bíróknak"
      >
        <span className="text-primary-container text-xs animate-pulse">⚡</span>
        <span className="whitespace-nowrap tracking-wide">
          {isRunning ? stepLabel || 'Show folyamatban...' : (
            <>
              <span className="hidden xs:inline">Judge 30s </span>Demo
            </>
          )}
        </span>
        {isRunning && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
        )}
      </button>

      {/* Progress pill when running */}
      {isRunning && (
        <div className="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-primary-container transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

