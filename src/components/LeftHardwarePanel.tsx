import React, { useState } from 'react';
import { IconCartridge } from './RetroIcons';
import { soundEngine } from '../lib/soundEngine';
import { HardwareUtilityBay } from './HardwareUtilityBay';

interface LeftHardwarePanelProps {
  isCartridgeInserted: boolean;
  onToggleCartridge: () => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  despair?: number;
  onLogMessage?: (msg: string) => void;
  onAddScore?: (pts: number) => void;
}

export const LeftHardwarePanel: React.FC<LeftHardwarePanelProps> = ({
  isCartridgeInserted,
  onToggleCartridge,
  scanlinesEnabled,
  onToggleScanlines,
  audioEnabled,
  onToggleAudio,
  despair = 20,
  onLogMessage,
  onAddScore,
}) => {
  const [turboMode, setTurboMode] = useState(false);

  return (
    <aside className="w-full h-full flex flex-col justify-between p-3.5 bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl font-mono text-xs select-none">
      
      {/* 1. Header with Screws */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-neutral-400 text-[10px]">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-300">
            <IconCartridge className="w-3.5 h-3.5 text-emerald-400" />
            <span>MODULE RACK-01</span>
          </div>
          <span className="font-mono text-[9px] text-neutral-500">REV: B2</span>
        </div>

        {/* 2. Cartridge Slot Bay */}
        <div className="mt-2 p-2 bg-[#08090c] border border-white/10 rounded-xl">
          <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1 flex justify-between">
            <span>CARTRIDGE BAY</span>
            <span className={isCartridgeInserted ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>
              {isCartridgeInserted ? '[LOCKED]' : '[EMPTY]'}
            </span>
          </div>

          <div className="p-1.5 bg-[#14171d] border border-white/15 rounded-lg flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-pixel text-neutral-200">
                {isCartridgeInserted ? 'NP-9000.ROM' : 'NO CARTRIDGE'}
              </span>
              <span className="text-[8px] text-neutral-500">
                {isCartridgeInserted ? 'SIZE: 512KB • CHKSUM: OK' : 'INSERT MEDIA'}
              </span>
            </div>

            <button
              onClick={() => {
                soundEngine.playPoke();
                onToggleCartridge();
              }}
              className={`px-2 py-0.5 text-[9px] font-pixel rounded cursor-pointer transition-all active:scale-95 ${
                isCartridgeInserted
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50 hover:bg-amber-900'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 hover:bg-emerald-900'
              }`}
              type="button"
            >
              {isCartridgeInserted ? 'EJECT' : 'LOAD'}
            </button>
          </div>
        </div>

        {/* 3. Hardware DIP Switches */}
        <div className="mt-2 p-2 bg-[#08090c] border border-white/10 rounded-xl space-y-1">
          <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-0.5">
            HARDWARE DIP SWITCHES
          </div>

          <label className="flex items-center justify-between cursor-pointer text-[9.5px] text-neutral-300">
            <span>CRT SCANLINES</span>
            <input
              type="checkbox"
              checked={scanlinesEnabled}
              onChange={onToggleScanlines}
              className="accent-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-[9.5px] text-neutral-300">
            <span>AUDIO CHIPTUNE</span>
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={onToggleAudio}
              className="accent-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-[9.5px] text-neutral-300">
            <span>OVERCLOCK OSC</span>
            <input
              type="checkbox"
              checked={turboMode}
              onChange={() => {
                soundEngine.playBoing();
                setTurboMode(!turboMode);
              }}
              className="accent-emerald-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 4. Modular Multi-Widget Accessory Bay (With 5 interactive modules & 3-dot selector) */}
      <HardwareUtilityBay
        isCartridgeInserted={isCartridgeInserted}
        turboMode={turboMode}
        despair={despair}
        onLogMessage={onLogMessage}
        onAddScore={onAddScore}
      />

    </aside>
  );
};
