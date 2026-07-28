import React, { useState } from 'react';
import { BrandProfile } from '../types';
import { PROFILES } from '../data/profileData';
import { ASSET_SETS } from '../data/assetSets';
import { Copy, Check, ExternalLink, Star, Code, Terminal, Shield, Joystick, Cpu, Sparkles } from 'lucide-react';

interface ProfileHeaderCardProps {
  activeProfile: BrandProfile;
  setActiveProfile: (p: BrandProfile) => void;
  onInspectAsset: (svgCode: string, name: string) => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  activeProfile,
  setActiveProfile,
  onInspectAsset,
}) => {
  const profile = PROFILES[activeProfile];
  const [copied, setCopied] = useState(false);

  // Find associated Glitch Tech assets for this profile
  const glitchSet = ASSET_SETS.find((s) => s.id === 'glitch_tech');
  const bannerAsset = glitchSet?.assets.find(
    (a) => a.category === 'banner' && (a.id.includes(activeProfile) || (activeProfile === 'linacre_site' && a.id.includes('dlinacre')))
  ) || glitchSet?.assets[2];

  const avatarAsset = glitchSet?.assets.find(
    (a) => a.category === 'avatar' && (a.id.includes(activeProfile) || (activeProfile === 'linacre_site' && a.id.includes('dlinacre')))
  ) || glitchSet?.assets[0];

  const handleCopyProfileMarkdown = () => {
    const md = `
# ${profile.name} (${profile.handle})
> ${profile.title}
> ${profile.bio}

![${profile.name} Banner](https://linacre.site/assets/banners/${activeProfile}_banner.png)

### ⚡ Core Repositories & Systems
- **Domain**: [linacre.site](${profile.website})
- **Folder Architecture**: \`🎨_folder\` standardized layout
- **Primary Tech Stack**: TypeScript / Rust / WebGL / C++ / C#
`;
    navigator.clipboard.writeText(md.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Banner Display Header */}
      <div className="relative w-full h-48 sm:h-64 bg-gray-950 overflow-hidden group">
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={() => onInspectAsset(bannerAsset?.svgCode || '', bannerAsset?.name || 'Banner')}
          title="Click to view/download high-res Banner SVG"
          dangerouslySetInnerHTML={{ __html: bannerAsset?.svgCode || '' }}
        />
        <div className="absolute top-3 right-3 bg-gray-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-gray-700 text-xs font-mono text-cyan-400 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click Banner to Inspect / Export</span>
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="p-6 sm:p-8 -mt-12 sm:-mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-6 border-b border-gray-800">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar Circle */}
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-gray-900 bg-gray-950 shadow-2xl cursor-pointer overflow-hidden transform transition-transform hover:scale-105"
              onClick={() => onInspectAsset(avatarAsset?.svgCode || '', avatarAsset?.name || 'Avatar')}
              title="Click to inspect & export Avatar"
              dangerouslySetInnerHTML={{ __html: avatarAsset?.svgCode || '' }}
            />

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {profile.name}
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {profile.handle}
                </span>
              </div>
              <p className="text-sm font-mono text-gray-300 mt-1">{profile.title}</p>
              <p className="text-xs text-gray-400 mt-2 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopyProfileMarkdown}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono font-bold rounded-lg border border-gray-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copied ? 'Markdown Copied!' : 'Copy README MD'}</span>
            </button>

            <a
              href="https://linacre.site"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold rounded-lg border border-cyan-500/30 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>linacre.site</span>
            </a>
          </div>

        </div>

        {/* Pinned Repositories Showcase Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Pinned Repositories & Projects ({profile.pinnedRepos.length})</span>
            </h3>
            <span className="text-xs font-mono text-gray-500">🎨_folder Compliant</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.pinnedRepos.map((repo, idx) => (
              <div
                key={idx}
                className="bg-gray-950/70 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all hover:bg-gray-950 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-400 text-sm group-hover:text-cyan-300 flex items-center gap-2">
                      <Code className="w-4 h-4 text-gray-500" />
                      {repo.name}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{repo.stars}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/80 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    {repo.language}
                  </span>
                  <span className="text-gray-500">/🎨_folder</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
