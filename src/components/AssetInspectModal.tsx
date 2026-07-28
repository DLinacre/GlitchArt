import React, { useState } from 'react';
import { X, Copy, Check, Download, Code, Layers, Sparkles } from 'lucide-react';

interface AssetInspectModalProps {
  svgCode: string;
  assetName: string;
  onClose: () => void;
}

export const AssetInspectModal: React.FC<AssetInspectModalProps> = ({
  svgCode,
  assetName,
  onClose,
}) => {
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [exportSize, setExportSize] = useState<512 | 1024 | 2048>(1024);

  const handleCopySvg = () => {
    navigator.clipboard.writeText(svgCode);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const htmlEmbed = `<img src="data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}" alt="${assetName}" referrerPolicy="no-referrer" />`;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlEmbed);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, exportSize, exportSize);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${assetName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_linacre.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono">{assetName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
          
          {/* Main Visual Render Box */}
          <div className="bg-gray-950 rounded-2xl p-6 border border-gray-800 shadow-inner flex items-center justify-center min-h-[260px] max-h-[380px]">
            <div
              className="w-full h-full max-h-[340px] flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>

          {/* Export Settings Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-950/60 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400">Export Resolution:</span>
              {[512, 1024, 2048].map((size) => (
                <button
                  key={size}
                  onClick={() => setExportSize(size as any)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    exportSize === size
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {size}x{size}px
                </button>
              ))}
            </div>

            <button
              onClick={handleDownloadPng}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-mono font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG ({exportSize}px)</span>
            </button>
          </div>

          {/* Raw SVG Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-400">RAW VECTOR SVG CODE</span>
              <button
                onClick={handleCopySvg}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded text-xs font-mono border border-gray-700"
              >
                {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSvg ? 'Copied' : 'Copy SVG'}</span>
              </button>
            </div>
            <pre className="bg-gray-950 p-4 rounded-xl text-xs font-mono text-cyan-300 border border-gray-800 overflow-x-auto max-h-36 scrollbar-thin">
              {svgCode}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
