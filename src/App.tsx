import React, { useState, useEffect, useRef } from 'react';
import { PetMood, CssDecayStage } from './lib/types';
import { soundEngine } from './lib/soundEngine';
import { useCssDecay } from './hooks/useCssDecay';
import { TamagotchiDevice, FeedbackPillData, ActiveQte } from './components/TamagotchiDevice';
import { NihilHat } from './components/NihilPetSprite';
import { LeftHardwarePanel } from './components/LeftHardwarePanel';
import { RightTelemetryPanel, ActiveStatusEffect } from './components/RightTelemetryPanel';
import { INITIAL_ACHIEVEMENTS, Achievement } from './lib/achievements';
import { AchievementToast } from './components/AchievementToast';
import { AchievementModal } from './components/AchievementModal';
import { WardrobeModal, LcdPalette } from './components/WardrobeModal';

export const App: React.FC = () => {
  // Power & Hardware State
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [isCartridgeInserted, setIsCartridgeInserted] = useState(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Entropy Session Clock (Default 360s = 6 mins, strictly < 10 mins)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(360);
  const [timeSurvivedSeconds, setTimeSurvivedSeconds] = useState(0);
  const [sessionEnding, setSessionEnding] = useState<'none' | 'nirvana'>('none');
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [autopsyReport, setAutopsyReport] = useState<string>('');

  // Score System & High Score
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nihilpet_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Pet State & Customization
  const [petName, setPetName] = useState<string>(() => {
    try {
      return localStorage.getItem('nihilpet_name') || 'Nihil-chan';
    } catch {
      return 'Nihil-chan';
    }
  });
  const [activePalette, setActivePalette] = useState<LcdPalette>(() => {
    try {
      return (localStorage.getItem('nihilpet_palette') as LcdPalette) || 'dmg';
    } catch {
      return 'dmg';
    }
  });
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);

  // Background Music (BGM) State (8-Bit Procedural Pokémon Town Loop)
  const [bgmLevel, setBgmLevel] = useState<number>(0);
  const [isBgmActive, setIsBgmActive] = useState<boolean>(false);

  const [despair, setDespair] = useState<number>(20);
  const [mood, setMood] = useState<PetMood>('idle');
  const [thought, setThought] = useState<string>('Why do bits flip when no one is watching?');
  const [activeHat, setActiveHat] = useState<NihilHat>('none');
  const [activeStatusText, setActiveStatusText] = useState<string>('[NORMAL]');

  // Gag & Animation States
  const [isHypercube, setIsHypercube] = useState(false);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [isScreenInverted, setIsScreenInverted] = useState(false);
  const [isVomiting, setIsVomiting] = useState(false);
  const [isKnockedOut, setIsKnockedOut] = useState(false);
  const [isHiccuping, setIsHiccuping] = useState(false);

  // Feedback Notifications
  const [feedbackPill, setFeedbackPill] = useState<FeedbackPillData | null>(null);
  const [timeDeltaNotice, setTimeDeltaNotice] = useState<{ text: string; isPenalty: boolean } | null>(null);

  // Quick-Time Event (QTE) State
  const [activeQte, setActiveQte] = useState<ActiveQte | null>(null);

  // Emergency States & Guards
  const [fuseCooldownSeconds, setFuseCooldownSeconds] = useState(0);
  const [isCriticalDespair, setIsCriticalDespair] = useState(false);
  const [criticalDespairCountdown, setCriticalDespairCountdown] = useState(6);

  // Session Incident Tracking
  const [totalTimePenaltiesSeconds, setTotalTimePenaltiesSeconds] = useState(0);
  const vomitCount = useRef<number>(0);
  const comaCount = useRef<number>(0);
  const fuseBlowCount = useRef<number>(0);

  // Status Effects List
  const [statusEffects, setStatusEffects] = useState<ActiveStatusEffect[]>([]);

  // Sliding Window Trackers for Rapid Action Gags
  const recentFeeds = useRef<number[]>([]);
  const recentPokes = useRef<number[]>([]);
  const recentShocks = useRef<number[]>([]);
  const seenHats = useRef<Set<NihilHat>>(new Set(['none']));
  const overclockCount = useRef<number>(0);

  // Achievements State (Persistent: only unlocked once per device)
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('nihilpet_achievements');
      if (saved) {
        const unlockedIds: string[] = JSON.parse(saved);
        return INITIAL_ACHIEVEMENTS.map((a) => ({
          ...a,
          unlocked: unlockedIds.includes(a.id),
        }));
      }
    } catch {}
    return INITIAL_ACHIEVEMENTS;
  });
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);
  const [isTrophiesModalOpen, setIsTrophiesModalOpen] = useState(false);

  // Telemetry Logs & Hex Registers
  const [logs, setLogs] = useState<string[]>([
    '> SYSTEM READY. INSERT ROM OR PUSH START.',
  ]);

  const [hexRegisters, setHexRegisters] = useState<{ addr: string; val: string }[]>([
    { addr: '0x0010', val: '0xDEAD' },
    { addr: '0x0012', val: '0xBEEF' },
    { addr: '0x0024', val: '0x1337' },
    { addr: '0x0026', val: '0x00FF' },
  ]);

  // CSS Decay Hook
  const [decayStage, setDecayStage] = useState<CssDecayStage>(0);
  useCssDecay(decayStage);

  // Available skins list for the bezel skin cycler (12 skins)
  const hatList: NihilHat[] = [
    'none',
    'beret',
    'party',
    'tinfoil',
    'clown',
    'cyber',
    'wizard',
    'pirate',
    'crown',
    'vr',
    'astro',
    'halo',
  ];

  // BGM Cycle Engine: OFF -> 25% -> 50% -> 80% -> OFF
  const cycleBgm = () => {
    if (!isBgmActive) {
      setIsBgmActive(true);
      setBgmLevel(1);
      soundEngine.setBgmVolume(0.25);
      soundEngine.startBgm();
      addLog('AUDIO SYNTH: 8-BIT POKÉMON TOWN THEME ACTIVE (25%).');
    } else if (bgmLevel === 1) {
      setBgmLevel(2);
      soundEngine.setBgmVolume(0.5);
      addLog('AUDIO SYNTH: BGM VOLUME SET TO 50%.');
    } else if (bgmLevel === 2) {
      setBgmLevel(3);
      soundEngine.setBgmVolume(0.8);
      addLog('AUDIO SYNTH: BGM VOLUME SET TO 80%.');
    } else {
      setIsBgmActive(false);
      setBgmLevel(0);
      soundEngine.stopBgm();
      addLog('AUDIO SYNTH: BGM MUTED.');
    }
  };

  const addLog = (entry: string) => {
    const timeStamp = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [...prev.slice(-15), `[${timeStamp}] ${entry}`]);
  };

  // Add Points helper with high score tracking
  const addScore = (delta: number) => {
    setScore((prev) => {
      const next = Math.max(0, prev + delta);
      if (next > highScore) {
        setHighScore(next);
        try {
          localStorage.setItem('nihilpet_highscore', String(next));
        } catch {}
      }
      return next;
    });
  };

  // TIME PENALTY SYSTEM: Drains time instead of instant killing
  const applyTimePenalty = (seconds: number, label: string) => {
    soundEngine.playPenaltyBuzz();
    setTimeRemainingSeconds((prev) => {
      const next = Math.max(0, prev - seconds);
      if (next <= 0) {
        triggerGameOver(
          'BATTERY ENTROPY COLLAPSE (TIME EXPIRED: 00:00)',
          `The Z80 entropy countdown ran out of juice because error penalties (-${seconds}s) drained the clock to zero.`
        );
        return 0;
      }
      return next;
    });
    setTotalTimePenaltiesSeconds((s) => s + seconds);
    setTimeDeltaNotice({ text: `-${seconds}s`, isPenalty: true });
    setFeedbackPill({ text: `-${seconds}s ${label}`, type: 'penalty' });
    addLog(`PENALTY: -${seconds}s DRAINED FROM CLOCK [${label}].`);

    setTimeout(() => setTimeDeltaNotice(null), 2400);
    setTimeout(() => setFeedbackPill(null), 2800);
  };

  // TIME BONUS SYSTEM
  const applyTimeBonus = (seconds: number, label: string) => {
    soundEngine.playCoin();
    setTimeRemainingSeconds((prev) => Math.min(360, prev + seconds));
    setTimeDeltaNotice({ text: `+${seconds}s`, isPenalty: false });
    setFeedbackPill({ text: `+${seconds}s ${label}`, type: 'bonus' });
    addLog(`BONUS: +${seconds}s ADDED TO CLOCK [${label}].`);

    setTimeout(() => setTimeDeltaNotice(null), 2400);
    setTimeout(() => setFeedbackPill(null), 2800);
  };

  // Unlock Achievement Engine (Strict: Only unlocked once per device)
  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const target = prev.find((a) => a.id === id);
      if (!target || target.unlocked) return prev;

      soundEngine.playAchievement();
      const updated = prev.map((a) =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleTimeString() } : a
      );

      try {
        const unlockedIds = updated.filter((a) => a.unlocked).map((a) => a.id);
        localStorage.setItem('nihilpet_achievements', JSON.stringify(unlockedIds));
      } catch {}

      addScore(target.points);
      setActiveToast(target);
      addLog(`ACHIEVEMENT UNLOCKED: [${target.title.toUpperCase()}] (+${target.points} PTS)`);
      return updated;
    });
  };

  // Reset all achievements on this machine
  const handleResetAchievements = () => {
    try {
      localStorage.removeItem('nihilpet_achievements');
    } catch {}
    setAchievements(INITIAL_ACHIEVEMENTS);
    addLog('SYSTEM: TROPHY COMPENDIUM RESET TO 0/16.');
  };

  // Trigger Terminal Game Over with detailed autopsy dossier
  const triggerGameOver = (reason: string, autopsy: string) => {
    soundEngine.playFlatline();
    setGameOverReason(reason);
    setAutopsyReport(autopsy);
    addLog(`*** FATAL TERMINATION: ${reason} ***`);
    unlockAchievement('FIRST_FLATLINE');
  };

  // Turn power on / cold boot / restart
  const handlePowerOn = () => {
    if (!isCartridgeInserted) {
      soundEngine.playSadTrombone();
      addLog('ERR: CANNOT BOOT WITHOUT CARTRIDGE.');
      return;
    }

    soundEngine.playPoke();
    setIsPoweredOn(true);
    setTimeRemainingSeconds(360);
    setTimeSurvivedSeconds(0);
    setDespair(20);
    setScore(0);
    setSessionEnding('none');
    setGameOverReason(null);
    setAutopsyReport('');
    setStatusEffects([]);
    setIsHypercube(false);
    setIsOverclocked(false);
    setIsVomiting(false);
    setIsKnockedOut(false);
    setIsHiccuping(false);
    setIsCriticalDespair(false);
    setCriticalDespairCountdown(6);
    setFuseCooldownSeconds(0);
    setFeedbackPill(null);
    setTimeDeltaNotice(null);
    setTotalTimePenaltiesSeconds(0);
    vomitCount.current = 0;
    comaCount.current = 0;
    fuseBlowCount.current = 0;
    recentFeeds.current = [];
    recentPokes.current = [];
    recentShocks.current = [];
    addLog('IGNITION: Z80 CPU BOOT SEQUENCE COMPLETED.');
    addLog('ENTROPY ENGINE INITIALIZED: 360s ALLOCATED.');
  };

  // Eject / insert cartridge
  const handleToggleCartridge = () => {
    if (isCartridgeInserted) {
      if (isPoweredOn) {
        unlockAchievement('CART_PULLER');
      }
      setIsCartridgeInserted(false);
      setIsPoweredOn(false);
      soundEngine.playGlitch();
      addLog('CARTRIDGE EJECTED: BUS HALTED.');
    } else {
      setIsCartridgeInserted(true);
      soundEngine.playPoke();
      addLog('CARTRIDGE INSERTED: NP-9000.ROM READY.');
    }
  };

  // Cycle skin on bezel
  const handleCycleHat = () => {
    const currentIndex = hatList.indexOf(activeHat);
    const nextHat = hatList[(currentIndex + 1) % hatList.length];
    setActiveHat(nextHat);
    seenHats.current.add(nextHat);
    if (seenHats.current.size >= 7) {
      unlockAchievement('FASHION_VICTIM');
    }
    addLog(`HARDWARE SWITCH: SKIN REGISTER SET TO [${nextHat.toUpperCase()}].`);
  };

  // Countdown timer & live passive loop (Runs every 1s when powered on and alive)
  useEffect(() => {
    if (!isPoweredOn || sessionEnding !== 'none' || gameOverReason) return;

    const interval = setInterval(() => {
      // 1. Tick fuse cooldown if active
      setFuseCooldownSeconds((f) => (f > 0 ? f - 1 : 0));

      // 2. Tick survival clock & passive survival points (+15 pts/sec)
      setTimeSurvivedSeconds((s) => {
        const nextSec = s + 1;
        if (nextSec >= 180 && despair <= 25) {
          unlockAchievement('SURVIVOR');
        }
        return nextSec;
      });
      addScore(15);

      // 3. Score threshold check
      setScore((currScore) => {
        if (currScore >= 20000) {
          unlockAchievement('POINT_HOARDER');
        }
        return currScore;
      });

      // 4. Critical Despair Countdown Handler (Does NOT instant kill immediately!)
      if (isCriticalDespair) {
        setCriticalDespairCountdown((cd) => {
          if (cd <= 1) {
            triggerGameOver(
              'VOID SINGULARITY COLLAPSE (CRITICAL DESPAIR UNRESOLVED)',
              'Autopsy diagnostic: Nihil-chan remained at 100% Despair for over 6 seconds without being fed. The entity voluntarily collapsed into vacuum zero-point energy.'
            );
            return 0;
          }
          // Drain additional 2 seconds per tick during emergency
          setTimeRemainingSeconds((t) => Math.max(1, t - 2));
          soundEngine.playAlarm();
          return cd - 1;
        });
      }

      // 5. Tick entropy session timer
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (despair <= 15) {
            setSessionEnding('nirvana');
            soundEngine.playPurposeFanfare();
            unlockAchievement('NIRVANA_MASTER');
            addScore(10000);
            addLog('TERMINAL: PIXEL NIRVANA ACHIEVED.');
          } else {
            triggerGameOver(
              'BATTERY ENTROPY COLLAPSE (TIME EXPIRED: 00:00)',
              'The 6-minute operational entropy budget was exhausted before achieving equilibrium. All virtual registers zeroed.'
            );
          }
          return 0;
        }
        return prev - (isOverclocked ? 2 : 1);
      });

      // 6. Tick status effects
      setStatusEffects((prev) =>
        prev
          .map((eff) => ({ ...eff, durationSeconds: eff.durationSeconds - 1 }))
          .filter((eff) => {
            if (eff.durationSeconds <= 0) {
              addLog(`STATUS EXPIRED: [${eff.name}].`);
              if (eff.id === 'hypercube') setIsHypercube(false);
              if (eff.id === 'overclock') setIsOverclocked(false);
              return false;
            }
            return true;
          })
      );

      // 7. Jitter random hex register
      setHexRegisters((prev) =>
        prev.map((r, i) =>
          i === 1
            ? { ...r, val: `0x${Math.floor(Math.random() * 65535).toString(16).toUpperCase()}` }
            : r
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isPoweredOn, sessionEnding, gameOverReason, isOverclocked, isCriticalDespair, despair]);

  // Periodic random cosmic events (every 24 seconds)
  useEffect(() => {
    if (!isPoweredOn || sessionEnding !== 'none' || gameOverReason) return;

    const eventInterval = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.35 && !isHiccuping) {
        setIsHiccuping(true);
        soundEngine.playBoing();
        addLog('ANOMALY: COSMIC HICCUPS! APPLY JOLT DEFIBRILLATOR TO CURE!');
        setThought('HIC! *spasm* My spatial matrices are vibrating! HIC!');
        setFeedbackPill({ text: '⚡ COSMIC HICCUPS! PRESS JOLT!', type: 'alert' });
        setTimeout(() => setFeedbackPill(null), 3000);
        setTimeout(() => setIsHiccuping(false), 16000);
      } else if (roll < 0.6) {
        soundEngine.playGlitch();
        setIsScreenInverted(true);
        setTimeout(() => setIsScreenInverted(false), 1200);
        addLog('SUBSTRATE FLUCTUATION: BRIEF QUANTUM INVERSION.');
        setThought('Light and shadow traded polarities for an instant.');
      } else if (roll < 0.85) {
        setDespair((d) => Math.max(0, d - 6));
        addScore(150);
        addLog('STRAY COMET: VIRTUAL CRUMB ABSORBED (+150 PTS).');
        setThought('Caught a stray pixel in my teeth. Unexpected solace.');
      }
    }, 24000);

    return () => clearInterval(eventInterval);
  }, [isPoweredOn, sessionEnding, gameOverReason, isHiccuping]);

  // QUICK-TIME EVENT (QTE) ENGINE: Urgent arcade reflex events every 20-32s
  useEffect(() => {
    if (!isPoweredOn || sessionEnding !== 'none' || gameOverReason) return;

    // Tick active QTE timer every 100ms
    const qteTicker = setInterval(() => {
      setActiveQte((curr) => {
        if (!curr) return null;
        const nextTime = curr.timeRemaining - 0.1;
        if (nextTime <= 0) {
          // QTE Failed! Apply harsh time penalty (-20s to -25s)
          soundEngine.playPenaltyBuzz();
          const penalty = curr.type === 'ground_arc' ? 25 : curr.type === 'feed_frenzy' ? 22 : 20;
          applyTimePenalty(penalty, `QTE FAILED [${curr.title}]`);
          addLog(`QTE EXPIRED: ${curr.title} NOT RESOLVED IN TIME! (-${penalty}s DRAINED).`);
          setThought(`ALARM: Reflex failure! System drained -${penalty} seconds of entropy budget.`);
          return null;
        }
        return { ...curr, timeRemaining: nextTime };
      });
    }, 100);

    // Randomly spawn a new QTE every 20-30s if none is currently active
    const qteSpawner = setInterval(() => {
      setActiveQte((curr) => {
        if (curr || !isPoweredOn || sessionEnding !== 'none' || gameOverReason) return curr;

        const qteTypes: Array<ActiveQte> = [
          {
            type: 'feed_frenzy',
            title: 'RAVENOUS STARVATION',
            instruction: 'SPAM FEED BUTTON',
            targetKey: 'feed',
            currentCount: 0,
            requiredCount: 5,
            timeRemaining: 4.5,
            totalTime: 4.5,
          },
          {
            type: 'clear_airway',
            title: 'ASPHYXIATION CHOKE',
            instruction: 'HEIMLICH POKE RAPIDLY',
            targetKey: 'poke',
            currentCount: 0,
            requiredCount: 4,
            timeRemaining: 4.0,
            totalTime: 4.0,
          },
          {
            type: 'ground_arc',
            title: '3.3V BUS SHORT CIRCUIT',
            instruction: 'HIT JOLT TO GROUND ARC',
            targetKey: 'shock',
            currentCount: 0,
            requiredCount: 1,
            timeRemaining: 3.5,
            totalTime: 3.5,
          },
          {
            type: 'anchor_void',
            title: 'DIMENSIONAL TEAR',
            instruction: 'HIT VOID TO ANCHOR',
            targetKey: 'void',
            currentCount: 0,
            requiredCount: 1,
            timeRemaining: 3.5,
            totalTime: 3.5,
          },
        ];

        const selected = qteTypes[Math.floor(Math.random() * qteTypes.length)];
        soundEngine.playAlarm();
        addLog(`⚡ EMERGENCY QTE: ${selected.title}! ${selected.instruction} (${selected.totalTime}s)!`);
        return selected;
      });
    }, 22000);

    return () => {
      clearInterval(qteTicker);
      clearInterval(qteSpawner);
    };
  }, [isPoweredOn, sessionEnding, gameOverReason]);

  // Helper to add or replace status effect
  const applyStatusEffect = (effect: ActiveStatusEffect) => {
    setStatusEffects((prev) => {
      const filtered = prev.filter((e) => e.id !== effect.id);
      return [...filtered, effect];
    });
    setActiveStatusText(`[${effect.name}]`);
  };

  // ACTION 1: FEED (Resolves critical despair, handles vomit penalty instead of instant death)
  const handleFeed = () => {
    if (!isPoweredOn || gameOverReason || isVomiting) return;

    // Check if FEED is target of active QTE
    if (activeQte && activeQte.targetKey === 'feed') {
      soundEngine.playEat();
      const nextCount = activeQte.currentCount + 1;
      if (nextCount >= activeQte.requiredCount) {
        // QTE Successfully Cleared!
        setActiveQte(null);
        applyTimeBonus(15, 'QTE DEFUSED');
        addScore(1200);
        soundEngine.playCoin();
        addLog(`⚡ QTE DEFUSED: ${activeQte.title} RESOLVED! (+15s CLOCK, +1200 PTS).`);
        setThought('Bytecode carbohydrates injected rapidly! Metabolic crisis averted.');
        setFeedbackPill({ text: '⚡ QTE DEFUSED! +15s +1200 PTS', type: 'bonus' });
        setTimeout(() => setFeedbackPill(null), 2500);
      } else {
        setActiveQte((q) => (q ? { ...q, currentCount: nextCount } : null));
      }
      return;
    }

    // Critical Despair Resolution
    if (isCriticalDespair) {
      setIsCriticalDespair(false);
      setDespair(65);
      soundEngine.playEat();
      soundEngine.playCoin();
      addScore(300);
      setThought('Bytecode carbohydrates absorbed! Singularity averted.');
      setFeedbackPill({ text: '✅ WILL RESTORED! CRISIS AVERTED', type: 'bonus' });
      addLog('EMERGENCY RESOLVED: FOOD INPUT CANCELLED VOID COLLAPSE (+300 PTS).');
      setTimeout(() => setFeedbackPill(null), 3000);
      return;
    }

    const now = Date.now();
    const nextFeeds = [...recentFeeds.current.filter((t) => now - t < 2500), now];
    recentFeeds.current = nextFeeds;

    // Rapid Feed Threshold Gag: Vomit penalty (-12s time drain)
    if (nextFeeds.length >= 7 && !isVomiting) {
      setIsVomiting(true);
      vomitCount.current += 1;
      soundEngine.playVomit();
      unlockAchievement('CARB_OVERFLOW');
      addScore(-200);
      setDespair((d) => Math.min(100, d + 10));
      setThought('URRGHHH... STOMACH BUFFER OVERFLOW... TOO MUCH PIXEL PIZZA!');
      applyTimePenalty(12, 'GASTRO VOMIT');

      // Only 4 separate unrecovered vomits causes fatal overdose
      if (vomitCount.current >= 4) {
        triggerGameOver(
          'FATAL REPEATED GASTRO-HEAP OVERFLOW (CHOKED ON PIXEL PIZZA)',
          'Autopsy diagnostic: Subject vomited 4 separate times without digestion recovery. Virtual trachea choked on compressed 8-bit mozzarella.'
        );
        return;
      }

      setTimeout(() => setIsVomiting(false), 3500);
      return;
    }

    soundEngine.playEat();
    soundEngine.playSpeechBabble(4);
    setMood('eating');

    const roll = Math.random() * 100;
    if (roll < 1.0) {
      // 1% Legendary Golden Slice
      unlockAchievement('GOLDEN_SLICE');
      applyStatusEffect({ id: 'satori', name: 'PIZZA_SATORI', durationSeconds: 30, type: 'legendary' });
      applyTimeBonus(30, 'GOLDEN SLICE');
      setDespair((d) => Math.max(0, d - 25));
      addScore(5000);
      setThought('THE GOLDEN SLICE! For 30 seconds, existence makes absolute sense.');
      setFeedbackPill({ text: '✨ GOLDEN SLICE! +30s +5000 PTS', type: 'legendary' });
      setTimeout(() => setFeedbackPill(null), 3500);
    } else if (roll < 60.0) {
      // 59% Satiated
      applyStatusEffect({ id: 'satiated', name: 'SATIATED', durationSeconds: 25, type: 'buff' });
      setDespair((d) => Math.max(0, d - 12));
      addScore(75);
      setThought('Compressed bytecode pizza digested. Caloric value accepted.');
      setFeedbackPill({ text: '+75 PTS [SATIATED]', type: 'bonus' });
      setTimeout(() => setFeedbackPill(null), 1800);
      addLog('ACTION FEED (60%): STATUS SET TO [SATIATED] (+75 PTS).');
    } else if (roll < 88.0) {
      // 28% Carb Regret
      applyStatusEffect({ id: 'regret', name: 'CARB_REGRET', durationSeconds: 20, type: 'debuff' });
      setDespair((d) => Math.min(100, d + 4));
      addScore(30);
      setThought('I metabolize nothing. Why celebrate culinary entropy?');
      addLog('ACTION FEED (28%): STATUS SET TO [CARB_REGRET] (+30 PTS).');
    } else {
      // 12% Metabolic Leak
      applyStatusEffect({ id: 'leak', name: 'METABOLIC_LEAK', durationSeconds: 15, type: 'debuff' });
      addScore(40);
      setThought('Heap fragmentation detected around virtual stomach.');
      addLog('ACTION FEED (12%): STATUS SET TO [METABOLIC_LEAK] (+40 PTS).');
    }

    setTimeout(() => setMood('idle'), 700);
  };

  // ACTION 2: POKE (Rapid gag: Concussion coma penalty -8s, button lock)
  const handlePoke = () => {
    if (!isPoweredOn || gameOverReason || isKnockedOut) return;
    unlockAchievement('FIRST_CONTACT');

    // Check if POKE is target of active QTE
    if (activeQte && activeQte.targetKey === 'poke') {
      soundEngine.playBoing();
      const nextCount = activeQte.currentCount + 1;
      if (nextCount >= activeQte.requiredCount) {
        // QTE Successfully Cleared!
        setActiveQte(null);
        applyTimeBonus(15, 'AIRWAY CLEARED');
        addScore(1200);
        soundEngine.playCoin();
        addLog(`⚡ QTE DEFUSED: ${activeQte.title} RESOLVED! (+15s CLOCK, +1200 PTS).`);
        setThought('Heimlich poke dislodged the blockage! Airway registers clear.');
        setFeedbackPill({ text: '⚡ QTE DEFUSED! +15s +1200 PTS', type: 'bonus' });
        setTimeout(() => setFeedbackPill(null), 2500);
      } else {
        setActiveQte((q) => (q ? { ...q, currentCount: nextCount } : null));
      }
      return;
    }

    const now = Date.now();
    const nextPokes = [...recentPokes.current.filter((t) => now - t < 2200), now];
    recentPokes.current = nextPokes;

    // Knockout Coma Gag (-8s time penalty and lock)
    if (nextPokes.length >= 8 && !isKnockedOut) {
      setIsKnockedOut(true);
      comaCount.current += 1;
      soundEngine.playSadTrombone();
      unlockAchievement('CONCUSSION_COMA');
      addScore(-150);
      setDespair((d) => Math.min(100, d + 8));
      setThought('X_X ... CONCUSSION TRAUMA ... SYNAPSES SUSPENDED ...');
      applyTimePenalty(8, 'CONCUSSION COMA');

      if (comaCount.current >= 4) {
        triggerGameOver(
          'FATAL REPEATED CRANIAL FRACTURE (4x CONCUSSION COMA)',
          'Autopsy diagnostic: Subject sustained 4 consecutive severe kinetic head impacts. The virtual skull failed under repeated somatic trauma.'
        );
        return;
      }

      setTimeout(() => setIsKnockedOut(false), 3800);
      return;
    }

    soundEngine.playPoke();
    setMood('poked');

    const roll = Math.random() * 100;
    if (roll < 1.0) {
      // 1% Legendary Hypercube Transcendence
      setIsHypercube(true);
      unlockAchievement('TESSERACT_WITNESS');
      applyStatusEffect({ id: 'hypercube', name: 'HYPERCUBE_4D', durationSeconds: 20, type: 'legendary' });
      addScore(5000);
      setThought('I SEE THE FOURTH DIMENSION. YOUR CURSOR IS MERELY A 2D SHADOW.');
      setFeedbackPill({ text: '🔮 4D HYPERCUBE! +5000 PTS', type: 'legendary' });
      setTimeout(() => setFeedbackPill(null), 3500);
      addLog('LEGENDARY ROLL (1%): [HYPERCUBE_TRANSCENDENCE] +5000 PTS! 4D SHIFT ACTIVE.');
    } else if (roll < 55.0) {
      // 54% Mild Annoyance
      applyStatusEffect({ id: 'annoyed', name: 'ANNOYED', durationSeconds: 15, type: 'debuff' });
      setDespair((d) => Math.min(100, d + 2));
      addScore(35);
      setThought('Collision registered on sensor node #3. Displeasure logged.');
      addLog('ACTION POKE (54%): STATUS SET TO [ANNOYED] (+35 PTS).');
    } else if (roll < 88.0) {
      // 33% Dizzy Spin
      applyStatusEffect({ id: 'dizzy', name: 'DIZZY_SPIN', durationSeconds: 12, type: 'debuff' });
      addScore(50);
      setThought('Centrifugal force is the only tangible truth.');
      addLog('ACTION POKE (33%): STATUS SET TO [DIZZY_SPIN] (+50 PTS).');
    } else {
      // 12% Static Zap
      soundEngine.playGlitch();
      setIsScreenInverted(true);
      setTimeout(() => setIsScreenInverted(false), 200);
      applyStatusEffect({ id: 'zap', name: 'STATIC_ZAP', durationSeconds: 10, type: 'debuff' });
      addScore(60);
      setThought('Static discharge! A tiny spark in an infinite dark.');
      addLog('ACTION POKE (12%): STATUS SET TO [STATIC_ZAP] (+60 PTS).');
    }

    setTimeout(() => setMood('idle'), 500);
  };

  // ACTION 3: CONTEMPLATE VOID (Moderate despair increment, triggers emergency countdown instead of instant death)
  const handleContemplateVoid = () => {
    if (!isPoweredOn || gameOverReason || isKnockedOut) return;

    // Check if VOID is target of active QTE
    if (activeQte && activeQte.targetKey === 'void') {
      soundEngine.playVoidDrone();
      setActiveQte(null);
      applyTimeBonus(15, 'VOID ANCHORED');
      addScore(1200);
      soundEngine.playCoin();
      addLog(`⚡ QTE DEFUSED: ${activeQte.title} RESOLVED! (+15s CLOCK, +1200 PTS).`);
      setThought('Dimensional tear stitched shut! Spacetime continuum stabilized.');
      setFeedbackPill({ text: '⚡ QTE DEFUSED! +15s +1200 PTS', type: 'bonus' });
      setTimeout(() => setFeedbackPill(null), 2500);
      return;
    }

    soundEngine.playVoidDrone();
    setMood('contemplating');

    const roll = Math.random() * 100;
    if (roll < 1.0) {
      // 1% Cosmic Anomaly
      setActiveHat('wizard');
      setDespair(0);
      setIsCriticalDespair(false);
      unlockAchievement('COSMIC_ANOMALY');
      applyStatusEffect({ id: 'anomaly', name: 'COSMIC_ANOMALY', durationSeconds: 25, type: 'legendary' });
      addScore(5000);
      setThought('SUPERNOVA OBSERVED: Ephemeral beauty in an indifferent void.');
      setFeedbackPill({ text: '🌟 COSMIC ANOMALY! +5000 PTS', type: 'legendary' });
      setTimeout(() => setFeedbackPill(null), 3500);
      addLog('LEGENDARY ROLL (1%): [COSMIC_ANOMALY] +5000 PTS! WIZARD SKIN UNLOCKED.');
    } else {
      // Deep reflection: adds only +6% to +8% despair
      const despairDelta = roll < 60 ? 6 : 8;
      setDespair((d) => {
        const nextD = Math.min(100, d + despairDelta);
        if (nextD >= 85) {
          unlockAchievement('VOID_WALKER');
        }
        if (nextD >= 100 && !isCriticalDespair) {
          setIsCriticalDespair(true);
          setCriticalDespairCountdown(6);
          soundEngine.playAlarm();
          setFeedbackPill({ text: '⚠️ CRITICAL: FEED TO AVERT SINGULARITY!', type: 'penalty' });
          setTimeout(() => setFeedbackPill(null), 3000);
          addLog('CRITICAL WARNING: 100% DESPAIR! 6s TO FEED OR COLLAPSE!');
        }
        return nextD;
      });

      addScore(90);
      setThought('Staring into dot matrix reveals the serene silence of non-existence.');
      setFeedbackPill({ text: '+90 PTS [CONTEMPLATION]', type: 'bonus' });
      setTimeout(() => setFeedbackPill(null), 1800);
      addLog(`ACTION VOID: CONTEMPLATION ACCEPTED (+90 PTS, +${despairDelta}% DESPAIR).`);
    }

    setTimeout(() => setMood('idle'), 1000);
  };

  // ACTION 4: SHOCK / JOLT (Cures hiccups; spamming trips fuse cooldown -15s instead of instant death)
  const handleShock = () => {
    if (!isPoweredOn || gameOverReason || isKnockedOut || fuseCooldownSeconds > 0) return;

    // Check if SHOCK is target of active QTE
    if (activeQte && activeQte.targetKey === 'shock') {
      soundEngine.playBoing();
      setActiveQte(null);
      applyTimeBonus(15, 'BUS GROUNDED');
      addScore(1200);
      soundEngine.playCoin();
      addLog(`⚡ QTE DEFUSED: ${activeQte.title} RESOLVED! (+15s CLOCK, +1200 PTS).`);
      setThought('3.3V bus grounded immediately! Short circuit prevented.');
      setFeedbackPill({ text: '⚡ QTE DEFUSED! +15s +1200 PTS', type: 'bonus' });
      setTimeout(() => setFeedbackPill(null), 2500);
      return;
    }

    // Hiccup Savior Defibrillator
    if (isHiccuping) {
      setIsHiccuping(false);
      unlockAchievement('HICCUP_SAVIOR');
      applyTimeBonus(10, 'DEFIBRILLATED');
      addScore(1000);
      setThought('Diaphragm defibrillated! Cosmic hiccups cured.');
      setFeedbackPill({ text: '⚡ HICCUPS CURED! +1000 PTS +10s', type: 'bonus' });
      setTimeout(() => setFeedbackPill(null), 3000);
      addLog('HICCUP SAVIOR: DEFIBRILLATION SUCCESSFUL! (+1000 PTS, +10s).');
      return;
    }

    const now = Date.now();
    const nextShocks = [...recentShocks.current.filter((t) => now - t < 2000), now];
    recentShocks.current = nextShocks;

    // Overvoltage Fuse Trip (Drains -15s time, locks button for 4s)
    if (nextShocks.length >= 3) {
      fuseBlowCount.current += 1;
      setFuseCooldownSeconds(4);
      applyTimePenalty(15, 'OVERVOLTAGE FUSE');

      if (fuseBlowCount.current >= 4) {
        triggerGameOver(
          '10,000V TRANSFORMER MELTDOWN (4x FUSE TRIPS)',
          'Autopsy diagnostic: Circuit breaker tripped 4 consecutive times in one session. The Z80 power regulator burst into permanent phosphor flames.'
        );
        return;
      }
      return;
    }

    soundEngine.playAlarm();

    const roll = Math.random() * 100;
    if (roll < 1.0) {
      // 1% The Zero Day
      setDespair(0);
      setIsCriticalDespair(false);
      unlockAchievement('ZERO_DAY_EXPLOIT');
      applyStatusEffect({ id: 'zeroday', name: 'THE_ZERO_DAY', durationSeconds: 30, type: 'legendary' });
      addScore(5000);
      setThought('UNCHECKED BUFFER IN REALITY FOUND. ROOT PRIVILEGES GRANTED.');
      setFeedbackPill({ text: '0x ROOT EXPLOIT! +5000 PTS', type: 'legendary' });
      setTimeout(() => setFeedbackPill(null), 3500);
      addLog('LEGENDARY ROLL (1%): [THE_ZERO_DAY] +5000 PTS! ROOT CONFIRMED.');
    } else if (roll < 50.0) {
      // 49% System Alert
      applyStatusEffect({ id: 'alert', name: 'SYSTEM_ALERT', durationSeconds: 10, type: 'debuff' });
      addScore(55);
      setThought('3.3V spike registered on pin #8. Mild somatic shock logged.');
      addLog('ACTION JOLT (49%): STATUS SET TO [SYSTEM_ALERT] (+55 PTS).');
    } else if (roll < 80.0) {
      // 30% Bit Flip
      applyStatusEffect({ id: 'bitflip', name: 'BIT_FLIP', durationSeconds: 15, type: 'debuff' });
      addScore(70);
      setThought('0x4E 0x49 0x48... Bit #3 inverted on register BX.');
      addLog('ACTION JOLT (30%): STATUS SET TO [BIT_FLIP] (+70 PTS).');
    } else {
      // 20% Overclocked Buff
      setIsOverclocked(true);
      overclockCount.current += 1;
      if (overclockCount.current >= 3) {
        unlockAchievement('OVERCLOCK_MANIAC');
      }
      applyStatusEffect({ id: 'overclock', name: 'OVERCLOCKED', durationSeconds: 12, type: 'buff' });
      addScore(250);
      setThought('CLOCK SPEED 200%: Burning through existence at double rate!');
      setFeedbackPill({ text: '>> OVERCLOCKED! +250 PTS', type: 'bonus' });
      setTimeout(() => setFeedbackPill(null), 2000);
      addLog('ACTION JOLT (20%): STATUS SET TO [OVERCLOCKED] (+250 PTS).');
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div
      className={`h-screen max-h-screen overflow-hidden flex flex-col justify-between p-2.5 bg-[#07070b] text-neutral-200 select-none font-mono ${
        isScreenInverted ? 'invert' : ''
      }`}
    >
      {/* 1. Ultra-clean Minimalist Top Hardware Header */}
      <header className="h-9 flex items-center justify-between px-3.5 bg-[#0d0f14] border border-white/10 rounded-xl text-[10px] text-neutral-400">
        <div className="flex items-center gap-2.5">
          <span className="font-pixel text-[10px] text-emerald-400 font-bold">
            [NIHIL-OS v2.4]
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-300 font-mono text-[9px]">
            ROM: NIHILPET9K_REV_C.BIN
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#14171f] px-2.5 py-1 rounded-lg border border-white/5">
            <span className="text-neutral-400 text-[8px] uppercase tracking-wider">SCORE:</span>
            <span className="font-pixel text-amber-400 text-[10px] font-bold">
              {score.toLocaleString()} PTS
            </span>
          </div>

          <button
            onClick={() => setIsWardrobeOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 font-pixel text-[9px] hover:bg-cyan-900/60 cursor-pointer transition-all active:scale-95"
            type="button"
            title="Open Wardrobe & Re-skin Menu (or press SELECT on hardware)"
          >
            <span>[WARDROBE]</span>
          </button>

          <button
            onClick={() => setIsTrophiesModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/50 text-amber-300 font-pixel text-[9px] hover:bg-amber-400/30 cursor-pointer transition-all active:scale-95"
            type="button"
            title="Open Trophy Compendium"
          >
            <span>[TROPHIES: {unlockedCount}/{achievements.length}]</span>
          </button>

          <span className="text-neutral-600">|</span>

          {/* 8-Bit Pokémon Town BGM Switcher */}
          <button
            onClick={cycleBgm}
            className={`px-2 py-1 rounded font-pixel text-[9px] cursor-pointer transition-all ${
              isBgmActive
                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
            type="button"
            title="Toggle Pokémon-style 8-Bit Chiptune Background Music"
          >
            BGM: {isBgmActive ? `${bgmLevel === 1 ? '25%' : bgmLevel === 2 ? '50%' : '80%'}` : 'OFF'}
          </button>

          <button
            onClick={() => {
              const muted = soundEngine.toggleMute();
              setAudioEnabled(!muted);
            }}
            className="px-2 py-1 rounded bg-neutral-800 text-[9px] hover:text-white cursor-pointer"
            type="button"
          >
            SFX: {audioEnabled ? 'ON' : 'MUTED'}
          </button>
        </div>
      </header>

      {/* 2. Unified 3-Column Command Deck (Screen-Filling Layout, 100% Fit, Zero Scrolling) */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-stretch justify-center gap-3.5 py-1.5 overflow-hidden">
        {/* Left Column: Vintage Hardware Rack */}
        <div className="w-72 lg:w-80 flex-shrink-0 h-full">
          <LeftHardwarePanel
            isCartridgeInserted={isCartridgeInserted}
            onToggleCartridge={handleToggleCartridge}
            scanlinesEnabled={scanlinesEnabled}
            onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
            audioEnabled={audioEnabled}
            onToggleAudio={() => {
              const muted = soundEngine.toggleMute();
              setAudioEnabled(!muted);
            }}
            despair={despair}
            onLogMessage={(msg) => addLog(msg)}
            onAddScore={(pts) => addScore(pts)}
          />
        </div>

        {/* Center Column: The Chunky Handheld GameBoy Console */}
        <div className="flex-1 min-w-[370px] max-w-[480px] h-full flex flex-col items-center justify-center">
          <TamagotchiDevice
            isPoweredOn={isPoweredOn}
            onPowerOn={handlePowerOn}
            mood={mood}
            despair={despair}
            thought={thought}
            activeHat={activeHat}
            activeStatusText={activeStatusText}
            onCycleHat={handleCycleHat}
            onFeed={handleFeed}
            onPoke={handlePoke}
            onContemplateVoid={handleContemplateVoid}
            onShock={handleShock}
            isHypercube={isHypercube}
            isOverclocked={isOverclocked}
            isVomiting={isVomiting}
            isKnockedOut={isKnockedOut}
            isHiccuping={isHiccuping}
            feedbackPill={feedbackPill}
            fuseCooldownSeconds={fuseCooldownSeconds}
            isCriticalDespair={isCriticalDespair}
            criticalDespairCountdown={criticalDespairCountdown}
            onOpenWardrobe={() => setIsWardrobeOpen(true)}
            activePalette={activePalette}
            petName={petName}
            activeQte={activeQte}
          />
        </div>

        {/* Right Column: Telemetry & Live Stats with Penalty Notifier */}
        <div className="w-80 lg:w-96 flex-shrink-0 h-full">
          <RightTelemetryPanel
            timeRemainingSeconds={timeRemainingSeconds}
            statusEffects={statusEffects}
            logs={logs}
            hexRegisters={hexRegisters}
            score={score}
            highScore={highScore}
            unlockedCount={unlockedCount}
            totalAchievements={achievements.length}
            onOpenAchievements={() => setIsTrophiesModalOpen(true)}
            timeDeltaNotice={timeDeltaNotice}
          />
        </div>
      </main>

      {/* 3. Steam/Minecraft-style Floating Achievement Toast */}
      <AchievementToast
        achievement={activeToast}
        onDismiss={() => setActiveToast(null)}
      />

      {/* 4a. Full Trophy Compendium Modal */}
      <AchievementModal
        isOpen={isTrophiesModalOpen}
        achievements={achievements}
        totalScore={score}
        onClose={() => setIsTrophiesModalOpen(false)}
        onResetAchievements={handleResetAchievements}
      />

      {/* 4b. Wardrobe & Hardware Customization Modal (Triggered by SELECT) */}
      <WardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        activeHat={activeHat}
        onSelectHat={(hat) => {
          setActiveHat(hat);
          seenHats.current.add(hat);
          if (seenHats.current.size >= 7) {
            unlockAchievement('FASHION_VICTIM');
          }
          addLog(`HARDWARE SWITCH: SKIN REGISTER SET TO [${hat.toUpperCase()}].`);
        }}
        petName={petName}
        onRenamePet={(newName) => {
          setPetName(newName);
          try {
            localStorage.setItem('nihilpet_name', newName);
          } catch {}
          addLog(`HARDWARE REGISTER: ENTITY DESIGNATION RENAMED TO [${newName.toUpperCase()}].`);
        }}
        activePalette={activePalette}
        onSelectPalette={(palette) => {
          setActivePalette(palette);
          try {
            localStorage.setItem('nihilpet_palette', palette);
          } catch {}
          addLog(`LCD CONTROLLER: PALETTE SWITCHED TO [${palette.toUpperCase()}].`);
        }}
        achievements={achievements}
      />

      {/* 5. Terminal Game Over Modal: HUGE CAUSE OF DEATH & DETAILED AUTOPSY */}
      {gameOverReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md select-none font-mono">
          <div className="max-w-xl w-full p-6 bg-[#0c0d12] border-2 border-rose-500 rounded-3xl shadow-[0_20px_70px_rgba(244,63,94,0.35)] text-center">
            
            {/* Header Badge */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="font-pixel text-xs text-rose-500 tracking-widest uppercase">
                [TERMINAL FAILURE // POST-MORTEM AUTOPSY]
              </span>
            </div>

            {/* HUGE Prominent Cause of Death Banner */}
            <div className="p-3.5 bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl mb-4 shadow-inner text-left">
              <div className="text-[9px] font-pixel text-rose-300 uppercase tracking-widest mb-1">
                CAUSE OF DEATH:
              </div>
              <div className="font-pixel text-base sm:text-lg text-white font-bold leading-tight">
                {gameOverReason}
              </div>
            </div>

            {/* Autopsy Dossier */}
            {autopsyReport && (
              <div className="p-3 bg-[#08090c] border border-white/10 rounded-xl mb-4 text-left">
                <div className="text-[8px] font-pixel text-neutral-400 uppercase tracking-widest mb-1">
                  FORENSIC DIAGNOSTIC REPORT:
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                  {autopsyReport}
                </p>
              </div>
            )}

            {/* Score & Session Breakdown */}
            <div className="p-3 bg-[#08090c] border border-white/10 rounded-xl mb-4 space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">FINAL ENTROPY SCORE:</span>
                <span className="font-pixel text-amber-400 text-sm font-bold">
                  {score.toLocaleString()} PTS
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-1.5">
                <span className="text-neutral-400">ALL-TIME BEST RECORD:</span>
                <span className="font-pixel text-emerald-400 font-bold">
                  {highScore.toLocaleString()} PTS
                  {score >= highScore && score > 0 ? ' (★ NEW RECORD!)' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-1.5">
                <span className="text-neutral-400">SURVIVAL DURATION:</span>
                <span className="font-mono text-neutral-200">
                  {Math.floor(timeSurvivedSeconds / 60)}m {timeSurvivedSeconds % 60}s
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-1.5">
                <span className="text-neutral-400">TIME LOST TO PENALTIES:</span>
                <span className="font-pixel text-rose-400">
                  -{totalTimePenaltiesSeconds}s DRAINED
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-1.5">
                <span className="text-neutral-400">TROPHIES COMPLETED:</span>
                <span className="font-mono text-amber-300">
                  {unlockedCount} / {achievements.length} UNLOCKED
                </span>
              </div>
            </div>

            {/* Restart Button */}
            <button
              onClick={handlePowerOn}
              className="w-full py-3 px-6 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-pixel text-xs font-bold cursor-pointer active:scale-95 transition-all uppercase shadow-lg shadow-rose-500/30 tracking-wider"
              type="button"
            >
              [ REBOOT HARDWARE // PLAY AGAIN ]
            </button>
          </div>
        </div>
      )}

      {/* 6. Terminal Ending: Nirvana Modal */}
      {sessionEnding === 'nirvana' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md select-none font-mono">
          <div className="max-w-md w-full p-6 bg-[#0c0d12] border-2 border-emerald-500 rounded-3xl shadow-[0_20px_60px_rgba(52,211,153,0.3)] text-center">
            <div className="font-pixel text-sm text-emerald-400 mb-2 uppercase tracking-wider">
              *** PIXEL NIRVANA ATTAINED ***
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Existence accepted despite futility. Nihil-chan reached complete zen synchrony before
              entropy expired.
            </p>
            <div className="p-3 bg-[#08090c] border border-emerald-500/30 rounded-xl mb-4 text-xs font-mono text-emerald-300 flex justify-between">
              <span>FINAL SCORE:</span>
              <span className="font-pixel font-bold">{score.toLocaleString()} PTS</span>
            </div>
            <button
              onClick={handlePowerOn}
              className="w-full py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-pixel text-[10px] font-bold cursor-pointer active:scale-95 transition-all uppercase shadow-lg shadow-emerald-500/30"
              type="button"
            >
              [ REBOOT SYSTEM CARTRIDGE ]
            </button>
          </div>
        </div>
      )}

      {/* 7. Bottom Hardware Status Bar */}
      <footer className="h-6 flex items-center justify-between px-3.5 text-[9px] text-neutral-500 border-t border-white/5">
        <span>Z80 BUS: 4.194304 MHz • CLOCK SYNCHRONIZED</span>
        <span>NIHILPET 9000 // STANDALONE HARDWARE WORKSTATION</span>
      </footer>
    </div>
  );
};

export default App;
