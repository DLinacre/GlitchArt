import React, { useState } from 'react';
import { ThemePreset, BrandProfile } from '../types';
import { Palette, Wand2, Plus, Trash2, Check, X, Sparkles, Sliders, Type, Layers, CheckCircle2 } from 'lucide-react';

interface BrandHarmonizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: ThemePreset[];
  activePresetId: string;
  onSelectPreset: (preset: ThemePreset) => void;
  onSaveCustomPreset: (preset: ThemePreset) => void;
  onDeleteCustomPreset: (id: string) => void;
  activeProfile: BrandProfile;
  studioPresetText: string;
}

const COLOR_SWATCHES = [
  { name: 'Cyan Neon', hex: '#06b6d4' },
  { name: 'Crimson Red', hex: '#ef4444' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Purple Glow', hex: '#a855f7' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Pink Cyber', hex: '#ec4899' },
  { name: 'Cobalt Blue', hex: '#3b82f6' },
  { name: 'Rose Sunset', hex: '#f43f5e' },
];

const FONT_OPTIONS = [
  { label: 'JetBrains Mono (Coding/Cyber)', value: 'JetBrains Mono, monospace' },
  { label: 'Space Grotesk (Modern HUD)', value: 'Space Grotesk, sans-serif' },
  { label: 'Fira Code (Technical)', value: 'Fira Code, monospace' },
  { label: 'Inter (Clean Standard)', value: 'Inter, sans-serif' },
  { label: 'Source Code Pro (Terminal)', value: 'Source Code Pro, monospace' },
];

export const BrandHarmonizerModal: React.FC<BrandHarmonizerModalProps> = ({
  isOpen,
  onClose,
  presets,
  activePresetId,
  onSelectPreset,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  activeProfile,
  studioPresetText,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'create'>('presets');

  // New Custom Preset Form State
  const [customName, setCustomName] = useState('My Custom Brand Style');
  const [customProfile, setCustomProfile] = useState<BrandProfile>(activeProfile);
  const [primaryColor, setPrimaryColor] = useState('#06b6d4');
  const [accentColor, setAccentColor] = useState('#ec4899');
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [glitchPrompt, setGlitchPrompt] = useState(
    studioPresetText || 'High-contrast Glitch-Tech Cyberpunk HUD with neon scanlines'
  );
  const [savedSuccessToast, setSavedSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newPreset: ThemePreset = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      brandProfile: customProfile,
      primaryColor,
      accentColor,
      fontFamily,
      glitchPresetPrompt: glitchPrompt.trim() || 'Custom Glitch Studio Preset',
      badgeText: 'CUSTOM',
      description: `User defined custom theme preset for @${customProfile}`,
      isCustom: true,
    };

    onSaveCustomPreset(newPreset);
    onSelectPreset(newPreset);
    setSavedSuccessToast(`Saved and applied "${newPreset.name}"!`);
    setTimeout(() => {
      setSavedSuccessToast(null);
      setActiveTab('presets');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-gray-950 border border-cyan-500/40 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-cyan-500/10">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-black text-white font-mono flex items-center gap-2">
                <span>GLOBAL BRAND HARMONIZER</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  SYSTEM ENGINE
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Harmonize colors, typography, brand profiles, and GlitchStudio prompts into saved Theme Presets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center border-b border-gray-800 bg-gray-900/60 px-5 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 font-mono text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-gray-950 border-cyan-500/50 text-cyan-300 border-b-gray-950'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Saved Theme Presets ({presets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 font-mono text-xs font-bold rounded-t-xl border-t border-x transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'create'
                ? 'bg-gray-950 border-purple-500/50 text-purple-300 border-b-gray-950'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Create New Preset</span>
          </button>
        </div>

        {/* Saved Success Toast */}
        {savedSuccessToast && (
          <div className="m-4 p-3 bg-emerald-950 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{savedSuccessToast}</span>
          </div>
        )}

        {/* Modal Body Scroll Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {activeTab === 'presets' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {presets.map((p) => {
                  const isActive = p.id === activePresetId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectPreset(p)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                        isActive
                          ? 'bg-gradient-to-br from-cyan-950/60 to-purple-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                          : 'bg-gray-900/80 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                      }`}
                    >
                      {/* Active Indicator Badge */}
                      {isActive && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono text-[10px] font-black flex items-center gap-1 shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>ACTIVE</span>
                        </span>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: p.primaryColor }}
                          />
                          <h4 className="font-bold text-white text-sm font-mono group-hover:text-cyan-300 transition-colors">
                            {p.name}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                            @{p.brandProfile}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed mb-3">
                          {p.description || p.glitchPresetPrompt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono">
                        {/* Swatches & Font info */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-1">
                            <span
                              className="w-4 h-4 rounded-full border border-gray-950"
                              style={{ backgroundColor: p.primaryColor }}
                              title={`Primary: ${p.primaryColor}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-gray-950"
                              style={{ backgroundColor: p.accentColor }}
                              title={`Accent: ${p.accentColor}`}
                            />
                          </div>
                          <span className="text-gray-400 truncate max-w-[130px]">
                            {p.fontFamily.split(',')[0]}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {p.isCustom && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCustomPreset(p.id);
                              }}
                              className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                              title="Delete custom preset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onSelectPreset(p)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                            }`}
                          >
                            {isActive ? 'Applied' : 'Apply Preset'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveNew} className="space-y-5">
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
                <h3 className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Configure Brand Style Tokens</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Preset Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Ultra Cyber Violet"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Target Brand Profile
                    </label>
                    <select
                      value={customProfile}
                      onChange={(e) => setCustomProfile(e.target.value as BrandProfile)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                    >
                      <option value="dlinacre">@DLinacre (Systems & Core)</option>
                      <option value="lin4cre">@LIN4CRE (Game Studio)</option>
                      <option value="linacre_site">linacre.site (Central Hub)</option>
                    </select>
                  </div>
                </div>

                {/* Primary & Accent Color Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Primary Brand Color ({primaryColor})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                      />
                      <div className="flex flex-wrap gap-1 flex-1">
                        {COLOR_SWATCHES.map((swatch) => (
                          <button
                            key={swatch.hex}
                            type="button"
                            onClick={() => setPrimaryColor(swatch.hex)}
                            className={`w-5 h-5 rounded-full border transition-all ${
                              primaryColor === swatch.hex ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                            title={swatch.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Accent Glow Color ({accentColor})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                      />
                      <div className="flex flex-wrap gap-1 flex-1">
                        {COLOR_SWATCHES.map((swatch) => (
                          <button
                            key={swatch.hex}
                            type="button"
                            onClick={() => setAccentColor(swatch.hex)}
                            className={`w-5 h-5 rounded-full border transition-all ${
                              accentColor === swatch.hex ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                            title={swatch.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Font Selection */}
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-purple-400" />
                    <span>Typography Family</span>
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-400"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* GlitchStudio Prompt Default */}
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    <span>GlitchStudio Preset Prompt Text</span>
                  </label>
                  <textarea
                    rows={2}
                    value={glitchPrompt}
                    onChange={(e) => setGlitchPrompt(e.target.value)}
                    placeholder="Enter GlitchStudio text prompt..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 bg-gray-950 border border-purple-500/40 rounded-xl space-y-2 font-mono">
                <span className="text-[10px] text-purple-400 font-bold block">
                  LIVE BRAND HARMONIZER PREVIEW
                </span>
                <div
                  className="p-3 rounded-lg border flex items-center justify-between"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    borderColor: `${primaryColor}50`,
                    fontFamily: fontFamily,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xs shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {customProfile === 'dlinacre' ? 'DL' : customProfile === 'lin4cre' ? 'L4' : 'LS'}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs" style={{ color: primaryColor }}>
                        {customName || 'Theme Preview'}
                      </h5>
                      <span className="text-[10px] text-gray-400">@{customProfile} • {fontFamily.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-950"
                      style={{ backgroundColor: accentColor }}
                    >
                      ACCENT
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className="px-4 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>SAVE & HARMONIZE BRAND PRESET</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
