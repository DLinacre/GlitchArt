import React, { useState } from 'react';
import { FolderNode, BrandProfile } from '../types';
import { INITIAL_FOLDER_STRUCTURE, generateReadmeBoilerplate, generateShellScript, generatePowerShellScript } from '../data/directoryPreset';
import JSZip from 'jszip';
import { FolderTree, Download, Copy, Check, Terminal, FileText, ChevronRight, ChevronDown, Sparkles, FolderPlus, FileCode } from 'lucide-react';

interface FolderGeneratorProps {
  activeProfile: BrandProfile;
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
  const [isZipping, setIsZipping] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Recursively build JSZip folders and files
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
              className="p-0.5 text-gray-500 hover:text-gray-300"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
          ) : (
            <span className="w-5"></span>
          )}

          {node.type === 'folder' ? (
            <FolderTree className="w-4 h-4 text-amber-400" />
          ) : (
            <FileCode className="w-4 h-4 text-cyan-400" />
          )}

          <span className="font-mono text-xs font-bold text-gray-200 group-hover:text-cyan-300">
            {node.name}
          </span>

          {node.purpose && (
            <span className="text-[11px] font-mono text-gray-500 hidden sm:inline">
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
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              Official 🎨_Folder Architecture & Auto-Creator
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Standardized repository folder layout for <span className="text-cyan-400">@DLinacre</span>, <span className="text-red-400">@LIN4CRE</span>, and <span className="text-emerald-400">linacre.site</span>. Keeps raw 3D, raster, and vector sources cleanly separated from engine builds and audio assets.
          </p>
        </div>

        {/* Big Download ZIP CTA */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-gray-950 font-mono font-black text-xs shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{isZipping ? 'PACKING ZIP...' : 'DOWNLOAD 🎨_FOLDER.ZIP'}</span>
        </button>
      </div>

      {/* Main Content Grid: Tree view on left, Terminal Scripts on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Tree View */}
        <div className="lg:col-span-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>Standard Directory Tree</span>
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
                onClick={() => copyToClipboard(shellContent, 'sh')}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded-lg text-xs font-mono border border-gray-700 transition-colors"
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
                onClick={() => copyToClipboard(ps1Content, 'ps1')}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-emerald-300 rounded-lg text-xs font-mono border border-gray-700 transition-colors"
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
                onClick={() => copyToClipboard(readmeContent, 'md')}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-amber-300 rounded-lg text-xs font-mono border border-gray-700 transition-colors"
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
