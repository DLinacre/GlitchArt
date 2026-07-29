import React, { useState } from 'react';
import {
  RepoItem,
  RepoAssetType,
  RepoAppliedAsset,
  RepoHistoryEntry,
  BrandProfile,
  AssetEditorConfig,
  OAuthConnectedAccount,
} from '../types';
import { PALETTE_THEMES } from './GlitchStudio';
import {
  Github,
  RefreshCw,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Plus,
  Palette,
  Sparkles,
  ChevronDown,
  Layers,
  Code2,
  ExternalLink,
  Shield,
  Star,
  Terminal,
  FolderSync,
  Tag,
  Search,
  Filter,
  ArrowUpDown,
  Sun,
  Moon,
  Sliders,
  History,
  GitCommit,
  GitBranch,
  Key,
  LogOut,
  UserCheck,
  Eye,
  Columns,
  Maximize2,
  Sparkle,
  Cpu,
  FileCode,
  Image as ImageIcon,
  Award,
  Box,
  Share2,
  CheckSquare
} from 'lucide-react';

interface GitHubRepoSyncProps {
  activeProfile: BrandProfile;
  onInspectAsset: (svgCode: string, name: string) => void;
}

// Default Accounts
const INITIAL_ACCOUNTS: OAuthConnectedAccount[] = [
  {
    id: 'acc_dlinacre',
    username: 'dlinacre',
    displayName: 'D. Linacre (Lead Dev)',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    connectedAt: 'Connected (OAuth)',
    authMethod: 'oauth',
    accessTokenMasked: 'gho_8f...92a1',
    repoCount: 4,
  },
  {
    id: 'acc_lin4cre',
    username: 'lin4cre',
    displayName: 'LIN4CRE Studio',
    avatarUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&auto=format&fit=crop&q=80',
    connectedAt: 'Connected (OAuth)',
    authMethod: 'oauth',
    accessTokenMasked: 'gho_3k...77b4',
    repoCount: 3,
  },
  {
    id: 'acc_linacre_site',
    username: 'linacre_site',
    displayName: 'linacre.site Org',
    avatarUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=120&auto=format&fit=crop&q=80',
    connectedAt: 'Connected (PAT)',
    authMethod: 'pat',
    accessTokenMasked: 'ghp_91...440c',
    repoCount: 1,
  },
];

// Initial default repositories with README excerpts and topics
const INITIAL_REPOS: RepoItem[] = [
  {
    id: 'repo_glitch_tech_ui',
    account: 'dlinacre',
    name: 'glitch-tech-ui',
    fullName: 'DLinacre/glitch-tech-ui',
    description: 'Cyberpunk HUD components, SVG glitch shaders, and high-frequency UI generators for React & Vite.',
    readmeExcerpt: '# Glitch Tech UI\nHigh-performance SVG shaders & cyberpunk HUD elements. Built with React 18, Tailwind, and WebGL.',
    language: 'TypeScript',
    stars: 342,
    forksCount: 48,
    updatedAt: '12 mins ago',
    isFavorite: true,
    topics: ['ui-kit', 'glitch-art', 'cyberpunk', 'svg', 'hud'],
    lastSyncedAt: 'Just now',
    appliedAssets: {},
    history: [],
  },
  {
    id: 'repo_art_folder',
    account: 'dlinacre',
    name: 'art-folder-generator',
    fullName: 'DLinacre/art-folder-generator',
    description: 'Standardized 🎨_folder architecture & asset pack builder for game developers and open source repos.',
    readmeExcerpt: '# Art Folder Generator\nAutomated gamedev asset directory structure and vector icon bundler.',
    language: 'TypeScript',
    stars: 589,
    forksCount: 82,
    updatedAt: '1 hour ago',
    isFavorite: true,
    topics: ['asset-management', 'github-repo', 'folder-tree', 'gamedev'],
    lastSyncedAt: '2 mins ago',
    appliedAssets: {},
    history: [],
  },
  {
    id: 'repo_cyber_engine',
    account: 'dlinacre',
    name: 'cyber-engine-core',
    fullName: 'DLinacre/cyber-engine-core',
    description: 'Real-time state synchronization, WebGL renderer, and low-latency packet dispatcher.',
    readmeExcerpt: '# Cyber Engine Core\nC++ WebGL graphics core with asynchronous particle buffers.',
    language: 'C++',
    stars: 210,
    forksCount: 29,
    updatedAt: '3 hours ago',
    isFavorite: false,
    topics: ['engine', 'webgl', 'networking', 'realtime'],
    lastSyncedAt: '5 mins ago',
    appliedAssets: {},
    history: [],
  },
  {
    id: 'repo_auth_vault',
    account: 'dlinacre',
    name: 'linacre-auth-vault',
    fullName: 'DLinacre/linacre-auth-vault',
    description: 'Zero-trust authentication protocol & encrypted local state engine.',
    readmeExcerpt: '# Linacre Auth Vault\nSecure OAuth 2.0 PKCE protocol implementation in Rust.',
    language: 'Rust',
    stars: 175,
    forksCount: 15,
    updatedAt: '1 day ago',
    isFavorite: false,
    topics: ['security', 'oauth', 'vault', 'encryption'],
    lastSyncedAt: '10 mins ago',
    appliedAssets: {},
    history: [],
  },
  {
    id: 'repo_cyber_runner',
    account: 'lin4cre',
    name: 'cyber-runner-3d',
    fullName: 'LIN4CRE/cyber-runner-3d',
    description: 'High-octane synthwave parkour game engine powered by WebGL & custom physics.',
    readmeExcerpt: '# Cyber Runner 3D\nFast-paced sci-fi platformer engine for web browsers.',
    language: 'C# / Unity',
    stars: 840,
    forksCount: 120,
    updatedAt: 'Just now',
    isFavorite: true,
    topics: ['gamedev', 'synthwave', 'parkour', 'unity3d', 'webgl'],
    lastSyncedAt: 'Just now',
    appliedAssets: {},
    history: [],
  },
  {
    id: 'repo_glitch_synth',
    account: 'lin4cre',
    name: 'glitch-audio-synth',
    fullName: 'LIN4CRE/glitch-audio-synth',
    description: 'Procedural sound effects generator, cyber glitch audio loops, and wave modulation synth.',
    readmeExcerpt: '# Glitch Audio Synth\nWebAudio synthesis node graph for procedural gamedev audio.',
    language: 'WebAudio API',
    stars: 412,
    forksCount: 64,
    updatedAt: '2 days ago',
    isFavorite: false,
    topics: ['webaudio', 'synth', 'sfx', 'procedural-sound'],
    lastSyncedAt: '12 mins ago',
    appliedAssets: {},
    history: [],
  },
  {
    id: 'repo_pixel_mesh',
    account: 'lin4cre',
    name: 'pixel-mesh-pipeline',
    fullName: 'LIN4CRE/pixel-mesh-pipeline',
    description: 'Automated 3D mesh pixelation and retro shader material suite for retro games.',
    readmeExcerpt: '# Pixel Mesh Pipeline\nHLSL vertex shader for dynamic retro pixel art rendering.',
    language: 'HLSL',
    stars: 290,
    forksCount: 38,
    updatedAt: '3 days ago',
    isFavorite: false,
    topics: ['shaders', 'pixel-art', '3d-mesh', 'retro'],
    lastSyncedAt: '15 mins ago',
    appliedAssets: {},
    history: [],
  },
  {
    id: 'repo_linacre_site_core',
    account: 'linacre_site',
    name: 'linacre-site-core',
    fullName: 'linacre.site/linacre-site-core',
    description: 'Production web platform for linacre.site hosting game previews & asset studio.',
    readmeExcerpt: '# linacre.site Platform\nThe central hub for Linacre brand identity, game demos, and developer tools.',
    language: 'React / Vite',
    stars: 650,
    forksCount: 95,
    updatedAt: '5 mins ago',
    isFavorite: true,
    topics: ['website', 'react', 'tailwind', 'linacre-site'],
    lastSyncedAt: '1 hour ago',
    appliedAssets: {},
    history: [],
  },
];

