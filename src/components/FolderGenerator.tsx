import React, { useState } from 'react';
import { FolderNode, BrandProfile } from '../types';
import { INITIAL_FOLDER_STRUCTURE, generateReadmeBoilerplate, generateShellScript, generatePowerShellScript } from '../data/directoryPreset';
import JSZip from 'jszip';
import {
  FolderTree,
  Download,
  Copy,
  Check,
  Terminal,
  FileText,
  ChevronRight,
  ChevronDown,
  Sparkles,
  FolderPlus,
  FileCode,
  Edit3,
  RefreshCw,
  Layers,
  Shield,
  Zap,
  Palette,
  Slash,
  Plus,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface FolderGeneratorProps {
  activeProfile: BrandProfile;
}

export type RenameCaseMode = 'none' | 'lowercase' | 'uppercase' | 'kebab' | 'snake';
export type TargetScope = 'all' | 'files' | 'folders';

export interface BulkRenameRules {
  prefix: string;
  suffix: string;
  findText: string;
  replaceText: string;
  caseMode: RenameCaseMode;
  targetScope: TargetScope;
  extensionFilter: string; // 'all' or '.png', '.svg', etc.
}

export interface LogomarkConfig {
  monogram: string;
  style: 'crest' | 'ring' | 'glass' | 'hexagon';
  primaryColor: string;
  secondaryColor: string;
  glowEffect: boolean;
  showGrid: boolean;
}

export const FolderGenerator: React.FC<FolderGeneratorProps> = ({ activeProfile }) => {
  const [tree, setTree] = useState<FolderNode>(INITIAL_FOLDER_STRUCTURE);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    root: true,
    raw: true,
    production: true,
    ui_ux: true,
    audio: true,
    docs: true,
  });

  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedSh, setCopiedSh] = useState(false);
  const [copiedPs1, setCopiedPs1] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [injectedSuccess, setInjectedSuccess] = useState(false);

  // Bulk Renaming State
  const [renameRules, setRenameRules] = useState<BulkRenameRules>({
    prefix: '',
    suffix: '',
    findText: '',
    replaceText: '',
    caseMode: 'none',
    targetScope: 'all',
    extensionFilter: 'all',
  });
  const [renameSuccessMsg, setRenameSuccessMsg] = useState<string | null>(null);

  // Minimalist Logomark Generator State based on Brand Profile
  const getInitialMonogram = (prof: BrandProfile) => {
    if (prof === 'dlinacre') return 'DL';
    if (prof === 'lin4cre') return 'L4';
    return 'LS';
  };

  const getInitialPrimaryColor = (prof: BrandProfile) => {
    if (prof === 'dlinacre') return '#38BDF8'; // Sky Blue
    if (prof === 'lin4cre') return '#00F0FF'; // Cyber Cyan
    return '#10B981'; // Emerald
  };

  const getInitialSecondaryColor = (prof: BrandProfile) => {
    if (prof === 'dlinacre') return '#F8FAFC'; // Titanium White
    if (prof === 'lin4cre') return '#FF0055'; // Neon Magenta
    return '#34D399'; // Mint
  };

  const [logomarkConfig, setLogomarkConfig] = useState<LogomarkConfig>({
    monogram: getInitialMonogram(activeProfile),
    style: activeProfile === 'dlinacre' ? 'glass' : activeProfile === 'lin4cre' ? 'ring' : 'crest',
    primaryColor: getInitialPrimaryColor(activeProfile),
    secondaryColor: getInitialSecondaryColor(activeProfile),
    glowEffect: true,
    showGrid: true,
  });

  // Profile brand keywords
  const brandKeywords: Record<BrandProfile, { tags: string[]; desc: string; heroBadge: string }> = {
    dlinacre: {
      tags: ['cupertino_dark_glass', 'vector_minimalism', 'system_architecture', 'fullstack_architect', 'sky_blue_accent'],
      desc: 'Cupertino Dark Glass & Sleek Minimalist System Architecture',
      heroBadge: 'DL ARCHITECTURE BRAND',
    },
    lin4cre: {
      tags: ['cyber_cyan', 'neon_magenta', 'high_octane_async', 'glitch_geometry', 'terminal_core'],
      desc: 'High-Octane Async Engines, Glitch Tech & Cyberpunk Visuals',
      heroBadge: 'LIN4CRE GAMING ENGINE',
    },
    linacre_site: {
      tags: ['porcelain_satin', 'official_hub', 'sleek_structure', 'emerald_horizon', 'minimal_crest'],
      desc: 'Official Linacre Studio Hub & Porcelain Minimalist Crests',
      heroBadge: 'LINACRE.SITE CREATIVE HUB',
    },
  };

  const currentBrandInfo = brandKeywords[activeProfile];

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ---------------------------------------------------------------------------
  // BULK RENAMING UTILITY LOGIC
  // ---------------------------------------------------------------------------
  const transformSingleName = (oldName: string, isFile: boolean, rules: BulkRenameRules): string => {
    if (!oldName) return oldName;

    let baseName = oldName;
    let ext = '';

    if (isFile && oldName.includes('.')) {
      const lastDotIndex = oldName.lastIndexOf('.');
      baseName = oldName.substring(0, lastDotIndex);
      ext = oldName.substring(lastDotIndex);
    }

    // Check extension filter
    if (rules.extensionFilter !== 'all') {
      if (isFile && ext.toLowerCase() !== rules.extensionFilter.toLowerCase()) {
        return oldName;
      }
    }

    // 1. Find & Replace
    if (rules.findText) {
      baseName = baseName.split(rules.findText).join(rules.replaceText);
    }

    // 2. Case Modes
    if (rules.caseMode === 'lowercase') {
      baseName = baseName.toLowerCase();
    } else if (rules.caseMode === 'uppercase') {
      baseName = baseName.toUpperCase();
    } else if (rules.caseMode === 'kebab') {
      baseName = baseName.replace(/[\s_]+/g, '-').toLowerCase();
    } else if (rules.caseMode === 'snake') {
      baseName = baseName.replace(/[\s-]+/g, '_').toLowerCase();
    }

    // 3. Prefix & Suffix
    const newBase = `${rules.prefix}${baseName}${rules.suffix}`;

    return isFile ? `${newBase}${ext}` : newBase;
  };

  // Helper to test if a node matches the target scope
  const isNodeMatchingScope = (node: FolderNode, rules: BulkRenameRules): boolean => {
    if (node.id === 'root') return false; // Do not rename root folder
    if (rules.targetScope === 'files' && node.type !== 'file') return false;
    if (rules.targetScope === 'folders' && node.type !== 'folder') return false;

    if (node.type === 'file' && rules.extensionFilter !== 'all') {
      const ext = node.name.includes('.') ? node.name.substring(node.name.lastIndexOf('.')) : '';
      if (ext.toLowerCase() !== rules.extensionFilter.toLowerCase()) return false;
    }

    return true;
  };

  // Collect all preview changes
  const collectRenamePreview = (node: FolderNode, rules: BulkRenameRules, results: { oldName: string; newName: string; type: 'file' | 'folder'; id: string }[] = []) => {
    if (isNodeMatchingScope(node, rules)) {
      const newName = transformSingleName(node.name, node.type === 'file', rules);
      if (newName !== node.name) {
        results.push({
          id: node.id,
          oldName: node.name,
          newName,
          type: node.type,
        });
      }
    }

    if (node.children) {
      node.children.forEach((child) => collectRenamePreview(child, rules, results));
    }

    return results;
  };

  const previewChanges = collectRenamePreview(tree, renameRules);

  const handleApplyBulkRename = () => {
    if (previewChanges.length === 0) return;

    const renameRecursive = (node: FolderNode): FolderNode => {
      let updatedName = node.name;
      if (isNodeMatchingScope(node, renameRules)) {
        updatedName = transformSingleName(node.name, node.type === 'file', renameRules);
      }

      const updatedChildren = node.children ? node.children.map(renameRecursive) : undefined;

      return {
        ...node,
        name: updatedName,
        children: updatedChildren,
      };
    };

    const newTree = renameRecursive(tree);
    setTree(newTree);

    setRenameSuccessMsg(`Successfully renamed ${previewChanges.length} items!`);
    setTimeout(() => setRenameSuccessMsg(null), 3000);
  };

  const handleResetTree = () => {
    setTree(INITIAL_FOLDER_STRUCTURE);
    setRenameRules({
      prefix: '',
      suffix: '',
      findText: '',
      replaceText: '',
      caseMode: 'none',
      targetScope: 'all',
      extensionFilter: 'all',
    });
    setRenameSuccessMsg('Reset structure to default 🎨_folder specification.');
    setTimeout(() => setRenameSuccessMsg(null), 2500);
  };

  // ---------------------------------------------------------------------------
  // MINIMALIST LOGOMARK SVG GENERATOR
  // ---------------------------------------------------------------------------
  const generateLogomarkSvgMarkup = (cfg: LogomarkConfig): string => {
    const primary = cfg.primaryColor;
    const secondary = cfg.secondaryColor;
    const mono = cfg.monogram.toUpperCase() || 'DL';

    let shapeContent = '';

    if (cfg.style === 'glass') {
      shapeContent = `
  <!-- Cupertino Frosted Glass Shield -->
  <rect x="20" y="20" width="160" height="160" rx="36" fill="#0F172A" fill-opacity="0.75" stroke="${primary}" stroke-width="2.5" />
  <rect x="28" y="28" width="144" height="144" rx="28" fill="url(#glassGrad)" fill-opacity="0.15" stroke="white" stroke-opacity="0.2" stroke-width="1.5" />
  <line x1="36" y1="36" x2="164" y2="36" stroke="${secondary}" stroke-width="2" stroke-linecap="round" stroke-opacity="0.8" />
  <text x="100" y="118" font-family="'JetBrains Mono', 'Space Grotesk', system-ui, sans-serif" font-weight="900" font-size="52" fill="white" text-anchor="middle" letter-spacing="2">${mono}</text>
  <circle cx="148" cy="148" r="6" fill="${primary}" />
      `;
    } else if (cfg.style === 'ring') {
      shapeContent = `
  <!-- Cyber HUD Ring Reticle -->
  <circle cx="100" cy="100" r="76" fill="#0A0D14" stroke="${primary}" stroke-width="3" stroke-dasharray="12 6" />
  <circle cx="100" cy="100" r="62" fill="none" stroke="${secondary}" stroke-width="1.5" stroke-opacity="0.6" />
  <path d="M 100 12 L 100 24 M 100 176 L 100 188 M 12 100 L 24 100 M 176 100 L 188 100" stroke="${primary}" stroke-width="3" stroke-linecap="round" />
  <text x="100" y="116" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="48" fill="${primary}" text-anchor="middle" letter-spacing="3">${mono}</text>
  <circle cx="100" cy="100" r="88" fill="none" stroke="${primary}" stroke-width="1" stroke-opacity="0.3" />
      `;
    } else if (cfg.style === 'hexagon') {
      shapeContent = `
  <!-- Hexagon Core Tech Node -->
  <polygon points="100,16 172,56 172,144 100,184 28,144 28,56" fill="#0B0F19" stroke="${primary}" stroke-width="3.5" stroke-linejoin="round" />
  <polygon points="100,28 160,62 160,138 100,172 40,138 40,62" fill="none" stroke="${secondary}" stroke-width="1.5" stroke-opacity="0.5" stroke-dasharray="8 4" />
  <text x="100" y="116" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="46" fill="white" text-anchor="middle" letter-spacing="2">${mono}</text>
  <circle cx="100" cy="30" r="4" fill="${secondary}" />
  <circle cx="100" cy="170" r="4" fill="${primary}" />
      `;
    } else {
      // Crest Style
      shapeContent = `
  <!-- Minimalist Emblem Crest -->
  <path d="M 100 20 L 170 45 V 110 C 170 150 100 182 100 182 C 100 182 30 150 30 110 V 45 Z" fill="#0F172A" stroke="${primary}" stroke-width="3" stroke-linejoin="round" />
  <path d="M 100 32 L 158 53 V 106 C 158 138 100 166 100 166 C 100 166 42 138 42 106 V 53 Z" fill="none" stroke="${secondary}" stroke-width="1.5" stroke-opacity="0.4" />
  <text x="100" y="116" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="44" fill="white" text-anchor="middle" letter-spacing="2">${mono}</text>
  <line x1="60" y1="130" x2="140" y2="130" stroke="${primary}" stroke-width="2" stroke-linecap="round" />
      `;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.4" />
      <stop offset="100%" stop-color="${secondary}" stop-opacity="0.05" />
    </linearGradient>
    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  ${cfg.showGrid ? `
  <!-- Tech Grid Overlay -->
  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-opacity="0.04" stroke-width="1" />
  </pattern>
  <rect width="200" height="200" fill="url(#grid)" />
  ` : ''}

  <g ${cfg.glowEffect ? 'filter="url(#glowEffect)"' : ''}>
    ${shapeContent}
  </g>
</svg>`;
  };

  const svgMarkupString = generateLogomarkSvgMarkup(logomarkConfig);

  const handleDownloadSvg = () => {
    const blob = new Blob([svgMarkupString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProfile}_logomark_${logomarkConfig.monogram.toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySvgCode = () => {
    navigator.clipboard.writeText(svgMarkupString);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handleInjectLogomarkToTree = () => {
    const filename = `${activeProfile}_logomark_${logomarkConfig.monogram.toLowerCase()}.svg`;

    const injectRecursive = (node: FolderNode): FolderNode => {
      if (node.id === 'ui_icons' || node.name === 'icons') {
        const existingIndex = node.children?.findIndex((c) => c.name === filename) ?? -1;
        const newFileNode: FolderNode = {
          id: `logomark_${Date.now()}`,
          name: filename,
          type: 'file',
          purpose: `Generated Minimalist Logomark SVG for ${activeProfile}`,
          content: svgMarkupString,
          selected: true,
        };

        if (existingIndex >= 0 && node.children) {
          const updated = [...node.children];
          updated[existingIndex] = newFileNode;
          return { ...node, children: updated };
        } else {
          return {
            ...node,
            children: [...(node.children || []), newFileNode],
          };
        }
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(injectRecursive),
        };
      }

      return node;
    };

    const updatedTree = injectRecursive(tree);
    setTree(updatedTree);

    // Expand UI icons folder automatically
    setExpandedIds((prev) => ({
      ...prev,
      root: true,
      ui_ux: true,
      ui_icons: true,
    }));

    setInjectedSuccess(true);
    setTimeout(() => setInjectedSuccess(false), 3000);
  };

  // ---------------------------------------------------------------------------
  // ZIP DOWNLOAD & SCRIPT HANDLERS
  // ---------------------------------------------------------------------------
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      const addNodeToZip = (node: FolderNode, currentPath: string) => {
        if (!node.selected) return;

        const path = currentPath ? `${currentPath}/${node.name}` : node.name;

        if (node.type === 'folder') {
          zip.folder(path);
          if (node.children) {
            node.children.forEach((child) => addNodeToZip(child, path));
          }
        } else if (node.type === 'file') {
          zip.file(path, node.content || `# ${node.name}\n\nProject document created for ${activeProfile} // linacre.site.\n`);
        }
      };

      addNodeToZip(tree, '');

      // Add starter README.md inside 🎨_folder root
      const readmeMd = generateReadmeBoilerplate(tree);
      zip.file(`🎨_folder/README.md`, readmeMd);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linacre_art_folder_${activeProfile}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating ZIP archive', err);
    } finally {
      setIsZipping(false);
    }
  };

  const readmeContent = generateReadmeBoilerplate(tree);
  const shellContent = generateShellScript(activeProfile);
  const ps1Content = generatePowerShellScript(activeProfile);

  const copyToClipboard = (text: string, type: 'md' | 'sh' | 'ps1') => {
    navigator.clipboard.writeText(text);
    if (type === 'md') {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } else if (type === 'sh') {
      setCopiedSh(true);
      setTimeout(() => setCopiedSh(false), 2000);
    } else {
      setCopiedPs1(true);
      setTimeout(() => setCopiedPs1(false), 2000);
    }
  };

  const renderTree = (node: FolderNode, depth: number = 0) => {
    const isExpanded = expandedIds[node.id] ?? true;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none" style={{ paddingLeft: `${depth * 16}px` }}>
        <div className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-800/50 rounded-lg group transition-colors">
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.id)}
              className="p-0.5 text-gray-500 hover:text-gray-300 cursor-pointer"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
          ) : (
            <span className="w-5"></span>
          )}

          {node.type === 'folder' ? (
            <FolderTree className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
          )}

          <span className="font-mono text-xs font-bold text-gray-200 group-hover:text-cyan-300">
            {node.name}
          </span>

          {node.purpose && (
            <span className="text-[11px] font-mono text-gray-500 hidden sm:inline truncate max-w-[200px]">
              — {node.purpose}
            </span>
          )}

          {node.allowedFormats && (
            <div className="hidden md:flex gap-1 ml-auto">
              {node.allowedFormats.slice(0, 3).map((fmt, i) => (
                <span key={i} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-950 text-gray-400 border border-gray-800">
                  {fmt}
                </span>
              ))}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-gray-800/80 ml-3">
            {node.children!.map((child) => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-950 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Official 🎨_Folder Architecture & Utilities</span>
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Standardized repository folder layout for <span className="text-cyan-400 font-bold">@DLinacre</span>, <span className="text-red-400 font-bold">@LIN4CRE</span>, and <span className="text-emerald-400 font-bold">linacre.site</span>. Includes bulk renaming engine and brand logomark vector generator.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-lg bg-sky-950 text-sky-300 border border-sky-400/40 text-[10px] font-mono font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>{currentBrandInfo.heroBadge}</span>
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {currentBrandInfo.desc}
            </span>
          </div>
        </div>

        {/* Big Download ZIP CTA */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-gray-950 font-mono font-black text-xs shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{isZipping ? 'PACKING ZIP...' : 'DOWNLOAD 🎨_FOLDER.ZIP'}</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION 1: MINIMALIST BRAND LOGOMARK SVG GENERATOR (Brand Keywords) */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Palette className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Minimalist Brand Logomark Studio</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-400/30">
                  {activeProfile} Brand Keywords
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Generate clean vector SVG logomarks based on active brand keywords. Save as SVG or inject into UI icons folder.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySvgCode}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sky-300 border border-gray-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSvg ? 'Copied SVG' : 'Copy SVG'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-gray-950 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .SVG</span>
            </button>
          </div>
        </div>

        {/* Brand Keywords Badges */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-gray-950/80 border border-gray-800">
          <span className="text-xs font-mono font-bold text-gray-400 mr-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Active Profile Keywords:</span>
          </span>
          {currentBrandInfo.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded bg-gray-900 text-sky-300 border border-sky-900/60 text-[10px] font-mono">
              #{tag}
            </span>
          ))}
        </div>

        {/* Generator Controls & Live Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Controls Left Column */}
          <div className="lg:col-span-7 space-y-4 bg-gray-950/70 p-4 rounded-xl border border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Monogram / Initials */}
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Monogram / Initials</label>
                <input
                  type="text"
                  maxLength={4}
                  value={logomarkConfig.monogram}
                  onChange={(e) => setLogomarkConfig({ ...logomarkConfig, monogram: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-sky-400"
                  placeholder="e.g. DL, L4, LS"
                />
              </div>

              {/* Logomark Style */}
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Vector Shape Style</label>
                <select
                  value={logomarkConfig.style}
                  onChange={(e) => setLogomarkConfig({ ...logomarkConfig, style: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="glass">Cupertino Glass Shield</option>
                  <option value="ring">Cyber HUD Reticle Ring</option>
                  <option value="hexagon">Hexagon Core Node</option>
                  <option value="crest">Minimalist Emblem Crest</option>
                </select>
              </div>

              {/* Primary Color Picker */}
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={logomarkConfig.primaryColor}
                    onChange={(e) => setLogomarkConfig({ ...logomarkConfig, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={logomarkConfig.primaryColor}
                    onChange={(e) => setLogomarkConfig({ ...logomarkConfig, primaryColor: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Secondary Color Picker */}
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Accent / Glow Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={logomarkConfig.secondaryColor}
                    onChange={(e) => setLogomarkConfig({ ...logomarkConfig, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={logomarkConfig.secondaryColor}
                    onChange={(e) => setLogomarkConfig({ ...logomarkConfig, secondaryColor: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 bg-gray-900 border border-gray-700 rounded text-xs font-mono text-white"
                  />
                </div>
              </div>

            </div>

            {/* Toggle Switches */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-800 text-xs font-mono">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={logomarkConfig.glowEffect}
                  onChange={(e) => setLogomarkConfig({ ...logomarkConfig, glowEffect: e.target.checked })}
                  className="rounded bg-gray-900 border-gray-700 text-sky-500 focus:ring-0"
                />
                <span>Ambient Glow Effect</span>
              </label>

              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={logomarkConfig.showGrid}
                  onChange={(e) => setLogomarkConfig({ ...logomarkConfig, showGrid: e.target.checked })}
                  className="rounded bg-gray-900 border-gray-700 text-sky-500 focus:ring-0"
                />
                <span>Tech Grid Overlay</span>
              </label>
            </div>
          </div>

          {/* Live SVG Preview & Inject Button Right Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3 bg-gray-950 p-5 rounded-xl border border-gray-800 text-center">
            <div
              className="w-40 h-40 rounded-2xl border border-slate-700/80 bg-slate-950 flex items-center justify-center p-2 shadow-2xl relative overflow-hidden"
              dangerouslySetInnerHTML={{ __html: svgMarkupString }}
            />
            
            <button
              type="button"
              onClick={handleInjectLogomarkToTree}
              className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                injectedSuccess
                  ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-gray-950 shadow-md shadow-sky-500/20'
              }`}
            >
              {injectedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Injected into 🎨_folder/📂_ui-ux/icons! ✓</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  <span>Inject Logomark into 🎨_folder Tree</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION 2: BULK RENAMING UTILITY PANEL                              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Edit3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Bulk Renaming Utility</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-400/30">
                  {previewChanges.length} Items Affected
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Apply prefix, suffix, case rules, or find/replace across all files & folders in the 🎨_folder structure simultaneously.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetTree}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Structure</span>
            </button>
            <button
              type="button"
              onClick={handleApplyBulkRename}
              disabled={previewChanges.length === 0}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Apply Rename ({previewChanges.length})</span>
            </button>
          </div>
        </div>

        {renameSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{renameSuccessMsg}</span>
          </div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800">
          
          {/* Prefix */}
          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1">Prefix Rule</label>
            <input
              type="text"
              value={renameRules.prefix}
              onChange={(e) => setRenameRules({ ...renameRules, prefix: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. dlinacre_, v1_"
            />
          </div>

          {/* Suffix */}
          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1">Suffix Rule</label>
            <input
              type="text"
              value={renameRules.suffix}
              onChange={(e) => setRenameRules({ ...renameRules, suffix: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. _raw, _final"
            />
          </div>

          {/* Find */}
          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1">Find Text</label>
            <input
              type="text"
              value={renameRules.findText}
              onChange={(e) => setRenameRules({ ...renameRules, findText: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. doc, image"
            />
          </div>

          {/* Replace */}
          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1">Replace With</label>
            <input
              type="text"
              value={renameRules.replaceText}
              onChange={(e) => setRenameRules({ ...renameRules, replaceText: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. spec, asset"
            />
          </div>

        </div>

        {/* Filters & Case Mode Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800">
          
          {/* Target Scope */}
          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1">Target Scope</label>
            <select
              value={renameRules.targetScope}
              onChange={(e) => setRenameRules({ ...renameRules, targetScope: e.target.value as TargetScope })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Items (Files & Folders)</option>
              <option value="files">Files Only</option>
              <option value="folders">Folders Only</option>
            </select>
          </div>

          {/* Extension Filter */}
          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1">Extension Filter</label>
            <select
              value={renameRules.extensionFilter}
              onChange={(e) => setRenameRules({ ...renameRules, extensionFilter: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Extensions</option>
              <option value=".png">.png (Raster Images)</option>
              <option value=".svg">.svg (Vector Logos)</option>
              <option value=".blend">.blend (3D Models)</option>
              <option value=".wav">.wav (Audio SFX)</option>
              <option value=".md">.md (Markdown Docs)</option>
              <option value=".psd">.psd (Photoshop Source)</option>
            </select>
          </div>

          {/* Case Transformation */}
          <div>
            <label className="text-xs font-mono text-gray-300 block mb-1">Case Format</label>
            <select
              value={renameRules.caseMode}
              onChange={(e) => setRenameRules({ ...renameRules, caseMode: e.target.value as RenameCaseMode })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="none">Keep Original Case</option>
              <option value="lowercase">lowercase</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="kebab">kebab-case</option>
              <option value="snake">snake_case</option>
            </select>
          </div>

        </div>

        {/* Live Preview List of Renamed Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>LIVE RENAMING PREVIEW</span>
            <span>{previewChanges.length} Items Matching Rule</span>
          </div>

          <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 max-h-48 overflow-y-auto scrollbar-thin space-y-1.5">
            {previewChanges.length === 0 ? (
              <p className="text-xs font-mono text-gray-500 italic text-center py-4">
                No items affected by current rules. Enter a prefix, suffix, case rule, or find/replace text above.
              </p>
            ) : (
              previewChanges.map((change) => (
                <div key={change.id} className="flex items-center justify-between p-2 rounded bg-gray-900/80 border border-gray-800/80 text-xs font-mono">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    {change.type === 'folder' ? <FolderTree className="w-3.5 h-3.5 text-amber-400" /> : <FileCode className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{change.oldName}</span>
                  </span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className="text-amber-300 font-bold truncate max-w-[240px]">
                    {change.newName}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT GRID: Interactive Tree View on Left, Scripts on Right  */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Tree View */}
        <div className="lg:col-span-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>Directory Tree (Live View)</span>
            </h3>
            <span className="text-xs font-mono text-gray-500">
              Click arrows to expand
            </span>
          </div>

          <div className="bg-gray-950 rounded-xl p-4 border border-gray-800/80 max-h-[500px] overflow-y-auto scrollbar-thin">
            {renderTree(tree)}
          </div>
        </div>

        {/* Right Column: Terminal Scripts & README Snippets */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Bash Terminal Script Box */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Bash Auto-Create Script (Linux / macOS)</span>
              </h3>
              <button
                type="button"
                onClick={() => copyToClipboard(shellContent, 'sh')}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded-lg text-xs font-mono border border-gray-700 transition-colors cursor-pointer"
              >
                {copiedSh ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSh ? 'Copied' : 'Copy Bash'}</span>
              </button>
            </div>

            <pre className="bg-gray-950 p-4 rounded-xl text-xs font-mono text-cyan-300 border border-gray-800 overflow-x-auto max-h-40 leading-relaxed scrollbar-thin">
              {shellContent}
            </pre>
          </div>

          {/* PowerShell Script Box */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-sm font-mono font-bold text-emerald-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>PowerShell Auto-Create Script (Windows)</span>
              </h3>
              <button
                type="button"
                onClick={() => copyToClipboard(ps1Content, 'ps1')}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-emerald-300 rounded-lg text-xs font-mono border border-gray-700 transition-colors cursor-pointer"
              >
                {copiedPs1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPs1 ? 'Copied' : 'Copy PowerShell'}</span>
              </button>
            </div>

            <pre className="bg-gray-950 p-4 rounded-xl text-xs font-mono text-emerald-300 border border-gray-800 overflow-x-auto max-h-40 leading-relaxed scrollbar-thin">
              {ps1Content}
            </pre>
          </div>

          {/* README Markdown Tree Box */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-sm font-mono font-bold text-amber-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>GitHub README.md Folder Spec</span>
              </h3>
              <button
                type="button"
                onClick={() => copyToClipboard(readmeContent, 'md')}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-amber-300 rounded-lg text-xs font-mono border border-gray-700 transition-colors cursor-pointer"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMd ? 'Copied' : 'Copy Markdown'}</span>
              </button>
            </div>

            <pre className="bg-gray-950 p-4 rounded-xl text-xs font-mono text-amber-200 border border-gray-800 overflow-x-auto max-h-44 leading-relaxed scrollbar-thin">
              {readmeContent}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
