import { FolderNode } from '../types';

export const INITIAL_FOLDER_STRUCTURE: FolderNode = {
  id: 'root',
  name: '🎨_folder',
  type: 'folder',
  description: 'Root directory for all art, design, audio, and documentation assets across DLinacre & LIN4CRE projects.',
  required: true,
  selected: true,
  children: [
    {
      id: 'raw',
      name: '📂_raw',
      type: 'folder',
      description: '[SOURCE FILES] Editable, uncompressed source files that remain outside final production builds.',
      required: true,
      selected: true,
      children: [
        {
          id: 'raw_3d',
          name: 'raw_3d',
          type: 'folder',
          purpose: 'Editable 3D project files',
          allowedFormats: ['.blend', '.max', '.c4d', '.mb', '.hip'],
          selected: true,
        },
        {
          id: 'raw_images',
          name: 'raw_images',
          type: 'folder',
          purpose: 'Editable raster artwork',
          allowedFormats: ['.psd', '.kra', '.clip', '.xcf'],
          selected: true,
        },
        {
          id: 'raw_vector',
          name: 'raw_vector',
          type: 'folder',
          purpose: 'Vector layouts, logos & UI schematics',
          allowedFormats: ['.ai', '.svg', '.fig', '.drawio'],
          selected: true,
        },
      ],
    },
    {
      id: 'production',
      name: '📂_production',
      type: 'folder',
      description: '[ENGINE READY] Compressed, optimized game and app assets loaded directly by runtime.',
      required: true,
      selected: true,
      children: [
        {
          id: 'prod_models',
          name: 'models',
          type: 'folder',
          purpose: 'Optimized 3D meshes',
          allowedFormats: ['.fbx', '.gltf', '.glb', '.obj'],
          selected: true,
        },
        {
          id: 'prod_textures',
          name: 'textures',
          type: 'folder',
          purpose: 'Material textures & normal maps',
          allowedFormats: ['.png', '.tga', '.webp', '.dds'],
          selected: true,
        },
        {
          id: 'prod_images',
          name: 'images',
          type: 'folder',
          purpose: '2D sprites, background maps & illustrations',
          allowedFormats: ['.png', '.jpg', '.webp', '.svg'],
          selected: true,
        },
        {
          id: 'prod_fonts',
          name: 'fonts',
          type: 'folder',
          purpose: 'Typography and game HUD fonts',
          allowedFormats: ['.ttf', '.otf', '.woff2'],
          selected: true,
        },
        {
          id: 'prod_shaders',
          name: 'shaders',
          type: 'folder',
          purpose: 'Glitch tech shader code & post-processing',
          allowedFormats: ['.shader', '.compute', '.hlsl', '.glsl'],
          selected: true,
        },
      ],
    },
    {
      id: 'ui_ux',
      name: '📂_ui-ux',
      type: 'folder',
      description: '[INTERFACE] User interface elements, HUDs, menus, and game avatars.',
      required: true,
      selected: true,
      children: [
        {
          id: 'ui_screens',
          name: 'screens',
          type: 'folder',
          purpose: 'Full UI screen mockups & menu layouts',
          allowedFormats: ['.png', '.jpg', '.fig'],
          selected: true,
        },
        {
          id: 'ui_icons',
          name: 'icons',
          type: 'folder',
          purpose: 'Game & App Icons (Glitch Tech Set 5)',
          allowedFormats: ['.svg', '.png'],
          selected: true,
        },
        {
          id: 'ui_hud',
          name: 'hud',
          type: 'folder',
          purpose: 'Heads-Up Display gauges, crosshairs & reticles',
          allowedFormats: ['.svg', '.png', '.json'],
          selected: true,
        },
      ],
    },
    {
      id: 'audio',
      name: '📂_audio',
      type: 'folder',
      description: '[SOUNDSCAPE] Sound effects, ambient synth tracks, and raw DAW audio sessions.',
      required: true,
      selected: true,
      children: [
        {
          id: 'audio_raw',
          name: 'raw_audio',
          type: 'folder',
          purpose: 'DAW project sessions',
          allowedFormats: ['.als', '.flp', '.aup3', '.logicx'],
          selected: true,
        },
        {
          id: 'audio_sfx',
          name: 'sfx',
          type: 'folder',
          purpose: 'Cyber sound effects & glitch noise triggers',
          allowedFormats: ['.wav', '.mp3', '.ogg'],
          selected: true,
        },
        {
          id: 'audio_music',
          name: 'music',
          type: 'folder',
          purpose: 'Background synth soundtrack & game loops',
          allowedFormats: ['.wav', '.mp3', '.flac'],
          selected: true,
        },
      ],
    },
    {
      id: 'docs',
      name: '📂_docs',
      type: 'folder',
      description: '[GUIDELINES] Project specifications, Game Design Documents (GDD), and brand style guides.',
      required: true,
      selected: true,
      children: [
        {
          id: 'doc_gdd',
          name: 'design_doc.md',
          type: 'file',
          purpose: 'Game Design Document or Technical Spec',
          content: `# Game Design Document & Tech Spec\n\n## Project Overview\n- **Developer Profile**: DLinacre // LIN4CRE\n- **Target Platform**: Desktop / WebGL / Mobile\n- **Core Aesthetic**: Cyberpunk Glitch Tech\n\n## Technical Architecture\n- Engine: Custom WebGL / Unity\n- State Engine: Low-latency sync\n- Audio Engine: Cyber SFX & WebAudio Synth\n`,
          selected: true,
        },
        {
          id: 'doc_style',
          name: 'style_guide.md',
          type: 'file',
          purpose: 'Brand palette, typography & glitch rules',
          content: `# Linacre Style Guide (Glitch Tech Edition)\n\n## Palette\n- Cyber Cyan: #00F0FF\n- Neon Red: #FF0055\n- Matrix Green: #00FF66\n- Deep Void Background: #0A0D14\n\n## Typography\n- Display: JetBrains Mono / Space Grotesk\n- Body: Inter / Plus Jakarta Sans\n`,
          selected: true,
        },
        {
          id: 'doc_mood',
          name: 'moodboard',
          type: 'folder',
          purpose: 'Inspiration images & visual references',
          allowedFormats: ['.png', '.jpg', '.webp'],
          selected: true,
        },
      ],
    },
  ],
};

