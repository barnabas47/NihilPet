export type PetMood = 
  | 'idle' 
  | 'poked' 
  | 'eating' 
  | 'contemplating' 
  | 'despair' 
  | 'glitch' 
  | 'bliss';

export type CssDecayStage = 0 | 1 | 2 | 3 | 4 | 5;

export interface UselessMetrics {
  voidProximity: number; // e.g. 84.7 parsecs
  sighsPerMin: number; // e.g. 42.0
  rulesPurged: number; // e.g. 19
  heatDeathSeconds: number; // e.g. 412
  energyWastedKj: number; // e.g. 3.42
  purposelessClicks: number;
}

export interface DialogueMessage {
  id: string;
  sender: 'nihil' | 'user' | 'system';
  text: string;
  timestamp: string;
}

export interface StupidApiResponse {
  endpoint: string;
  status: number;
  payload: Record<string, unknown>;
  executionMs: number;
}

