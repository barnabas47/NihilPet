export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_CONTACT',
    title: 'First Contact',
    description: 'Poked Nihil-chan for the first time. Somatic trauma initiated.',
    points: 100,
    icon: '[!]',
    unlocked: false,
  },
  {
    id: 'CARB_OVERFLOW',
    title: 'Stomachal Buffer Overflow',
    description: 'Fed Nihil-chan 8 pizzas in 3 seconds until it vomited.',
    points: 1500,
    icon: '[#]',
    unlocked: false,
  },
  {
    id: 'CONCUSSION_COMA',
    title: 'Kinetic Brain Trauma',
    description: 'Poked 12 times in under 3 seconds until Nihil-chan was knocked out.',
    points: 1200,
    icon: '[@]',
    unlocked: false,
  },
  {
    id: 'VOID_WALKER',
    title: 'Edge of Nothingness',
    description: 'Survived at over 85% Despair without collapsing.',
    points: 2000,
    icon: '[~]',
    unlocked: false,
  },
  {
    id: 'POINT_HOARDER',
    title: 'Score Maximizer',
    description: 'Accumulated over 20,000 entropy points in a single session.',
    points: 2500,
    icon: '[$]',
    unlocked: false,
  },
  {
    id: 'TESSERACT_WITNESS',
    title: 'Fourth Dimension Witness',
    description: 'Rolled the 1% legendary 4D Hypercube Transcendence.',
    points: 5000,
    icon: '[4D]',
    unlocked: false,
  },
  {
    id: 'GOLDEN_SLICE',
    title: 'The Golden Slice',
    description: 'Rolled the 1% legendary Pizza Satori and froze the clock.',
    points: 5000,
    icon: '[*]',
    unlocked: false,
  },
  {
    id: 'ZERO_DAY_EXPLOIT',
    title: 'Zero-Day Root Exploit',
    description: 'Rolled the 1% legendary Reality Buffer Overflow.',
    points: 5000,
    icon: '[0x]',
    unlocked: false,
  },
  {
    id: 'COSMIC_ANOMALY',
    title: 'Cosmic Anomaly',
    description: 'Rolled the 1% legendary Supernova and unlocked Wizard skin.',
    points: 5000,
    icon: '[+]',
    unlocked: false,
  },
  {
    id: 'FASHION_VICTIM',
    title: 'Substrate Fashionista',
    description: 'Cycled through all 7 hardware skin variants.',
    points: 800,
    icon: '[S]',
    unlocked: false,
  },
  {
    id: 'HICCUP_SAVIOR',
    title: 'Cosmic Defibrillator',
    description: 'Scared away random cosmic hiccups using a hardware JOLT.',
    points: 1000,
    icon: '[Z]',
    unlocked: false,
  },
  {
    id: 'CART_PULLER',
    title: 'Hot-Swap Vandal',
    description: 'Ejected the ROM cartridge while the Z80 CPU was running.',
    points: 600,
    icon: '[R]',
    unlocked: false,
  },
  {
    id: 'SURVIVOR',
    title: 'Stubborn Optimist',
    description: 'Survive for over 3 minutes with Will to Live above 75%.',
    points: 3000,
    icon: '[H]',
    unlocked: false,
  },
  {
    id: 'OVERCLOCK_MANIAC',
    title: 'Thermal Dissipator',
    description: 'Triggered the Overclock status effect 3 times.',
    points: 1500,
    icon: '[>>]',
    unlocked: false,
  },
  {
    id: 'FIRST_FLATLINE',
    title: 'Welcome to Thermal Death',
    description: 'Experienced your first Game Over flatline.',
    points: 500,
    icon: '[X]',
    unlocked: false,
  },
  {
    id: 'NIRVANA_MASTER',
    title: 'Pixel Nirvana Achieved',
    description: 'Reached session completion with pure zen harmony.',
    points: 10000,
    icon: '[ZEN]',
    unlocked: false,
  },
];
