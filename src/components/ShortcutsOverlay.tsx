import React from 'react';
import { Keyboard, X, Command, CornerDownLeft, RotateCcw, RotateCw } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface ShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsOverlay: React.FC<ShortcutsOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutsList = [
    {
      category: 'Tab Navigation',
      items: [
        { keys: ['⌘/Ctrl', '1'], label: 'Switch to 10 Theme Collection' },
        { keys: ['⌘/Ctrl', '2'], label: 'Switch to Glitch Studio' },
        { keys: ['⌘/Ctrl', '3'], label: 'Switch to Repo Sync & Insta-Apply' },
        { keys: ['⌘/Ctrl', '4'], label: 'Switch to 🎨_Folder Generator' },
        { keys: ['⌘/Ctrl', '5'], label: 'Switch to GitHub README Builder' },
      ],
    },
    {
      category: 'History & Editing',
      items: [
        { keys: ['⌘/Ctrl', 'Z'], label: 'Undo previous action in App state stack' },
        { keys: ['⌘/Ctrl', 'Y'], label: 'Redo previously undone action' },
        { keys: ['⌘/Ctrl', 'Shift', 'Z'], label: 'Alternative Redo shortcut' },
      ],
    },
    {
      category: 'System & Overlays',
      items: [
        { keys: ['Alt'], label: 'Open Quick Actions floating menu (Save, Clear Cache, Fullscreen)' },
        { keys: ['?'], label: 'Open / toggle this Keyboard Shortcuts overlay' },
        { keys: ['⌘/Ctrl', 'K'], label: 'Alternative shortcut to toggle Hotkeys modal' },
        { keys: ['Esc'], label: 'Close active overlay or inspector modal' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div
        className="bg-gray-900 border border-gray-700/90 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-6 overflow-hidden relative"
        role="dialog"
        aria-labelledby="shortcuts-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>Global Keyboard Shortcuts</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Hotkey Engine
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Quick navigation and state history control using your keyboard.
              </p>
            </div>
          </div>

          <Tooltip content="Close shortcuts modal (Esc)" position="left">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Categories Grid */}
        <div className="space-y-5 max-h-[60vh] overflow-y-auto scrollbar-thin pr-1">
          {shortcutsList.map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                {cat.category}
              </h3>
              <div className="bg-gray-950 rounded-xl p-3 border border-gray-800/90 space-y-2">
                {cat.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center justify-between text-xs py-1 px-1">
                    <span className="text-gray-300 font-medium">{item.label}</span>
                    <div className="flex items-center space-x-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 text-[11px] font-mono font-bold text-cyan-200 bg-gray-900 border border-gray-700 rounded shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer tip */}
        <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-cyan-400" />
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-950 border border-gray-800 text-cyan-300">Esc</kbd> anytime to dismiss</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-mono font-bold text-xs transition-colors cursor-pointer"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
