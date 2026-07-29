import React from 'react';
import { BrandProfile } from '../types';
import { PROFILES } from '../data/profileData';
import { Sparkles, FolderTree, Palette, Code, Github, Download, RotateCcw, RotateCw, Keyboard } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface HeaderNavProps {
  activeProfile: BrandProfile;
  setActiveProfile: (p: BrandProfile) => void;
  activeTab: 'gallery' | 'studio' | 'reposync' | 'folder' | 'readme';
  setActiveTab: (tab: 'gallery' | 'studio' | 'reposync' | 'folder' | 'readme') => void;
  onDownloadAllZip: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  undoCount?: number;
  redoCount?: number;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenShortcuts?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeProfile,
  setActiveProfile,
  activeTab,
  setActiveTab,
  onDownloadAllZip,
  canUndo = false,
  canRedo = false,
  undoCount = 0,
  redoCount = 0,
  onUndo,
  onRedo,
  onOpenShortcuts,
}) => {
  const profile = PROFILES[activeProfile];

  return (
    <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-4">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rx-8 bg-gradient-to-br from-red-600 via-pink-600 to-cyan-500 p-0.5 rounded-xl shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center font-mono font-black text-cyan-400 text-lg">
                  L⚡
                </div>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-cyan-300 to-red-400 bg-clip-text text-transparent">
                  LINACRE ASSET STUDIO
                </h1>
                <p className="text-xs font-mono text-gray-400 flex items-center gap-1">
                  <span>linacre.site</span>
                  <span className="text-cyan-400">//</span>
                  <span className="text-red-400">DLinacre</span>
                  <span className="text-gray-500">&</span>
                  <span className="text-pink-400">LIN4CRE</span>
                </p>
              </div>
            </div>

            {/* Mobile Profile Switcher Pill */}
            <div className="flex md:hidden bg-gray-900 border border-gray-800 rounded-lg p-1">
              {(['dlinacre', 'lin4cre', 'linacre_site'] as BrandProfile[]).map((pKey) => (
                <button
                  key={pKey}
                  onClick={() => setActiveProfile(pKey)}
                  className={`px-2 py-1 text-xs font-mono rounded-md transition-all ${
                    activeProfile === pKey
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {pKey === 'dlinacre' ? 'DL' : pKey === 'lin4cre' ? 'L4' : 'SITE'}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-gray-900/80 p-1 rounded-xl border border-gray-800/80 w-full md:w-auto overflow-x-auto">
            <Tooltip content="Switch to Theme Collection (⌘1)" position="bottom">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>10 Theme Collection</span>
              </button>
            </Tooltip>

            <Tooltip content="Switch to Repo Sync (⌘3)" position="bottom">
              <button
                onClick={() => setActiveTab('reposync')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'reposync'
                    ? 'bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-300 border border-emerald-500/40 shadow-md shadow-emerald-500/10 font-bold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <Github className="w-4 h-4 text-emerald-400" />
                <span>Repo Sync & Insta-Apply</span>
              </button>
            </Tooltip>

            <Tooltip content="Switch to Glitch Studio (⌘2)" position="bottom">
              <button
                onClick={() => setActiveTab('studio')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'studio'
                    ? 'bg-gradient-to-r from-red-950 to-pink-950 text-red-300 border border-red-500/40 shadow-md shadow-red-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-red-400" />
                <span>Glitch Studio</span>
              </button>
            </Tooltip>

            <Tooltip content="Switch to 🎨_Folder Generator (⌘4)" position="bottom">
              <button
                onClick={() => setActiveTab('folder')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'folder'
                    ? 'bg-gradient-to-r from-amber-950 to-emerald-950 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <FolderTree className="w-4 h-4 text-amber-400" />
                <span>🎨_Folder Generator</span>
              </button>
            </Tooltip>

            <Tooltip content="Switch to GitHub README (⌘5)" position="bottom">
              <button
                onClick={() => setActiveTab('readme')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'readme'
                    ? 'bg-gradient-to-r from-purple-950 to-indigo-950 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <Code className="w-4 h-4 text-purple-400" />
                <span>GitHub README</span>
              </button>
            </Tooltip>
          </nav>


          {/* Undo/Redo, Hotkeys & Desktop Profile Switcher & ZIP Action */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Undo / Redo Control Pair */}
            <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-0.5">
              <Tooltip content={canUndo ? `Undo last action (${undoCount}) [Ctrl+Z]` : 'Nothing to undo'} position="bottom">
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="p-1.5 rounded-md text-gray-400 hover:text-cyan-300 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content={canRedo ? `Redo action (${redoCount}) [Ctrl+Y]` : 'Nothing to redo'} position="bottom">
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="p-1.5 rounded-md text-gray-400 hover:text-cyan-300 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

            {/* Global Shortcuts Button */}
            <Tooltip content="View Keyboard Shortcuts Overlay (? / ⌘K)" position="bottom">
              <button
                onClick={onOpenShortcuts}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-cyan-500/50 text-gray-400 hover:text-cyan-300 transition-all cursor-pointer"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </Tooltip>

            {/* Profile Switcher */}
            <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
              <Tooltip content="Switch to @DLinacre brand profile" position="bottom">
                <button
                  onClick={() => setActiveProfile('dlinacre')}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                    activeProfile === 'dlinacre'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  @DLinacre
                </button>
              </Tooltip>
              <Tooltip content="Switch to @LIN4CRE brand profile" position="bottom">
                <button
                  onClick={() => setActiveProfile('lin4cre')}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                    activeProfile === 'lin4cre'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50 font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  @LIN4CRE
                </button>
              </Tooltip>
              <Tooltip content="Switch to linacre.site brand profile" position="bottom">
                <button
                  onClick={() => setActiveProfile('linacre_site')}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                    activeProfile === 'linacre_site'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  linacre.site
                </button>
              </Tooltip>
            </div>

            {/* Zip Download */}
            <Tooltip content="Export full 🎨_folder repository archive" position="bottom">
              <button
                onClick={onDownloadAllZip}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ZIP</span>
              </button>
            </Tooltip>
          </div>

        </div>
      </div>
    </header>
  );
};

