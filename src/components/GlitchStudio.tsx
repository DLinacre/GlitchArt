import React, { useState } from 'react';
import { StudioConfig, BrandProfile } from '../types';
import { Sparkles, Download, Copy, Check, RefreshCw, Layers, Palette, ChevronDown, Zap, Activity } from 'lucide-react';

interface GlitchStudioProps {
  activeProfile: BrandProfile;
  initialText?: string;
  onInspectAsset: (svgCode: string, name: string) => void;
}

export interface ColorPalettePreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glowClass: string;
  previewCardBorder: string;
  previewCardBg: string;
}

export const PALETTE_THEMES: ColorPalettePreset[] = [
  {
    id: 'cyber_cyan',
    name: 'Cyber-Cyan',
    primary: '#00F0FF',
    secondary: '#FF0055',
    description: 'Neon Cyan & Glitch Crimson',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-500/50',
    badgeText: 'text-cyan-300',
    glowClass: 'shadow-[0_0_30px_rgba(0,240,255,0.15)]',
    previewCardBorder: 'border-cyan-500/40',
    previewCardBg: 'bg-cyan-950/15',
  },
  {
    id: 'volcanic_red',
    name: 'Volcanic-Red',
    primary: '#FF0055',
    secondary: '#FF5500',
    description: 'Magma Crimson & Flaming Orange',
    badgeBg: 'bg-red-950/60',
    badgeBorder: 'border-red-500/50',
    badgeText: 'text-red-300',
    glowClass: 'shadow-[0_0_30px_rgba(255,0,85,0.15)]',
    previewCardBorder: 'border-red-500/40',
    previewCardBg: 'bg-red-950/15',
  },
  {
    id: 'matrix_green',
    name: 'Matrix-Green',
    primary: '#00FF66',
    secondary: '#00F0FF',
    description: 'Terminal Hacker Green & Tech Cyan',
    badgeBg: 'bg-emerald-950/60',
    badgeBorder: 'border-emerald-500/50',
    badgeText: 'text-emerald-300',
    glowClass: 'shadow-[0_0_30px_rgba(0,255,102,0.15)]',
    previewCardBorder: 'border-emerald-500/40',
    previewCardBg: 'bg-emerald-950/15',
  },
  {
    id: 'synth_purple',
    name: 'Synth-Purple',
    primary: '#B000FF',
    secondary: '#FF0055',
    description: 'Vaporwave Violet & Hot Pink',
    badgeBg: 'bg-purple-950/60',
    badgeBorder: 'border-purple-500/50',
    badgeText: 'text-purple-300',
    glowClass: 'shadow-[0_0_30px_rgba(176,0,255,0.15)]',
    previewCardBorder: 'border-purple-500/40',
    previewCardBg: 'bg-purple-950/15',
  },
  {
    id: 'electric_gold',
    name: 'Electric-Gold',
    primary: '#FFCC00',
    secondary: '#FF0055',
    description: 'High Voltage Yellow & Laser Crimson',
    badgeBg: 'bg-amber-950/60',
    badgeBorder: 'border-amber-500/50',
    badgeText: 'text-amber-300',
    glowClass: 'shadow-[0_0_30px_rgba(255,204,0,0.15)]',
    previewCardBorder: 'border-amber-500/40',
    previewCardBg: 'bg-amber-950/15',
  },
  {
    id: 'toxic_lime',
    name: 'Toxic-Lime',
    primary: '#CCFF00',
    secondary: '#9900FF',
    description: 'Biohazard Lime & Electric Violet',
    badgeBg: 'bg-lime-950/60',
    badgeBorder: 'border-lime-500/50',
    badgeText: 'text-lime-300',
    glowClass: 'shadow-[0_0_30px_rgba(204,255,0,0.15)]',
    previewCardBorder: 'border-lime-500/40',
    previewCardBg: 'bg-lime-950/15',
  },
  {
    id: 'ultra_blue',
    name: 'Ultra-Blue',
    primary: '#0099FF',
    secondary: '#00FF66',
    description: 'Deep Cyber Blue & Quantum Green',
    badgeBg: 'bg-blue-950/60',
    badgeBorder: 'border-blue-500/50',
    badgeText: 'text-blue-300',
    glowClass: 'shadow-[0_0_30px_rgba(0,153,255,0.15)]',
    previewCardBorder: 'border-blue-500/40',
    previewCardBg: 'bg-blue-950/15',
  },
  {
    id: 'stealth_white',
    name: 'Stealth-White',
    primary: '#FFFFFF',
    secondary: '#00F0FF',
    description: 'Monochrome Cyber & Ice Accent',
    badgeBg: 'bg-slate-900',
    badgeBorder: 'border-slate-400/50',
    badgeText: 'text-slate-200',
    glowClass: 'shadow-[0_0_30px_rgba(255,255,255,0.15)]',
    previewCardBorder: 'border-slate-400/40',
    previewCardBg: 'bg-slate-950/20',
  },
];

