import React, { useState, useEffect, useRef } from 'react';
import { StudioConfig, BrandProfile } from '../types';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Palette,
  ChevronDown,
  Zap,
  Activity,
  Bot,
  Wand2,
  Loader2,
  Lightbulb,
  ArrowRight,
  Cpu,
  Code,
  Terminal,
  Shield,
  FileCode,
  Music,
  Volume2,
  VolumeX,
  Dices,
  Play,
  Pause,
  Square,
  Radio,
  Headphones,
  Disc,
} from 'lucide-react';
import {
  ThemeTunePlayer,
  THEME_TUNE_TRACKS,
  generateInfiniteRandomPrompt,
  ThemeTuneTrack,
} from '../utils/themeTuneSynth';

interface GlitchStudioProps {
  activeProfile: BrandProfile;
  initialText?: string;
  onInspectAsset: (svgCode: string, name: string) => void;
}

export interface ColorPalettePreset {
  id: string;
  name: string;
  category: 'Apple Glass' | 'Minimalist' | 'Technical' | 'Creative';
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

export interface PresetExample {
  id: string;
  title: string;
  subtitle: string;
  category: 'Apple Glass' | 'Minimalist' | 'Technical' | 'Creative';
  themeId: string;
  assetType: StudioConfig['assetType'];
  titleText: string;
  subtitleText: string;
  handleText: string;
  selectedIcon: StudioConfig['selectedIcon'];
  layoutMode?: 'standard' | 'badge' | 'split' | 'minimalist';
  glitchIntensity: number;
  previewGradient: string;
}

export interface RepoContextPreset {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  topics: string[];
}

export interface GeminiSuggestion {
  titleText: string;
  subText: string;
  handleText: string;
  iconStyle: string;
  themePreset: string;
  reasoning: string;
}

export const SAMPLE_REPOS_CONTEXT: RepoContextPreset[] = [
  {
    id: 'glitch-tech-ui',
    name: 'glitch-tech-ui',
    fullName: 'DLinacre/glitch-tech-ui',
    description: 'Cyberpunk HUD components, SVG glitch shaders, and high-frequency UI generators for React & Vite.',
    language: 'TypeScript',
    topics: ['ui-kit', 'glitch-art', 'cyberpunk', 'svg', 'hud'],
  },
  {
    id: 'art-folder-generator',
    name: 'art-folder-generator',
    fullName: 'DLinacre/art-folder-generator',
    description: 'Standardized 🎨_folder architecture & asset pack builder for game developers and open source repos.',
    language: 'TypeScript',
    topics: ['asset-management', 'github-repo', 'folder-tree', 'gamedev'],
  },
  {
    id: 'cyber-engine-core',
    name: 'cyber-engine-core',
    fullName: 'DLinacre/cyber-engine-core',
    description: 'Real-time state synchronization, WebGL renderer, and low-latency packet dispatcher.',
    language: 'C++',
    topics: ['engine', 'webgl', 'networking', 'realtime'],
  },
  {
    id: 'linacre-auth-vault',
    name: 'linacre-auth-vault',
    fullName: 'DLinacre/linacre-auth-vault',
    description: 'Zero-trust authentication protocol & encrypted local state engine.',
    language: 'Rust',
    topics: ['security', 'auth', 'oauth', 'cryptography'],
  },
  {
    id: 'cyber-runner-3d',
    name: 'cyber-runner-3d',
    fullName: 'LIN4CRE/cyber-runner-3d',
    description: 'High-octane neon runner web game engine with particle physics and synthwave audio synth.',
    language: 'TypeScript',
    topics: ['game-engine', 'canvas', 'synthwave', 'threejs'],
  },
  {
    id: 'linacre-site-core',
    name: 'linacre-site-core',
    fullName: 'linacre_site/linacre-site-core',
    description: 'Central brand asset hub, vector catalog system, and profile customizing infrastructure.',
    language: 'TypeScript',
    topics: ['brand-hub', 'vector-art', 'design-system'],
  },
];

export const PALETTE_THEMES: ColorPalettePreset[] = [
  // Apple Glass Category
  {
    id: 'apple_dark_glass',
    name: 'Apple-Dark-Glass',
    category: 'Apple Glass',
    primary: '#38BDF8',
    secondary: '#F8FAFC',
    description: 'Cupertino Dark Glass with Frosted Backdrop & Silver Titanium accents',
    badgeBg: 'bg-slate-900/80 backdrop-blur-md',
    badgeBorder: 'border-white/20',
    badgeText: 'text-sky-200',
    glowClass: 'shadow-[0_0_35px_rgba(56,189,248,0.2)]',
    previewCardBorder: 'border-slate-300/30',
    previewCardBg: 'bg-slate-900/60 backdrop-blur-xl',
  },
  {
    id: 'cupertino_titanium',
    name: 'Cupertino-Titanium',
    category: 'Apple Glass',
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    description: 'Space Black Titanium Frame & Translucent Satin Glass',
    badgeBg: 'bg-gray-900/90 backdrop-blur-md',
    badgeBorder: 'border-slate-500/40',
    badgeText: 'text-slate-100',
    glowClass: 'shadow-[0_0_35px_rgba(241,245,249,0.15)]',
    previewCardBorder: 'border-slate-400/30',
    previewCardBg: 'bg-gray-950/70 backdrop-blur-2xl',
  },
  {
    id: 'obsidian_liquid',
    name: 'Obsidian-Liquid-Glass',
    category: 'Apple Glass',
    primary: '#818CF8',
    secondary: '#C084FC',
    description: 'Deep Translucent Obsidian Glass with Soft Ambient Glow',
    badgeBg: 'bg-indigo-950/80 backdrop-blur-md',
    badgeBorder: 'border-indigo-400/40',
    badgeText: 'text-indigo-200',
    glowClass: 'shadow-[0_0_35px_rgba(129,140,248,0.2)]',
    previewCardBorder: 'border-indigo-400/30',
    previewCardBg: 'bg-indigo-950/40 backdrop-blur-xl',
  },
  {
    id: 'frosted_ice',
    name: 'Frosted-Ice-Glass',
    category: 'Apple Glass',
    primary: '#06B6D4',
    secondary: '#F8FAFC',
    description: 'Subtle Satin Ice Sheen with Translucent Backdrop',
    badgeBg: 'bg-cyan-950/80 backdrop-blur-md',
    badgeBorder: 'border-cyan-400/40',
    badgeText: 'text-cyan-200',
    glowClass: 'shadow-[0_0_35px_rgba(6,182,212,0.2)]',
    previewCardBorder: 'border-cyan-400/30',
    previewCardBg: 'bg-cyan-950/30 backdrop-blur-xl',
  },

  // Minimalist Category
  {
    id: 'stealth_white',
    name: 'Stealth-White',
    category: 'Minimalist',
    primary: '#FFFFFF',
    secondary: '#00F0FF',
    description: 'Monochrome Cyber & Crisp Ice Accent',
    badgeBg: 'bg-slate-900',
    badgeBorder: 'border-slate-400/50',
    badgeText: 'text-slate-200',
    glowClass: 'shadow-[0_0_30px_rgba(255,255,255,0.15)]',
    previewCardBorder: 'border-slate-400/40',
    previewCardBg: 'bg-slate-950/20',
  },
  {
    id: 'nordic_slate',
    name: 'Nordic-Slate',
    category: 'Minimalist',
    primary: '#38BDF8',
    secondary: '#94A3B8',
    description: 'Slate Gray & Cool Frost Blue',
    badgeBg: 'bg-sky-950/60',
    badgeBorder: 'border-sky-500/50',
    badgeText: 'text-sky-300',
    glowClass: 'shadow-[0_0_30px_rgba(56,189,248,0.15)]',
    previewCardBorder: 'border-sky-500/40',
    previewCardBg: 'bg-sky-950/15',
  },
  {
    id: 'zen_vector',
    name: 'Zen-Vector',
    category: 'Minimalist',
    primary: '#F8FAFC',
    secondary: '#64748B',
    description: 'Stark High Contrast Geometric Monochrome',
    badgeBg: 'bg-slate-900',
    badgeBorder: 'border-slate-600/50',
    badgeText: 'text-slate-100',
    glowClass: 'shadow-[0_0_30px_rgba(248,250,252,0.12)]',
    previewCardBorder: 'border-slate-500/40',
    previewCardBg: 'bg-slate-900/40',
  },
  {
    id: 'clean_architect',
    name: 'Clean-Architect',
    category: 'Minimalist',
    primary: '#22D3EE',
    secondary: '#CBD5E1',
    description: 'Steel Cyan & Understated Architectural Lines',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-600/40',
    badgeText: 'text-cyan-200',
    glowClass: 'shadow-[0_0_25px_rgba(34,211,238,0.12)]',
    previewCardBorder: 'border-cyan-600/30',
    previewCardBg: 'bg-cyan-950/20',
  },

  // Technical Category
  {
    id: 'cyber_cyan',
    name: 'Cyber-Cyan',
    category: 'Technical',
    primary: '#00F0FF',
    secondary: '#FF0055',
    description: 'Neon Cyan & Glitch Crimson HUD',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-500/50',
    badgeText: 'text-cyan-300',
    glowClass: 'shadow-[0_0_30px_rgba(0,240,255,0.15)]',
    previewCardBorder: 'border-cyan-500/40',
    previewCardBg: 'bg-cyan-950/15',
  },
  {
    id: 'matrix_green',
    name: 'Matrix-Green',
    category: 'Technical',
    primary: '#00FF66',
    secondary: '#00F0FF',
    description: 'Terminal Hacker Green & Tech Cyan CLI',
    badgeBg: 'bg-emerald-950/60',
    badgeBorder: 'border-emerald-500/50',
    badgeText: 'text-emerald-300',
    glowClass: 'shadow-[0_0_30px_rgba(0,255,102,0.15)]',
    previewCardBorder: 'border-emerald-500/40',
    previewCardBg: 'bg-emerald-950/15',
  },
  {
    id: 'rust_vault',
    name: 'Rust-Vault',
    category: 'Technical',
    primary: '#F59E0B',
    secondary: '#EF4444',
    description: 'Zero-Trust Encrypted Amber & Vault Crimson',
    badgeBg: 'bg-amber-950/60',
    badgeBorder: 'border-amber-500/50',
    badgeText: 'text-amber-300',
    glowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    previewCardBorder: 'border-amber-500/40',
    previewCardBg: 'bg-amber-950/15',
  },
  {
    id: 'blueprint_cad',
    name: 'Blueprint-CAD',
    category: 'Technical',
    primary: '#60A5FA',
    secondary: '#38BDF8',
    description: 'Industrial CAD Grid & Technical Blueprints',
    badgeBg: 'bg-blue-950/70',
    badgeBorder: 'border-blue-400/50',
    badgeText: 'text-blue-200',
    glowClass: 'shadow-[0_0_30px_rgba(96,165,250,0.15)]',
    previewCardBorder: 'border-blue-500/40',
    previewCardBg: 'bg-blue-950/20',
  },

  // Creative Category
  {
    id: 'synth_purple',
    name: 'Synth-Purple',
    category: 'Creative',
    primary: '#B000FF',
    secondary: '#FF0055',
    description: 'Vaporwave Violet & Hot Neon Pink',
    badgeBg: 'bg-purple-950/60',
    badgeBorder: 'border-purple-500/50',
    badgeText: 'text-purple-300',
    glowClass: 'shadow-[0_0_30px_rgba(176,0,255,0.15)]',
    previewCardBorder: 'border-purple-500/40',
    previewCardBg: 'bg-purple-950/15',
  },
  {
    id: 'volcanic_red',
    name: 'Volcanic-Red',
    category: 'Creative',
    primary: '#FF0055',
    secondary: '#FF5500',
    description: 'Magma Crimson & Flaming Cyber Orange',
    badgeBg: 'bg-red-950/60',
    badgeBorder: 'border-red-500/50',
    badgeText: 'text-red-300',
    glowClass: 'shadow-[0_0_30px_rgba(255,0,85,0.15)]',
    previewCardBorder: 'border-red-500/40',
    previewCardBg: 'bg-red-950/15',
  },
  {
    id: 'electric_gold',
    name: 'Electric-Gold',
    category: 'Creative',
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
    category: 'Creative',
    primary: '#CCFF00',
    secondary: '#9900FF',
    description: 'Biohazard Lime & Electric Violet Synth',
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
    category: 'Creative',
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
];

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: 'apple_glass_portfolio',
    title: 'Apple Dark Glass Studio',
    subtitle: 'Cupertino translucent dark glass card with sky blue & silver titanium accents',
    category: 'Apple Glass',
    themeId: 'apple_dark_glass',
    assetType: 'banner',
    titleText: 'LINACRE.SITE',
    subtitleText: 'Cupertino Dark Glass & Sleek System Architecture',
    handleText: '@dlinacre // macOS Sequoia',
    selectedIcon: 'code',
    layoutMode: 'standard',
    glitchIntensity: 0,
    previewGradient: 'from-slate-900 via-sky-950 to-slate-950',
  },
  {
    id: 'cupertino_titanium_monogram',
    title: 'Cupertino Space Titanium',
    subtitle: 'Space black titanium frame with subtle frosted satin glass',
    category: 'Apple Glass',
    themeId: 'cupertino_titanium',
    assetType: 'avatar',
    titleText: 'DL',
    subtitleText: 'Senior Full-Stack Architect',
    handleText: 'v2.5.0',
    selectedIcon: 'circuit',
    layoutMode: 'badge',
    glitchIntensity: 0,
    previewGradient: 'from-gray-950 via-slate-900 to-black',
  },
  {
    id: 'liquid_obsidian_engine',
    title: 'Liquid Obsidian Glass',
    subtitle: 'Deep translucent obsidian with soft indigo ambient glow',
    category: 'Apple Glass',
    themeId: 'obsidian_liquid',
    assetType: 'banner',
    titleText: 'LIN4CRE',
    subtitleText: 'High-Performance Async Engines & Distributed Systems',
    handleText: 'Obsidian Build',
    selectedIcon: 'terminal',
    layoutMode: 'standard',
    glitchIntensity: 5,
    previewGradient: 'from-indigo-950 via-slate-900 to-slate-950',
  },
  {
    id: 'stealth_porcelain_clean',
    title: 'Minimalist Porcelain',
    subtitle: 'Stark white typography on clean dark charcoal backdrop',
    category: 'Minimalist',
    themeId: 'stealth_white',
    assetType: 'banner',
    titleText: 'DLINACRE',
    subtitleText: 'Clean Vector Minimalist & Developer Brand Hub',
    handleText: 'minimal',
    selectedIcon: 'code',
    layoutMode: 'minimalist',
    glitchIntensity: 0,
    previewGradient: 'from-slate-950 via-slate-900 to-gray-950',
  },
  {
    id: 'nordic_slate_docs',
    title: 'Nordic Slate Docs',
    subtitle: 'Frost blue & slate gray for developer documentation and tools',
    category: 'Minimalist',
    themeId: 'nordic_slate',
    assetType: 'repo_card',
    titleText: 'CYBER-ENGINE',
    subtitleText: 'Modular C++ WebGL Graphics & Packet Renderer',
    handleText: 'C++20',
    selectedIcon: 'wrench',
    layoutMode: 'standard',
    glitchIntensity: 0,
    previewGradient: 'from-sky-950 via-slate-900 to-slate-950',
  },
  {
    id: 'matrix_hacker_cli',
    title: 'Terminal Matrix CLI',
    subtitle: 'Hacker green CRT scanlines & terminal shell aesthetic',
    category: 'Technical',
    themeId: 'matrix_green',
    assetType: 'banner',
    titleText: 'AUTH-VAULT',
    subtitleText: 'Zero-Trust Encrypted Cryptographic Protocol',
    handleText: 'BUILD: PASSING',
    selectedIcon: 'shield',
    layoutMode: 'standard',
    glitchIntensity: 20,
    previewGradient: 'from-emerald-950 via-gray-950 to-emerald-950',
  },
  {
    id: 'vaporwave_synth_80s',
    title: 'Vaporwave 80s Synth',
    subtitle: 'Hot neon pink & violet sunset grid for game engines',
    category: 'Creative',
    themeId: 'synth_purple',
    assetType: 'banner',
    titleText: 'NEON-RUNNER',
    subtitleText: 'High-Octane Particle Physics Web Engine',
    handleText: 'ThreeJS',
    selectedIcon: 'joystick',
    layoutMode: 'split',
    glitchIntensity: 35,
    previewGradient: 'from-purple-950 via-pink-950 to-slate-950',
  },
  {
    id: 'rust_encrypted_vault',
    title: 'Rust Security Vault',
    subtitle: 'Amber security shield & vault encryption HUD',
    category: 'Technical',
    themeId: 'rust_vault',
    assetType: 'repo_card',
    titleText: 'SECURE-VAULT',
    subtitleText: 'Memory-Safe Cryptography & Auth Protocol',
    handleText: 'Rust 1.78',
    selectedIcon: 'shield',
    layoutMode: 'standard',
    glitchIntensity: 10,
    previewGradient: 'from-amber-950 via-gray-950 to-red-950',
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

  // Preset Examples Category State & Filtering
  const [activePresetCategory, setActivePresetCategory] = useState<'all' | 'Apple Glass' | 'Minimalist' | 'Technical' | 'Creative'>('all');

  const filteredPresetExamples = PRESET_EXAMPLES.filter((ex) => {
    if (activePresetCategory === 'all') return true;
    return ex.category === activePresetCategory;
  });

  const handleApplyPresetExample = (ex: PresetExample) => {
    const theme = PALETTE_THEMES.find((t) => t.id === ex.themeId) || PALETTE_THEMES[0];
    setSelectedThemeId(theme.id);
    setConfig((prev) => ({
      ...prev,
      titleText: ex.titleText,
      subtitleText: ex.subtitleText,
      handleText: ex.handleText,
      selectedIcon: ex.selectedIcon,
      themeColor: theme.primary,
      secondaryColor: theme.secondary,
      glitchIntensity: ex.glitchIntensity,
      assetType: ex.assetType,
    }));
  };

  // Gemini AI Auto-Generate state
  const [selectedRepoId, setSelectedRepoId] = useState<string>('glitch-tech-ui');
  const [customRepo, setCustomRepo] = useState({
    name: 'cyber-hud-next',
    description: 'Futuristic HUD overlay framework with animated canvas nodes & WebGL shaders',
    language: 'TypeScript',
    topics: 'hud, cyberpunk, shaders, react',
  });
  const [refineInstruction, setRefineInstruction] = useState('');
  const [promptFlashed, setPromptFlashed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<GeminiSuggestion[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiSection, setShowAiSection] = useState(true);

  // Theme Tune Synth Audio State
  const [isPlayingTune, setIsPlayingTune] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string>(THEME_TUNE_TRACKS[0].id);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<ThemeTunePlayer | null>(null);

  useEffect(() => {
    playerRef.current = new ThemeTunePlayer(THEME_TUNE_TRACKS[0]);
    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  const handleToggleTune = () => {
    if (!playerRef.current) return;
    if (isPlayingTune) {
      playerRef.current.stop();
      setIsPlayingTune(false);
    } else {
      playerRef.current.play();
      setIsPlayingTune(true);
    }
  };

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    const track = THEME_TUNE_TRACKS.find((t) => t.id === trackId);
    if (track && playerRef.current) {
      playerRef.current.setTrack(track);
    }
  };

  const handleToggleMute = () => {
    if (!playerRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    playerRef.current.setVolume(newMute ? 0 : 0.15);
  };

  const handleGenerateInfinitePrompt = () => {
    const freshPrompt = generateInfiniteRandomPrompt();
    setRefineInstruction(freshPrompt);
    setPromptFlashed(true);
    setTimeout(() => setPromptFlashed(false), 800);
  };

  // Gemini Audio Generation & HTML5 Audio Player State
  interface GeneratedAudioTrack {
    trackTitle: string;
    genre: string;
    bpm: number;
    description: string;
    voiceName: string;
    audioUrl: string;
  }

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudioTrack, setGeneratedAudioTrack] = useState<GeneratedAudioTrack | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // HTML5 Audio Player State
  const html5AudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingGeneratedAudio, setIsPlayingGeneratedAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0.8);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setAudioError(null);
    try {
      const response = await fetch('/api/gemini/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: selectedThemeId,
          themeName: activePalette.name,
          repoName: selectedRepoId === 'custom' ? customRepo.name : activeProfile.handle,
          promptNote: refineInstruction,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate theme audio track.');
      }

      const data = await response.json();
      setGeneratedAudioTrack(data);
      setIsPlayingGeneratedAudio(false);

      // Stop loop synth if running to avoid audio clutter
      if (playerRef.current && isPlayingTune) {
        playerRef.current.stop();
        setIsPlayingTune(false);
      }
    } catch (err: any) {
      console.error('Audio Generation Error:', err);
      setAudioError(err.message || 'Error triggering Gemini API for audio generation.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleToggleGeneratedAudioPlay = () => {
    if (!html5AudioRef.current) return;
    if (isPlayingGeneratedAudio) {
      html5AudioRef.current.pause();
      setIsPlayingGeneratedAudio(false);
    } else {
      html5AudioRef.current.play().then(() => {
        setIsPlayingGeneratedAudio(true);
      }).catch(err => console.error("Audio play error:", err));
    }
  };

  const handleAudioTimeUpdate = () => {
    if (html5AudioRef.current) {
      setAudioCurrentTime(html5AudioRef.current.currentTime);
      setAudioDuration(html5AudioRef.current.duration || 0);
    }
  };

  const handleAudioSeek = (newTime: number) => {
    if (html5AudioRef.current) {
      html5AudioRef.current.currentTime = newTime;
      setAudioCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAudioVolume(vol);
    if (html5AudioRef.current) {
      html5AudioRef.current.volume = vol;
      html5AudioRef.current.muted = vol === 0;
      setIsAudioMuted(vol === 0);
    }
  };

  const handleToggleAudioMute = () => {
    if (!html5AudioRef.current) return;
    const newMute = !isAudioMuted;
    setIsAudioMuted(newMute);
    html5AudioRef.current.muted = newMute;
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec) || !isFinite(timeInSec)) return '0:00';
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  const normalizeIcon = (iconStr: string): StudioConfig['selectedIcon'] => {
    const lower = (iconStr || '').toLowerCase();
    if (lower.includes('joy') || lower.includes('game') || lower.includes('pad')) return 'joystick';
    if (lower.includes('term') || lower.includes('cli') || lower.includes('shell')) return 'terminal';
    if (lower.includes('cube') || lower.includes('box') || lower.includes('3d')) return 'cube';
    if (lower.includes('shield') || lower.includes('auth') || lower.includes('lock') || lower.includes('sec')) return 'shield';
    if (lower.includes('wrench') || lower.includes('tool') || lower.includes('gear')) return 'wrench';
    if (lower.includes('wave') || lower.includes('audio') || lower.includes('sound')) return 'waveform';
    if (lower.includes('circ') || lower.includes('chip') || lower.includes('cpu')) return 'circuit';
    return 'code';
  };

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    setAiError(null);

    try {
      let repoPayload;
      if (selectedRepoId === 'custom') {
        repoPayload = {
          repoName: customRepo.name,
          repoDescription: customRepo.description + (refineInstruction ? ` (Note: ${refineInstruction})` : ''),
          repoLanguage: customRepo.language,
          repoTopics: customRepo.topics.split(',').map((s) => s.trim()),
          assetType: config.assetType,
        };
      } else {
        const repo = SAMPLE_REPOS_CONTEXT.find((r) => r.id === selectedRepoId) || SAMPLE_REPOS_CONTEXT[0];
        repoPayload = {
          repoName: repo.name,
          repoDescription: repo.description + (refineInstruction ? ` (Note: ${refineInstruction})` : ''),
          repoLanguage: repo.language,
          repoTopics: repo.topics,
          assetType: config.assetType,
        };
      }

      const res = await fetch('/api/gemini/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repoPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status} error`);
      }

      const data = await res.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setAiSuggestions(data.suggestions);
      } else {
        throw new Error('Invalid suggestions output format received from Gemini.');
      }
    } catch (err: any) {
      console.error('Gemini generate error:', err);
      setAiError(err.message || 'Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestion = (sug: GeminiSuggestion) => {
    const targetThemeId = PALETTE_THEMES.find((p) => p.id === sug.themePreset)
      ? sug.themePreset
      : PALETTE_THEMES.find((p) => p.name.toLowerCase().includes(sug.themePreset.toLowerCase()))?.id || 'cyber_cyan';

    handlePaletteSelect(targetThemeId);

    setConfig((prev) => ({
      ...prev,
      titleText: sug.titleText.toUpperCase(),
      subtitleText: sug.subText,
      handleText: sug.handleText,
      selectedIcon: normalizeIcon(sug.iconStyle),
    }));
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
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Brand Asset & Theme Studio</h2>
          </div>
          <button
            onClick={() => {
              handlePaletteSelect('apple_dark_glass');
              setConfig({
                ...config,
                titleText: activeProfile === 'dlinacre' ? 'DLINACRE' : activeProfile === 'lin4cre' ? 'LIN4CRE' : 'LINACRE.SITE',
                glitchIntensity: 0,
                themeColor: PALETTE_THEMES[0].primary,
                secondaryColor: PALETTE_THEMES[0].secondary,
              });
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Reset Controls"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Examples Showcase Gallery (1-Click Apply) */}
        <div className="bg-gradient-to-br from-slate-900 via-gray-950 to-slate-900 border border-slate-700/60 rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-mono font-bold text-white">PRESET EXAMPLES & EXAMPLES GALLERY</h3>
            </div>
            <span className="text-[10px] font-mono text-sky-400 font-bold">1-Click Apply</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-950 rounded-xl border border-gray-800">
            {(['all', 'Apple Glass', 'Minimalist', 'Technical', 'Creative'] as const).map((cat) => {
              const isSelected = activePresetCategory === cat;
              const count = cat === 'all' ? PRESET_EXAMPLES.length : PRESET_EXAMPLES.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActivePresetCategory(cat)}
                  className={`flex-1 min-w-[70px] py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-gray-950 shadow-md shadow-sky-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <span>{cat === 'all' ? 'All' : cat}</span>
                  <span className={`text-[8px] px-1 py-0.2 rounded-full ${isSelected ? 'bg-gray-950 text-sky-300' : 'bg-gray-900 text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Preset Example Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredPresetExamples.map((ex) => {
              const isCurrentActive = config.titleText === ex.titleText && selectedThemeId === ex.themeId;
              return (
                <div
                  key={ex.id}
                  className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 bg-gradient-to-br ${ex.previewGradient} ${
                    isCurrentActive
                      ? 'border-sky-400 ring-1 ring-sky-400 shadow-md shadow-sky-500/20'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div>
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
                        <span>{ex.title}</span>
                      </span>
                      <p className="text-[10px] text-gray-300 mt-0.5 line-clamp-1">{ex.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[9px] font-mono">
                    <span className="px-1.5 py-0.5 rounded border border-white/20 bg-black/40 text-sky-200">
                      {ex.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetExample(ex)}
                      className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-gray-950 border border-sky-400/40 font-bold transition-all cursor-pointer"
                    >
                      {isCurrentActive ? 'Active ✓' : 'Load Example'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gemini AI Auto-Generate Panel */}
        <div className="bg-gradient-to-b from-cyan-950/40 via-gray-950 to-purple-950/20 border border-cyan-500/30 rounded-2xl p-4 space-y-3 shadow-lg shadow-cyan-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <span>GEMINI REPO AUTO-GENERATE</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-300 border border-red-500/40 font-semibold">
                    AI 3.6 Flash
                  </span>
                </h3>
                <p className="text-[11px] text-gray-400">
                  Analyze repository context from GitHubRepoSync to generate custom branding text & icon themes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAiSection(!showAiSection)}
              className="text-xs text-gray-400 hover:text-cyan-300 font-mono transition-colors cursor-pointer"
            >
              {showAiSection ? 'Hide' : 'Show'}
            </button>
          </div>

          {showAiSection && (
            <div className="space-y-3 pt-2 border-t border-gray-800/80">
              {/* Repository Selector */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-400 mb-1 flex items-center justify-between">
                  <span>SELECT REPOSITORY CONTEXT</span>
                  <span className="text-cyan-400 font-normal">GitHubRepoSync</span>
                </label>
                <select
                  value={selectedRepoId}
                  onChange={(e) => setSelectedRepoId(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 hover:border-cyan-500/50 text-cyan-300 font-mono text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
                >
                  {SAMPLE_REPOS_CONTEXT.map((repo) => (
                    <option key={repo.id} value={repo.id} className="bg-gray-950 text-gray-200">
                      {repo.fullName} ({repo.language})
                    </option>
                  ))}
                  <option value="custom" className="bg-gray-950 text-yellow-300 font-bold">
                    + Custom Repository Details...
                  </option>
                </select>
              </div>

              {/* Custom Repo Fields if "custom" is selected */}
              {selectedRepoId === 'custom' && (
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-0.5">Repo Name</label>
                    <input
                      type="text"
                      value={customRepo.name}
                      onChange={(e) => setCustomRepo({ ...customRepo, name: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 font-mono text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={customRepo.description}
                      onChange={(e) => setCustomRepo({ ...customRepo, description: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 font-mono text-gray-300 text-[11px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Language</label>
                      <input
                        type="text"
                        value={customRepo.language}
                        onChange={(e) => setCustomRepo({ ...customRepo, language: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 font-mono text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Topics (comma separated)</label>
                      <input
                        type="text"
                        value={customRepo.topics}
                        onChange={(e) => setCustomRepo({ ...customRepo, topics: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 font-mono text-gray-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Prompt Refinement Note & Infinite Prompt Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-mono text-gray-400">
                    STYLE DIRECTIVE / PROMPT NOTE
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateInfinitePrompt}
                    className="flex items-center gap-1 text-[10px] font-mono text-yellow-300 hover:text-yellow-200 bg-yellow-950/40 hover:bg-yellow-900/60 border border-yellow-500/40 px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold shadow-sm"
                    title="Generate a unique infinite prompt variation"
                  >
                    <Dices className="w-3 h-3 text-yellow-400 animate-spin-slow" />
                    <span>🎲 INFINITE RANDOM PROMPT</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Optional prompt note (e.g., 'Emphasize high frequency, dark synth, C++')"
                    value={refineInstruction}
                    onChange={(e) => setRefineInstruction(e.target.value)}
                    className={`w-full bg-gray-950 border rounded-xl px-3 py-1.5 text-xs font-mono text-gray-300 placeholder-gray-600 focus:outline-none transition-all ${
                      promptFlashed
                        ? 'border-yellow-400 ring-2 ring-yellow-400/50 bg-yellow-950/20 text-yellow-200'
                        : 'border-gray-800 focus:border-cyan-500'
                    }`}
                  />
                  {refineInstruction && (
                    <button
                      type="button"
                      onClick={() => setRefineInstruction('')}
                      className="absolute right-2 top-1.5 text-[10px] text-gray-500 hover:text-gray-300 font-mono"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleGenerateSuggestions}
                  disabled={isGenerating}
                  className="sm:col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
                      <span>Analyzing Repo...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-cyan-300" />
                      <span>AUTO-GENERATE BRANDING</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleGenerateInfinitePrompt();
                    setTimeout(() => {
                      handleGenerateSuggestions();
                    }, 50);
                  }}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 hover:text-white font-mono font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                  title="Generate a fresh random prompt and trigger Gemini AI instantly"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Random & Gen</span>
                </button>
              </div>

              {aiError && (
                <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 font-mono">
                  ⚠️ {aiError}
                </div>
              )}

              {/* Render AI Suggested Cards */}
              {aiSuggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Lightbulb className="w-3 h-3 text-yellow-400" />
                      <span>{aiSuggestions.length} GEMINI AI BRAND SUGGESTIONS</span>
                    </span>
                    <span>Click to apply to canvas</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-[260px] overflow-y-auto pr-1">
                    {aiSuggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleApplySuggestion(sug)}
                        className="p-3 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-cyan-500/60 rounded-xl cursor-pointer transition-all group space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-cyan-300 group-hover:text-white transition-colors">
                            {sug.titleText}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-800/50">
                            Theme: {sug.themePreset}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-gray-400 line-clamp-1">
                          {sug.subText}
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1 border-t border-gray-900">
                          <span className="text-gray-400">{sug.handleText} • Icon: {sug.iconStyle}</span>
                          <span className="text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform font-bold">
                            <span>Apply</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>

                        <p className="text-[10px] text-gray-500 italic line-clamp-2">
                          "{sug.reasoning}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
              {/* Live Preview Mode Animation Toggle */}
              <button
                type="button"
                onClick={() => setLiveGlitchMode(!liveGlitchMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                  liveGlitchMode
                    ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/30 animate-pulse'
                    : 'bg-gray-950 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
                }`}
                title="Toggle Live Preview with Glitch Animation & Scanlines"
              >
                <Zap className={`w-3.5 h-3.5 ${liveGlitchMode ? 'text-yellow-300' : 'text-gray-500'}`} />
                <span>Live Preview: {liveGlitchMode ? 'ON' : 'OFF'}</span>
              </button>

              <span className={`px-2.5 py-1.5 rounded bg-gray-950 font-mono text-xs border ${activePalette.badgeBorder} ${activePalette.badgeText}`}>
                {config.aspectRatio === '1:1' ? '512x512' : '1200x400'}
              </span>
            </div>
          </div>

          {/* Cyberpunk Theme Tunes Audio Synthesizer & Gemini AI Theme Audio Generator */}
          <div className="p-3.5 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border border-gray-800 rounded-2xl space-y-3 font-mono text-xs shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleTune}
                  className={`p-2 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingTune
                      ? 'bg-cyan-500 text-gray-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                      : 'bg-gray-900 text-cyan-400 border-cyan-500/40 hover:bg-cyan-950'
                  }`}
                  title={isPlayingTune ? 'Pause Theme Tune' : 'Play Theme Tune Synth'}
                >
                  {isPlayingTune ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>PAUSE SYNTH LOOP</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PLAY SYNTH LOOP</span>
                    </>
                  )}
                </button>

                {/* Animated Frequency Equalizer when playing loop */}
                {isPlayingTune && (
                  <div className="flex items-end gap-0.5 h-4 px-1">
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2"></span>
                    <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-4 [animation-delay:0.1s]"></span>
                    <span className="w-1 bg-blue-400 rounded-full animate-bounce h-3 [animation-delay:0.2s]"></span>
                    <span className="w-1 bg-purple-400 rounded-full animate-bounce h-4 [animation-delay:0.15s]"></span>
                  </div>
                )}
              </div>

              {/* Track Selector */}
              <div className="flex items-center gap-2 flex-1 max-w-xs min-w-[180px]">
                <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <select
                  value={selectedTrackId}
                  onChange={(e) => handleSelectTrack(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-cyan-300 rounded-lg px-2.5 py-1 text-[11px] focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {THEME_TUNE_TRACKS.map((t) => (
                    <option key={t.id} value={t.id} className="bg-gray-950 text-gray-200">
                      🎵 {t.name} ({t.genre})
                    </option>
                  ))}
                </select>
              </div>

              {/* Gemini Audio Generation Button */}
              <button
                type="button"
                onClick={handleGenerateAudio}
                disabled={isGeneratingAudio}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer border border-purple-400/30"
                title="Generate custom Glitch-Tech theme audio track using Gemini API"
              >
                {isGeneratingAudio ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-200" />
                    <span>SYNTHESIZING AUDIO...</span>
                  </>
                ) : (
                  <>
                    <Headphones className="w-3.5 h-3.5 text-yellow-300" />
                    <span>GENERATE THEME AUDIO (GEMINI API)</span>
                  </>
                )}
              </button>

              {/* Mute toggle */}
              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-1.5 rounded-lg border transition-all ${
                  isMuted
                    ? 'bg-red-950/60 border-red-500/50 text-red-300'
                    : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Error banner if audio generation failed */}
            {audioError && (
              <div className="p-2 bg-red-950/70 border border-red-500/50 rounded-xl text-[11px] text-red-300">
                ⚠️ Audio Generation Error: {audioError}
              </div>
            )}

            {/* Gemini Generated HTML5 Audio Player Card */}
            {generatedAudioTrack && (
              <div className="p-3 bg-gray-950/90 border border-cyan-500/40 rounded-xl space-y-2.5 shadow-inner relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Disc className={`w-4 h-4 text-cyan-400 ${isPlayingGeneratedAudio ? 'animate-spin' : ''}`} />
                    <span className="font-bold text-cyan-200 text-xs">{generatedAudioTrack.trackTitle}</span>
                    <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] rounded-full">
                      {generatedAudioTrack.genre}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-950 border border-purple-500/40 text-purple-300 text-[10px] rounded-full">
                      {generatedAudioTrack.bpm} BPM
                    </span>
                    <span className="px-2 py-0.5 bg-yellow-950 border border-yellow-500/40 text-yellow-300 text-[10px] rounded-full">
                      Voice: {generatedAudioTrack.voiceName}
                    </span>
                  </div>

                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span>Gemini Glitch-Tech Audio</span>
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 italic">
                  "{generatedAudioTrack.description}"
                </p>

                {/* HTML5 Audio element with refs */}
                <audio
                  ref={html5AudioRef}
                  src={generatedAudioTrack.audioUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onLoadedMetadata={handleAudioTimeUpdate}
                  onEnded={() => setIsPlayingGeneratedAudio(false)}
                />

                {/* HTML5 Audio Custom Player Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {/* Play / Pause Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleGeneratedAudioPlay}
                    className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-gray-950 font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/30"
                  >
                    {isPlayingGeneratedAudio ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold">PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold">PLAY TRACK</span>
                      </>
                    )}
                  </button>

                  {/* Waveform Equalizer visualizer when track is playing */}
                  {isPlayingGeneratedAudio && (
                    <div className="flex items-end gap-1 h-5 px-1">
                      <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-3"></span>
                      <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-5 [animation-delay:0.1s]"></span>
                      <span className="w-1 bg-blue-400 rounded-full animate-bounce h-4 [animation-delay:0.2s]"></span>
                      <span className="w-1 bg-purple-400 rounded-full animate-bounce h-5 [animation-delay:0.15s]"></span>
                      <span className="w-1 bg-pink-400 rounded-full animate-pulse h-3 [animation-delay:0.25s]"></span>
                    </div>
                  )}

                  {/* Timeline Seek Slider */}
                  <div className="flex-1 flex items-center gap-2 min-w-[150px]">
                    <span className="text-[10px] text-gray-400 font-mono w-8 text-right">
                      {formatTime(audioCurrentTime)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={audioDuration || 1}
                      step={0.1}
                      value={audioCurrentTime}
                      onChange={(e) => handleAudioSeek(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-gray-400 font-mono w-8">
                      {formatTime(audioDuration)}
                    </span>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleToggleAudioMute}
                      className="text-gray-400 hover:text-cyan-300 p-1"
                      title={isAudioMuted ? 'Unmute' : 'Mute'}
                    >
                      {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isAudioMuted ? 0 : audioVolume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-16 accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                      title={`Volume: ${Math.round((isAudioMuted ? 0 : audioVolume) * 100)}%`}
                    />
                  </div>

                  {/* Download WAV File Button */}
                  <a
                    href={generatedAudioTrack.audioUrl}
                    download={`${generatedAudioTrack.trackTitle.replace(/\s+/g, '_')}_gemini.wav`}
                    className="p-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white rounded-lg flex items-center gap-1 text-[11px] transition-all cursor-pointer ml-auto"
                    title="Download Glitch Audio WAV File"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download WAV</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* SVG Preview Container dynamically styled with palette classes & animated glitch keyframe effects */}
          <div
            style={{
              '--theme-primary': activePalette.primary,
              '--theme-secondary': activePalette.secondary,
              '--theme-glow': `${activePalette.primary}33`,
            } as React.CSSProperties}
            className={`relative w-full rounded-2xl p-4 border shadow-inner overflow-hidden flex items-center justify-center min-h-[300px] transition-all duration-300 ${activePalette.previewCardBg} ${activePalette.previewCardBorder}`}
          >
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

