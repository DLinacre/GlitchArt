export type BrandProfile = 'dlinacre' | 'lin4cre' | 'linacre_site';

export type VisualPresetId = 'Cyberpunk' | 'Minimal Glass' | 'Classic Tech';

export type AssetCategory = 'logo' | 'avatar' | 'banner' | 'game_icon' | 'app_icon' | 'ui_badge' | 'wallpaper';

export type StyleThemeId =
  | 'glitch_tech'
  | 'neon_circuit'
  | 'retro_pixel'
  | 'minimal_vector'
  | 'sketch_hand'
  | 'flat_ui'
  | 'material_tech'
  | 'gradient_abstract'
  | 'vaporwave'
  | 'geometric_isometric';

export interface AssetItem {
  id: string;
  name: string;
  category: AssetCategory;
  themeId: StyleThemeId;
  description: string;
  tags: string[];
  dimensions?: string;
  svgCode: string; // Dynamic clean vector or SVG representation
  previewBg?: string;
  suggestedUsage: string;
}

export interface StyleSet {
  id: StyleThemeId;
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  badgeTag: string;
  assets: AssetItem[];
}

export interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  description?: string;
  purpose?: string;
  allowedFormats?: string[];
  required?: boolean;
  selected?: boolean;
  children?: FolderNode[];
  content?: string;
}

export interface StudioConfig {
  profile: BrandProfile;
  titleText: string;
  subtitleText: string;
  handleText: string;
  themeColor: string; // hex
  secondaryColor: string; // hex
  glitchIntensity: number; // 0 - 100
  scanlines: boolean;
  gridOverlay: boolean;
  selectedIcon: 'joystick' | 'terminal' | 'cube' | 'shield' | 'wrench' | 'waveform' | 'circuit' | 'code';
  assetType: 'avatar' | 'banner' | 'logo' | 'repo_card';
  aspectRatio: '1:1' | '16:9' | '4:1';
}

export interface ProfileMeta {
  id: BrandProfile;
  name: string;
  handle: string;
  title: string;
  bio: string;
  website: string;
  accentColor: string;
  bannerTitle: string;
  bannerSubtitle: string;
  pinnedRepos: {
    name: string;
    description: string;
    language: string;
    stars: number;
    icon: string;
  }[];
}

export type RepoAssetType =
  | 'logo'
  | 'icon'
  | 'banner'
  | 'readmeHeader'
  | 'socialCard'
  | 'readmeBadge'
  | 'releaseArt'
  | 'favicon'
  | 'orgLogo'
  | 'profileBanner';

export interface RepoAppliedAsset {
  assetType: RepoAssetType;
  assetName: string;
  svgCode: string;
  appliedAt: string;
  themeName: string;
  commitHash?: string;
  commitMessage?: string;
  targetPath?: string;
}

export interface RepoHistoryEntry {
  id: string;
  timestamp: string;
  assetType: RepoAssetType;
  assetName: string;
  svgCode: string;
  themeName: string;
  commitHash: string;
  commitMessage: string;
  targetPath: string;
}

export interface AssetOptionVariant {
  id: string;
  variantName: string;
  styleTag: string;
  svgCode: string;
  description: string;
}

export interface AssetEditorConfig {
  scale: number; // 0.5 to 1.5
  padding: number; // 0 to 48
  bgMode: 'dark' | 'light' | 'transparent';
  primaryColor: string;
  secondaryColor: string;
  glitchIntensity: number; // 0 to 100
  scanlines: boolean;
  glowEffect: boolean;
}

export interface OAuthConnectedAccount {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  connectedAt: string;
  authMethod: 'oauth' | 'pat' | 'simulated';
  accessTokenMasked: string;
  repoCount: number;
}

export interface RepoItem {
  id: string;
  account: string; // Account username e.g. dlinacre or connected account
  name: string;
  fullName: string;
  description: string;
  readmeExcerpt?: string;
  language: string;
  stars: number;
  forksCount?: number;
  updatedAt?: string;
  isFavorite?: boolean;
  isPrivate?: boolean;
  topics: string[];
  appliedAssets?: Partial<Record<RepoAssetType, RepoAppliedAsset>>;
  history?: RepoHistoryEntry[];
  lastSyncedAt?: string;
}

