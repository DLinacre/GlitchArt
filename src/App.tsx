import React, { useState, useEffect, useCallback } from 'react';
import { BrandProfile, AssetItem, ThemePreset } from './types';
import { HeaderNav } from './components/HeaderNav';
import { ProfileHeaderCard } from './components/ProfileHeaderCard';
import { AssetGallery } from './components/AssetGallery';
import { GlitchStudio } from './components/GlitchStudio';
import { FolderGenerator } from './components/FolderGenerator';
import { ReadmeBuilder } from './components/ReadmeBuilder';
import { GitHubRepoSync } from './components/GitHubRepoSync';
import { AssetInspectModal } from './components/AssetInspectModal';
import { ShortcutsOverlay } from './components/ShortcutsOverlay';
import { QuickActionsMenu } from './components/QuickActionsMenu';
import { BrandHarmonizerModal } from './components/BrandHarmonizerModal';
import { DEFAULT_THEME_PRESETS } from './data/themePresets';
import { Tooltip } from './components/Tooltip';
import { INITIAL_FOLDER_STRUCTURE, generateReadmeBoilerplate } from './data/directoryPreset';
import JSZip from 'jszip';
import { ExternalLink, Keyboard, Clock, Download, Activity, CheckCircle2, Zap } from 'lucide-react';

export interface AppStateSnapshot {
  activeProfile: BrandProfile;
  activeTab: 'gallery' | 'studio' | 'reposync' | 'folder' | 'readme';
  studioPresetText: string;
  timestamp: string;
}

