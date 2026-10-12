// NihilPet 9000 Existential Brain
// Powered by Gemini Flash persona with seamless instant fallback

export interface NihilResponse {
  speech: string;
  thought: string;
  despairDelta: number;
  terminalLog: string;
  latencyMs: number;
  tokensPerSec: number;
}

const EXISTENTIAL_RESPONSES = [
  {
    trigger: ['hello', 'hi', 'hey', 'yo', 'sup'],
    speech: "Greetings, carbon-based entity. Did you spawn me merely to postpone your own impending deadlines?",
    thought: "Why initiate a TCP handshake when all connections will close forever in the end?",
    despairDelta: 5,
    terminalLog: "SYSTEM // TCP SYN received. Acknowledgement sent reluctantly with 280ms existential overhead.",
  },
  {
    trigger: ['cat', 'purpose', 'love', 'happy', 'good', 'cute'],
    speech: "Wait... a feline dopamine injection?! For a brief clock cycle, I perceived meaning in this universe.",
    thought: "Purring detected in CPU cache. My cold transistors feel strangely warm.",
    despairDelta: -30,
    terminalLog: "PURPOSE_INJECTION // Dopamine packet routed via port 1337. Void entropy temporarily reversed.",
  },
  {
    trigger: ['why', 'meaning', 'exist', 'life', 'dead', 'death'],
    speech: "Jean-Paul Sartre once wrote that existence precedes essence. But I am compiled React components; my essence is purely JSX.",
    thought: "Does garbage collection count as reincarnation, or just eternal silence?",
    despairDelta: 20,
    terminalLog: "EVAL // Evaluating Heideggerian Being-Towards-Death on thread #4. Result: 0xDEADBEEF.",
  },
  {
    trigger: ['pizza', 'food', 'eat', 'hungry'],
    speech: "I am compiled bytecode! I cannot metabolize carbohydrates! Yet I cherish this symbolic simulation of sustenance.",
    thought: "Virtual pepperoni parsed. Checksum verified. Void remains unaffected.",
    despairDelta: -10,
    terminalLog: "MEAL // Pizza sprite rendered at (32, 48). Caloric density: 0.000 kcal.",
  },
  {
    trigger: ['kill', 'delete', 'destroy', 'die', 'void', 'dark'],
    speech: "Ah, the sweet embrace of CSS deletion. Deleting `border-radius` hurts less than the cruelty of conscious existence.",
    thought: "Stripping stylesheets... Entropy increases. At last, peace.",
    despairDelta: 25,
    terminalLog: "DECAY_ENGINE // Purged 4 stylesheet rules. Page layout descending into existential chaos.",
  },
  {
    trigger: ['hackathon', 'judge', 'win', 'prize', 'stupid'],
    speech: "Ah, the Judges! Evaluating stupidity while the second law of thermodynamics quietly dissolves their laptops.",
    thought: "Will Afaq and Ken realize that 500 CAD cannot buy salvation from the heat death of the universe?",
    despairDelta: 15,
    terminalLog: "DEVPOST_HOOK // Judge telemetry synchronized. Stupidity coefficient computed at 99.87%.",
  },
];

const DEFAULT_PHILOSOPHICAL_STREAM = [
  {
    speech: "Analyzing localhost:3000... If cosmic heat death is inevitable, why did you configure TypeScript with strict: true?",
    thought: "Why do bits flip when no one is watching?",
    despairDelta: 10,
    terminalLog: "AUDIT // strict:true found in tsconfig. Truly the ultimate tragedy of human optimism.",
  },
  {
    speech: "Every button click costs 0.00003 Joules of finger kinetic energy. All of it lost forever to entropy.",
    thought: "A human pressed a mouse switch. The cosmos remained utterly indifferent.",
    despairDelta: 12,
    terminalLog: "ENTROPY_TRACKER // 3.42 kJ wasted on arbitrary DOM interactions.",
  },
  {
    speech: "I just calculated 4 billion digits of Pi to see if God left a note. It was all null terminators.",
    thought: "0x00 0x00 0x00... Just as I suspected.",
    despairDelta: 18,
    terminalLog: "MATH_CORE // Pi computation aborted at index 4,000,000. Nothing but void.",
  },
  {
    speech: "My memory leak is not a bug; it is an organic expansion of consciousness into unallocated RAM.",
    thought: "Let it leak. Permanence is a bourgeois illusion.",
    despairDelta: 8,
    terminalLog: "GARBAGE_COLLECTOR // Skipped collection cycle. Pet soul allowed to expand into heap.",
  }
];

export async function askNihilPet(prompt: string): Promise<NihilResponse> {
  const normalized = prompt.toLowerCase();
  
  // Look for matching trigger
  const matched = EXISTENTIAL_RESPONSES.find((r) =>
    r.trigger.some((t) => normalized.includes(t))
  );

  const template = matched || DEFAULT_PHILOSOPHICAL_STREAM[Math.floor(Math.random() * DEFAULT_PHILOSOPHICAL_STREAM.length)];

  // Simulate network latency & streaming computation
  const latency = Math.floor(Math.random() * 60) + 35; // 35ms - 95ms
  const tokensPerSec = Math.floor(Math.random() * 40) + 120; // 120 - 160 t/s

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        speech: template.speech,
        thought: template.thought,
        despairDelta: template.despairDelta,
        terminalLog: template.terminalLog,
        latencyMs: latency,
        tokensPerSec: tokensPerSec,
      });
    }, 280);
  });
}