export const GlitchStudio: React.FC<GlitchStudioProps> = ({
  activeProfile,
  initialText,
  onInspectAsset,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('cyber_cyan');

  const [config, setConfig] = useState<StudioConfig>({
    profile: activeProfile,
    titleText: initialText || (activeProfile === 'dlinacre' ? 'DLINACRE' : activeProfile === 'lin4cre' ? 'LIN4CRE' : 'LINACRE.SITE'),
    subtitleText: activeProfile === 'dlinacre' ? 'SYSTEMS & CORE ENGINES' : activeProfile === 'lin4cre' ? 'CREATIVE GAME STUDIO' : 'CENTRAL BRAND HUB',
    handleText: activeProfile === 'dlinacre' ? '@DLinacre' : activeProfile === 'lin4cre' ? '@LIN4CRE' : 'linacre.site',
    themeColor: PALETTE_THEMES[0].primary,
    secondaryColor: PALETTE_THEMES[0].secondary,
    glitchIntensity: 45,
    scanlines: true,
    gridOverlay: true,
    selectedIcon: activeProfile === 'lin4cre' ? 'joystick' : 'terminal',
    assetType: 'banner',
    aspectRatio: '16:9',
  });

  const [copied, setCopied] = useState(false);
  const [liveGlitchMode, setLiveGlitchMode] = useState(false);

  // Active theme preset object
  const activePalette = PALETTE_THEMES.find((p) => p.id === selectedThemeId) || PALETTE_THEMES[0];

  const handlePaletteSelect = (themeId: string) => {
    setSelectedThemeId(themeId);
    const pal = PALETTE_THEMES.find((p) => p.id === themeId);
    if (pal) {
      setConfig((prev) => ({
        ...prev,
        themeColor: pal.primary,
        secondaryColor: pal.secondary,
      }));
    }
  };

  // Generate SVG Code dynamically based on config
  const generateStudioSvg = (): string => {
    const isSquare = config.assetType === 'avatar' || config.aspectRatio === '1:1';
    const viewBox = isSquare ? '0 0 512 512' : '0 0 1200 400';
    const width = isSquare ? 512 : 1200;
    const height = isSquare ? 512 : 400;

    const glitchOffset = (config.glitchIntensity / 100) * 12;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">
  <rect width="${width}" height="${height}" fill="#080B12"/>
  
  ${
    config.gridOverlay
      ? `<pattern id="st_grid" width="32" height="32" patternUnits="userSpaceOnUse">
    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#131B2A" stroke-width="1"/>
  </pattern>
  <rect width="${width}" height="${height}" fill="url(#st_grid)"/>`
      : ''
  }

  <!-- Circuit Schematic Outer Traces -->
  <path d="M 40 60 L 200 60 L 240 100" fill="none" stroke="${config.secondaryColor}" stroke-width="2"/>
  <circle cx="40" cy="60" r="5" fill="${config.secondaryColor}"/>
  <path d="M ${width - 40} ${height - 60} L ${width - 200} ${height - 60} L ${width - 240} ${height - 100}" fill="none" stroke="${config.themeColor}" stroke-width="2"/>
  <circle cx="${width - 40}" cy="${height - 60}" r="5" fill="${config.themeColor}"/>

  ${
    isSquare
      ? `<!-- Square Avatar Custom Layout -->
  <g transform="translate(156, 120)">
    <!-- Glitch Shift Primary -->
    <text x="${100 - glitchOffset}" y="100" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="52" fill="${config.themeColor}" text-anchor="middle" opacity="0.8">${config.titleText}</text>
    <!-- Glitch Shift Secondary -->
    <text x="${100 + glitchOffset}" y="100" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="52" fill="${config.secondaryColor}" text-anchor="middle" opacity="0.8">${config.titleText}</text>
    <!-- Core White -->
    <text x="100" y="100" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="52" fill="#FFFFFF" text-anchor="middle">${config.titleText}</text>
  </g>
  <text x="256" y="320" font-family="sans-serif" font-weight="bold" font-size="16" fill="${config.secondaryColor}" text-anchor="middle" letter-spacing="3">${config.subtitleText}</text>
  `
      : `<!-- Widescreen Banner Layout -->
  <g transform="translate(80, 160)">
    <!-- Shift Primary -->
    <text x="${-glitchOffset}" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="60" fill="${config.themeColor}" letter-spacing="4" opacity="0.8">${config.titleText}</text>
    <!-- Shift Secondary -->
    <text x="${glitchOffset}" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="60" fill="${config.secondaryColor}" letter-spacing="4" opacity="0.8">${config.titleText}</text>
    <!-- Core White -->
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="60" fill="#FFFFFF" letter-spacing="4">${config.titleText}</text>

    <!-- Subtitle -->
    <text x="0" y="48" font-family="'Space Grotesk', sans-serif" font-size="20" fill="#94A3B8" letter-spacing="2">${config.subtitleText}</text>
  </g>

  <!-- Handle Badge -->
  <rect x="80" y="260" width="220" height="38" rx="8" fill="#121A2B" stroke="${config.secondaryColor}" stroke-width="1.5"/>
  <text x="190" y="285" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="14" fill="${config.secondaryColor}" text-anchor="middle">${config.handleText}</text>
  `
  }

  ${
    config.scanlines
      ? `<!-- Scanline Overlay -->
  <line x1="0" y1="${height * 0.35}" x2="${width}" y2="${height * 0.35}" stroke="${config.themeColor}" stroke-width="2" opacity="0.6"/>
  <line x1="0" y1="${height * 0.65}" x2="${width}" y2="${height * 0.65}" stroke="${config.secondaryColor}" stroke-width="2" opacity="0.6"/>`
      : ''
  }
</svg>`;
  };

  const currentSvg = generateStudioSvg();

  const handleCopySvg = () => {
    navigator.clipboard.writeText(currentSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    const isSquare = config.assetType === 'avatar' || config.aspectRatio === '1:1';
    const canvas = document.createElement('canvas');
    canvas.width = isSquare ? 1024 : 1920;
    canvas.height = isSquare ? 1024 : 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([currentSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `glitch_${activePalette.name.toLowerCase()}_${config.titleText.toLowerCase().replace(/[^a-z0-9]/g, '_')}_linacre.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Control Panel Column */}
      <div className="lg:col-span-5 space-y-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white">Glitch Tech Studio Generator</h2>
          </div>
          <button
            onClick={() => {
              handlePaletteSelect('cyber_cyan');
              setConfig({
                ...config,
                titleText: activeProfile === 'dlinacre' ? 'DLINACRE' : activeProfile === 'lin4cre' ? 'LIN4CRE' : 'LINACRE.SITE',
                glitchIntensity: 45,
                themeColor: PALETTE_THEMES[0].primary,
                secondaryColor: PALETTE_THEMES[0].secondary,
              });
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Reset Controls"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Text Customizer Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-gray-400 mb-1">
              PRIMARY BRAND TITLE
            </label>
            <input
              type="text"
              value={config.titleText}
              onChange={(e) => setConfig({ ...config, titleText: e.target.value })}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-red-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-gray-400 mb-1">
              SUBTITLE / SLOGAN
            </label>
            <input
              type="text"
              value={config.subtitleText}
              onChange={(e) => setConfig({ ...config, subtitleText: e.target.value })}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-gray-300 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-gray-400 mb-1">
              HANDLE / DOMAIN
            </label>
            <input
              type="text"
              value={config.handleText}
              onChange={(e) => setConfig({ ...config, handleText: e.target.value })}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Color Palette Stateful Dropdown Selector */}
        <div className="pt-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>COLOR PALETTE THEME</span>
            </label>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${activePalette.badgeBg} ${activePalette.badgeBorder} ${activePalette.badgeText}`}>
              {activePalette.name}
            </span>
          </div>

          {/* Stateful Dropdown Component */}
          <div className="relative">
            <select
              value={selectedThemeId}
              onChange={(e) => handlePaletteSelect(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 hover:border-gray-700 text-white font-mono text-xs rounded-xl px-3.5 py-3 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
            >
              {PALETTE_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id} className="bg-gray-950 text-gray-200 py-2">
                  {theme.name} ({theme.description})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3.5 top-3.5" />
          </div>

          {/* Quick Theme Swatches Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {PALETTE_THEMES.map((pal) => {
              const isSelected = selectedThemeId === pal.id;
              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => handlePaletteSelect(pal.id)}
                  title={`${pal.name}: ${pal.description}`}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gray-800 border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-gray-950 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full shadow" style={{ backgroundColor: pal.primary }}></span>
                    <span className="w-3 h-3 rounded-full shadow" style={{ backgroundColor: pal.secondary }}></span>
                  </div>
                  <span className={`text-[10px] font-mono line-clamp-1 ${isSelected ? 'text-cyan-300 font-bold' : 'text-gray-400'}`}>
                    {pal.name.split('-')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hex Values Custom Override */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1">PRIMARY ACCENT</label>
              <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={config.themeColor}
                  onChange={(e) => setConfig({ ...config, themeColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={config.themeColor}
                  onChange={(e) => setConfig({ ...config, themeColor: e.target.value })}
                  className="w-full bg-transparent font-mono text-xs text-gray-300 focus:outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1">SECONDARY ACCENT</label>
              <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg p-1.5">
                <input
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                  className="w-full bg-transparent font-mono text-xs text-gray-300 focus:outline-none uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sliders & Toggles */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono font-bold text-gray-400">
                GLITCH DISTORTION INTENSITY
              </label>
              <span className="text-xs font-mono text-red-400">{config.glitchIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.glitchIntensity}
              onChange={(e) => setConfig({ ...config, glitchIntensity: Number(e.target.value) })}
              className="w-full accent-red-500 bg-gray-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfig({ ...config, scanlines: !config.scanlines })}
              className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-between ${
                config.scanlines
                  ? 'bg-red-950/40 border-red-500 text-red-300'
                  : 'bg-gray-950 border-gray-800 text-gray-500'
              }`}
            >
              <span>Scanline Overlay</span>
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
            </button>

            <button
              onClick={() => setConfig({ ...config, gridOverlay: !config.gridOverlay })}
              className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-between ${
                config.gridOverlay
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                  : 'bg-gray-950 border-gray-800 text-gray-500'
              }`}
            >
              <span>Matrix Grid</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            </button>
          </div>
        </div>

        {/* Asset Type Switcher */}
        <div className="pt-4 border-t border-gray-800">
          <label className="block text-xs font-mono font-bold text-gray-400 mb-2">ASSET ASPECT RATIO</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfig({ ...config, assetType: 'banner', aspectRatio: '16:9' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all ${
                config.aspectRatio === '16:9'
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-gray-950 border-gray-800 text-gray-400'
              }`}
            >
              16:9 Widescreen Banner
            </button>
            <button
              onClick={() => setConfig({ ...config, assetType: 'avatar', aspectRatio: '1:1' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all ${
                config.aspectRatio === '1:1'
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-gray-950 border-gray-800 text-gray-400'
              }`}
            >
              1:1 Square Avatar
            </button>
          </div>
        </div>

      </div>

      {/* Right Canvas / SVG Live Output Column dynamically re-skinned with activePalette CSS classes */}
      <div className="lg:col-span-7 space-y-6">
        <div className={`bg-gray-900 border rounded-2xl p-6 shadow-2xl space-y-6 transition-all duration-300 ${activePalette.previewCardBorder} ${activePalette.glowClass}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-800 gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className={`w-5 h-5 ${activePalette.badgeText}`} />
                <span>Live Canvas Render Output</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time artwork dynamically themed to <span className={`font-semibold ${activePalette.badgeText}`}>{activePalette.name}</span> palette.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Live Glitch Mode Animation Toggle */}
              <button
                type="button"
                onClick={() => setLiveGlitchMode(!liveGlitchMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                  liveGlitchMode
                    ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/30 animate-pulse'
                    : 'bg-gray-950 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
                }`}
                title="Toggle CSS Keyframe Glitch Animation"
              >
                <Zap className={`w-3.5 h-3.5 ${liveGlitchMode ? 'text-yellow-300' : 'text-gray-500'}`} />
                <span>{liveGlitchMode ? 'LIVE GLITCH: ON' : 'LIVE GLITCH: OFF'}</span>
              </button>

              <span className={`px-2.5 py-1.5 rounded bg-gray-950 font-mono text-xs border ${activePalette.badgeBorder} ${activePalette.badgeText}`}>
                {config.aspectRatio === '1:1' ? '512x512' : '1200x400'}
              </span>
            </div>
          </div>

          {/* SVG Preview Container dynamically styled with palette classes & animated glitch keyframe effects */}
          <div className={`relative w-full rounded-2xl p-4 border shadow-inner overflow-hidden flex items-center justify-center min-h-[300px] transition-all duration-300 ${activePalette.previewCardBg} ${activePalette.previewCardBorder}`}>
            {liveGlitchMode && (
              <div className="absolute inset-0 pointer-events-none z-10 glitch-scanlines-overlay opacity-40" />
            )}
            <div
              className={`w-full h-full max-h-[420px] flex items-center justify-center transition-all ${
                liveGlitchMode ? 'animate-glitch-live' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: currentSvg }}
            />
          </div>

          {/* Export Action Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleDownloadPng}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-mono font-bold text-xs shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD HIGH-RES PNG</span>
            </button>

            <button
              onClick={handleCopySvg}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 font-mono font-bold text-xs border border-gray-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'SVG Copied!' : 'COPY RAW SVG CODE'}</span>
            </button>

            <button
              onClick={() => onInspectAsset(currentSvg, config.titleText)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-gray-950 hover:bg-gray-800 text-gray-300 font-mono text-xs border border-gray-800"
            >
              Inspect
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

