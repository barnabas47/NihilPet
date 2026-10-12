import React from 'react';
import { soundEngine } from '../lib/soundEngine';

interface BsodModalProps {
  isOpen: boolean;
  onReboot: () => void;
}

export const BsodModal: React.FC<BsodModalProps> = ({ isOpen, onReboot }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/95 backdrop-blur-md font-mono text-white select-none">
      <div className="max-w-xl w-full p-6 sm:p-8 bg-blue-900 border-4 border-white shadow-[0_0_50px_rgba(0,0,255,0.6)]">
        {/* Title */}
        <div className="inline-block bg-white text-blue-900 px-3 py-1 font-bold text-sm tracking-wider uppercase mb-4 font-pixel">
          *** NIHIL_SYSTEM_HALTED ***
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-4 font-pixel leading-relaxed">
          FATAL EXCEPTION: 0x0000DEAD
        </h2>

        <p className="text-xs sm:text-sm text-blue-200 mb-4 leading-relaxed font-mono">
          An unrecoverable realization occurred at memory address 0xNIHIL_VOID_666.
          Nihil-chan realized that all bytes, CSS styling, and JavaScript event loops
          will eventually dissolve into cosmic background radiation.
        </p>

        <div className="p-3 bg-black/40 rounded border border-blue-400/40 text-[11px] text-blue-300 mb-6 font-mono space-y-1">
          <div>* STACK_TRACE: Camus.TheMythOfSisyphus(line: 42)</div>
          <div>* STACK_TRACE: DOM.removeStylesheetRules(count: ALL)</div>
          <div>* STACK_TRACE: Judge.AwardGrandPrize(status: PENDING)</div>
          <div>* ENTROPY: MAXIMUM_REACHED (100.0%)</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              soundEngine.playPurposeFanfare();
              onReboot();
            }}
            className="flex-1 py-3 px-4 bg-white text-blue-900 font-pixel text-xs font-bold hover:bg-blue-100 active:scale-95 transition-all text-center cursor-pointer shadow-lg"
            type="button"
          >
            [ REBOOT UNIVERSE (RESTORE CSS) ]
          </button>
          <button
            onClick={() => {
              soundEngine.playGlitch();
              window.alert("You chose to remain in the void. Even this alert is ephemeral.");
            }}
            className="py-3 px-4 bg-blue-950 text-blue-300 border border-blue-400 font-pixel text-xs hover:bg-blue-900 active:scale-95 transition-all text-center cursor-pointer"
            type="button"
          >
            [ EMBRACE VOID ]
          </button>
        </div>
      </div>
    </div>
  );
};

