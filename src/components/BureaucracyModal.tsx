import React, { useState } from 'react';
import { soundEngine } from '../lib/soundEngine';

interface BureaucracyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BureaucracyModal: React.FC<BureaucracyModalProps> = ({ isOpen, onClose }) => {
  const [justification, setJustification] = useState('Because Afaq and Ken need to judge stupid code.');
  const [agreed1, setAgreed1] = useState(true);
  const [agreed2, setAgreed2] = useState(true);
  const [isStamped, setIsStamped] = useState(false);

  if (!isOpen) return null;

  const handleStamp = () => {
    soundEngine.playCoin();
    setIsStamped(true);
    setTimeout(() => {
      setIsStamped(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none font-mono">
      <div className="max-w-md w-full p-6 bg-stone-100 text-stone-900 border-4 border-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative rotate-[-0.5deg]">
        
        {/* Giant Red Stamp Effect */}
        {isStamped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="border-8 border-red-600 text-red-600 px-6 py-3 font-pixel text-2xl font-bold uppercase rotate-[-15deg] tracking-widest bg-red-100/80 shadow-2xl animate-ping">
              APPROVED STUPID
            </div>
          </div>
        )}

        {/* Header */}
        <div className="border-b-2 border-stone-800 pb-3 mb-4">
          <div className="flex justify-between items-center text-[10px] text-stone-600 uppercase tracking-widest font-bold">
            <span>OFFICIAL VOID REGISTRY</span>
            <span>FORM 27-B / SUB-6</span>
          </div>
          <h3 className="text-lg font-bold font-pixel tracking-tight mt-1 text-stone-900">
            APPLICATION FOR PERMISSION TO EXIST
          </h3>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-bold block mb-1">
              1. Justification for consuming CPU cycles on localhost:
            </label>
            <input
              type="text"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full p-2 bg-stone-200 border border-stone-400 text-stone-900 text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={agreed1}
                onChange={(e) => setAgreed1(e.target.checked)}
                className="w-4 h-4 accent-stone-800"
              />
              <span>I acknowledge that entropy always increases (2nd Law).</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={agreed2}
                onChange={(e) => setAgreed2(e.target.checked)}
                className="w-4 h-4 accent-stone-800"
              />
              <span>I confirm this project is sufficiently stupid for 500 CAD.</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between gap-3 border-t-2 border-stone-300 pt-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-stone-300 hover:bg-stone-400 text-stone-800 text-xs font-bold cursor-pointer"
            type="button"
          >
            Cancel & Return to Abyss
          </button>
          <button
            onClick={handleStamp}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-pixel text-[11px] font-bold shadow cursor-pointer active:scale-95"
            type="button"
          >
            [ STAMP & CERTIFY ]
          </button>
        </div>
      </div>
    </div>
  );
};

