import React, { useState } from 'react';
import { BrandProfile, AssetItem } from './types';
import { HeaderNav } from './components/HeaderNav';
import { ProfileHeaderCard } from './components/ProfileHeaderCard';
import { AssetGallery } from './components/AssetGallery';
import { GlitchStudio } from './components/GlitchStudio';
import { FolderGenerator } from './components/FolderGenerator';
import { ReadmeBuilder } from './components/ReadmeBuilder';
import { GitHubRepoSync } from './components/GitHubRepoSync';
import { AssetInspectModal } from './components/AssetInspectModal';
import { INITIAL_FOLDER_STRUCTURE, generateReadmeBoilerplate } from './data/directoryPreset';
import JSZip from 'jszip';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const [activeProfile, setActiveProfile] = useState<BrandProfile>('dlinacre');
  const [activeTab, setActiveTab] = useState<'gallery' | 'studio' | 'reposync' | 'folder' | 'readme'>('reposync');
  const [inspectModal, setInspectModal] = useState<{ svgCode: string; name: string } | null>(null);
  const [studioPresetText, setStudioPresetText] = useState<string>('');

  const handleInspectAsset = (svgCode: string, name: string) => {
    setInspectModal({ svgCode, name });
  };

  const handleSendToStudio = (asset: AssetItem) => {
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
        setActiveProfile={setActiveProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadAllZip={handleDownloadAllZip}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Active Profile Header Simulator Card */}
        <ProfileHeaderCard
          activeProfile={activeProfile}
          setActiveProfile={setActiveProfile}
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
