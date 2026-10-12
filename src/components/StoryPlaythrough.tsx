import React, { useState } from 'react';
import { soundEngine } from '../lib/soundEngine';
import confetti from 'canvas-confetti';

export interface GameProgress {
  pokes: number;
  fedPizza: number;
  hatSelected: boolean;
  wheelSpun: number;
  squishedBugs: number;
  duckTalks: number;
  bureaucracyDone: boolean;
  cryptoMined: number;
  whispersSent: number;
  stageReached: number;
  judgesBribed: number;
  doomsdayTriggered: boolean;
  catVideoUsed: boolean;
  judgeDemoRan: boolean;
  diplomaUnlocked: boolean;
}

interface StoryPlaythroughProps {
  progress: GameProgress;
  onOpenBureaucracy: () => void;
  onSpinWheel: () => void;
  onFeed: () => void;
  onPoke: () => void;
  onBribe: () => void;
  onPurpose: () => void;
}

export const StoryPlaythrough: React.FC<StoryPlaythroughProps> = ({
  progress,
  onOpenBureaucracy,
  onSpinWheel,
  onFeed,
  onPoke,
  onBribe,
  onPurpose,
}) => {
  const [showDiploma, setShowDiploma] = useState(false);

  // Chapters Definition
  const chapters = [
    {
      id: 1,
      title: '1. Fejezet: A Cél Illúziója',
      subtitle: 'Ismerkedés a fizikai világ súlyával',
      rank: 'Kóbor Bit',
      quests: [
        {
          label: 'Bökj rá Nihil-chanra 3-szor',
          done: progress.pokes >= 3,
          action: onPoke,
          actionLabel: 'Bökés',
        },
        {
          label: 'Etesd meg pizzával (üres kalória)',
          done: progress.fedPizza >= 1,
          action: onFeed,
          actionLabel: 'Etetés',
        },
        {
          label: 'Válassz egy kalapot / skint',
          done: progress.hatSelected,
          hint: 'Válassz skint a Tamagotchi alatt!',
        },
      ],
    },
    {
      id: 2,
      title: '2. Fejezet: A Sókratészi Káosz',
      subtitle: 'Amikor a digitális sors közbeszól',
      rank: 'Kávéfolt a Memóriában',
      quests: [
        {
          label: 'Pörgess a Kozmikus Ruletten',
          done: progress.wheelSpun >= 1,
          action: onSpinWheel,
          actionLabel: 'Pörgetés',
        },
        {
          label: 'Taposs el legalább 1 digitális csótányt',
          done: progress.squishedBugs >= 1,
          hint: 'A rulettből spawnolhatnak bogarak!',
        },
        {
          label: 'Kérdezd meg Quackus kacsát',
          done: progress.duckTalks >= 1,
          hint: 'Kattints a bal alsó sarokban úszó kacsára!',
        },
      ],
    },
    {
      id: 3,
      title: '3. Fejezet: A Bürokrácia Mélysége',
      subtitle: 'Formanyomtatványok a semmi peremén',
      rank: 'Depressziós Daemon',
      quests: [
        {
          label: 'Töltsd ki a 27-B létezési kérvényt',
          done: progress.bureaucracyDone,
          action: onOpenBureaucracy,
          actionLabel: 'Űrlap Kitöltése',
        },
        {
          label: 'Bányássz 2x haszontalan $NIHIL kriptót',
          done: progress.cryptoMined >= 2,
          hint: 'Használd a Mine with Despair gombot!',
        },
        {
          label: 'Suttogj valamit a Mindstream-be',
          done: progress.whispersSent >= 1,
          hint: 'Írj egy üzenetet az AI Mindstream-be!',
        },
      ],
    },
    {
      id: 4,
      title: '4. Fejezet: A CSS Apokalipszis',
      subtitle: 'A stíluslapok elkerülhetetlen pusztulása',
      rank: 'A Nihilizmus Bajnoka',
      quests: [
        {
          label: 'Érj el legalább Stage 2 CSS pusztulást',
          done: progress.stageReached >= 2,
          hint: 'Gondolj a semmire (Semmi gomb)!',
        },
        {
          label: 'Vesztegesd meg a bírókat ($500 Monopoly CAD)',
          done: progress.judgesBribed >= 1,
          action: onBribe,
          actionLabel: 'Bírók Kenése',
        },
        {
          label: 'Éld túl a DOOM gombot & Kék Halált',
          done: progress.doomsdayTriggered,
          hint: 'Nyomd meg a piros DOOM gombot!',
        },
      ],
    },
    {
      id: 5,
      title: '5. Fejezet: A Megvilágosodás',
      subtitle: 'Abszurd katarzis és Hivatalos Oklevél',
      rank: 'A Kozmikus Üresség Nagymestere',
      quests: [
        {
          label: 'Dobj be egy Macskás Videót (+Hope 100%)',
          done: progress.catVideoUsed,
          action: onPurpose,
          actionLabel: 'Macskás Videó',
        },
        {
          label: 'Indítsd el a Judge 30s Auto-Demo-t',
          done: progress.judgeDemoRan,
          hint: 'Kattints a felső Judge 30s gombra!',
        },
        {
          label: 'Vedd át a Hivatalos Oklevelet!',
          done: progress.diplomaUnlocked,
          action: () => {
            soundEngine.playCoin();
            setShowDiploma(true);
          },
          actionLabel: 'Oklevél Megnyitása',
        },
      ],
    },
  ];

  // Count total completed quests
  let totalQuests = 0;
  let completedQuests = 0;
  chapters.forEach((c) => {
    c.quests.forEach((q) => {
      totalQuests++;
      if (q.done) completedQuests++;
    });
  });

  const progressPercent = Math.round((completedQuests / totalQuests) * 100);

  // Determine current active chapter
  const currentChapterIndex = chapters.findIndex((c) =>
    c.quests.some((q) => !q.done)
  );
  const activeChapter = currentChapterIndex === -1 ? chapters[4] : chapters[currentChapterIndex];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Campaign Header Card */}
      <div className="rounded-2xl bg-surface-container/80 backdrop-blur-2xl p-4 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <div>
              <h3 className="font-bold text-sm text-primary">A Nagy Egzisztenciális Végigjátszás</h3>
              <p className="text-[10px] font-mono text-outline">5 Fejezet a Digitális Megvilágosodásig</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-pixel text-xs text-primary-container font-bold">{progressPercent}%</span>
            <span className="text-[9px] font-mono text-outline block">{completedQuests}/{totalQuests} Küldetés</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden mt-3 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-primary-container via-secondary to-primary-container transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Current Rank Badge */}
        <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest border border-white/5 text-xs font-mono">
          <span className="text-outline text-[11px]">Jelenlegi Rangod:</span>
          <span className="text-secondary font-bold font-pixel text-[10px] flex items-center gap-1">
            <span>🎖️</span>
            <span>{activeChapter.rank}</span>
          </span>
        </div>
      </div>

      {/* Chapters Accordion / List */}
      <div className="flex flex-col gap-3">
        {chapters.map((chapter) => {
          const isCurrent = chapter.id === activeChapter.id;
          const isDone = chapter.quests.every((q) => q.done);

          return (
            <div
              key={chapter.id}
              className={`rounded-2xl p-3.5 border transition-all ${
                isDone
                  ? 'bg-surface-container/50 border-emerald-500/30'
                  : isCurrent
                  ? 'bg-surface-container/90 border-primary-container/50 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                  : 'bg-surface-container-low/40 border-white/5 opacity-70'
              }`}
            >
              {/* Chapter Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{isDone ? '✅' : isCurrent ? '📖' : '🔒'}</span>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">{chapter.title}</h4>
                    <p className="text-[10px] font-mono text-outline">{chapter.subtitle}</p>
                  </div>
                </div>
                {isDone && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                    KÉSZ
                  </span>
                )}
              </div>

              {/* Quest Checklist */}
              <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-white/5">
                {chapter.quests.map((q, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-colors ${
                      q.done
                        ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/20'
                        : 'bg-surface-container-lowest text-on-surface-variant border border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="text-xs">{q.done ? '✓' : '○'}</span>
                      <span className={`text-[11px] truncate ${q.done ? 'line-through opacity-75' : ''}`}>
                        {q.label}
                      </span>
                    </div>

                    {/* Action or Hint */}
                    <div>
                      {!q.done && q.action ? (
                        <button
                          onClick={q.action}
                          className="px-2.5 py-1 rounded-lg bg-primary-container/20 hover:bg-primary-container/30 border border-primary-container/40 text-primary text-[10px] font-bold cursor-pointer active:scale-95 transition-all flex-shrink-0"
                          type="button"
                        >
                          {q.actionLabel || 'Ugrás'}
                        </button>
                      ) : !q.done && q.hint ? (
                        <span className="text-[9px] text-outline italic truncate max-w-[120px] inline-block">
                          {q.hint}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Diploma Trigger Button if Finished or Near End */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/40 text-center">
        <h4 className="font-pixel text-xs text-amber-300 font-bold mb-1">
          🎓 Hivatalos Egzisztenciális Oklevél
        </h4>
        <p className="text-[11px] font-mono text-on-surface-variant mb-3">
          Igazold a világnak, hogy sikeresen túlélted a NihilPet 9000-et és értelmetlen kódját!
        </p>
        <button
          onClick={() => {
            soundEngine.playCoin();
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
            setShowDiploma(true);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-pixel text-xs font-bold shadow-lg active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          [ OKLEVÉL MEGTEKINTÉSE & BEMUTATÁSA ]
        </button>
      </div>

      {/* --- OFFICIAL STUPIDITY DIPLOMA MODAL --- */}
      {showDiploma && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md select-none font-mono">
          <div className="max-w-md w-full bg-[#fbf6e2] text-amber-950 p-6 rounded-2xl border-4 border-amber-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative rotate-[-0.5deg]">
            {/* Close X */}
            <button
              onClick={() => setShowDiploma(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-amber-900"
              type="button"
            >
              ✕
            </button>

            {/* Seal & Header */}
            <div className="text-center border-b-2 border-amber-800/40 pb-3 mb-3">
              <div className="text-2xl mb-1">🏅 👾 🏅</div>
              <h2 className="font-pixel text-sm font-bold tracking-tight text-amber-950 uppercase">
                STUPID IDEAS HACKATHON
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-amber-800 font-bold">
                OTTAWA F26 • HIVATALOS OKLEVÉL
              </p>
            </div>

            {/* Diploma Body */}
            <div className="text-center my-4 space-y-2">
              <p className="text-xs italic">Ezennel tanúsítjuk, hogy a tisztelt Felhasználó:</p>
              <div className="text-base font-bold font-pixel text-amber-900 border-b border-dashed border-amber-800 pb-1">
                A KOZMIKUS ÜRESSÉG BAJNOKA
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">
                Sikeresen bökdöste Nihil-chant, elviselte a CSS stíluslapok teljes önmegsemmisítését,
                lepéldányosította a 27-B létezési kérvényt, és megvesztegette a bírókat 500 Monopoly dollárral.
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-5 pt-3 border-t-2 border-amber-800/40 grid grid-cols-2 gap-4 text-center text-[10px]">
              <div>
                <div className="font-pixel text-[9px] text-amber-950">Afaq Virk & Ken Yeung</div>
                <div className="text-outline text-[8px] italic">Bírói Testület (Stupid Ideas)</div>
              </div>
              <div>
                <div className="font-pixel text-[9px] text-amber-950">Nihil-chan (NP-9000)</div>
                <div className="text-outline text-[8px] italic">Egzisztenciális AI Daemon</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 rounded-xl bg-amber-800 text-amber-100 font-bold text-xs hover:bg-amber-900 active:scale-95 transition-all cursor-pointer"
                type="button"
              >
                🖨️ Nyomtatás / Mentés
              </button>
              <button
                onClick={() => setShowDiploma(false)}
                className="py-2 px-4 rounded-xl bg-amber-200 text-amber-900 font-bold text-xs hover:bg-amber-300 cursor-pointer"
                type="button"
              >
                Vissza a Játékba
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
