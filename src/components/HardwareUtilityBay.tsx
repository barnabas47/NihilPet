import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../lib/soundEngine';

export type UtilityModuleId = 'scope' | 'calc' | 'weather' | 'crypto' | 'bio';

interface HardwareUtilityBayProps {
  isCartridgeInserted: boolean;
  turboMode: boolean;
  despair: number;
  onLogMessage?: (msg: string) => void;
  onAddScore?: (pts: number) => void;
}

const MODULES_INFO: { id: UtilityModuleId; label: string; badge: string }[] = [
  { id: 'scope', label: 'WAVE OSCILLOSCOPE', badge: 'CH-1' },
  { id: 'calc', label: '8-BIT POCKET CALC', badge: 'MATH-Z80' },
  { id: 'weather', label: 'GLOBAL RADAR API', badge: 'OPEN-METEO' },
  { id: 'crypto', label: 'VOID ASSET EXCHANGE', badge: 'MARKET' },
  { id: 'bio', label: 'SOMATIC EKG VITALS', badge: 'BIO-NODE' },
];

export const HardwareUtilityBay: React.FC<HardwareUtilityBayProps> = ({
  isCartridgeInserted,
  turboMode,
  despair,
  onLogMessage,
  onAddScore,
}) => {
  const [activeModule, setActiveModule] = useState<UtilityModuleId>('scope');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Calculator State
  const [calcInput, setCalcInput] = useState<string>('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);

  // 2. Weather State (Random Global Cities from Open-Meteo)
  const CITIES = [
    { name: 'TOKYO, JP', lat: 35.6762, lon: 139.6503 },
    { name: 'REYKJAVIK, IS', lat: 64.1466, lon: -21.9426 },
    { name: 'HONOLULU, US', lat: 21.3069, lon: -157.8583 },
    { name: 'SVALBARD, NO', lat: 78.2232, lon: 15.6267 },
    { name: 'BUDAPEST, HU', lat: 47.4979, lon: 19.0402 },
    { name: 'DEATH VALLEY', lat: 36.5323, lon: -116.9325 },
    { name: 'CHERNOBYL, UA', lat: 51.2763, lon: 30.2218 },
  ];
  const [cityIndex, setCityIndex] = useState(0);
  const [weatherData, setWeatherData] = useState<{
    city: string;
    temp: number;
    wind: number;
    code: number;
    loading: boolean;
  }>({
    city: 'TOKYO, JP',
    temp: 18.5,
    wind: 12.3,
    code: 1,
    loading: false,
  });

  // 3. Crypto / Cursed Asset State
  const [voidPrice, setVoidPrice] = useState<number>(0.00042);
  const [pizzaPrice, setPizzaPrice] = useState<number>(420.69);
  const [entropyRate, setEntropyRate] = useState<number>(99.8);
  const [priceHistory, setPriceHistory] = useState<number[]>([10, 14, 12, 18, 22, 19, 26, 30, 28, 35]);

  // Oscilloscope Animation
  useEffect(() => {
    if (activeModule !== 'scope') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const renderScope = () => {
      ctx.fillStyle = '#060a06';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#0e2b0e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      ctx.strokeStyle = '#38e538';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const w = canvas.width;
      const h = canvas.height;

      for (let x = 0; x < w; x++) {
        const freq = turboMode ? 0.08 : 0.04;
        const amp = isCartridgeInserted ? 14 : 2;
        const y = h / 2 + Math.sin(x * freq + phase) * amp + (Math.random() - 0.5) * 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += turboMode ? 0.25 : 0.08;
      animId = requestAnimationFrame(renderScope);
    };

    renderScope();
    return () => cancelAnimationFrame(animId);
  }, [activeModule, isCartridgeInserted, turboMode]);

  // Live Crypto Ticker Simulation
  useEffect(() => {
    if (activeModule !== 'crypto') return;
    const ticker = setInterval(() => {
      setVoidPrice((p) => Math.max(0.00001, +(p + (Math.random() - 0.48) * 0.00003).toFixed(5)));
      setPizzaPrice((p) => +(p + (Math.random() - 0.49) * 4).toFixed(2));
      setEntropyRate((e) => +(e + (Math.random() - 0.5) * 1.5).toFixed(1));
      setPriceHistory((prev) => [...prev.slice(-9), Math.floor(Math.random() * 25 + 15)]);
    }, 1800);
    return () => clearInterval(ticker);
  }, [activeModule]);

  // Fetch Weather for selected city
  const fetchWeather = async (idx: number) => {
    const target = CITIES[idx];
    setWeatherData((prev) => ({ ...prev, city: target.name, loading: true }));
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${target.lat}&longitude=${target.lon}&current_weather=true`
      );
      if (res.ok) {
        const data = await res.json();
        setWeatherData({
          city: target.name,
          temp: Math.round(data.current_weather.temperature),
          wind: Math.round(data.current_weather.windspeed),
          code: data.current_weather.weathercode,
          loading: false,
        });
        if (onLogMessage) onLogMessage(`WEATHER RADAR: ${target.name} ${data.current_weather.temperature}°C FETCHED.`);
        return;
      }
    } catch {}
    // Fallback simulation
    const mockTemp = Math.floor(Math.random() * 35) - 5;
    setWeatherData({
      city: target.name,
      temp: mockTemp,
      wind: Math.floor(Math.random() * 25),
      code: 1,
      loading: false,
    });
  };

  const cycleCity = () => {
    soundEngine.playPoke();
    const nextIdx = (cityIndex + 1) % CITIES.length;
    setCityIndex(nextIdx);
    fetchWeather(nextIdx);
  };

  // Calculator logic
  const handleCalcBtn = (char: string) => {
    soundEngine.playPoke();
    if (char === 'C') {
      setCalcInput('0');
      setCalcPrev(null);
      setCalcOp(null);
      return;
    }
    if (['+', '-', '*', '/'].includes(char)) {
      setCalcPrev(parseFloat(calcInput));
      setCalcOp(char);
      setCalcInput('0');
      return;
    }
    if (char === '=') {
      if (calcPrev !== null && calcOp) {
        const cur = parseFloat(calcInput);
        let res = 0;
        if (calcOp === '+') res = calcPrev + cur;
        if (calcOp === '-') res = calcPrev - cur;
        if (calcOp === '*') res = calcPrev * cur;
        if (calcOp === '/') res = cur !== 0 ? calcPrev / cur : 404;
        setCalcInput(String(Math.round(res * 100) / 100).slice(0, 8));
        setCalcPrev(null);
        setCalcOp(null);
        if (onAddScore) onAddScore(10);
      }
      return;
    }
    // Digit entry
    setCalcInput((prev) => (prev === '0' ? char : (prev + char).slice(0, 8)));
  };

  // Switch modules
  const currentModIdx = MODULES_INFO.findIndex((m) => m.id === activeModule);
  const cycleModule = (dir: 1 | -1) => {
    soundEngine.playBoing();
    const nextIdx = (currentModIdx + dir + MODULES_INFO.length) % MODULES_INFO.length;
    setActiveModule(MODULES_INFO[nextIdx].id);
  };

  // EKG Heart Rate based on despair
  const heartBpm = Math.round(72 + (despair / 100) * 88);

  // Widget Drawer / Menu Popover State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Touch & Mouse Horizontal Drag / Swipe Gesture State
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (clientX: number) => {
    setDragStartX(clientX);
    setIsDragging(true);
    setDragOffsetX(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging || dragStartX === null) return;
    const diff = clientX - dragStartX;
    setDragOffsetX(Math.max(-80, Math.min(80, diff)));
  };

  const handlePointerUp = () => {
    if (!isDragging || dragStartX === null) return;
    if (dragOffsetX < -35) {
      cycleModule(1);
    } else if (dragOffsetX > 35) {
      cycleModule(-1);
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragOffsetX(0);
  };

  return (
    <div className="relative my-2 p-2.5 bg-[#0a0c10] border border-white/10 rounded-xl flex flex-col justify-between select-none font-mono shadow-md">
      {/* 1. Header with Mode Selector, Carousel Navigation & Widget Drawer Trigger */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[9px] text-neutral-400">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{MODULES_INFO[currentModIdx].label}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Drawer Launcher Button */}
          <button
            onClick={() => {
              soundEngine.playBoing();
              setIsDrawerOpen(!isDrawerOpen);
            }}
            className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/50 hover:bg-cyan-900 text-cyan-300 font-pixel text-[8px] cursor-pointer transition-all active:scale-95"
            type="button"
            title="Open Interactive Widget Library Menu"
          >
            {isDrawerOpen ? '[CLOSE]' : '[WIDGETS]'}
          </button>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => cycleModule(-1)}
              className="px-1.5 py-0.2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-pixel text-[8px] cursor-pointer"
              type="button"
              title="Previous Hardware Widget"
            >
              &lt;
            </button>
            <button
              onClick={() => cycleModule(1)}
              className="px-1.5 py-0.2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-pixel text-[8px] cursor-pointer"
              type="button"
              title="Next Hardware Widget"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Draggable Widget Stage (Comfortable 105px Height - No Cramping / No Cutoffs!) */}
      <div
        className="relative h-[105px] my-1.5 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
        style={{
          transform: `translateX(${dragOffsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* MODE 1: WAVE OSCILLOSCOPE */}
        {activeModule === 'scope' && (
          <div className="w-full h-full bg-[#060a06] border border-emerald-900/60 rounded-lg overflow-hidden shadow-inner flex flex-col justify-between">
            <canvas ref={canvasRef} width={260} height={80} className="w-full flex-1 object-cover" />
            <div className="px-2 py-0.5 bg-black/60 flex justify-between text-[7px] text-emerald-500 font-pixel">
              <span>FREQ: {turboMode ? '240Hz (TURBO)' : '60Hz'}</span>
              <span>SWIPE &lt; &gt; TO SWITCH</span>
            </div>
          </div>
        )}

        {/* MODE 2: 8-BIT WORKING POCKET CALCULATOR */}
        {activeModule === 'calc' && (
          <div className="w-full h-full bg-[#12151d] border border-white/10 rounded-lg p-2 flex flex-col justify-between shadow-inner">
            <div className="bg-[#060a06] border border-emerald-900/50 rounded px-2 py-1 text-right font-pixel text-emerald-400 text-sm tracking-wider">
              {calcInput}
            </div>
            <div className="grid grid-cols-4 gap-1 text-[8.5px] font-pixel flex-1 pt-1">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', 'C', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCalcBtn(btn);
                  }}
                  className={`flex items-center justify-center py-1 rounded cursor-pointer active:scale-90 transition-all ${
                    btn === '='
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                      : btn === 'C'
                      ? 'bg-rose-900 text-rose-200'
                      : ['+', '-', '*', '/'].includes(btn)
                      ? 'bg-amber-950 text-amber-300 border border-amber-600/30'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  }`}
                  type="button"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODE 3: REAL-TIME GLOBAL WEATHER RADAR */}
        {activeModule === 'weather' && (
          <div className="w-full h-full bg-[#09111e] border border-cyan-900/50 rounded-lg p-2 flex flex-col justify-between text-cyan-300 font-mono text-[9px]">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] text-cyan-400 truncate font-bold">
                {weatherData.city}
              </span>
              <button
                onClick={cycleCity}
                className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-pixel text-[7px] hover:bg-cyan-900 cursor-pointer"
                type="button"
              >
                [CYCLE CITY]
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-baseline gap-1">
                <span className="font-pixel text-xl text-white font-bold">
                  {weatherData.loading ? '...' : `${weatherData.temp}°C`}
                </span>
                <span className="text-[8px] text-neutral-400">ATMOS</span>
              </div>
              <div className="text-right text-[8px] text-cyan-400/80">
                <div>WIND: {weatherData.wind} km/h</div>
                <div>BARO: 1013 hPa</div>
              </div>
            </div>

            <div className="text-[7px] font-pixel text-neutral-500 truncate">
              RADAR SYNC: OPEN-METEO SAT-LINK OK
            </div>
          </div>
        )}

        {/* MODE 4: CURSED ASSET EXCHANGE / TICKER */}
        {activeModule === 'crypto' && (
          <div className="w-full h-full bg-[#140f1a] border border-purple-900/50 rounded-lg p-2 flex flex-col justify-between text-[9px] font-mono text-purple-300">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[8px] text-amber-400 font-bold">
                VOID/USD: ${voidPrice}
              </span>
              <span className="font-pixel text-[7px] text-emerald-400">
                +14.2% ▲
              </span>
            </div>

            {/* Mini SVG Sparkline */}
            <div className="h-6 flex items-end gap-1 px-1 py-0.5 bg-black/40 rounded border border-white/5">
              {priceHistory.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-purple-400/80 rounded-t-xs transition-all duration-300"
                  style={{ height: `${(val / 40) * 100}%` }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[8px]">
              <span className="text-neutral-400">PIZZA/ETH: ${pizzaPrice}</span>
              <button
                onClick={() => {
                  soundEngine.playCoin();
                  if (onLogMessage) onLogMessage(`EXCHANGE: BOUGHT 1,000 VOIDCOIN AT $${voidPrice}!`);
                  if (onAddScore) onAddScore(25);
                }}
                className="px-1.5 py-0.2 rounded bg-purple-950 border border-purple-500/50 text-purple-200 font-pixel text-[7px] hover:bg-purple-900 cursor-pointer"
                type="button"
              >
                [BUY DIP]
              </button>
            </div>
          </div>
        )}

        {/* MODE 5: SOMATIC BIOMETRICS & EKG */}
        {activeModule === 'bio' && (
          <div className="w-full h-full bg-[#180d0e] border border-rose-900/50 rounded-lg p-2 flex flex-col justify-between text-[9px] font-mono text-rose-300">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[8px] text-rose-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>EKG MONITOR</span>
              </span>
              <span className="font-pixel text-xs text-rose-400 font-bold">
                {heartBpm} BPM
              </span>
            </div>

            {/* EKG Simulated Wave */}
            <div className="h-4 flex items-center justify-center font-pixel text-[8px] text-rose-400 tracking-tighter">
              _/\_/\___/\_/\___/\_
            </div>

            <div className="grid grid-cols-2 text-[8px] text-neutral-400 border-t border-white/5 pt-0.5">
              <span>CORE: 38.4°C</span>
              <span className="text-right">ANXIETY: {despair}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Interactive 3-Dot Switcher (Directly Addressing the User Request!) */}
      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-neutral-500">
        <div className="flex items-center gap-1.5" title="Click dots to switch hardware modules">
          {MODULES_INFO.map((mod, idx) => {
            const isActive = mod.id === activeModule;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  soundEngine.playBoing();
                  setActiveModule(mod.id);
                }}
                className={`transition-all cursor-pointer ${
                  isActive
                    ? 'w-3 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                    : 'w-1.5 h-1.5 rounded-full bg-neutral-700 hover:bg-neutral-500'
                }`}
                type="button"
                title={`Switch to ${mod.label}`}
              />
            );
          })}
        </div>

        <span className="font-mono text-[8px] text-neutral-400 flex items-center gap-1">
          <span className="opacity-60">SWIPE ↔</span>
          <span className="text-cyan-400 font-pixel">BAY: {MODULES_INFO[currentModIdx].badge}</span>
        </span>
      </div>

      {/* 4. Drop-in Interactive Widget Drawer Menu (Phone-Style Widget Tray) */}
      {isDrawerOpen && (
        <div className="absolute inset-0 bg-[#08090d]/95 backdrop-blur-sm z-30 rounded-xl p-2.5 flex flex-col justify-between border border-cyan-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="font-pixel text-[9px] text-cyan-300 uppercase tracking-wider font-bold">
              📱 HARDWARE WIDGET TRAY
            </span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-pixel text-[8px] cursor-pointer"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1.5 my-1 overflow-y-auto max-h-[110px] pr-0.5">
            {MODULES_INFO.map((mod) => {
              const isSelected = mod.id === activeModule;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    soundEngine.playBoing();
                    setActiveModule(mod.id);
                    setIsDrawerOpen(false);
                  }}
                  className={`flex items-center justify-between p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400/80 text-cyan-200'
                      : 'bg-[#12151e] border-white/5 hover:border-white/20 text-neutral-300'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-neutral-600'
                      }`}
                    />
                    <span className="font-pixel text-[8px]">{mod.label}</span>
                  </div>
                  <span className="font-mono text-[7px] text-neutral-500">
                    [{mod.badge}]
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-1 border-t border-white/10 text-[7px] text-neutral-500 text-center font-pixel">
            CLICK ANY WIDGET TO MOUNT INTO RACK BAY
          </div>
        </div>
      )}
    </div>
  );
};
