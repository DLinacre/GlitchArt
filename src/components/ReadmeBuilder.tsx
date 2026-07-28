import React, { useState } from 'react';
import { BrandProfile } from '../types';
import { PROFILES } from '../data/profileData';
import { Copy, Check, Code, Sparkles, Terminal, Shield, ExternalLink, Globe } from 'lucide-react';

interface ReadmeBuilderProps {
  activeProfile: BrandProfile;
}

export const ReadmeBuilder: React.FC<ReadmeBuilderProps> = ({ activeProfile }) => {
  const profile = PROFILES[activeProfile];
  const [copied, setCopied] = useState(false);

  const generateMarkdown = (): string => {
    return `# ${profile.bannerTitle}

<p align="center">
  <img src="https://linacre.site/assets/banners/${activeProfile}_banner.png" alt="${profile.name} Banner" width="100%" />
</p>

## ⚡ Overview & Profile Bio
> **${profile.title}**
> 
> ${profile.bio}
>
> 🌐 **Main Digital Hub**: [linacre.site](${profile.website})

---

## 🎨 Asset & Repository Architecture (\`🎨_folder\`)

All repositories owned by **${profile.name}** follow the official **Linacre \`🎨_folder\`** structure to keep editable raw 3D models, raster art, vector files, and DAW soundscapes separated from runtime production builds:

\`\`\`text
🎨_folder/
├── 📂_raw/               # .blend, .psd, .ai, .fig
├── 📂_production/        # .fbx, .gltf, .png, .shader
├── 📂_ui-ux/             # Glitch HUDs, icons, menus
├── 📂_audio/              # .wav, .mp3 SFX & synth loops
└── 📂_docs/               # Game Design Documents (GDD) & Style Guides
\`\`\`

---

## 💻 Primary Tech Stack & Core Systems

| Domain | Frameworks & Tools |
| :--- | :--- |
| **Languages** | TypeScript, Rust, C++, C#, HLSL, Python |
| **Game Engines** | WebGL, Unity, Custom C++ Core |
| **UI & Audio** | Cyber Glitch HUD, WebAudio Synth API, Vector SVG |
| **Persistence** | Zero-Trust Encrypted Vault, Local State Sync |

---

## 🚀 Key Repositories & Featured Projects

${profile.pinnedRepos
  .map(
    (repo) => `### 📦 [${repo.name}](https://github.com/${profile.name}/${repo.name})
- **Language**: \`${repo.language}\`
- **Description**: ${repo.description}
- **Compliance**: \`🎨_folder\` Ready
`
  )
  .join('\n')}

---

<p align="center">
  <sub>Maintained by <b>${profile.name}</b> // Official Domain: <a href="https://linacre.site">linacre.site</a></sub>
</p>
`;
  };

  const mdCode = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(mdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              GitHub Profile README Builder ({profile.handle})
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Ready-to-use GitHub profile Markdown for <span className="text-cyan-400">{profile.name}</span> with banners, badges, and repo specs.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-0.5"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'README Copied to Clipboard!' : 'Copy Profile README.md'}</span>
        </button>
      </div>

      {/* Code Display Box */}
      <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 shadow-inner overflow-x-auto">
        <pre className="text-xs font-mono text-purple-200 leading-relaxed scrollbar-thin">
          {mdCode}
        </pre>
      </div>
    </div>
  );
};
