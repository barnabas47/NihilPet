import React, { useState } from 'react';
import { soundEngine } from '../lib/soundEngine';

export interface MisfortuneOutcome {
  id: string;
  name: string;
  icon: string;
  desc: string;
  effect: () => void;
}

interface WheelOfMisfortuneProps {
  onTriggerChaos: (outcome: MisfortuneOutcome) => void;
}

export const WheelOfMisfortune: React.FC<WheelOfMisfortuneProps> = ({ onTriggerChaos }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [lastOutcome, setLastOutcome] = useState<MisfortuneOutcome | null>(null);

  const outcomes: MisfortuneOutcome[] = [
    {
      id: 'bugs',
      name: 'Digital Cockroach Outbreak',
      icon: '🪲',
      desc: 'Three digital bugs crawl across the DOM looking for memory leaks.',
      effect: () => soundEngine.playSadTrombone(),
    },
    {
      id: 'comicsans',
      name: 'Comic Sans Contagion',
      icon: '🔤',
      desc: 'All fonts momentarily degrade into Comic Sans. A tragedy for typography.',
      effect: () => soundEngine.playGlitch(),
    },
    {
      id: 'nihilcoin',
      name: 'Absurd NihilCoin Airdrop',
      icon: '🪙',
      desc: 'Awarded 0.00000042 $NIHIL. Current fiat value: $0.00 CAD.',
      effect: () => soundEngine.playCoin(),
    },
    {
      id: 'duck',
      name: 'Summon Quackus The Absurd',
      icon: '🦆',
      desc: 'An 8-bit existential rubber duck waddles across your screen.',
      effect: () => soundEngine.playQuack(),
    },
    {
      id: 'pizzarain',
      name: 'Pixel Pizza Deluge',
      icon: '🍕',
      desc: 'Bytecode pizza rain drops from heaven! Carbohydrates for the soul!',
      effect: () => soundEngine.playEat(),
    },
    {
      id: 'vertigo',
      name: 'Gravitational Nihilism',
      icon: '🌀',
      desc: 'Screen experiences severe existential dizziness and tilts violently.',
      effect: () => soundEngine.playBoing(),
    },
    {
      id: 'bureaucracy',
      name: 'Kafkaesque Form 27-B Audit',
      icon: '📋',
      desc: 'You have been summoned by digital bureaucracy to justify your cursor clicks.',
      effect: () => soundEngine.playSadTrombone(),
    },
    {
      id: 'sunglasses',
      name: 'Nietzschean Coolness',
      icon: '🕶️',
      desc: 'Nihil-chan gains 8-bit sunglasses. When you stare into the void, the void looks dope.',
      effect: () => soundEngine.playCoin(),
    },
  ];

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setLastOutcome(null);

    let speed = 60;
    let ticks = 0;
    const maxTicks = 22 + Math.floor(Math.random() * 8);

    const spinStep = () => {
      ticks++;
      soundEngine.playSlotTick();
      setDisplayIndex((prev) => (prev + 1) % outcomes.length);

      if (ticks < maxTicks) {
        speed = Math.floor(speed * 1.08); // slow down
        setTimeout(spinStep, speed);
      } else {
        const finalOutcome = outcomes[(displayIndex + 1) % outcomes.length];
        setLastOutcome(finalOutcome);
        setIsSpinning(false);
        finalOutcome.effect();
        onTriggerChaos(finalOutcome);
      }
    };

    spinStep();
  };

  const activeItem = outcomes[displayIndex];

  return (
    <div className="w-full rounded-2xl bg-surface-container/70 backdrop-blur-2xl p-4 shadow-md border border-white/5 decay-hide-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎰</span>
          <span className="font-semibold text-sm text-on-surface">Cosmic Misfortune Roulette</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-bold">
          RANDOM CHAOS
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        {/* Roulette Screen Box */}
        <div className="w-full max-w-xs h-24 rounded-xl bg-surface-container-lowest border-2 border-primary-container/40 flex flex-col items-center justify-center p-3 shadow-inner relative overflow-hidden">
          <div className="absolute top-1 left-2 text-[9px] font-mono text-outline uppercase tracking-wider">
            [ OUTCOME SELECTOR ]
          </div>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl animate-bounce">{activeItem.icon}</span>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs font-bold text-primary truncate">
                {activeItem.name}
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant truncate max-w-[200px]">
                {activeItem.desc}
              </span>
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
            isSpinning
              ? 'bg-surface-container-highest text-outline cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-container/20 via-purple-600/30 to-secondary-container/20 hover:from-primary-container/30 hover:to-secondary-container/30 border border-primary-container/40 text-primary shadow-[0_0_15px_rgba(0,242,254,0.25)]'
          }`}
          type="button"
        >
          <span className="text-sm">🎲</span>
          <span>{isSpinning ? 'Consulting The Void...' : 'SPIN FOR COSMIC MISFORTUNE'}</span>
          <span className="text-sm">🎲</span>
        </button>

        {/* Last Outcome Alert */}
        {lastOutcome && (
          <div className="w-full p-2.5 rounded-lg bg-surface-container-high border border-primary-container/30 flex items-center gap-2 text-xs font-mono text-primary animate-pulse-subtle">
            <span className="text-lg">{lastOutcome.icon}</span>
            <span>{lastOutcome.desc}</span>
          </div>
        )}
      </div>
    </div>
  );
};