export default function App() {
  const [activeProfile, setActiveProfile] = useState<BrandProfile>('dlinacre');
  const [activeTab, setActiveTab] = useState<'gallery' | 'studio' | 'reposync' | 'folder' | 'readme'>('reposync');
  const [inspectModal, setInspectModal] = useState<{ svgCode: string; name: string } | null>(null);
  const [studioPresetText, setStudioPresetText] = useState<string>('');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<number | null>(null);

  // Global Brand Harmonizer & Theme Preset State
  const [themePresets, setThemePresets] = useState<ThemePreset[]>(() => {
    try {
      const saved = localStorage.getItem('linacre_theme_presets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading theme presets from storage', e);
    }
    return DEFAULT_THEME_PRESETS;
  });
  const [activePresetId, setActivePresetId] = useState<string>(DEFAULT_THEME_PRESETS[0].id);
  const [isHarmonizerOpen, setIsHarmonizerOpen] = useState<boolean>(false);

  const handleSelectThemePreset = useCallback((preset: ThemePreset) => {
    setActivePresetId(preset.id);
    setActiveProfile(preset.brandProfile);
    if (preset.glitchPresetPrompt) {
      setStudioPresetText(preset.glitchPresetPrompt);
    }
    if (preset.fontFamily) {
      document.body.style.fontFamily = preset.fontFamily;
    }
    const ts = new Date().toLocaleTimeString();
    setLastModifiedTimestamp(ts);
  }, []);

  const handleSaveCustomPreset = useCallback((newPreset: ThemePreset) => {
    setThemePresets((prev) => {
      const updated = [...prev, newPreset];
      try {
        localStorage.setItem('linacre_theme_presets', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const handleDeleteCustomPreset = useCallback((id: string) => {
    setThemePresets((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('linacre_theme_presets', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  // Sync fullscreen state change events
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const handleClearCache = useCallback(() => {
    setHistory([]);
    setRedoStack([]);
    setStudioPresetText('');
    const ts = new Date().toLocaleTimeString();
    setLastModifiedTimestamp(ts);
  }, []);

  // Session activity timestamp
  const [lastModifiedTimestamp, setLastModifiedTimestamp] = useState<string>(
    new Date().toLocaleTimeString()
  );

  // Undo / Redo State History Stack
  const [history, setHistory] = useState<AppStateSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<AppStateSnapshot[]>([]);

  const changeProfileWithHistory = useCallback((p: BrandProfile) => {
    setActiveProfile((prevProfile) => {
      if (prevProfile === p) return prevProfile;
      const ts = new Date().toLocaleTimeString();
      setLastModifiedTimestamp(ts);
      setHistory((h) => [...h, { activeProfile: prevProfile, activeTab, studioPresetText, timestamp: ts }]);
      setRedoStack([]);
      return p;
    });
  }, [activeTab, studioPresetText]);

  const changeTabWithHistory = useCallback((tab: 'gallery' | 'studio' | 'reposync' | 'folder' | 'readme') => {
    setActiveTab((prevTab) => {
      if (prevTab === tab) return prevTab;
      const ts = new Date().toLocaleTimeString();
      setLastModifiedTimestamp(ts);
      setHistory((h) => [...h, { activeProfile, activeTab: prevTab, studioPresetText, timestamp: ts }]);
      setRedoStack([]);
      return tab;
    });
  }, [activeProfile, studioPresetText]);

  const handleUndo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const previous = prevHistory[prevHistory.length - 1];
      const newHistory = prevHistory.slice(0, prevHistory.length - 1);
      const ts = new Date().toLocaleTimeString();

      setRedoStack((prevRedo) => [
        ...prevRedo,
        { activeProfile, activeTab, studioPresetText, timestamp: ts },
      ]);

      setActiveProfile(previous.activeProfile);
      setActiveTab(previous.activeTab);
      setStudioPresetText(previous.studioPresetText);
      setLastModifiedTimestamp(previous.timestamp || ts);

      return newHistory;
    });
  }, [activeProfile, activeTab, studioPresetText]);

  const handleRedo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const next = prevRedo[prevRedo.length - 1];
      const newRedo = prevRedo.slice(0, prevRedo.length - 1);
      const ts = new Date().toLocaleTimeString();

      setHistory((prevHistory) => [
        ...prevHistory,
        { activeProfile, activeTab, studioPresetText, timestamp: ts },
      ]);

      setActiveProfile(next.activeProfile);
      setActiveTab(next.activeTab);
      setStudioPresetText(next.studioPresetText);
      setLastModifiedTimestamp(next.timestamp || ts);

      return newRedo;
    });
  }, [activeProfile, activeTab, studioPresetText]);

  // Export Session Data Backup JSON
  const handleExportSession = useCallback(() => {
    const sessionPayload = {
      app: 'LINACRE ASSET STUDIO',
      exportedAt: new Date().toISOString(),
      activeProfile,
      activeTab,
      studioPresetText,
      lastModified: lastModifiedTimestamp,
      undoHistoryCount: history.length,
      isHighContrastMode: isHighContrast,
    };

    const blob = new Blob([JSON.stringify(sessionPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linacre_session_${activeProfile}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeProfile, activeTab, studioPresetText, lastModifiedTimestamp, history.length, isHighContrast]);

  // Global Keyboard Shortcuts (meta+1..5, Ctrl+Z, Ctrl+Y, ?, Esc, Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Tab Switching Meta + 1..5
      if (isCmdOrCtrl && !e.shiftKey && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const tabMap: Record<string, 'gallery' | 'studio' | 'reposync' | 'folder' | 'readme'> = {
          '1': 'gallery',
          '2': 'studio',
          '3': 'reposync',
          '4': 'folder',
          '5': 'readme',
        };
        const targetTab = tabMap[e.key];
        if (targetTab) {
          changeTabWithHistory(targetTab);
        }
        return;
      }

      // Undo / Redo Shortcuts
      if (isCmdOrCtrl && (e.key === 'z' || e.key === 'Z')) {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
        return;
      }

      if (isCmdOrCtrl && (e.key === 'y' || e.key === 'Y')) {
        if (!isInput) {
          e.preventDefault();
          handleRedo();
        }
        return;
      }

      // Quick Actions Trigger (Alt key alone or Alt combos)
      if (e.key === 'Alt' || e.key === 'Option') {
        if (!isInput) {
          e.preventDefault();
          setIsQuickActionsOpen((prev) => !prev);
        }
        return;
      }

      if (e.altKey && !isInput) {
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          handleExportSession();
          return;
        }
        if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          handleClearCache();
          return;
        }
        if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          handleToggleFullscreen();
          return;
        }
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          setIsHighContrast((prev) => !prev);
          return;
        }
      }

      // Toggle Hotkey Overlay (? or Cmd+K)
      if (e.key === '?' || (isCmdOrCtrl && (e.key === 'k' || e.key === 'K'))) {
        if (!isInput) {
          e.preventDefault();
          setIsShortcutsOpen((prev) => !prev);
        }
        return;
      }

      // Escape key to close active overlays
      if (e.key === 'Escape') {
        if (isQuickActionsOpen) {
          setIsQuickActionsOpen(false);
        } else if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
        } else if (inspectModal) {
          setInspectModal(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeTabWithHistory, handleUndo, handleRedo, isShortcutsOpen, isQuickActionsOpen, inspectModal, handleExportSession, handleClearCache, handleToggleFullscreen]);

  const handleInspectAsset = (svgCode: string, name: string) => {
    setInspectModal({ svgCode, name });
  };

  const handleSendToStudio = (asset: AssetItem) => {
    const ts = new Date().toLocaleTimeString();
    setLastModifiedTimestamp(ts);
    setHistory((h) => [...h, { activeProfile, activeTab, studioPresetText, timestamp: ts }]);
    setRedoStack([]);
    setStudioPresetText(asset.name.toUpperCase());
    setActiveTab('studio');
  };

  const handleDownloadAllZip = async () => {
    try {
      setZipProgress(0);
      const zip = new JSZip();
      
      const addNodeToZip = (node: typeof INITIAL_FOLDER_STRUCTURE, currentPath: string) => {
        const path = currentPath ? `${currentPath}/${node.name}` : node.name;
        if (node.type === 'folder') {
          zip.folder(path);
          if (node.children) {
            node.children.forEach((child) => addNodeToZip(child, path));
          }
        } else if (node.type === 'file') {
          zip.file(path, node.content || `# ${node.name}\n`);
        }
      };

      addNodeToZip(INITIAL_FOLDER_STRUCTURE, '');
      zip.file('🎨_folder/README.md', generateReadmeBoilerplate(INITIAL_FOLDER_STRUCTURE));

      const blob = await zip.generateAsync(
        { type: 'blob' },
        (metadata) => {
          setZipProgress(Math.min(99, Math.floor(metadata.percent)));
        }
      );

      setZipProgress(100);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linacre_art_collection_${activeProfile}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setZipProgress(null);
      }, 1800);
    } catch (e) {
      console.error('Failed to create ZIP', e);
      setZipProgress(null);
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors ${
      isHighContrast
        ? 'bg-black text-white selection:bg-yellow-400 selection:text-black font-semibold'
        : 'bg-gray-950 text-gray-100 selection:bg-red-500 selection:text-white'
    }`}>
      {/* Header Navigation Bar */}
      <HeaderNav
        activeProfile={activeProfile}
        setActiveProfile={changeProfileWithHistory}
        activeTab={activeTab}
        setActiveTab={changeTabWithHistory}
        onDownloadAllZip={handleDownloadAllZip}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        undoCount={history.length}
        redoCount={redoStack.length}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenQuickActions={() => setIsQuickActionsOpen(true)}
        onExportSession={handleExportSession}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast((prev) => !prev)}
        lastModified={lastModifiedTimestamp}
        themePresets={themePresets}
        activePresetId={activePresetId}
        onSelectThemePreset={handleSelectThemePreset}
        onOpenBrandHarmonizer={() => setIsHarmonizerOpen(true)}
      />

      {/* Sub-Header Session Status Bar */}
      <div className={`border-b text-xs font-mono py-1.5 px-4 sm:px-8 transition-colors ${
        isHighContrast
          ? 'bg-zinc-900 border-cyan-400 text-cyan-300 font-bold'
          : 'bg-slate-900/60 border-slate-800/80 text-gray-400'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Last modified: <strong className="text-gray-200">{lastModifiedTimestamp}</strong></span>
            </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-emerald-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>History stack: {history.length} snapshot{history.length === 1 ? '' : 's'} recorded</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {isHighContrast && (
              <span className="px-2 py-0.5 rounded bg-yellow-400 text-black font-extrabold text-[10px] tracking-wide">
                ACCESSIBILITY: HIGH CONTRAST
              </span>
            )}
            <span className="text-gray-500">Active Profile: <strong className="text-cyan-300">@{activeProfile}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Active Profile Header Simulator Card */}
        <ProfileHeaderCard
          activeProfile={activeProfile}
          setActiveProfile={changeProfileWithHistory}
          onInspectAsset={handleInspectAsset}
        />

        {/* Tab Switcher Views */}
        {activeTab === 'reposync' && (
          <GitHubRepoSync
            activeProfile={activeProfile}
            onInspectAsset={handleInspectAsset}
          />
        )}

        {activeTab === 'gallery' && (
          <AssetGallery
            onInspectAsset={handleInspectAsset}
            onSendToStudio={handleSendToStudio}
          />
        )}

        {activeTab === 'studio' && (
          <GlitchStudio
            activeProfile={activeProfile}
            initialText={studioPresetText}
            onInspectAsset={handleInspectAsset}
          />
        )}

        {activeTab === 'folder' && (
          <FolderGenerator activeProfile={activeProfile} />
        )}

        {activeTab === 'readme' && (
          <ReadmeBuilder activeProfile={activeProfile} />
        )}

      </main>

      {/* ZIP Generation Progress Toast Floating Notification */}
      {zipProgress !== null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-cyan-500/80 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col gap-1.5 w-72">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-cyan-300 flex items-center gap-1.5">
                {zipProgress === 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Download className="w-4 h-4 animate-bounce text-cyan-400" />
                )}
                <span>{zipProgress === 100 ? 'Archive Complete!' : 'Packaging 🎨_Folder ZIP...'}</span>
              </span>
              <span className="text-cyan-400">{zipProgress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-full transition-all duration-150 rounded-full"
                style={{ width: `${zipProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Triggers in bottom right */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2">
        <Tooltip content="Quick Actions Menu (Alt key)" position="left">
          <button
            onClick={() => setIsQuickActionsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-400 text-xs font-mono font-bold text-amber-300 shadow-xl hover:shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Quick Actions</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-950 border border-slate-800 text-gray-400 rounded">Alt</kbd>
          </button>
        </Tooltip>

        <Tooltip content="Keyboard Shortcuts (?) [⌘1-5, Ctrl+Z/Y]" position="left">
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 shadow-xl hover:shadow-cyan-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span>Shortcuts</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-950 border border-slate-800 text-gray-400 rounded">?</kbd>
          </button>
        </Tooltip>
      </div>

      {/* Footer Branding */}
      <footer className="border-t border-gray-900 bg-gray-950/80 py-8 mt-16 text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-bold">LINACRE ASSET STUDIO</span>
            <span>//</span>
            <span className="text-gray-400">Official Brand Assets & 🎨_Folder Hierarchy</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="https://linacre.site" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              <span>linacre.site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-gray-700">|</span>
            <span>DLinacre & LIN4CRE GitHub Customizer</span>
          </div>
        </div>
      </footer>

      {/* Quick Actions Menu Modal */}
      <QuickActionsMenu
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onSaveWorkspace={handleExportSession}
        onClearCache={handleClearCache}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        onExportZip={handleDownloadAllZip}
        onToggleHighContrast={() => setIsHighContrast((prev) => !prev)}
        isHighContrast={isHighContrast}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onSwitchTab={changeTabWithHistory}
      />

      {/* Keyboard Shortcuts Overlay Modal */}
      <ShortcutsOverlay
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Global Brand Harmonizer Modal */}
      <BrandHarmonizerModal
        isOpen={isHarmonizerOpen}
        onClose={() => setIsHarmonizerOpen(false)}
        presets={themePresets}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectThemePreset}
        onSaveCustomPreset={handleSaveCustomPreset}
        onDeleteCustomPreset={handleDeleteCustomPreset}
        activeProfile={activeProfile}
        studioPresetText={studioPresetText}
      />

      {/* Inspect Modal */}
      {inspectModal && (
        <AssetInspectModal
          svgCode={inspectModal.svgCode}
          assetName={inspectModal.name}
          onClose={() => setInspectModal(null)}
        />
      )}
    </div>
  );
}


