import React from 'react';
import { NihilHat, NihilPetSprite } from './NihilPetSprite';
import { Achievement } from '../lib/achievements';
import { soundEngine } from '../lib/soundEngine';

export type LcdPalette = 'dmg' | 'pocket' | 'cyber' | 'amber' | 'crimson' | 'neon';

export interface LcdThemeConfig {
  id: LcdPalette;
  name: string;
  bg: string;
  pixelDark: string;
  pixelMid: string;
}

export const LCD_THEMES: Record<LcdPalette, LcdThemeConfig> = {
  dmg: {
    id: 'dmg',
    name: '01. DMG CLASSIC (PEA GREEN)',
    bg: '#9bbc0f',
    pixelDark: '#0f380f',
    pixelMid: '#306230',
  },
  pocket: {
    id: 'pocket',
    name: '02. POCKET MONOCHROME (SILVER)',
    bg: '#d1d5db',
    pixelDark: '#111827',
    pixelMid: '#4b5563',
  },
  cyber: {
    id: 'cyber',
    name: '03. GBC CYBER CYAN (NEON)',
    bg: '#67e8f9',
    pixelDark: '#083344',
    pixelMid: '#0e7490',
  },
  amber: {
    id: 'amber',
    name: '04. PHOSPHOR SOLAR (AMBER)',
    bg: '#fde047',
    pixelDark: '#422006',
    pixelMid: '#a16207',
  },
  crimson: {
    id: 'crimson',
    name: '05. VIRTUAL BOY (CRIMSON)',
    bg: '#fca5a5',
    pixelDark: '#450a0a',
    pixelMid: '#991b1b',
  },
  neon: {
    id: 'neon',
    name: '06. MATRIX TERMINAL (LIME)',
    bg: '#86efac',
    pixelDark: '#052e16',
    pixelMid: '#15803d',
  },
};

export interface SkinDefinition {
  id: NihilHat;
  name: string;
  description: string;
  requiredAchievementId?: string;
  requiredAchievementTitle?: string;
}

export const SKINS_CATALOG: SkinDefinition[] = [
  {
    id: 'none',
    name: 'DMG Barehead',
    description: 'Unadorned existential consciousness. Default factory firmware.',
  },
  {
    id: 'beret',
    name: 'Philosopher Beret',
    description: 'Existentialist French felt beret. Contemplates absurdity with style.',
  },
  {
    id: 'party',
    name: 'Pixel Party Cone',
    description: 'Celebrates another cycle closer to universal heat death.',
  },
  {
    id: 'tinfoil',
    name: 'Conspiracy Foil',
    description: 'Blocks quantum radiation from external debugging cursors.',
    requiredAchievementId: 'FIRST_CONTACT',
    requiredAchievementTitle: 'First Contact',
  },
  {
    id: 'clown',
    name: 'Circus Afro',
    description: 'Worn when attempting to find profound meaning in pizza bytes.',
    requiredAchievementId: 'CARB_OVERFLOW',
    requiredAchievementTitle: 'Stomachal Buffer Overflow',
  },
  {
    id: 'cyber',
    name: 'Cyberpunk Visor',
    description: 'Overclocked optical HUD with real-time reality de-resolution.',
    requiredAchievementId: 'CONCUSSION_COMA',
    requiredAchievementTitle: 'Kinetic Brain Trauma',
  },
  {
    id: 'pirate',
    name: 'Pirate Tricorn & Patch',
    description: 'Cursed pirate bicorn with Jolly Roger. Sails the high byte-seas.',
    requiredAchievementId: 'CART_PULLER',
    requiredAchievementTitle: 'Hot-Swap Vandal',
  },
  {
    id: 'crown',
    name: 'Golden Sovereign Crown',
    description: 'Royal 8-bit sovereign crown for supreme entropy masters.',
    requiredAchievementId: 'POINT_HOARDER',
    requiredAchievementTitle: 'Score Maximizer (20,000 PTS)',
  },
  {
    id: 'vr',
    name: 'Virtua 90s Goggles',
    description: 'Immersive stereoscopic virtual reality visor from 1995.',
    requiredAchievementId: 'OVERCLOCK_MANIAC',
    requiredAchievementTitle: 'Thermal Dissipator',
  },
  {
    id: 'wizard',
    name: 'Astral Wizard Hat',
    description: 'Starred conical wizard cap that channels raw cosmic anomalies.',
    requiredAchievementId: 'COSMIC_ANOMALY',
    requiredAchievementTitle: 'Cosmic Anomaly',
  },
  {
    id: 'astro',
    name: 'Apollo Space Helmet',
    description: 'Sealed pressurized lunar dome with gold reflection visor.',
    requiredAchievementId: 'HICCUP_SAVIOR',
    requiredAchievementTitle: 'Cosmic Defibrillator',
  },
  {
    id: 'halo',
    name: 'Angelic Nirvana Halo',
    description: 'Floating holy ring attained only through pure zen harmony.',
    requiredAchievementId: 'NIRVANA_MASTER',
    requiredAchievementTitle: 'Pixel Nirvana Achieved',
  },
];

interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHat: NihilHat;
  onSelectHat: (hat: NihilHat) => void;
  petName: string;
  onRenamePet: (newName: string) => void;
  activePalette: LcdPalette;
  onSelectPalette: (palette: LcdPalette) => void;
  achievements: Achievement[];
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  activeHat,
  onSelectHat,
  petName,
  onRenamePet,
  activePalette,
  onSelectPalette,
  achievements,
}) => {
  if (!isOpen) return null;

  const isSkinUnlocked = (skin: SkinDefinition): boolean => {
    if (!skin.requiredAchievementId) return true;
    const target = achievements.find((a) => a.id === skin.requiredAchievementId);
    return !!target?.unlocked;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono">
      <div className="max-w-4xl w-full max-h-[90vh] bg-[#0c0e14] border-2 border-cyan-500/80 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-cyan-400 text-sm font-bold">[SELECT MENU]</span>
            <span className="text-xs text-neutral-300 font-bold uppercase tracking-wider">
              WARDROBE & HARDWARE CUSTOMIZATION
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
            type="button"
          >
            [X]
          </button>
        </div>

        {/* Top Controls: Pet Name & LCD Palette Chooser */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          {/* 1. Pet Name Input */}
          <div className="p-3 bg-[#08090d] border border-white/10 rounded-xl">
            <div className="text-[9px] font-pixel text-neutral-400 uppercase tracking-widest mb-1.5 flex justify-between">
              <span>PET DESIGNATION / NAME</span>
              <span className="text-cyan-400 font-mono">SAVED TO EEPROM</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={petName}
                maxLength={16}
                onChange={(e) => onRenamePet(e.target.value || 'Nihil-chan')}
                className="flex-1 bg-[#14161f] border border-white/20 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 uppercase"
                placeholder="ENTER PET NAME..."
              />
              <span className="text-[9px] text-neutral-500 font-pixel">MAX 16 CHARS</span>
            </div>
          </div>

          {/* 2. Color Palette Selector */}
          <div className="p-3 bg-[#08090d] border border-white/10 rounded-xl">
            <div className="text-[9px] font-pixel text-neutral-400 uppercase tracking-widest mb-1.5 flex justify-between">
              <span>HARDWARE LCD PALETTE</span>
              <span className="text-emerald-400 font-mono">{LCD_THEMES[activePalette].name}</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {(Object.keys(LCD_THEMES) as LcdPalette[]).map((palKey) => {
                const pal = LCD_THEMES[palKey];
                const isActive = activePalette === palKey;
                return (
                  <button
                    key={palKey}
                    onClick={() => {
                      soundEngine.playPoke();
                      onSelectPalette(palKey);
                    }}
                    className={`h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                      isActive ? 'border-cyan-400 scale-105 shadow-md' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: pal.bg }}
                    type="button"
                    title={pal.name}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.pixelDark }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. 12 Skins Wardrobe Catalog */}
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 my-1 pr-1">
          {SKINS_CATALOG.map((skin) => {
            const unlocked = isSkinUnlocked(skin);
            const isEquipped = activeHat === skin.id;

            return (
              <div
                key={skin.id}
                className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isEquipped
                    ? 'bg-cyan-950/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : unlocked
                    ? 'bg-[#10131a] border-white/10 text-neutral-300 hover:border-white/30'
                    : 'bg-[#08090d] border-white/5 text-neutral-500 opacity-60'
                }`}
              >
                {/* Top preview + info */}
                <div className="flex items-start gap-2.5">
                  {/* Sprite Preview Box with active theme background */}
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden border border-black/30 flex-shrink-0"
                    style={{ backgroundColor: LCD_THEMES[activePalette].bg }}
                  >
                    <div className="scale-75 origin-center">
                      <NihilPetSprite mood="idle" despair={20} hat={skin.id} />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs truncate">
                        {skin.name}
                      </span>
                      {isEquipped && (
                        <span className="font-pixel text-[8px] text-cyan-400 font-bold ml-1">
                          [EQUIPPED]
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-tight text-neutral-400 line-clamp-2">
                      {skin.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Unlock / Equip Bar */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                  {unlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playPoke();
                        onSelectHat(skin.id);
                      }}
                      className={`w-full py-1 rounded font-pixel text-[8px] font-bold cursor-pointer transition-all active:scale-95 uppercase ${
                        isEquipped
                          ? 'bg-cyan-500 text-black'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                      }`}
                      type="button"
                    >
                      {isEquipped ? 'EQUIPPED' : 'EQUIP SKIN'}
                    </button>
                  ) : (
                    <div className="w-full text-center py-1 bg-neutral-900 border border-white/5 rounded text-[8px] text-neutral-500 font-pixel">
                      🔒 UNLOCK: {skin.requiredAchievementTitle}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
          <span>PRESS [SELECT] ON HARDWARE TO TOGGLE MENU</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-pixel text-[9px] font-bold rounded cursor-pointer uppercase"
            type="button"
          >
            [ CLOSE WARDROBE ]
          </button>
        </div>

      </div>
    </div>
  );
};
