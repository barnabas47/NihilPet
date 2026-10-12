import React, { useState, useEffect } from 'react';
import { soundEngine } from '../lib/soundEngine';

interface Bug {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export const DigitalBugs: React.FC<{ isActive: boolean; onClear: () => void }> = ({
  isActive,
  onClear,
}) => {
  const [bugs, setBugs] = useState<Bug[]>([]);

  useEffect(() => {
    if (isActive) {
      const initialBugs: Bug[] = [
        { id: 1, x: 20, y: 30, dx: 1.5, dy: 1.2 },
        { id: 2, x: 70, y: 50, dx: -1.8, dy: 0.9 },
        { id: 3, x: 40, y: 80, dx: 1.2, dy: -1.6 },
        { id: 4, x: 80, y: 20, dx: -1.4, dy: -1.1 },
      ];
      setBugs(initialBugs);
    } else {
      setBugs([]);
    }
  }, [isActive]);

  // Bug movement loop
  useEffect(() => {
    if (!isActive || bugs.length === 0) return;

    const interval = setInterval(() => {
      setBugs((prevBugs) =>
        prevBugs.map((bug) => {
          let nx = bug.x + bug.dx;
          let ny = bug.y + bug.dy;
          let ndx = bug.dx;
          let ndy = bug.dy;

          if (nx < 5 || nx > 92) ndx = -ndx;
          if (ny < 10 || ny > 85) ndy = -ndy;

          return { ...bug, x: nx, y: ny, dx: ndx, dy: ndy };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, bugs.length]);

  const squishBug = (id: number) => {
    soundEngine.playBoing();
    setBugs((prev) => {
      const remaining = prev.filter((b) => b.id !== id);
      if (remaining.length === 0) {
        soundEngine.playCoin();
        onClear();
      }
      return remaining;
    });
  };

  if (!isActive || bugs.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {bugs.map((bug) => (
        <div
          key={bug.id}
          onClick={() => squishBug(bug.id)}
          style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
          className="absolute pointer-events-auto cursor-crosshair text-2xl select-none hover:scale-125 transition-transform"
          title="Click to squish the digital bug!"
        >
          🪲
        </div>
      ))}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-950/90 text-red-200 border border-red-500 px-3 py-1 rounded-full font-mono text-xs z-50 pointer-events-auto flex items-center gap-2">
        <span>⚠️ MEMORY LEAK: Squish the digital bugs ({bugs.length} left)!</span>
        <button
          onClick={onClear}
          className="underline text-red-400 hover:text-white cursor-pointer ml-1"
          type="button"
        >
          [Dismiss]
        </button>
      </div>
    </div>
  );
};