export function generateReadmeBoilerplate(selectedTree: FolderNode): string {
  return `# [Project Name] - Linacre Repository

## 🎨 Asset & Design Organization (Glitch Tech Schematic)

This repository follows the official \`🎨_folder\` layout for **Linacre Development [DLinacre // LIN4CRE]**.
All editable source files remain strictly separated from optimized runtime assets.

\`\`\`text
🎨_folder/                   # Root directory for all art, design, and documentation.
├── 📂_raw/                   # [SOURCE FILES] Uncompressed, editable work-in-progress.
│   ├── raw_3d/               # .blend, .max, .c4d
│   ├── raw_images/           # .psd, .kra, .clip (Raster)
│   └── raw_vector/           # .ai, .svg, .fig (Vector / UI Layouts)
│
├── 📂_production/            # [ENGINE READY] Compressed, optimized assets ready for build.
│   ├── models/               # .fbx, .gltf, .obj (3D)
│   ├── textures/             # .png, .tga, .webp (Materials/Surfaces)
│   ├── images/               # .png, .jpg (Sprites, Backgrounds)
│   ├── fonts/                # .ttf, .otf, .woff2
│   └── shaders/              # .shader, .compute (Glitch/Tech code)
│
├── 📂_ui-ux/                 # [INTERFACE] Layouts, icons, and menus.
│   ├── screens/              # Full UI screen mockups (Glitch style menus)
│   ├── icons/                # Game Icons, App Icons (Set 5 Glitch Tech)
│   └── hud/                  # Head-Up Display elements.
│
├── 📂_audio/                 # [SOUNDSCAPE] All audio assets.
│   ├── raw_audio/            # Project files (e.g., Audacity, Ableton)
│   ├── sfx/                  # .wav, .mp3 (Sound Effects, Glitch noise)
│   └── music/                # .wav, .mp3 (Loops, Score)
│
└── 📂_docs/                  # [GUIDELINES] Style guides and documentation.
    ├── design_doc.md         # The Game Design Document (GDD) or App Spec.
    ├── style_guide.md        # Color palettes, typography, and glitch rules.
    └── moodboard/            # Reference images and inspiration.
\`\`\`

---

## ⚡ Profile Badges & Direct Links
- **Website**: [linacre.site](https://linacre.site)
- **Engineering Profile**: [@DLinacre](https://github.com/DLinacre)
- **Creative Game Studio**: [@LIN4CRE](https://github.com/LIN4CRE)
`;
}

