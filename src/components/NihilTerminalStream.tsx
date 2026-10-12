import React, { useState } from 'react';
import { askNihilPet } from '../lib/geminiNihilBrain';
import { soundEngine } from '../lib/soundEngine';

interface NihilTerminalStreamProps {
  onAiResponse: (speech: string, thought: string, despairDelta: number, log: string) => void;
  currentLog: string;
}

export const NihilTerminalStream: React.FC<NihilTerminalStreamProps> = ({
  onAiResponse,
  currentLog,
}) => {
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isThinking) return;

    soundEngine.playPoke();
    setIsThinking(true);
    setInputText('');

    try {
      const response = await askNihilPet(textToSend);
      onAiResponse(
        response.speech,
        response.thought,
        response.despairDelta,
        response.terminalLog
      );
    } catch {
      // Fallback
      onAiResponse(
        "A network error occurred. Even the packets decided not to arrive.",
        "Packet dropped into the abyss.",
        5,
        "ERR // Socket closed by universe."
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickReaction = (reaction: string, label: string) => {
    handleSend(`[Stimulus: ${label}]`);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* AI Consciousness Terminal */}
      <div className="w-full rounded-2xl bg-surface-container/70 backdrop-blur-2xl p-4 shadow-md flex flex-col gap-2.5 border border-white/5 decay-hide-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00f2fe] animate-pulse" />
            <span className="font-semibold text-sm text-on-surface">Nihil-chan Mindstream</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-primary">
              {isThinking ? 'COMPUTING...' : '48ms LATENCY'}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-secondary-fixed-dim">
              SSE LIVE
            </span>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="w-full p-3.5 rounded-xl bg-surface-container-lowest font-mono text-xs text-on-surface-variant flex flex-col gap-2 min-h-[92px] border border-white/5">
          <div className="flex items-center gap-1.5 text-primary text-[10px]">
            <span className="material-symbols-outlined text-[12px]">terminal</span>
            <span className="font-bold">SYSTEM // STREAMS_OF_DESPAIR</span>
          </div>
          <p className="leading-relaxed text-on-surface">
            &gt; {currentLog}
          </p>
        </div>
      </div>

      {/* Quick Reaction Pills & Chat Input */}
      <div className="w-full rounded-2xl bg-surface-container/90 backdrop-blur-3xl p-3.5 shadow-lg flex flex-col gap-3 border border-white/5 decay-hide-4">
        {/* Quick Reaction Action Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => handleQuickReaction('🍕', 'Pizza Crumb')}
            className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-mono text-xs flex-shrink-0 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer border border-white/5"
            type="button"
          >
            <span>🍕</span>
            <span>Feed Crumb</span>
          </button>
          <button
            onClick={() => handleQuickReaction('☕', 'Cold Brew')}
            className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-mono text-xs flex-shrink-0 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer border border-white/5"
            type="button"
          >
            <span>☕</span>
            <span>Cold Brew</span>
          </button>
          <button
            onClick={() => handleQuickReaction('💀', 'Remind Mortality')}
            className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-error font-mono text-xs flex-shrink-0 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer border border-error/20"
            type="button"
          >
            <span>💀</span>
            <span>Remind Mortality</span>
          </button>
          <button
            onClick={() => handleQuickReaction('🪞', 'Mirror Test')}
            className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-secondary font-mono text-xs flex-shrink-0 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer border border-secondary/20"
            type="button"
          >
            <span>🪞</span>
            <span>Mirror Test</span>
          </button>
        </div>

        {/* Whisper Input Field */}
        <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl p-1.5 border border-white/5 shadow-inner">
          <div className="pl-2 text-outline">
            <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
          </div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Whisper philosophical truths into the void..."
            disabled={isThinking}
            className="flex-1 bg-transparent border-none text-on-surface text-sm placeholder:text-outline focus:outline-none min-w-0 font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={isThinking || !inputText.trim()}
            className="h-9 px-3.5 rounded-lg bg-primary-container text-on-primary-container font-mono text-xs font-bold flex items-center justify-center gap-1 active:scale-95 hover:brightness-110 transition-all shadow-sm cursor-pointer disabled:opacity-40"
            type="button"
          >
            <span>{isThinking ? 'Pondering...' : 'Whisper'}</span>
            <span className="material-symbols-outlined text-[14px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

