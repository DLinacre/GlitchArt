import React, { useState, useEffect } from 'react';
import {
  Zap,
  Save,
  Trash2,
  Maximize,
  Minimize,
  Download,
  Sun,
  Keyboard,
  X,
  Search,
  Check,
  RefreshCw,
  Sparkles,
  FolderTree,
  Github,
  Code
} from 'lucide-react';
import { Tooltip } from './Tooltip';

interface QuickActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWorkspace: () => void;
  onClearCache: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onExportZip: () => void;
  onToggleHighContrast: () => void;
  isHighContrast: boolean;
  onOpenShortcuts: () => void;
  onSwitchTab: (tab: 'gallery' | 'studio' | 'reposync' | 'folder' | 'readme') => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  isOpen,
  onClose,
  onSaveWorkspace,
  onClearCache,
  onToggleFullscreen,
  isFullscreen,
  onExportZip,
  onToggleHighContrast,
  isHighContrast,
  onOpenShortcuts,
  onSwitchTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setToastMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleAction = (actionFn: () => void, feedbackMsg: string) => {
    actionFn();
    showToast(feedbackMsg);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const actions = [
    {
      id: 'save-workspace',
      title: 'Save Workspace',
      description: 'Export session data backup JSON snapshot',
      icon: <Save className="w-5 h-5 text-emerald-400" />,
      badge: 'Save',
      shortcut: 'Alt + S',
      handler: () => handleAction(onSaveWorkspace, 'Workspace session saved to JSON file!'),
    },
    {
      id: 'clear-cache',
      title: 'Clear Cache & History',
      description: 'Reset history stack and temporary session state',
      icon: <Trash2 className="w-5 h-5 text-red-400" />,
      badge: 'Cache',
      shortcut: 'Alt + C',
      handler: () => handleAction(onClearCache, 'Session history cache cleared!'),
    },
    {
      id: 'toggle-fullscreen',
      title: isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen Mode',
      description: isFullscreen ? 'Return to standard window view' : 'Expand preview to full screen',
      icon: isFullscreen ? (
        <Minimize className="w-5 h-5 text-cyan-400" />
      ) : (
        <Maximize className="w-5 h-5 text-cyan-400" />
      ),
      badge: 'Display',
      shortcut: 'Alt + F',
      handler: () => handleAction(onToggleFullscreen, isFullscreen ? 'Exited Fullscreen' : 'Entered Fullscreen'),
    },
    {
      id: 'export-zip',
      title: 'Export 🎨_Folder ZIP',
      description: 'Download full brand asset repository zip archive',
      icon: <Download className="w-5 h-5 text-amber-400" />,
      badge: 'Archive',
      shortcut: '⌘4',
      handler: () => handleAction(onExportZip, 'Initiating ZIP generation...'),
    },
    {
      id: 'toggle-high-contrast',
      title: isHighContrast ? 'Standard Theme Mode' : 'Toggle High Contrast Mode',
      description: 'Switch visual theme for high accessibility',
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      badge: 'Theme',
      shortcut: 'Alt + H',
      handler: () => handleAction(onToggleHighContrast, 'Toggled high contrast mode'),
    },
    {
      id: 'open-shortcuts',
      title: 'Keyboard Shortcuts Guide',
      description: 'View full list of keyboard shortcuts',
      icon: <Keyboard className="w-5 h-5 text-purple-400" />,
      badge: 'Help',
      shortcut: '?',
      handler: () => {
        onClose();
        onOpenShortcuts();
      },
    },
  ];

  const filteredActions = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 backdrop-blur-md p-4 animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden relative transition-all ${
          isHighContrast
            ? 'bg-black border-2 border-cyan-400 text-white'
            : 'bg-gray-900 border-gray-700/90 text-gray-100'
        }`}
        role="dialog"
        aria-labelledby="quick-actions-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 id="quick-actions-title" className="text-sm font-bold flex items-center gap-2">
                <span>Quick Actions Menu</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                  ALT KEY MENU
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Perform common tasks instantly without switching tabs.
              </p>
            </div>
          </div>

          <Tooltip content="Close Quick Actions (Esc / Alt)" position="left">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Search Input Filter */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search actions (Save workspace, Clear cache, Fullscreen...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Action Grid List */}
        <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto scrollbar-thin">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-gray-500">
              No matching quick actions found for "{searchQuery}".
            </div>
          ) : (
            filteredActions.map((act) => (
              <button
                key={act.id}
                onClick={act.handler}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                  isHighContrast
                    ? 'bg-zinc-900 border-zinc-700 hover:border-cyan-400 hover:bg-zinc-800'
                    : 'bg-gray-950/70 border-gray-800/80 hover:border-cyan-500/50 hover:bg-gray-850'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 group-hover:border-cyan-500/40 transition-colors">
                    {act.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-200 group-hover:text-cyan-300 transition-colors">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {act.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400 group-hover:text-gray-200">
                    {act.shortcut}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Navigation Quick Switches */}
        <div className="p-4 pt-2 border-t border-gray-800 bg-gray-950/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-400">
          <span>Jump to tab:</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => { onClose(); onSwitchTab('gallery'); }}
              className="px-2 py-1 rounded bg-gray-900 hover:bg-cyan-950 hover:text-cyan-300 border border-gray-800 text-[11px] cursor-pointer"
            >
              Themes (1)
            </button>
            <button
              onClick={() => { onClose(); onSwitchTab('studio'); }}
              className="px-2 py-1 rounded bg-gray-900 hover:bg-red-950 hover:text-red-300 border border-gray-800 text-[11px] cursor-pointer"
            >
              Studio (2)
            </button>
            <button
              onClick={() => { onClose(); onSwitchTab('reposync'); }}
              className="px-2 py-1 rounded bg-gray-900 hover:bg-emerald-950 hover:text-emerald-300 border border-gray-800 text-[11px] cursor-pointer"
            >
              Sync (3)
            </button>
            <button
              onClick={() => { onClose(); onSwitchTab('folder'); }}
              className="px-2 py-1 rounded bg-gray-900 hover:bg-amber-950 hover:text-amber-300 border border-gray-800 text-[11px] cursor-pointer"
            >
              Folder (4)
            </button>
            <button
              onClick={() => { onClose(); onSwitchTab('readme'); }}
              className="px-2 py-1 rounded bg-gray-900 hover:bg-purple-950 hover:text-purple-300 border border-gray-800 text-[11px] cursor-pointer"
            >
              README (5)
            </button>
          </div>
        </div>

        {/* Feedback Toast */}
        {toastMessage && (
          <div className="absolute inset-x-0 bottom-4 mx-auto w-max px-4 py-2 rounded-xl bg-emerald-500 text-gray-950 font-mono font-bold text-xs shadow-2xl flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
