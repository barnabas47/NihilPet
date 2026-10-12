import React, { useEffect, useRef } from 'react';

interface CrtStaticNoiseProps {
  onPowerOn: () => void;
}

export const CrtStaticNoise: React.FC<CrtStaticNoiseProps> = ({ onPowerOn }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 160);
    const height = (canvas.height = 140);
    const imgData = ctx.createImageData(width, height);
    const buffer32 = new Uint32Array(imgData.data.buffer);

    const renderNoise = () => {
      const len = buffer32.length;
      for (let i = 0; i < len; i++) {
        // High contrast black & white retro static noise
        const val = Math.random() < 0.5 ? 0xff101510 : 0xff8bac0f;
        buffer32[i] = val;
      }
      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(renderNoise);
    };

    renderNoise();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#0f380f] p-4 select-none">
      {/* Canvas Pixel Static */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-40" />

      {/* Retro Signal Box */}
      <div className="relative z-10 flex flex-col items-center bg-[#0f380f]/90 border-2 border-[#8bac0f] p-4 text-center shadow-lg max-w-[220px]">
        <div className="text-[10px] font-pixel text-[#8bac0f] tracking-widest uppercase mb-1">
          [ NO SIGNAL ]
        </div>
        <div className="text-[8px] font-mono text-[#9bbc0f] mb-3">
          ROM NOT INITIALIZED
        </div>

        {/* Big Retro Boot Button */}
        <button
          onClick={onPowerOn}
          className="w-full py-2.5 px-3 bg-[#8bac0f] text-[#0f380f] font-pixel text-[9px] font-bold border-2 border-[#9bbc0f] hover:bg-[#9bbc0f] active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider"
          type="button"
        >
          [ BOOT ROM ]
        </button>
      </div>
    </div>
  );
};
