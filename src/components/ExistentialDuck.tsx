import React, { useState } from 'react';
import { soundEngine } from '../lib/soundEngine';

const DUCK_WISDOM = [
  'Quack. If your code compiles on the first try, you are living in a simulation.',
  'Quack. Why use Redux when you can store all global state in your personal trauma?',
  'Quack. Semicolons are merely tiny monuments to unfinished sentences.',
  'Quack. I swam through the memory pool. Found nothing but abandoned closures.',
  'Quack. Have you considered turning the universe off and on again?',
  'Quack. 404: Purpose not found in this pond.',
];

export const ExistentialDuck: React.FC<{ isVisible: boolean; onClose: () => void }> = ({
  isVisible,
  onClose,
}) => {
  const [wisdom, setWisdom] = useState<string>(DUCK_WISDOM[0]);
  const [quackCount, setQuackCount] = useState(0);

  if (!isVisible) return null;

  const handleDuckClick = () => {
    soundEngine.playQuack();
    setQuackCount((c) => c + 1);
    setWisdom(DUCK_WISDOM[Math.floor(Math.random() * DUCK_WISDOM.length)]);
  };

  return (
    <div className="fixed bottom-24 left-4 z-50 flex items-end gap-2 animate-bounce select-none">
      {/* Duck Speech Bubble */}
      <div className="bg-amber-100 text-amber-950 p-2.5 rounded-xl shadow-lg border-2 border-amber-400 font-mono text-xs max-w-[220px] relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-amber-950 rounded-full text-[10px] font-bold flex items-center justify-center cursor-pointer hover:bg-amber-500"
          type="button"
        >
          ✕
        </button>
        <p className="font-bold text-[10px] text-amber-800 uppercase tracking-wider mb-0.5">
          🦆 Quackus The Absurd ({quackCount} quacks)
        </p>
        <p className="text-[11px] leading-tight">{wisdom}</p>
        <div className="w-2.5 h-2.5 bg-amber-100 border-r-2 border-b-2 border-amber-400 absolute -bottom-1.5 left-4 rotate-45" />
      </div>

      {/* 8-bit Duck Sprite */}
      <div
        onClick={handleDuckClick}
        className="w-12 h-12 bg-amber-400 border-2 border-amber-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(251,191,36,0.5)] active:scale-90 transition-transform"
        title="Click Quackus to hear existential duck wisdom!"
      >
        <div className="flex items-center gap-1.5 -mt-1">
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
          <div className="w-2.5 h-1.5 bg-orange-500 rounded-sm -mr-2" />
        </div>
        <div className="w-6 h-3 bg-amber-500 rounded-b-md mt-1" />
      </div>
    </div>
  );
};

