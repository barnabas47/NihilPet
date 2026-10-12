import React, { useState } from 'react';
import { StupidApiResponse } from '../lib/types';
import { soundEngine } from '../lib/soundEngine';

interface StupidApiDrawerProps {
  despair: number;
}

export const StupidApiDrawer: React.FC<StupidApiDrawerProps> = ({ despair }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/nihilism/status');
  const [apiResponse, setApiResponse] = useState<StupidApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const endpoints = [
    {
      path: '/api/v1/nihilism/status',
      method: 'GET',
      desc: 'Retrieve pet existential consciousness metrics and cosmic entropy score.',
    },
    {
      path: '/api/v1/nihilism/excuse',
      method: 'GET',
      desc: 'Generate thermodynamically sound excuses to cancel daily standups.',
    },
    {
      path: '/api/v1/nihilism/css-destroyer',
      method: 'POST',
      desc: 'Synthesizes cursed CSS snippets that induce existential dread.',
    },
  ];

  const handleTestApi = () => {
    soundEngine.playPoke();
    setIsLoading(true);

    setTimeout(() => {
      let payload: Record<string, unknown> = {};

      if (selectedEndpoint === '/api/v1/nihilism/status') {
        payload = {
          pet_name: "Nihil-chan",
          existential_state: despair > 75 ? "CRIPPLING_DREAD" : despair > 40 ? "ACTIVE_ENNUI" : "TRANSIENT_COMFORT",
          despair_percent: despair,
          will_to_live_cpu_cycles: Math.max(0, 100 - despair) * 1024,
          cosmic_entropy_rate: "0.0039 J/K·s",
          recommended_action: "Cease typing immediately; keyboard plastic outlives your descendants.",
          philosophical_grounding: "Jean-Paul Sartre: L'Être et le Néant (1943)",
        };
      } else if (selectedEndpoint === '/api/v1/nihilism/excuse') {
        const excuses = [
          "Cannot attend sprint planning: The Sun will expand into a Red Giant in 5 billion years, rendering Jira tickets moot.",
          "PR review postponed: Storing code in Git creates temporary magnetic dipoles that accelerate local thermodynamic entropy.",
          "Feature deployment cancelled: According to Camus, pushing to prod is merely rolling Sisyphus's boulder up AWS EC2.",
          "Standup missed: Contemplated the infinite silence of the spaces between CSS selectors.",
        ];
        payload = {
          excuse_id: `EXCUSE-${Math.floor(Math.random() * 8999 + 1000)}`,
          excuse_text: excuses[Math.floor(Math.random() * excuses.length)],
          scientific_validity: "99.98% Thermodynamic Consensus",
          boss_acceptance_probability: "0.001%",
        };
      } else {
        payload = {
          status: "SUCCESSFULLY_CURSED",
          affected_dom_nodes: 42,
          cursed_css: "* { font-family: 'Times New Roman' !important; border: 1px dashed #666 !important; filter: grayscale(80%); }",
          dread_severity: "MAXIMAL",
          warning: "Applying this CSS will void all product designer warranties.",
        };
      }

      setApiResponse({
        endpoint: selectedEndpoint,
        status: 200,
        payload,
        executionMs: Math.floor(Math.random() * 30) + 12,
      });
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="w-full rounded-2xl bg-surface-container/70 backdrop-blur-2xl p-4 shadow-md border border-white/5 decay-hide-4">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary-container">api</span>
          <span className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
            Stupidest REST API Explorer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-bold">
            PRIZE TRACK #7 ($67 CAD)
          </span>
          <span className="material-symbols-outlined text-outline text-[18px]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </div>

      {/* Expanded API Playground */}
      {isOpen && (
        <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-white/5">
          <p className="text-xs text-on-surface-variant font-mono">
            Directly test the endpoints submitted for the Stupidest API Prize Track.
          </p>

          {/* Endpoint Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {endpoints.map((ep) => (
              <button
                key={ep.path}
                onClick={() => setSelectedEndpoint(ep.path)}
                className={`flex flex-col items-start p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedEndpoint === ep.path
                    ? 'bg-primary-container/10 border-primary-container/40 text-primary'
                    : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:bg-surface-container'
                }`}
                type="button"
              >
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                  <span className={`px-1 py-0.5 rounded text-[9px] ${
                    ep.method === 'GET' ? 'bg-emerald-950 text-emerald-400' : 'bg-purple-950 text-purple-400'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="truncate">{ep.path.replace('/api/v1/nihilism', '')}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Test Action Bar */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant truncate">
              <span className="text-primary-container font-bold">URL:</span>
              <span className="text-primary truncate">https://nihilpet.stupid/api/v1{selectedEndpoint.replace('/api/v1', '')}</span>
            </div>
            <button
              onClick={handleTestApi}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_10px_rgba(0,242,254,0.3)] cursor-pointer flex-shrink-0 flex items-center gap-1"
              type="button"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span className="material-symbols-outlined text-[14px]">send</span>
              )}
              <span>Execute Request</span>
            </button>
          </div>

          {/* JSON Response Window */}
          {apiResponse && (
            <div className="mt-2 p-3 rounded-xl bg-surface-container-lowest border border-white/5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[10px] text-outline">
                <span className="text-emerald-400 font-bold">HTTP {apiResponse.status} OK</span>
                <span>Latency: {apiResponse.executionMs}ms</span>
                <span>Content-Type: application/json</span>
              </div>
              <pre className="mt-2 text-primary/90 overflow-x-auto text-[11px] leading-relaxed max-h-48">
                {JSON.stringify(apiResponse.payload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

