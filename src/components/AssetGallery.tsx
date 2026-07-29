import React, { useState } from 'react';
import { AssetItem, AssetCategory, StyleThemeId } from '../types';
import { ASSET_SETS } from '../data/assetSets';
import { Search, Copy, Check, Download, Eye, Sparkles, Filter, Grid, Palette, FolderDown, Loader2, ZoomIn } from 'lucide-react';
import JSZip from 'jszip';

interface AssetGalleryProps {
  onInspectAsset: (svgCode: string, name: string) => void;
  onSendToStudio: (asset: AssetItem) => void;
}

export const AssetGallery: React.FC<AssetGalleryProps> = ({
  onInspectAsset,
  onSendToStudio,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<StyleThemeId | 'all'>('glitch_tech');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [filenameSuffix, setFilenameSuffix] = useState<string>('bundle_v1');
  const [isBatchZipping, setIsBatchZipping] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<AssetItem | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  // Flatten or filter assets
  const filteredSets = ASSET_SETS.filter((set) => {
    if (selectedTheme !== 'all' && set.id !== selectedTheme) return false;
    return true;
  });

  // Calculate all currently visible assets across selected theme and category
  const allVisibleAssets = filteredSets.flatMap((themeSet) =>
    themeSet.assets.filter((asset) => {
      if (selectedCategory !== 'all' && asset.category !== selectedCategory) return false;
      if (
        searchQuery &&
        !asset.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      return true;
    })
  );

  const toggleSelectAsset = (id: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = allVisibleAssets.map((a) => a.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedAssetIds.includes(id));

    if (allSelected) {
      setSelectedAssetIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedAssetIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleDownloadSelectedZip = async () => {
    if (selectedAssetIds.length === 0 || isBatchZipping) return;
    setIsBatchZipping(true);

    try {
      const zip = new JSZip();
      const svgFolder = zip.folder('selected_svgs');
      
      const selectedAssets = allVisibleAssets.filter((a) => selectedAssetIds.includes(a.id));
      
      selectedAssets.forEach((asset, idx) => {
        const cleanName = `${idx + 1}_${asset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
        if (svgFolder) {
          svgFolder.file(cleanName, asset.svgCode);
        }
      });

      const manifestContent = {
        title: 'Selected SVG Assets Export',
        exportedAt: new Date().toISOString(),
        count: selectedAssets.length,
        customSuffix: filenameSuffix,
        assets: selectedAssets.map((a) => ({
          name: a.name,
          category: a.category,
          dimensions: a.dimensions,
          description: a.description,
        })),
      };

      zip.file('selected_manifest.json', JSON.stringify(manifestContent, null, 2));

      const cleanSuffix = (filenameSuffix || 'batch').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linacre_assets_${cleanSuffix}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setToastMsg(`Successfully exported ${selectedAssets.length} SVGs as "linacre_assets_${cleanSuffix}.zip"!`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (e) {
      console.error('Failed to batch zip selected assets:', e);
    } finally {
      setIsBatchZipping(false);
    }
  };

  const handleCopySvg = (svgCode: string, id: string) => {
    navigator.clipboard.writeText(svgCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPng = (svgCode: string, name: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_linacre.png`;
      a.click();
    };
    img.src = url;
  };

  // Download Collection ZIP containing all currently displayed assets
  const handleDownloadCollectionZip = async () => {
    if (allVisibleAssets.length === 0 || isZipping) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const svgFolder = zip.folder('svg_vector_assets');
      const infoFolder = zip.folder('metadata');

      allVisibleAssets.forEach((asset, index) => {
        const fileName = `${index + 1}_${asset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
        if (svgFolder) {
          svgFolder.file(fileName, asset.svgCode);
        }
      });

      const manifestContent = {
        collectionTitle: 'Linacre Art & Asset Collection',
        exportedAt: new Date().toISOString(),
        totalAssets: allVisibleAssets.length,
        filterTheme: selectedTheme,
        filterCategory: selectedCategory,
        assets: allVisibleAssets.map((a) => ({
          name: a.name,
          category: a.category,
          dimensions: a.dimensions,
          usage: a.suggestedUsage,
          description: a.description,
        })),
      };

      if (infoFolder) {
        infoFolder.file('collection_manifest.json', JSON.stringify(manifestContent, null, 2));
      }

      zip.file(
        'README_COLLECTION.md',
        `# Linacre Brand & Game Dev Asset Collection\n\nThis archive contains ${allVisibleAssets.length} production-ready assets downloaded from linacre.site Asset Studio.\n\n## Usage Instructions\n- Use SVG vector files for crisp rendering at any resolution on GitHub or websites.\n- Place icons in your \`🎨_folder/📂_ui-ux/icons/\` directory.\n`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linacre_assets_collection_${selectedTheme}_${allVisibleAssets.length}_items.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to zip collection:', e);
    } finally {
      setIsZipping(false);
    }
  };


  return (
    <div className="space-y-8">
      {/* Search & Filter Header Toolbar */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              <span>Complete Brand Asset Collection (10 Sets)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Explore Glitch Tech, Neon Circuit, Retro Pixel, Minimal Vector, Sketch Hand, Flat UI, Material, Gradient & Isometric sets for DLinacre, LIN4CRE, and linacre.site.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search assets (e.g. avatar, banner, joystick)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Theme Tabs Horizontal Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Design Theme Set:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedTheme('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedTheme === 'all'
                  ? 'bg-cyan-500 text-gray-950 shadow-md shadow-cyan-500/20'
                  : 'bg-gray-950 text-gray-400 border border-gray-800 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              ALL 10 SETS
            </button>

            {ASSET_SETS.map((set) => (
              <button
                key={set.id}
                onClick={() => setSelectedTheme(set.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedTheme === set.id
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold border border-red-400 shadow-md shadow-red-500/20'
                    : 'bg-gray-950 text-gray-400 border border-gray-800 hover:text-gray-200 hover:border-gray-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: set.primaryColor }}></span>
                <span>{set.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Filters & Zip Collection Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-gray-500 mr-1">Category:</span>
            {[
              { id: 'all', label: 'All Types' },
              { id: 'logo', label: 'Logos' },
              { id: 'avatar', label: 'Profile Avatars' },
              { id: 'banner', label: 'GitHub Banners' },
              { id: 'game_icon', label: 'Game Icons' },
              { id: 'app_icon', label: 'App Icons' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gray-800 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-gray-950 text-gray-400 border border-gray-800/80 hover:text-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Download Entire Collection ZIP Action */}
          <button
            type="button"
            onClick={handleDownloadCollectionZip}
            disabled={allVisibleAssets.length === 0 || isZipping}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
              allVisibleAssets.length === 0 || isZipping
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-gray-950 border border-cyan-300 shadow-cyan-500/20 transform hover:-translate-y-0.5'
            }`}
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Zipping {allVisibleAssets.length} Assets...</span>
              </>
            ) : (
              <>
                <FolderDown className="w-4 h-4" />
                <span>DOWNLOAD COLLECTION ({allVisibleAssets.length} ZIP)</span>
              </>
            )}
          </button>
        </div>

        {/* Batch Action Toolbar for Checkbox Multi-Selection */}
        <div className="p-3 bg-gray-950 border border-cyan-500/30 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectAllVisible}
              className="px-3 py-1.5 bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-lg text-cyan-300 font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <input
                type="checkbox"
                checked={
                  allVisibleAssets.length > 0 &&
                  allVisibleAssets.every((a) => selectedAssetIds.includes(a.id))
                }
                onChange={toggleSelectAllVisible}
                className="w-4 h-4 rounded border-gray-700 accent-cyan-400 cursor-pointer"
              />
              <span>
                Select All Visible ({allVisibleAssets.length})
              </span>
            </button>

            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-gray-400">Selected Count:</span>
              <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded font-bold">
                {selectedAssetIds.length} assets
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1">
              <span className="text-gray-400 text-[11px]">ZIP Suffix:</span>
              <span className="text-gray-500 font-bold">linacre_assets_</span>
              <input
                type="text"
                value={filenameSuffix}
                onChange={(e) => setFilenameSuffix(e.target.value)}
                placeholder="suffix"
                className="w-24 bg-gray-950 border border-gray-700 rounded px-1.5 py-0.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
              />
              <span className="text-gray-500 font-bold">.zip</span>
            </div>

            <button
              type="button"
              onClick={handleDownloadSelectedZip}
              disabled={selectedAssetIds.length === 0 || isBatchZipping}
              className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedAssetIds.length === 0 || isBatchZipping
                  ? 'bg-gray-900 text-gray-500 border border-gray-800 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-300 shadow-md shadow-cyan-500/20'
              }`}
            >
              {isBatchZipping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Bundling {selectedAssetIds.length}...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD SELECTED ({selectedAssetIds.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toast Notification for Batch Actions */}
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

      </div>

      {/* Asset Grid Display */}
      <div className="space-y-12">
        {filteredSets.map((themeSet) => {
          const itemsToDisplay = themeSet.assets.filter((asset) => {
            if (selectedCategory !== 'all' && asset.category !== selectedCategory) return false;
            if (
              searchQuery &&
              !asset.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
            ) {
              return false;
            }
            return true;
          });

          if (itemsToDisplay.length === 0) return null;

          return (
            <div key={themeSet.id} className="space-y-4">
              {/* Theme Section Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{ backgroundColor: themeSet.primaryColor }}
                    ></span>
                    <h3 className="text-lg font-black text-white tracking-wide">{themeSet.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-gray-800 text-cyan-400 border border-gray-700">
                      {themeSet.badgeTag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{themeSet.description}</p>
                </div>
                <span className="text-xs font-mono text-gray-500">{itemsToDisplay.length} Assets Available</span>
              </div>

              {/* Items Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itemsToDisplay.map((asset) => {
                  const isSelected = selectedAssetIds.includes(asset.id);
                  return (
                    <div
                      key={asset.id}
                      draggable={true}
                      onMouseEnter={(e) => {
                        setHoveredAsset(asset);
                        setHoverCoords({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => {
                        setHoverCoords({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => {
                        setHoveredAsset(null);
                        setHoverCoords(null);
                      }}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          'application/json',
                          JSON.stringify({
                            type: 'gallery_asset',
                            assetName: asset.name,
                            svgCode: asset.svgCode,
                            description: asset.description,
                          })
                        );
                        e.dataTransfer.setData('text/plain', asset.name);
                      }}
                      className={`bg-gray-900 border rounded-2xl overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between group cursor-grab active:cursor-grabbing relative ${
                        isSelected
                          ? 'border-cyan-400 ring-1 ring-cyan-400/50 bg-cyan-950/20 shadow-cyan-500/20'
                          : 'border-gray-800 hover:border-cyan-500/50'
                      }`}
                    >
                      {/* Checkbox Multi-selection button in top-right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectAsset(asset.id);
                        }}
                        className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-gray-950/90 border border-gray-700 hover:border-cyan-400 text-cyan-300 flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        title={isSelected ? 'Deselect asset' : 'Select asset for batch download'}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectAsset(asset.id)}
                          className="w-4 h-4 rounded border-gray-600 accent-cyan-400 cursor-pointer"
                        />
                        <span className="text-[10px] font-mono font-bold">
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </button>

                      {/* Drag Badge Indicator */}
                      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-2 py-1 rounded-md bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                          <span>Drag to 🎨_folder</span>
                        </span>
                      </div>

                      {/* SVG Preview Box */}
                      <div className="relative w-full h-48 bg-gray-950 p-4 flex items-center justify-center overflow-hidden border-b border-gray-800/80">
                        <div
                          className="w-full h-full flex items-center justify-center transform transition-transform group-hover:scale-105"
                          dangerouslySetInnerHTML={{ __html: asset.svgCode }}
                        />

                        {/* Floating Quick Action Overlay */}
                        <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                          <button
                            onClick={() => onInspectAsset(asset.svgCode, asset.name)}
                            className="p-2.5 bg-gray-900 hover:bg-gray-800 text-cyan-300 rounded-xl border border-cyan-500/40 shadow-lg text-xs font-mono flex items-center gap-1.5"
                            title="Inspect SVG & Dimensions"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => handleCopySvg(asset.svgCode, asset.id)}
                            className="p-2.5 bg-gray-900 hover:bg-gray-800 text-emerald-300 rounded-xl border border-emerald-500/40 shadow-lg text-xs font-mono flex items-center gap-1.5"
                            title="Copy Raw SVG"
                          >
                            {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedId === asset.id ? 'Copied' : 'SVG'}</span>
                          </button>

                          <button
                            onClick={() => handleDownloadPng(asset.svgCode, asset.name)}
                            className="p-2.5 bg-gray-900 hover:bg-gray-800 text-red-300 rounded-xl border border-red-500/40 shadow-lg text-xs font-mono flex items-center gap-1.5"
                            title="Download PNG"
                          >
                            <Download className="w-4 h-4" />
                            <span>PNG</span>
                          </button>
                        </div>
                      </div>

                      {/* Asset Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-gray-100 text-sm group-hover:text-cyan-300 transition-colors">
                              {asset.name}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                              {asset.dimensions || 'Vector'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                            {asset.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-cyan-400/90 truncate max-w-[200px]">
                          {asset.suggestedUsage}
                        </span>
                        <button
                          onClick={() => onSendToStudio(asset)}
                          className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Customize</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          );
        })}
      </div>

      {/* High-Contrast Floating Hover-to-Preview Portal */}
      {hoveredAsset && hoverCoords && (
        <div
          style={{
            left: `${Math.min(window.innerWidth - 340, hoverCoords.x + 20)}px`,
            top: `${Math.max(20, Math.min(window.innerHeight - 400, hoverCoords.y - 120))}px`,
          }}
          className="fixed z-50 pointer-events-none w-80 bg-slate-950/95 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.4)] rounded-2xl p-4 space-y-3 backdrop-blur-xl animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-800">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300">
              <ZoomIn className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>HOVER PREVIEW (2.5X)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-mono text-[10px] font-bold">
              {hoveredAsset.category}
            </span>
          </div>

          {/* High-Contrast Pitch Black Zoom Viewport */}
          <div className="w-full h-44 bg-black border border-cyan-500/50 rounded-xl p-3 flex items-center justify-center overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-pink-500/5 pointer-events-none" />
            <div
              className="w-full h-full flex items-center justify-center transform scale-150 transition-transform filter drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]"
              dangerouslySetInnerHTML={{ __html: hoveredAsset.svgCode }}
            />
          </div>

          <div className="space-y-1 font-mono text-xs">
            <h4 className="font-bold text-white text-sm truncate">{hoveredAsset.name}</h4>
            <p className="text-[11px] text-gray-300 line-clamp-2 font-sans">{hoveredAsset.description}</p>
          </div>

          <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[10px] font-mono text-gray-400">
            <span>Dimensions: {hoveredAsset.dimensions || '512x512'}</span>
            <span className="text-cyan-400 font-bold">Click card for details</span>
          </div>
        </div>
      )}
    </div>
  );
};
