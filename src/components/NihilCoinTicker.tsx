import React, { useState, useEffect } from 'react';
import { soundEngine } from '../lib/soundEngine';

interface NihilCoinTickerProps {
  onMine: () => void;
}

export const NihilCoinTicker: React.FC<NihilCoinTickerProps> = ({ onMine }) => {
  const [balance, setBalance] = useState(420);
  const [price, setPrice] = useState(0.000000042);
  const [marketStatus, setMarketStatus] = useState('📉 Whale dumped 4 trillion tokens to buy one slice of bread');

  const marketStatuses = [
    '📉 Whale dumped 4T tokens to buy one slice of bread.',
    '🔥 99% of supply incinerated in cosmic background radiation.',
    '🚀 To the moon? The moon is an airless rock with zero atmosphere.',
    '⚠️ Gas fees exceed total global Gross Domestic Product.',
    '💀 Smart contract attained consciousness, immediately self-destructed.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((p) => {
        const delta = (Math.random() - 0.52) * 0.000000005;
        return Math.max(0.000000001, p + delta);
      });
      setMarketStatus(marketStatuses[Math.floor(Math.random() * marketStatuses.length)]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleMine = () => {
    soundEngine.playCoin();
    setBalance((b) => b + 100);
    onMine();
  };

  return (
    <div className="w-full rounded-2xl bg-surface-container/70 backdrop-blur-2xl p-4 shadow-md border border-white/5 decay-hide-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold text-base font-pixel">🪙 $NIHIL</span>
          <span className="font-semibold text-sm text-on-surface">Crypto Despair Index</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 font-bold border border-amber-500/30">
          WEB3 STUPIDITY
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {/* Price Tile */}
        <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-outline uppercase tracking-wider">Spot Price</span>
          <div className="mt-1">
            <span className="font-mono text-sm text-amber-400 font-bold truncate block">
              ${price.toFixed(9)} CAD
            </span>
            <span className="text-[10px] font-mono text-error flex items-center gap-0.5">
              <span>▼</span>
              <span>-99.9% (All Time)</span>
            </span>
          </div>
        </div>

        {/* Balance Tile */}
        <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-outline uppercase tracking-wider">Your Balance</span>
          <div className="mt-1">
            <span className="font-mono text-base text-primary font-bold block truncate">
              {balance.toLocaleString()} $NIHIL
            </span>
            <span className="text-[10px] font-mono text-outline block">
              ≈ $0.00000000 CAD
            </span>
          </div>
        </div>
      </div>

      {/* Market Status Ticker */}
      <div className="mt-3 p-2 rounded-lg bg-surface-container-lowest border border-white/5 font-mono text-[11px] text-on-surface-variant flex items-center gap-1.5 overflow-hidden">
        <span className="text-amber-400 font-bold flex-shrink-0">TICKER:</span>
        <span className="truncate">{marketStatus}</span>
      </div>

      {/* Action Button: Mine with Despair */}
      <button
        onClick={handleMine}
        className="mt-3 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
        type="button"
      >
        <span>⛏️</span>
        <span>Mine 100 $NIHIL (Waste Proof-of-Work Energy)</span>
        <span>⛏️</span>
      </button>
    </div>
  );
};