export function generateShellScript(profile: string = 'DLinacre'): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# Linacre 🎨_folder Auto-Creator Script
# Created for: ${profile} // linacre.site
# ==============================================================================

echo "⚡ Initializing Linacre 🎨_folder Structure..."

mkdir -p "🎨_folder/📂_raw/raw_3d"
mkdir -p "🎨_folder/📂_raw/raw_images"
mkdir -p "🎨_folder/📂_raw/raw_vector"

mkdir -p "🎨_folder/📂_production/models"
mkdir -p "🎨_folder/📂_production/textures"
mkdir -p "🎨_folder/📂_production/images"
mkdir -p "🎨_folder/📂_production/fonts"
mkdir -p "🎨_folder/📂_production/shaders"

mkdir -p "🎨_folder/📂_ui-ux/screens"
mkdir -p "🎨_folder/📂_ui-ux/icons"
mkdir -p "🎨_folder/📂_ui-ux/hud"

mkdir -p "🎨_folder/📂_audio/raw_audio"
mkdir -p "🎨_folder/📂_audio/sfx"
mkdir -p "🎨_folder/📂_audio/music"

mkdir -p "🎨_folder/📂_docs/moodboard"

# Create boilerplate markdown documentation
cat << 'EOF' > "🎨_folder/📂_docs/design_doc.md"
# Game Design Document & Tech Spec
- Profile: ${profile}
- Domain: linacre.site
- Style: Cyberpunk Glitch Tech
EOF

cat << 'EOF' > "🎨_folder/📂_docs/style_guide.md"
# Linacre Brand Style Guide
- Primary Accent: #00F0FF (Cyber Cyan)
- Secondary Accent: #FF0055 (Neon Cyber Red)
- Background: #0A0D14
EOF

echo "✅ 🎨_folder directory structure created successfully for ${profile}!"
`;
}

export function generatePowerShellScript(profile: string = 'DLinacre'): string {
  return `# PowerShell Script for Linacre 🎨_folder Directory Creation
Write-Host "⚡ Initializing Linacre 🎨_folder Structure for ${profile}..." -ForegroundColor Cyan

$paths = @(
    "🎨_folder\📂_raw\raw_3d",
    "🎨_folder\📂_raw\raw_images",
    "🎨_folder\📂_raw\raw_vector",
    "🎨_folder\📂_production\models",
    "🎨_folder\📂_production\textures",
    "🎨_folder\📂_production\images",
    "🎨_folder\📂_production\fonts",
    "🎨_folder\📂_production\shaders",
    "🎨_folder\📂_ui-ux\screens",
    "🎨_folder\📂_ui-ux\icons",
    "🎨_folder\📂_ui-ux\hud",
    "🎨_folder\📂_audio\raw_audio",
    "🎨_folder\📂_audio\sfx",
    "🎨_folder\📂_audio\music",
    "🎨_folder\📂_docs\moodboard"
)

foreach ($path in $paths) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
}

@'
# Game Design Document
- Profile: ${profile}
- Site: linacre.site
'@ | Out-File -FilePath "🎨_folder\📂_docs\design_doc.md" -Encoding utf8

Write-Host "✅ 🎨_folder hierarchy generated successfully!" -ForegroundColor Green
`;
}