export const GitHubRepoSync: React.FC<GitHubRepoSyncProps> = ({
  activeProfile,
  onInspectAsset,
}) => {
  // Accounts & OAuth State
  const [accounts, setAccounts] = useState<OAuthConnectedAccount[]>(INITIAL_ACCOUNTS);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>('all');
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [patInput, setPatInput] = useState('');
  const [patStatusMsg, setPatStatusMsg] = useState<string | null>(null);

  // Repositories State
  const [repos, setRepos] = useState<RepoItem[]>(INITIAL_REPOS);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('repo_glitch_tech_ui');
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name'>('stars');
  const [isRefreshingList, setIsRefreshingList] = useState(false);

  // Target Asset Type Selector
  const [selectedAssetType, setSelectedAssetType] = useState<RepoAssetType>('banner');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('cyber_cyan');

  // Profile Theme Categories Filter State ('all' | 'Apple Glass' | 'Minimalist' | 'Technical' | 'Creative')
  const [activeThemeCategory, setActiveThemeCategory] = useState<'all' | 'Apple Glass' | 'Minimalist' | 'Technical' | 'Creative'>('all');

  // Filtered Theme Presets based on selected Category
  const filteredThemePresets = PALETTE_THEMES.filter((theme) => {
    if (activeThemeCategory === 'all') return true;
    return theme.category === activeThemeCategory;
  });

  const handleSelectThemePreset = (themeId: string) => {
    const theme = PALETTE_THEMES.find((t) => t.id === themeId);
    if (!theme) return;

    setSelectedThemeId(theme.id);
    setEditorConfig((prev) => ({
      ...prev,
      primaryColor: theme.primary,
      secondaryColor: theme.secondary,
    }));
    setToastMessage(`Applied ${theme.category} theme: ${theme.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // AI Option Variant Selection (0, 1, 2, 3)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [variationSeed, setVariationSeed] = useState<number>(101);
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false);

  // Live Glitch Animation & Editor Controls State
  const [liveGlitchMode, setLiveGlitchMode] = useState(false);
  const [showEditorTools, setShowEditorTools] = useState(true);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [editorConfig, setEditorConfig] = useState<AssetEditorConfig>({
    scale: 1.0,
    padding: 16,
    bgMode: 'dark',
    primaryColor: '#00f0ff',
    secondaryColor: '#ff0055',
    glitchIntensity: 60,
    scanlines: true,
    glowEffect: true,
  });

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Modal to create custom repository
  const [showAddRepoModal, setShowAddRepoModal] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('');
  const [newRepoLang, setNewRepoLang] = useState('TypeScript');

  // Currently Selected Repo & Theme Palette
  const currentRepo = repos.find((r) => r.id === selectedRepoId) || repos[0];
  const activePalette = PALETTE_THEMES.find((p) => p.id === selectedThemeId) || PALETTE_THEMES[0];

  // Refresh Repo List Simulated Action
  const handleRefreshRepoList = () => {
    setIsRefreshingList(true);
    setTimeout(() => {
      setRepos((prev) =>
        prev.map((r) => ({
          ...r,
          lastSyncedAt: 'Just now',
        }))
      );
      setIsRefreshingList(false);
      setToastMessage('Refreshed repository metadata from GitHub!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 400);
  };

  // Star/Unstar Favorite Repository
  const handleToggleFavorite = (repoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRepos((prev) =>
      prev.map((r) => (r.id === repoId ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  // Filter and Sort Repositories
  const filteredRepos = repos
    .filter((repo) => {
      if (selectedAccountFilter !== 'all' && repo.account !== selectedAccountFilter) return false;
      if (favoritesOnly && !repo.isFavorite) return false;
      if (languageFilter !== 'all' && repo.language !== languageFilter) return false;
      if (
        searchQuery &&
        !repo.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !repo.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !repo.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      if (sortBy === 'stars') return b.stars - a.stars;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Regeneration Handler
  const handleRegenerateOptions = () => {
    setIsGeneratingOptions(true);
    setTimeout(() => {
      setVariationSeed((prev) => prev + Math.floor(Math.random() * 80) + 1);
      setIsGeneratingOptions(false);
    }, 300);
  };

  // Context-Aware Multi-Option Vector Generation Engine
  const generateOptionVariants = (): { id: string; name: string; tag: string; svgCode: string; desc: string }[] => {
    const p = editorConfig.primaryColor || activePalette.primary;
    const s = editorConfig.secondaryColor || activePalette.secondary;
    const repoName = currentRepo.name.toUpperCase();
    const handle = `@${currentRepo.account.toUpperCase()}`;
    const lang = currentRepo.language;
    const seed = variationSeed;
    const scale = editorConfig.scale;
    const pad = editorConfig.padding;
    const bgFill =
      editorConfig.bgMode === 'light'
        ? '#F8FAFC'
        : editorConfig.bgMode === 'transparent'
        ? 'none'
        : '#060911';
    const textMain = editorConfig.bgMode === 'light' ? '#0F172A' : '#FFFFFF';

    // Helper SVG Wrap with Scale and Padding
    const wrapSvg = (innerSvg: string, viewBoxWidth = 1200, viewBoxHeight = 400) => {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" width="100%" height="100%">
  <rect width="${viewBoxWidth}" height="${viewBoxHeight}" fill="${bgFill}"/>
  ${
    editorConfig.scanlines && editorConfig.bgMode !== 'light'
      ? `<pattern id="pat_scan" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="0" stroke="${p}" stroke-width="0.5" opacity="0.12"/>
        </pattern>
        <rect width="${viewBoxWidth}" height="${viewBoxHeight}" fill="url(#pat_scan)"/>`
      : ''
  }
  <g transform="translate(${pad}, ${pad}) scale(${scale})">
    ${innerSvg}
  </g>
</svg>`;
    };

    if (selectedAssetType === 'icon' || selectedAssetType === 'favicon') {
      return [
        {
          id: 'opt_icon_1',
          name: 'Variant A: Cyber Hex Shield',
          tag: 'Hexagon Vector',
          desc: 'High-frequency hexagon icon tailored for GitHub profile avatars.',
          svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="80" fill="${bgFill}" stroke="${p}" stroke-width="8"/>
  <polygon points="256,60 430,160 430,350 256,450 82,350 82,160" fill="#0D1322" stroke="${s}" stroke-width="6"/>
  <circle cx="256" cy="255" r="90" fill="none" stroke="${p}" stroke-width="6" stroke-dasharray="16,8"/>
  <path d="M 220 200 L 290 255 L 220 310 Z" fill="${p}"/>
  <text x="256" y="420" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="28" fill="${textMain}" text-anchor="middle">${repoName.substring(0, 10)}</text>
</svg>`,
        },
        {
          id: 'opt_icon_2',
          name: 'Variant B: Minimal Circuit Ring',
          tag: 'Clean Minimal',
          desc: 'Sleek geometric circle ring with language tag.',
          svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="100" fill="${bgFill}" stroke="${s}" stroke-width="6"/>
  <circle cx="256" cy="230" r="140" fill="#0A0E1A" stroke="${p}" stroke-width="10"/>
  <rect x="176" y="150" width="160" height="160" rx="24" fill="none" stroke="${s}" stroke-width="6" transform="rotate(45 256 230)"/>
  <text x="256" y="245" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="48" fill="${textMain}" text-anchor="middle">${repoName.substring(0, 3)}</text>
  <rect x="156" y="410" width="200" height="36" rx="12" fill="#121B2D" stroke="${p}" stroke-width="2"/>
  <text x="256" y="434" font-family="monospace" font-weight="bold" font-size="16" fill="${p}" text-anchor="middle">${lang}</text>
</svg>`,
        },
        {
          id: 'opt_icon_3',
          name: 'Variant C: Matrix Pixel Cube',
          tag: 'Isometric 3D',
          desc: '3D isometric block with glow accent.',
          svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="64" fill="${bgFill}"/>
  <g transform="translate(256, 220)">
    <polygon points="0,-120 120,-50 0,20 -120,-50" fill="${p}" opacity="0.85"/>
    <polygon points="0,20 120,-50 120,90 0,160" fill="${s}" opacity="0.8"/>
    <polygon points="-120,-50 0,20 0,160 -120,90" fill="#0D1322" stroke="${p}" stroke-width="4"/>
  </g>
  <text x="256" y="440" font-family="monospace" font-weight="bold" font-size="22" fill="${p}" text-anchor="middle">${handle}</text>
</svg>`,
        },
        {
          id: 'opt_icon_4',
          name: 'Variant D: Terminal Command Shell',
          tag: 'Developer Core',
          desc: 'Authentic CLI prompt emblem with glowing brackets.',
          svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="80" fill="${bgFill}" stroke="${p}" stroke-width="4"/>
  <rect x="64" y="64" width="384" height="384" rx="32" fill="#0A0E1A" stroke="${s}" stroke-width="4"/>
  <text x="120" y="240" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="72" fill="${p}">&gt;_${repoName.substring(0, 2)}</text>
  <text x="120" y="320" font-family="monospace" font-size="24" fill="${s}">// RUNTIME_OK</text>
</svg>`,
        },
      ];
    }

    if (selectedAssetType === 'logo' || selectedAssetType === 'orgLogo') {
      return [
        {
          id: 'opt_logo_1',
          name: 'Variant A: Horizontal Glitch Title',
          tag: 'High-Tech Badge',
          desc: 'Wide logo vector featuring offset RGB glitch shadows.',
          svgCode: wrapSvg(`
  <rect x="40" y="30" width="1020" height="260" rx="24" fill="#0D1322" stroke="${p}" stroke-width="4"/>
  <g transform="translate(100, 150)">
    <text x="${seed % 8}" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="52" fill="${p}" opacity="0.8">${repoName}</text>
    <text x="${-(seed % 8)}" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="52" fill="${s}" opacity="0.8">${repoName}</text>
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="52" fill="${textMain}">${repoName}</text>
    <text x="0" y="42" font-family="'Space Grotesk', sans-serif" font-size="20" fill="#94A3B8">${currentRepo.description}</text>
  </g>
  <rect x="880" y="60" width="140" height="36" rx="10" fill="#121B2D" stroke="${s}" stroke-width="2"/>
  <text x="950" y="84" font-family="monospace" font-weight="bold" font-size="14" fill="${p}" text-anchor="middle">${lang}</text>
`, 1100, 320),
        },
        {
          id: 'opt_logo_2',
          name: 'Variant B: Minimal Vector Monogram',
          tag: 'Corporate Clean',
          desc: 'Modern minimal emblem with stark contrast typography.',
          svgCode: wrapSvg(`
  <rect x="40" y="30" width="1020" height="260" rx="24" fill="#0A0E1A" stroke="${s}" stroke-width="3"/>
  <circle cx="140" cy="160" r="60" fill="#121B2D" stroke="${p}" stroke-width="4"/>
  <text x="140" y="178" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="42" fill="${p}" text-anchor="middle">&lt;/&gt;</text>
  <g transform="translate(240, 150)">
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="48" fill="${textMain}">${repoName}</text>
    <text x="0" y="38" font-family="'Space Grotesk', sans-serif" font-size="18" fill="${s}">${handle} // OPEN SOURCE</text>
  </g>
`, 1100, 320),
        },
        {
          id: 'opt_logo_3',
          name: 'Variant C: Cyberpunk HUD Capsule',
          tag: 'Gamedev HUD',
          desc: 'Bracketed capsule design with active repo telemetry.',
          svgCode: wrapSvg(`
  <rect x="40" y="30" width="1020" height="260" rx="32" fill="#0D1322" stroke="${p}" stroke-width="4"/>
  <line x1="80" y1="80" x2="1020" y2="80" stroke="${s}" stroke-width="2" opacity="0.4"/>
  <text x="100" y="160" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="56" fill="${textMain}">${repoName}</text>
  <text x="100" y="210" font-family="monospace" font-size="18" fill="${p}">TAGS: ${currentRepo.topics.slice(0, 4).join(' • ')}</text>
`, 1100, 320),
        },
        {
          id: 'opt_logo_4',
          name: 'Variant D: Terminal Shell Banner',
          tag: 'CLI Dark',
          desc: 'Dark terminal window header with stars & status.',
          svgCode: wrapSvg(`
  <rect x="40" y="30" width="1020" height="260" rx="20" fill="#060911" stroke="${p}" stroke-width="3"/>
  <rect x="40" y="30" width="1020" height="40" rx="20" fill="#121B2D"/>
  <circle cx="70" cy="50" r="6" fill="#FF5F56"/>
  <circle cx="90" cy="50" r="6" fill="#FFBD2E"/>
  <circle cx="110" cy="50" r="6" fill="#27C93F"/>
  <text x="140" y="55" font-family="monospace" font-size="13" fill="#94A3B8">${currentRepo.fullName}</text>
  <text x="80" y="150" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="44" fill="${textMain}">$ ${repoName}</text>
  <text x="80" y="195" font-family="monospace" font-size="18" fill="${s}">⭐ ${currentRepo.stars} Stars // ${currentRepo.forksCount || 12} Forks</text>
`, 1100, 320),
        },
      ];
    }

    if (selectedAssetType === 'readmeBadge') {
      return [
        {
          id: 'opt_badge_1',
          name: 'Variant A: Cyber Status Badge Set',
          tag: 'Triple Badge Pack',
          desc: 'Compact status badges for GitHub README headers.',
          svgCode: wrapSvg(`
  <g transform="translate(40, 60)">
    <!-- Badge 1 -->
    <rect x="0" y="0" width="220" height="60" rx="14" fill="#0A0E1A" stroke="${p}" stroke-width="2"/>
    <text x="110" y="25" font-family="monospace" font-size="11" fill="#94A3B8" text-anchor="middle">BUILD STATUS</text>
    <text x="110" y="45" font-family="monospace" font-weight="bold" font-size="14" fill="#00FF66" text-anchor="middle">⚡ PASSING</text>
    
    <!-- Badge 2 -->
    <rect x="250" y="0" width="220" height="60" rx="14" fill="#0A0E1A" stroke="${s}" stroke-width="2"/>
    <text x="360" y="25" font-family="monospace" font-size="11" fill="#94A3B8" text-anchor="middle">LANGUAGE</text>
    <text x="360" y="45" font-family="monospace" font-weight="bold" font-size="14" fill="${p}" text-anchor="middle">${lang}</text>

    <!-- Badge 3 -->
    <rect x="500" y="0" width="220" height="60" rx="14" fill="#0A0E1A" stroke="${p}" stroke-width="2"/>
    <text x="610" y="25" font-family="monospace" font-size="11" fill="#94A3B8" text-anchor="middle">STARS</text>
    <text x="610" y="45" font-family="monospace" font-weight="bold" font-size="14" fill="#FFBD2E" text-anchor="middle">⭐ ${currentRepo.stars}</text>
  </g>
`, 800, 180),
        },
        {
          id: 'opt_badge_2',
          name: 'Variant B: Single Full-Width Pill',
          tag: 'Unified Pill',
          desc: 'Sleek single pill combining stars, language, and status.',
          svgCode: wrapSvg(`
  <rect x="40" y="40" width="720" height="70" rx="35" fill="#0D1322" stroke="${p}" stroke-width="3"/>
  <text x="100" y="82" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="16" fill="${textMain}">${repoName}</text>
  <line x1="280" y1="50" x2="280" y2="100" stroke="${s}" stroke-width="2"/>
  <text x="380" y="82" font-family="monospace" font-size="15" fill="${p}">${lang}</text>
  <line x1="480" y1="50" x2="480" y2="100" stroke="${s}" stroke-width="2"/>
  <text x="590" y="82" font-family="monospace" font-size="15" fill="#00FF66">RELEASE v1.4.0</text>
`, 800, 150),
        },
        {
          id: 'opt_badge_3',
          name: 'Variant C: Neon Minimal Badges',
          tag: 'Neon Pills',
          desc: 'High contrast vibrant badge capsules.',
          svgCode: wrapSvg(`
  <g transform="translate(60, 40)">
    <rect x="0" y="0" width="180" height="50" rx="25" fill="${p}"/>
    <text x="90" y="32" font-family="monospace" font-weight="900" font-size="14" fill="#060911" text-anchor="middle">${lang}</text>
    
    <rect x="200" y="0" width="180" height="50" rx="25" fill="${s}"/>
    <text x="290" y="32" font-family="monospace" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle">⭐ ${currentRepo.stars} STARS</text>
  </g>
`, 800, 140),
        },
        {
          id: 'opt_badge_4',
          name: 'Variant D: Matrix Hexagon Badge',
          tag: 'Hex Tags',
          desc: 'Cyberpunk hexagonal status markers.',
          svgCode: wrapSvg(`
  <g transform="translate(50, 30)">
    <polygon points="20,0 160,0 180,45 160,90 20,90 0,45" fill="#0A0E1A" stroke="${p}" stroke-width="3"/>
    <text x="90" y="52" font-family="monospace" font-weight="bold" font-size="14" fill="${p}" text-anchor="middle">${repoName.substring(0, 8)}</text>
  </g>
`, 800, 150),
        },
      ];
    }

    // Default: Widescreen Repo Banner (1200x400), README Header, Social Card, Release Art, Profile Banner
    return [
      {
        id: 'opt_banner_1',
        name: 'Variant A: Cyber Grid Glitch Hero',
        tag: 'Cyberpunk Shader',
        desc: 'High-tech grid with offset glitch text and repo metadata.',
        svgCode: wrapSvg(`
  <defs>
    <pattern id="grid_p" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${p}" stroke-width="0.5" opacity="0.18"/>
    </pattern>
  </defs>
  <rect x="40" y="30" width="1120" height="340" fill="url(#grid_p)"/>
  <rect x="40" y="30" width="1120" height="340" rx="24" fill="#0D1322" opacity="0.85" stroke="${p}" stroke-width="3"/>
  <rect x="40" y="30" width="240" height="6" fill="${s}"/>
  <rect x="920" y="364" width="240" height="6" fill="${p}"/>
  
  <g transform="translate(90, 150)">
    <text x="${seed % 6}" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="54" fill="${p}" opacity="0.8">${repoName}</text>
    <text x="${-(seed % 6)}" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="54" fill="${s}" opacity="0.8">${repoName}</text>
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="54" fill="${textMain}">${repoName}</text>
    <text x="0" y="45" font-family="'Space Grotesk', sans-serif" font-size="20" fill="#94A3B8">${currentRepo.description}</text>
    <text x="0" y="85" font-family="monospace" font-size="14" fill="${s}">TAGS: ${currentRepo.topics.join(' // ')}</text>
  </g>
  <rect x="940" y="60" width="180" height="38" rx="10" fill="#121B2D" stroke="${p}" stroke-width="2"/>
  <text x="1030" y="84" font-family="monospace" font-weight="bold" font-size="14" fill="${p}" text-anchor="middle">${lang}</text>
`),
      },
      {
        id: 'opt_banner_2',
        name: 'Variant B: Minimal Neon Circuit',
        tag: 'Clean Minimalist',
        desc: 'Streamlined dark neon circuit layout with high contrast.',
        svgCode: wrapSvg(`
  <rect x="40" y="30" width="1120" height="340" rx="28" fill="#0A0E1A" stroke="${s}" stroke-width="3"/>
  <circle cx="1000" cy="200" r="220" fill="${p}" opacity="0.08"/>
  <g transform="translate(100, 160)">
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="60" fill="${textMain}">${repoName}</text>
    <text x="0" y="50" font-family="'Space Grotesk', sans-serif" font-size="22" fill="#94A3B8">${currentRepo.description}</text>
    <text x="0" y="90" font-family="monospace" font-size="16" fill="${p}">AUTHOR: ${handle} • LANGUAGE: ${lang}</text>
  </g>
`),
      },
      {
        id: 'opt_banner_3',
        name: 'Variant C: Retro Synthwave Horizon',
        tag: '80s Synthwave',
        desc: 'Retro horizon grid lines with vibrant glowing sun.',
        svgCode: wrapSvg(`
  <rect x="40" y="30" width="1120" height="340" rx="24" fill="#060911"/>
  <circle cx="600" cy="180" r="100" fill="${s}" opacity="0.8"/>
  <line x1="40" y1="260" x2="1160" y2="260" stroke="${p}" stroke-width="3"/>
  <g transform="translate(100, 150)">
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="52" fill="#FFFFFF">${repoName}</text>
    <text x="0" y="42" font-family="monospace" font-size="18" fill="${p}">SYNTH ENGINE // ${lang}</text>
  </g>
`),
      },
      {
        id: 'opt_banner_4',
        name: 'Variant D: Terminal Shell Log',
        tag: 'CLI Console',
        desc: 'Full IDE command line header preview.',
        svgCode: wrapSvg(`
  <rect x="40" y="30" width="1120" height="340" rx="20" fill="#0A0E1A" stroke="${p}" stroke-width="3"/>
  <rect x="40" y="30" width="1120" height="42" rx="20" fill="#121B2D"/>
  <circle cx="70" cy="51" r="6" fill="#FF5F56"/>
  <circle cx="90" cy="51" r="6" fill="#FFBD2E"/>
  <circle cx="110" cy="51" r="6" fill="#27C93F"/>
  <text x="140" y="56" font-family="monospace" font-size="14" fill="#94A3B8">term -- ${currentRepo.fullName}</text>
  <text x="80" y="140" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="36" fill="${p}">$ git checkout -b main</text>
  <text x="80" y="190" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="36" fill="${textMain}">$ asset-studio --apply ${selectedAssetType}</text>
  <text x="80" y="240" font-family="monospace" font-size="18" fill="#00FF66">&gt; SUCCESS: Applied to ${currentRepo.name}</text>
`),
      },
    ];
  };

  const optionVariants = generateOptionVariants();
  const currentActiveOption = optionVariants[selectedVariantIndex] || optionVariants[0];

  // Insta-Apply Action
  const handleInstaApply = () => {
    const appliedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const commitHash = Math.random().toString(16).substring(2, 9);
    const commitMsg = `style(branding): update ${selectedAssetType} via Linacre Asset Studio [skip ci]`;
    const targetPath = `.github/assets/${currentRepo.name}_${selectedAssetType}.svg`;

    const newAppliedAsset: RepoAppliedAsset = {
      assetType: selectedAssetType,
      assetName: `${currentRepo.name}_${selectedAssetType}`,
      svgCode: currentActiveOption.svgCode,
      appliedAt: appliedTime,
      themeName: activePalette.name,
      commitHash,
      commitMessage: commitMsg,
      targetPath,
    };

    const newHistoryEntry: RepoHistoryEntry = {
      id: `hist_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      assetType: selectedAssetType,
      assetName: `${currentRepo.name}_${selectedAssetType}`,
      svgCode: currentActiveOption.svgCode,
      themeName: activePalette.name,
      commitHash,
      commitMessage: commitMsg,
      targetPath,
    };

    setRepos((prevRepos) =>
      prevRepos.map((r) => {
        if (r.id === currentRepo.id) {
          return {
            ...r,
            lastSyncedAt: 'Just now',
            appliedAssets: {
              ...r.appliedAssets,
              [selectedAssetType]: newAppliedAsset,
            },
            history: [newHistoryEntry, ...(r.history || [])],
          };
        }
        return r;
      })
    );

    setToastMessage(`⚡ Insta-Applied ${selectedAssetType.toUpperCase()}! Commit #${commitHash} pushed to ${currentRepo.fullName}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Download SVG
  const handleDownloadImage = () => {
    const blob = new Blob([currentActiveOption.svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRepo.name}_${selectedAssetType}_${activePalette.name.toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy Markdown
  const handleCopyMarkdownSnippet = () => {
    const snippet = `<!-- ${currentRepo.fullName} ${selectedAssetType.toUpperCase()} Asset -->
![${currentRepo.name} ${selectedAssetType}](.github/assets/${currentRepo.name}_${selectedAssetType}.svg)
`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  // Create new repo
  const handleCreateNewRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;

    const cleanName = newRepoName.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    const newRepo: RepoItem = {
      id: `repo_${Date.now()}`,
      account: activeProfile,
      name: cleanName,
      fullName: `${activeProfile === 'dlinacre' ? 'DLinacre' : activeProfile === 'lin4cre' ? 'LIN4CRE' : 'linacre.site'}/${cleanName}`,
      description: newRepoDesc || 'New custom project repository created via Linacre Asset Studio.',
      readmeExcerpt: `# ${cleanName}\n${newRepoDesc}`,
      language: newRepoLang,
      stars: 1,
      forksCount: 0,
      updatedAt: 'Just now',
      isFavorite: true,
      topics: ['custom-repo', 'linacre-site', 'gamedev'],
      lastSyncedAt: 'Just now',
      appliedAssets: {},
      history: [],
    };

    setRepos([newRepo, ...repos]);
    setSelectedRepoId(newRepo.id);
    setShowAddRepoModal(false);
    setNewRepoName('');
    setNewRepoDesc('');
    setToastMessage(`Created & Synced repository ${newRepo.fullName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // PAT Connect Submit
  const handleConnectPAT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patInput.trim()) return;

    const newAcc: OAuthConnectedAccount = {
      id: `acc_${Date.now()}`,
      username: `user_${Math.floor(Math.random() * 8999) + 1000}`,
      displayName: 'Personal OAuth User',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      connectedAt: 'Just now',
      authMethod: 'pat',
      accessTokenMasked: `${patInput.substring(0, 4)}...${patInput.substring(patInput.length - 4)}`,
      repoCount: 2,
    };

    setAccounts([newAcc, ...accounts]);
    setPatInput('');
    setPatStatusMsg('Successfully authenticated GitHub Personal Access Token!');
    setTimeout(() => {
      setPatStatusMsg(null);
      setShowOAuthModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Top Header Hub */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                GITHUB OAUTH ACTIVE ({accounts.length} Accounts Connected)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-3">
              <Github className="w-8 h-8 text-cyan-400" />
              <span>GitHub Repository Asset Manager</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl font-sans">
              Connect accounts, select any project repository, generate AI multi-option artwork tailored to project metadata, tweak styling, and hit <span className="text-emerald-400 font-bold">Insta-Apply</span> to update GitHub repositories automatically!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowOAuthModal(true)}
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-gray-950 hover:bg-gray-800 text-cyan-300 border border-cyan-500/40 flex items-center gap-2 shadow-lg transition-all"
            >
              <Key className="w-4 h-4 text-cyan-400" />
              <span>ACCOUNTS & OAUTH</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddRepoModal(true)}
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 hover:from-cyan-400 hover:to-teal-400 flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>ADD REPOSITORY</span>
            </button>
          </div>
        </div>

        {/* Connected Accounts Badges Row */}
        <div className="mt-6 pt-4 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-gray-500 mr-2">Connected Accounts:</span>
            <button
              onClick={() => setSelectedAccountFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedAccountFilter === 'all'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'bg-gray-950 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              All ({repos.length} Repos)
            </button>

            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccountFilter(acc.username)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  selectedAccountFilter === acc.username
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-gray-950 text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>@{acc.username}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleRefreshRepoList}
            disabled={isRefreshingList}
            className="text-xs font-mono text-gray-400 hover:text-cyan-300 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingList ? 'animate-spin' : ''}`} />
            <span>Sync Repos</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Repository Dropdown, Filtering, Asset Type Selection & AI Options */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Repository Dropdown Hub */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-gray-300 flex items-center gap-2">
                <FolderSync className="w-4 h-4 text-cyan-400" />
                <span>SELECT REPOSITORY</span>
              </label>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFavoritesOnly(!favoritesOnly)}
                  className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-all ${
                    favoritesOnly
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold'
                      : 'bg-gray-950 text-gray-500 border border-gray-800 hover:text-amber-400'
                  }`}
                  title="Show Starred Favorites Only"
                >
                  <Star className={`w-3 h-3 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>Favorites</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search repository name, language, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 hover:border-gray-700 text-white font-mono text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            {/* Repository Select Dropdown */}
            <div className="relative">
              <select
                value={selectedRepoId}
                onChange={(e) => setSelectedRepoId(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 hover:border-gray-700 text-white font-mono text-xs rounded-xl px-4 py-3.5 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer shadow-inner"
              >
                {filteredRepos.map((repo) => {
                  const appliedCount = Object.keys(repo.appliedAssets || {}).length;
                  const favStar = repo.isFavorite ? '★ ' : '';
                  return (
                    <option key={repo.id} value={repo.id} className="bg-gray-950 text-gray-200 py-2">
                      {favStar}{repo.fullName} ({repo.language} — {repo.stars}★ — {appliedCount} Applied)
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3.5 top-4" />
            </div>

            {/* Selected Repository Detail Card */}
            <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-3 relative">
              <button
                type="button"
                onClick={(e) => handleToggleFavorite(currentRepo.id, e)}
                className="absolute top-3.5 right-3.5 text-gray-500 hover:text-amber-400 transition-all"
                title="Toggle Favorite"
              >
                <Star className={`w-4 h-4 ${currentRepo.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>

              <div className="flex items-center justify-between pr-6">
                <span className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  {currentRepo.fullName}
                </span>
              </div>

              <p className="text-xs text-gray-300 line-clamp-2">{currentRepo.description}</p>

              {currentRepo.readmeExcerpt && (
                <div className="p-2.5 rounded-lg bg-gray-900/90 border border-gray-800/80 font-mono text-[11px] text-gray-400 space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
                    <FileCode className="w-3 h-3" />
                    <span>README Metadata Context</span>
                  </div>
                  <p className="line-clamp-2 text-gray-300">{currentRepo.readmeExcerpt}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                  {currentRepo.language}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                  {currentRepo.stars}
                </span>
                {currentRepo.topics.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-900 text-gray-400 border border-gray-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Themes & Preset Templates Hub with Filter Categories */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-gray-800">
              <label className="text-xs font-mono font-bold text-gray-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>PROFILE THEME PRESETS</span>
              </label>
              <span className="text-[11px] font-mono text-gray-400">
                Active: <strong className="text-cyan-300">{activePalette.name}</strong> ({activePalette.category})
              </span>
            </div>

            {/* Filter Categories Tabs ('Apple Glass', 'Minimalist', 'Technical', 'Creative') */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-950 rounded-xl border border-gray-800">
              {(['all', 'Apple Glass', 'Minimalist', 'Technical', 'Creative'] as const).map((cat) => {
                const isSelected = activeThemeCategory === cat;
                const count = cat === 'all' ? PALETTE_THEMES.length : PALETTE_THEMES.filter(t => t.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveThemeCategory(cat)}
                    className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-gray-950 shadow-md shadow-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900'
                    }`}
                  >
                    <span>{cat === 'all' ? 'All' : cat}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-gray-950 text-cyan-300' : 'bg-gray-900 text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Category Preset Templates Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredThemePresets.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelectThemePreset(theme.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-gray-800 border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-gray-950 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-gray-200 flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20 shadow-sm shrink-0"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span className="truncate">{theme.name}</span>
                      </span>

                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}>
                        {theme.category}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 line-clamp-2">{theme.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-800/60">
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} title={`Primary: ${theme.primary}`} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.secondary }} title={`Secondary: ${theme.secondary}`} />
                      </div>

                      {isSelected ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-gray-500 hover:text-cyan-300">
                          Apply Theme →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Supported Asset Types Grid */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            <label className="block text-xs font-mono font-bold text-gray-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-400" />
              <span>SUPPORTED REPOSITORY ASSET TYPES</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'banner', label: 'Hero Banner', dims: '1200x400' },
                { id: 'logo', label: 'Repo Logo', dims: '800x250' },
                { id: 'icon', label: 'Repo Icon', dims: '512x512' },
                { id: 'readmeHeader', label: 'README Header', dims: '1100x320' },
                { id: 'socialCard', label: 'Social OG Card', dims: '1200x630' },
                { id: 'readmeBadge', label: 'Badge Set', dims: '400x100' },
                { id: 'releaseArt', label: 'Release Art', dims: '1200x600' },
                { id: 'favicon', label: 'Favicon Vector', dims: '256x256' },
                { id: 'orgLogo', label: 'Org Logo', dims: '512x512' },
                { id: 'profileBanner', label: 'Profile Banner', dims: '1200x350' },
              ].map((type) => {
                const isSelected = selectedAssetType === type.id;
                const isApplied = !!currentRepo.appliedAssets?.[type.id as RepoAssetType];
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setSelectedAssetType(type.id as RepoAssetType);
                      setSelectedVariantIndex(0);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-gray-800 border-cyan-400 ring-1 ring-cyan-400 shadow-lg shadow-cyan-500/10'
                        : 'bg-gray-950 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                    }`}
                  >
                    {isApplied && (
                      <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                        <span className="inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                    )}
                    <div className="text-xs font-mono font-bold text-gray-200">{type.label}</div>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">{type.dims}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Multi-Option Generated Variants Picker */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>AI GENERATED DESIGN OPTIONS</span>
              </label>

              <button
                type="button"
                onClick={handleRegenerateOptions}
                disabled={isGeneratingOptions}
                className="px-2.5 py-1 rounded-lg text-xs font-mono text-yellow-400 bg-gray-950 border border-yellow-500/40 hover:bg-yellow-500/10 flex items-center gap-1 transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingOptions ? 'animate-spin' : ''}`} />
                <span>Refresh Options</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {optionVariants.map((variant, idx) => {
                const isSelected = selectedVariantIndex === idx;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all space-y-2 ${
                      isSelected
                        ? 'bg-gray-800 border-yellow-400 ring-1 ring-yellow-400 shadow-md'
                        : 'bg-gray-950 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-gray-200">{variant.tag}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800">
                        Opt #{idx + 1}
                      </span>
                    </div>

                    <div
                      className="w-full h-16 bg-gray-900/90 rounded border border-gray-800/80 p-1 flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: variant.svgCode }}
                    />

                    <p className="text-[10px] text-gray-400 line-clamp-1">{variant.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive Preview, Editor Suite & Insta-Apply Console */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Preview & Insta-Apply Suite */}
          <div className={`bg-gray-900 border rounded-2xl p-6 shadow-2xl space-y-6 transition-all duration-300 ${activePalette.previewCardBorder} ${activePalette.glowClass}`}>
            
            {/* Action Bar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-800 gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${activePalette.badgeText}`} />
                  <span>{currentActiveOption.name}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Contextually tailored for <span className="font-mono text-cyan-300">{currentRepo.fullName}</span>
                </p>
              </div>

              {/* Action Buttons: Live Glitch & Insta-Apply */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setLiveGlitchMode(!liveGlitchMode)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                    liveGlitchMode
                      ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/30 animate-pulse'
                      : 'bg-gray-950 text-gray-400 border-gray-800 hover:text-white'
                  }`}
                  title="Toggle Keyframe Glitch Shader"
                >
                  <Zap className={`w-3.5 h-3.5 ${liveGlitchMode ? 'text-yellow-300' : 'text-gray-500'}`} />
                  <span>GLITCH FX</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstaApply}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-gray-950 hover:from-emerald-400 hover:to-cyan-400 border border-emerald-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Zap className="w-4 h-4 fill-gray-950 stroke-none" />
                  <span>INSTA-APPLY TO REPO</span>
                </button>
              </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono rounded-xl flex items-center gap-2 animate-bounce shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* SVG Render Canvas Container */}
            <div className={`relative w-full rounded-2xl p-4 border shadow-inner overflow-hidden flex items-center justify-center min-h-[320px] transition-all duration-300 ${
              editorConfig.bgMode === 'light'
                ? 'bg-slate-100 border-slate-300'
                : activePalette.previewCardBg + ' ' + activePalette.previewCardBorder
            }`}>
              {liveGlitchMode && (
                <div className="absolute inset-0 pointer-events-none z-10 glitch-scanlines-overlay opacity-40" />
              )}
              <div
                className={`w-full h-full max-h-[420px] flex items-center justify-center transition-all ${
                  liveGlitchMode ? 'animate-glitch-live' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: currentActiveOption.svgCode }}
              />
            </div>

            {/* Integrated Customization & Styling Controls Toolbar */}
            <div className="bg-gray-950/90 border border-gray-800/80 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>REAL-TIME EDITING & STYLING TOOLBAR</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Dark / Light / Transparent Canvas Toggle */}
                  <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-0.5 text-xs font-mono">
                    <button
                      onClick={() => setEditorConfig({ ...editorConfig, bgMode: 'dark' })}
                      className={`px-2 py-1 rounded ${editorConfig.bgMode === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setEditorConfig({ ...editorConfig, bgMode: 'light' })}
                      className={`px-2 py-1 rounded ${editorConfig.bgMode === 'light' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setEditorConfig({ ...editorConfig, bgMode: 'transparent' })}
                      className={`px-2 py-1 rounded ${editorConfig.bgMode === 'transparent' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                    >
                      Trans
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Scale Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                    <span>Scale Zoom:</span>
                    <span>{Math.round(editorConfig.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={editorConfig.scale}
                    onChange={(e) => setEditorConfig({ ...editorConfig, scale: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Padding Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                    <span>Inner Padding:</span>
                    <span>{editorConfig.padding}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    step="2"
                    value={editorConfig.padding}
                    onChange={(e) => setEditorConfig({ ...editorConfig, padding: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Color Palette Selector */}
                <div>
                  <div className="text-[11px] font-mono text-gray-400 mb-1">Color Palette Preset:</div>
                  <select
                    value={selectedThemeId}
                    onChange={(e) => handleSelectThemePreset(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1 text-xs font-mono text-white cursor-pointer"
                  >
                    {PALETTE_THEMES.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.category}] {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Secondary Output Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono bg-gray-950 text-gray-300 border border-gray-800 hover:text-white hover:border-gray-700 flex items-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdownSnippet}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono bg-gray-950 text-gray-300 border border-gray-800 hover:text-white hover:border-gray-700 flex items-center gap-2 transition-all"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{copiedSnippet ? 'Copied Snippet!' : 'Copy Markdown'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentRepo.history && currentRepo.history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono bg-gray-950 text-amber-300 border border-amber-500/30 hover:bg-amber-500/10 flex items-center gap-1.5 transition-all"
                  >
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span>Version History ({currentRepo.history.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onInspectAsset(currentActiveOption.svgCode, `${currentRepo.name}_${selectedAssetType}`)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono bg-gray-950 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 flex items-center gap-1.5 transition-all"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect Source</span>
                </button>
              </div>
            </div>

          </div>

          {/* Applied Assets Vault & Git Commit History for Selected Repo */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-mono font-bold text-gray-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                <span>Applied Repository Branding Vault ({currentRepo.name})</span>
              </span>
              <span className="text-xs text-gray-500 font-normal">
                {Object.keys(currentRepo.appliedAssets || {}).length} Active Assets
              </span>
            </h4>

            {Object.keys(currentRepo.appliedAssets || {}).length === 0 ? (
              <div className="p-6 text-center bg-gray-950/60 border border-gray-800/80 rounded-xl space-y-2">
                <p className="text-xs font-mono text-gray-400">No active assets applied yet to this repository.</p>
                <p className="text-[11px] text-gray-500">
                  Select an asset type, pick a design option, and click <strong className="text-emerald-400">Insta-Apply</strong> to generate GitHub commits!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(currentRepo.appliedAssets!).map(([typeKey, rawItem]) => {
                  const item = rawItem as RepoAppliedAsset;
                  if (!item) return null;
                  return (
                    <div key={typeKey} className="p-3 bg-gray-950 border border-gray-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-300 uppercase">{typeKey}</span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          #{item.commitHash || 'main'}
                        </span>
                      </div>

                      <div
                        className="w-full h-24 bg-gray-900/80 rounded-lg border border-gray-800 p-2 flex items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-all"
                        onClick={() => onInspectAsset(item.svgCode, item.assetName)}
                        dangerouslySetInnerHTML={{ __html: item.svgCode }}
                      />

                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1">
                        <span>{item.appliedAt}</span>
                        <button
                          onClick={() => onInspectAsset(item.svgCode, item.assetName)}
                          className="text-cyan-400 hover:underline"
                        >
                          Inspect Source
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Version History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <span>Version History Log ({currentRepo.name})</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {currentRepo.history?.map((entry) => (
                <div key={entry.id} className="p-3 bg-gray-950 border border-gray-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyan-300">{entry.assetType.toUpperCase()}</span>
                    <span className="text-gray-500">{entry.timestamp}</span>
                  </div>

                  <p className="text-xs text-gray-300 font-mono">{entry.commitMessage}</p>

                  <div
                    className="w-full h-20 bg-gray-900/90 rounded border border-gray-800 p-2 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: entry.svgCode }}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-emerald-400">Commit #{entry.commitHash}</span>
                    <button
                      onClick={() => {
                        onInspectAsset(entry.svgCode, entry.assetName);
                        setShowHistoryModal(false);
                      }}
                      className="text-xs font-mono text-cyan-400 hover:underline"
                    >
                      Restore / Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GitHub OAuth Setup & Account Manager Modal */}
      {showOAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Github className="w-5 h-5 text-cyan-400" />
                <span>GitHub OAuth & Accounts Manager</span>
              </h3>
              <button
                onClick={() => setShowOAuthModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Connected Accounts List */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-gray-400">ACTIVE AUTHENTICATED ACCOUNTS</label>
              {accounts.map((acc) => (
                <div key={acc.id} className="p-3 bg-gray-950 border border-gray-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={acc.avatarUrl} alt={acc.username} className="w-8 h-8 rounded-full border border-gray-700" />
                    <div>
                      <div className="text-xs font-mono font-bold text-white">@{acc.username}</div>
                      <div className="text-[10px] text-gray-500">{acc.authMethod.toUpperCase()} • Token: {acc.accessTokenMasked}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    AUTHENTICATED
                  </span>
                </div>
              ))}
            </div>

            {/* Authenticate with PAT or OAuth */}
            <form onSubmit={handleConnectPAT} className="space-y-3 pt-2 border-t border-gray-800">
              <label className="block text-xs font-mono text-gray-300">AUTHENTICATE WITH PERSONAL ACCESS TOKEN (PAT)</label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={patInput}
                onChange={(e) => setPatInput(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />

              {patStatusMsg && (
                <p className="text-xs font-mono text-emerald-400">{patStatusMsg}</p>
              )}

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-[11px] font-mono text-cyan-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GitHub OAuth Redirect Configuration</span>
                </div>
                <p className="text-gray-300">
                  Callback URL for GitHub App Registration:
                </p>
                <code className="block p-1.5 bg-gray-950 rounded border border-gray-800 text-[10px] text-cyan-300 break-all select-all">
                  {window.location.origin}/auth/callback
                </code>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOAuthModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-gray-950 text-gray-400 border border-gray-800 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-gray-950"
                >
                  Authenticate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Repository Modal */}
      {showAddRepoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Github className="w-5 h-5 text-cyan-400" />
                <span>Add GitHub Repository</span>
              </h3>
              <button
                onClick={() => setShowAddRepoModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewRepo} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">REPOSITORY NAME</label>
                <input
                  type="text"
                  placeholder="e.g., my-awesome-game"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">DESCRIPTION</label>
                <textarea
                  placeholder="Short overview of the project..."
                  value={newRepoDesc}
                  onChange={(e) => setNewRepoDesc(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white font-sans focus:outline-none focus:border-cyan-400 h-20"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">PRIMARY LANGUAGE</label>
                <select
                  value={newRepoLang}
                  onChange={(e) => setNewRepoLang(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="C# / Unity">C# / Unity</option>
                  <option value="C++ / Unreal">C++ / Unreal</option>
                  <option value="HLSL / Shaders">HLSL / Shaders</option>
                  <option value="Rust">Rust</option>
                  <option value="Python">Python</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRepoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-gray-950 text-gray-400 border border-gray-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-gray-950"
                >
                  Sync & Add Repo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
