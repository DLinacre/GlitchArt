import React, { useState, useEffect, useCallback } from 'react';
import { BrandProfile, AssetItem } from './types';
import { HeaderNav } from './components/HeaderNav';
import { ProfileHeaderCard } from './components/ProfileHeaderCard';
import { AssetGallery } from './components/AssetGallery';
import { GlitchStudio } from './components/GlitchStudio';
import { FolderGenerator } from './components/FolderGenerator';
import { ReadmeBuilder } from './components/ReadmeBuilder';
import { GitHubRepoSync } from './components/GitHubRepoSync';
import { AssetInspectModal } from './components/AssetInspectModal';
import { ShortcutsOverlay } from './components/ShortcutsOverlay';
import { Tooltip } from './components/Tooltip';
import { INITIAL_FOLDER_STRUCTURE, generateReadmeBoilerplate } from './data/directoryPreset';
import JSZip from 'jszip';
import { ExternalLink, Keyboard } from 'lucide-react';

export interface AppStateSnapshot {
  activeProfile: BrandProfile;
  activeTab: 'gallery' | 'studio' | 'reposync' | 'folder' | 'readme';
  studioPresetText: string;
}

export default function App() {
  const [activeProfile, setActiveProfile] = useState<BrandProfile>('dlinacre');
  const [activeTab, setActiveTab] = useState<'gallery' | 'studio' | 'reposync' | 'folder' | 'readme'>('reposync');
  const [inspectModal, setInspectModal] = useState<{ svgCode: string; name: string } | null>(null);
  const [studioPresetText, setStudioPresetText] = useState<string>('');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Undo / Redo State History Stack
  const [history, setHistory] = useState<AppStateSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<AppStateSnapshot[]>([]);

  const changeProfileWithHistory = useCallback((p: BrandProfile) => {
    setActiveProfile((prevProfile) => {
      if (prevProfile === p) return prevProfile;
      setHistory((h) => [...h, { activeProfile: prevProfile, activeTab, studioPresetText }]);
      setRedoStack([]);
      return p;
    });
  }, [activeTab, studioPresetText]);

  const changeTabWithHistory = useCallback((tab: 'gallery' | 'studio' | 'reposync' | 'folder' | 'readme') => {
    setActiveTab((prevTab) => {
      if (prevTab === tab) return prevTab;
      setHistory((h) => [...h, { activeProfile, activeTab: prevTab, studioPresetText }]);
      setRedoStack([]);
      return tab;
    });
  }, [activeProfile, studioPresetText]);

  const handleUndo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const previous = prevHistory[prevHistory.length - 1];
      const newHistory = prevHistory.slice(0, prevHistory.length - 1);

      setRedoStack((prevRedo) => [
        ...prevRedo,
        { activeProfile, activeTab, studioPresetText },
      ]);

      setActiveProfile(previous.activeProfile);
      setActiveTab(previous.activeTab);
      setStudioPresetText(previous.studioPresetText);

      return newHistory;
    });
  }, [activeProfile, activeTab, studioPresetText]);

  const handleRedo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const next = prevRedo[prevRedo.length - 1];
      const newRedo = prevRedo.slice(0, prevRedo.length - 1);

      setHistory((prevHistory) => [
        ...prevHistory,
        { activeProfile, activeTab, studioPresetText },
      ]);

      setActiveProfile(next.activeProfile);
      setActiveTab(next.activeTab);
      setStudioPresetText(next.studioPresetText);

      return newRedo;
    });
  }, [activeProfile, activeTab, studioPresetText]);

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

      // Toggle Hotkey Overlay (? or Cmd+K)
      if (e.key === '?' || (isCmdOrCtrl && (e.key === 'k' || e.key === 'K'))) {
        if (!isInput) {
          e.preventDefault();
          setIsShortcutsOpen((prev) => !prev);
        }
        return;
      }

      // Escape key to close modals
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
        } else if (inspectModal) {
          setInspectModal(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeTabWithHistory, handleUndo, handleRedo, isShortcutsOpen, inspectModal]);

  const handleInspectAsset = (svgCode: string, name: string) => {
    setInspectModal({ svgCode, name });
  };

  const handleSendToStudio = (asset: AssetItem) => {
    setHistory((h) => [...h, { activeProfile, activeTab, studioPresetText }]);
    setRedoStack([]);
    setStudioPresetText(asset.name.toUpperCase());
    setActiveTab('studio');
  };

  const handleDownloadAllZip = async () => {
    try {
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

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linacre_art_collection_${activeProfile}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to create ZIP', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-red-500 selection:text-white font-sans antialiased">
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
      />

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

      {/* Floating Keyboard Shortcuts Trigger Pill in bottom right */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
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

      {/* Keyboard Shortcuts Overlay Modal */}
      <ShortcutsOverlay
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
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

