import { StyleSet } from '../types';

export const ASSET_SETS: StyleSet[] = [
  {
    id: 'glitch_tech',
    title: 'Glitch Tech (Core Favorite)',
    subtitle: 'Cyberpunk, Red/Cyan Distortion, Circuit Schematic & High Tech',
    description: 'The signature dark neon glitch aesthetic for DLinacre, LIN4CRE, and linacre.site. Features digital signal noise, fractured geometry, scanlines, and high-voltage accents.',
    primaryColor: '#FF0055',
    accentColor: '#00F0FF',
    bgGradient: 'from-gray-950 via-slate-900 to-red-950',
    badgeTag: 'FEATURED FAVORITE',
    assets: [
      {
        id: 'gt_avatar_dlinacre',
        name: 'DLinacre [ENGINEERING] Glitch Avatar',
        category: 'avatar',
        themeId: 'glitch_tech',
        description: 'High-contrast square avatar with circuit schematic trace and cyan/red glitch offset.',
        tags: ['avatar', 'glitch', 'dlinacre', 'engineering', 'circuit'],
        dimensions: '512x512',
        suggestedUsage: 'GitHub Profile Avatar for @DLinacre',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" fill="#0A0D14"/>
  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#161F30" stroke-width="1"/>
  </pattern>
  <rect width="512" height="512" fill="url(#grid)"/>
  
  <!-- Outer Frame -->
  <rect x="24" y="24" width="464" height="464" rx="16" fill="none" stroke="#00F0FF" stroke-width="3" stroke-dasharray="12,6" opacity="0.8"/>
  <rect x="36" y="36" width="440" height="440" rx="12" fill="none" stroke="#FF0055" stroke-width="2" opacity="0.6"/>

  <!-- Schematic Circuits -->
  <path d="M 60 120 L 160 120 L 200 160 L 200 240" fill="none" stroke="#00F0FF" stroke-width="3"/>
  <circle cx="60" cy="120" r="6" fill="#00F0FF"/>
  <path d="M 450 390 L 350 390 L 310 350 L 310 270" fill="none" stroke="#FF0055" stroke-width="3"/>
  <circle cx="450" cy="390" r="6" fill="#FF0055"/>

  <!-- Glitch Letter DL Monogram -->
  <g transform="translate(140, 130)">
    <!-- Red Glitch Layer -->
    <path d="M 20 20 L 100 20 L 100 60 L 60 60 L 60 180 L 140 180 L 140 220 L 20 220 Z" fill="#FF0055" opacity="0.7" transform="translate(-6, 4)"/>
    <!-- Cyan Glitch Layer -->
    <path d="M 20 20 L 100 20 L 100 60 L 60 60 L 60 180 L 140 180 L 140 220 L 20 220 Z" fill="#00F0FF" opacity="0.8" transform="translate(6, -4)"/>
    <!-- Main Core White -->
    <path d="M 20 20 L 100 20 L 100 60 L 60 60 L 60 180 L 140 180 L 140 220 L 20 220 Z" fill="#FFFFFF"/>
  </g>

  <!-- Glitch Scanlines -->
  <line x1="20" y1="210" x2="490" y2="210" stroke="#FF0055" stroke-width="3" opacity="0.7"/>
  <line x1="50" y1="310" x2="460" y2="310" stroke="#00F0FF" stroke-width="2" opacity="0.8"/>

  <!-- Tech Label -->
  <rect x="140" y="420" width="232" height="36" rx="6" fill="#121824" stroke="#00F0FF" stroke-width="1"/>
  <text x="256" y="444" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="16" fill="#00F0FF" text-anchor="middle" letter-spacing="3">DLINACRE // DEV</text>
</svg>`,
      },
      {
        id: 'gt_avatar_lin4cre',
        name: 'LIN4CRE [GAME STUDIO] Glitch Avatar',
        category: 'avatar',
        themeId: 'glitch_tech',
        description: 'Dynamic game studio avatar featuring a glitch joystick motif with neon red flare.',
        tags: ['avatar', 'glitch', 'lin4cre', 'joystick', 'game-dev'],
        dimensions: '512x512',
        suggestedUsage: 'GitHub Profile Avatar for @LIN4CRE',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" fill="#0D0714"/>
  <pattern id="hex" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 40 10 L 40 30 L 20 40 L 0 30 L 0 10 Z" fill="none" stroke="#231238" stroke-width="1"/>
  </pattern>
  <rect width="512" height="512" fill="url(#hex)"/>

  <!-- Glow effect -->
  <circle cx="256" cy="230" r="140" fill="#FF0055" opacity="0.15" filter="blur(20px)"/>

  <!-- Joystick Symbol Glitched -->
  <g transform="translate(126, 110)">
    <!-- Cyan Glitch Shadow -->
    <path d="M 80 40 C 40 40 20 70 20 120 L 20 180 C 20 220 50 240 100 240 L 160 240 C 210 240 240 220 240 180 L 240 120 C 240 70 220 40 180 40 Z" fill="none" stroke="#00F0FF" stroke-width="12" transform="translate(-6, 4)" opacity="0.8"/>
    <!-- Red Glitch Main -->
    <path d="M 80 40 C 40 40 20 70 20 120 L 20 180 C 20 220 50 240 100 240 L 160 240 C 210 240 240 220 240 180 L 240 120 C 240 70 220 40 180 40 Z" fill="#180A28" stroke="#FF0055" stroke-width="10"/>

    <!-- D-Pad Left -->
    <path d="M 60 120 L 80 120 L 80 100 L 100 100 L 100 120 L 120 120 L 120 140 L 100 140 L 100 160 L 80 160 L 80 140 L 60 140 Z" fill="#00F0FF"/>
    
    <!-- Action Buttons Right -->
    <circle cx="180" cy="115" r="10" fill="#FF0055"/>
    <circle cx="200" cy="135" r="10" fill="#00F0FF"/>
    <circle cx="160" cy="135" r="10" fill="#00FF66"/>
    <circle cx="180" cy="155" r="10" fill="#FFCC00"/>
  </g>

  <!-- Tech Label -->
  <rect x="120" y="420" width="272" height="38" rx="6" fill="#1A0D28" stroke="#FF0055" stroke-width="1.5"/>
  <text x="256" y="445" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="16" fill="#FF0055" text-anchor="middle" letter-spacing="3">LIN4CRE // STUDIO</text>
</svg>`,
      },
      {
        id: 'gt_banner_dlinacre',
        name: 'DLinacre Engineering GitHub Banner',
        category: 'banner',
        themeId: 'glitch_tech',
        description: 'Widescreen 16:9 banner for DLinacre GitHub repository header with schematic logic gates and binary code overlay.',
        tags: ['banner', 'dlinacre', 'github-header', 'glitch', 'widescreen'],
        dimensions: '1920x1080',
        suggestedUsage: 'GitHub Profile README Banner for DLinacre',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_dlinacre" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080C14"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#05080F"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#bg_dlinacre)"/>

  <!-- Cyber Grid Lines -->
  <path d="M 0 50 L 1200 50 M 0 100 L 1200 100 M 0 150 L 1200 150 M 0 200 L 1200 200 M 0 250 L 1200 250 M 0 300 L 1200 300 M 0 350 L 1200 350" stroke="#1E293B" stroke-width="1" opacity="0.6"/>
  <path d="M 100 0 L 100 400 M 200 0 L 200 400 M 300 0 L 300 400 M 400 0 L 400 400 M 500 0 L 500 400 M 600 0 L 600 400 M 700 0 L 700 400 M 800 0 L 800 400 M 900 0 L 900 400 M 1000 0 L 1000 400 M 1100 0 L 1100 400" stroke="#1E293B" stroke-width="1" opacity="0.6"/>

  <!-- Circuit Schematics -->
  <path d="M 80 80 L 300 80 L 380 160 L 500 160" fill="none" stroke="#00F0FF" stroke-width="2"/>
  <circle cx="80" cy="80" r="5" fill="#00F0FF"/>
  <circle cx="500" cy="160" r="5" fill="#00F0FF"/>

  <path d="M 1120 320 L 900 320 L 820 240 L 700 240" fill="none" stroke="#FF0055" stroke-width="2"/>
  <circle cx="1120" cy="320" r="5" fill="#FF0055"/>

  <!-- Glitched Title Text -->
  <!-- Cyan Shift -->
  <text x="104" y="184" font-family="'JetBrains Mono', sans-serif" font-weight="900" font-size="54" fill="#00F0FF" letter-spacing="4" opacity="0.8">DLINACRE // SYSTEMS</text>
  <!-- Red Shift -->
  <text x="96" y="176" font-family="'JetBrains Mono', sans-serif" font-weight="900" font-size="54" fill="#FF0055" letter-spacing="4" opacity="0.8">DLINACRE // SYSTEMS</text>
  <!-- Foreground White -->
  <text x="100" y="180" font-family="'JetBrains Mono', sans-serif" font-weight="900" font-size="54" fill="#FFFFFF" letter-spacing="4">DLINACRE // SYSTEMS</text>

  <!-- Subtitle -->
  <text x="102" y="225" font-family="'Space Grotesk', sans-serif" font-size="18" fill="#94A3B8" letter-spacing="3">SYSTEMS ARCHITECTURE, SECURE ENGINES & GLITCH PROTOCOLS</text>

  <!-- Status Badges -->
  <rect x="100" y="270" width="160" height="34" rx="4" fill="#1E293B" stroke="#00F0FF" stroke-width="1"/>
  <text x="180" y="292" font-family="'JetBrains Mono', monospace" font-size="12" fill="#00F0FF" text-anchor="middle">LINACRE.SITE CORE</text>

  <rect x="275" y="270" width="150" height="34" rx="4" fill="#1E293B" stroke="#FF0055" stroke-width="1"/>
  <text x="350" y="292" font-family="'JetBrains Mono', monospace" font-size="12" fill="#FF0055" text-anchor="middle">🎨_FOLDER READY</text>

  <!-- Terminal Decor Right Side -->
  <rect x="800" y="100" width="320" height="200" rx="8" fill="#0A0F1D" stroke="#334155" stroke-width="2"/>
  <rect x="800" y="100" width="320" height="30" rx="8" fill="#1E293B"/>
  <circle cx="820" cy="115" r="5" fill="#FF5F56"/>
  <circle cx="835" cy="115" r="5" fill="#FFBD2E"/>
  <circle cx="850" cy="115" r="5" fill="#27C93F"/>
  <text x="870" y="120" font-family="monospace" font-size="11" fill="#64748B">dlinacre@kernel:~</text>

  <text x="815" y="155" font-family="monospace" font-size="12" fill="#00F0FF">$ init_art_pipeline.sh</text>
  <text x="815" y="180" font-family="monospace" font-size="12" fill="#22C55E">[OK] 🎨_folder loaded</text>
  <text x="815" y="205" font-family="monospace" font-size="12" fill="#E2E8F0">[STATUS] Active sync linacre.site</text>
  <text x="815" y="230" font-family="monospace" font-size="12" fill="#FF0055">[GLITCH] Glitch Tech v5.0 ready</text>
  <text x="815" y="260" font-family="monospace" font-size="12" fill="#00F0FF">_ &gt; awaiting build command</text>
</svg>`,
      },
      {
        id: 'gt_banner_lin4cre',
        name: 'LIN4CRE Game Studio GitHub Banner',
        category: 'banner',
        themeId: 'glitch_tech',
        description: 'Widescreen 16:9 banner for LIN4CRE Game Studio profile header with cyberpunk synth grid.',
        tags: ['banner', 'lin4cre', 'game-studio', 'glitch', 'widescreen'],
        dimensions: '1920x1080',
        suggestedUsage: 'GitHub Profile README Banner for LIN4CRE',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_lin4cre" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#12051E"/>
      <stop offset="50%" stop-color="#240A38"/>
      <stop offset="100%" stop-color="#08020F"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#bg_lin4cre)"/>

  <!-- Perspective Horizon Grid -->
  <g opacity="0.4">
    <line x1="0" y1="260" x2="1200" y2="260" stroke="#FF0055" stroke-width="2"/>
    <line x1="0" y1="280" x2="1200" y2="280" stroke="#FF0055" stroke-width="1.5"/>
    <line x1="0" y1="310" x2="1200" y2="310" stroke="#FF0055" stroke-width="1"/>
    <line x1="0" y1="350" x2="1200" y2="350" stroke="#FF0055" stroke-width="1"/>
    <!-- Perspective lines -->
    <line x1="600" y1="240" x2="-200" y2="400" stroke="#00F0FF" stroke-width="1"/>
    <line x1="600" y1="240" x2="200" y2="400" stroke="#00F0FF" stroke-width="1"/>
    <line x1="600" y1="240" x2="600" y2="400" stroke="#00F0FF" stroke-width="1"/>
    <line x1="600" y1="240" x2="1000" y2="400" stroke="#00F0FF" stroke-width="1"/>
    <line x1="600" y1="240" x2="1400" y2="400" stroke="#00F0FF" stroke-width="1"/>
  </g>

  <!-- Big Glitch Text LIN4CRE -->
  <text x="104" y="174" font-family="'JetBrains Mono', sans-serif" font-weight="900" font-size="64" fill="#00F0FF" letter-spacing="6" opacity="0.7">LIN4CRE // STUDIO</text>
  <text x="96" y="166" font-family="'JetBrains Mono', sans-serif" font-weight="900" font-size="64" fill="#FF0055" letter-spacing="6" opacity="0.8">LIN4CRE // STUDIO</text>
  <text x="100" y="170" font-family="'JetBrains Mono', sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="6">LIN4CRE // STUDIO</text>

  <text x="102" y="215" font-family="'Space Grotesk', sans-serif" font-size="18" fill="#D8B4FE" letter-spacing="3">INDIE GAME DEV, 3D ASSET PIPELINES & SYNTH SOUNDSCAPES</text>

  <!-- Feature Chips -->
  <g transform="translate(100, 250)">
    <rect x="0" y="0" width="140" height="32" rx="16" fill="#3B0764" stroke="#FF0055" stroke-width="1"/>
    <text x="70" y="20" font-family="monospace" font-size="12" fill="#FF0055" text-anchor="middle">🕹️ GAME ENGINE</text>

    <rect x="155" y="0" width="140" height="32" rx="16" fill="#3B0764" stroke="#00F0FF" stroke-width="1"/>
    <text x="225" y="20" font-family="monospace" font-size="12" fill="#00F0FF" text-anchor="middle">🎨 3D MODELS</text>

    <rect x="310" y="0" width="140" height="32" rx="16" fill="#3B0764" stroke="#00FF66" stroke-width="1"/>
    <text x="380" y="20" font-family="monospace" font-size="12" fill="#00FF66" text-anchor="middle">🔊 SYNTH AUDIO</text>
  </g>

  <!-- Retro Sun Right Side -->
  <circle cx="950" cy="180" r="90" fill="#FF0055"/>
  <!-- Sun stripes -->
  <rect x="850" y="170" width="200" height="6" fill="#12051E"/>
  <rect x="850" y="185" width="200" height="8" fill="#12051E"/>
  <rect x="850" y="202" width="200" height="12" fill="#12051E"/>
  <rect x="850" y="222" width="200" height="16" fill="#12051E"/>
</svg>`,
      },
      {
        id: 'gt_logo_linacre_site',
        name: 'linacre.site Primary Web Header Logo',
        category: 'logo',
        themeId: 'glitch_tech',
        description: 'Official header logo for linacre.site with circuit underline and glowing pulse dot.',
        tags: ['logo', 'linacre.site', 'web-header', 'glitch', 'circuit'],
        dimensions: '800x200',
        suggestedUsage: 'Website Header & Main Navigation Logo for linacre.site',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#080C14"/>
  <!-- Background Glow -->
  <ellipse cx="400" cy="100" rx="250" ry="60" fill="#00F0FF" opacity="0.08" filter="blur(20px)"/>

  <!-- Logo Group -->
  <g transform="translate(60, 40)">
    <!-- Symbol Box -->
    <rect x="0" y="10" width="100" height="100" rx="16" fill="#101726" stroke="#00F0FF" stroke-width="3"/>
    <path d="M 25 30 L 75 30 L 75 50 L 50 50 L 50 90 L 25 90 Z" fill="#FF0055"/>
    <path d="M 30 35 L 80 35 L 80 55 L 55 55 L 55 95 L 30 95 Z" fill="#00F0FF" opacity="0.8"/>

    <!-- Text Group -->
    <text x="134" y="74" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="46" fill="#00F0FF" letter-spacing="2">LINACRE</text>
    <text x="130" y="70" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="46" fill="#FFFFFF" letter-spacing="2">LINACRE</text>
    <text x="340" y="70" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="46" fill="#FF0055" letter-spacing="2">.SITE</text>

    <!-- Circuit Underscore -->
    <path d="M 130 95 L 480 95 L 520 120 L 600 120" fill="none" stroke="#00F0FF" stroke-width="3"/>
    <circle cx="130" cy="95" r="5" fill="#00F0FF"/>
    <circle cx="600" cy="120" r="6" fill="#FF0055"/>
  </g>
</svg>`,
      },
      {
        id: 'gt_icon_game_joystick',
        name: 'Game Dev Cyber Joystick Icon',
        category: 'game_icon',
        themeId: 'glitch_tech',
        description: 'Square glitch icon representing game development and arcade controller mechanics.',
        tags: ['icon', 'game-dev', 'joystick', 'glitch'],
        dimensions: '256x256',
        suggestedUsage: 'Project Avatar or Category Icon for Games',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <rect width="256" height="256" rx="32" fill="#0F081C" stroke="#FF0055" stroke-width="4"/>
  <rect x="20" y="20" width="216" height="216" rx="20" fill="none" stroke="#00F0FF" stroke-width="1.5" stroke-dasharray="8,4"/>
  
  <g transform="translate(48, 58)">
    <rect x="0" y="40" width="160" height="85" rx="20" fill="#1A0D30" stroke="#FF0055" stroke-width="4"/>
    <circle cx="45" cy="82" r="16" fill="#00F0FF"/>
    <circle cx="115" cy="72" r="8" fill="#FF0055"/>
    <circle cx="135" cy="92" r="8" fill="#00FF66"/>
  </g>
</svg>`,
      },
      {
        id: 'gt_icon_3d_cube',
        name: 'Fragmented 3D Asset Cube Icon',
        category: 'app_icon',
        themeId: 'glitch_tech',
        description: 'Isometric polygon cube with cyber red and cyan lighting for 3D assets and raw models.',
        tags: ['icon', '3d-models', 'cube', 'assets'],
        dimensions: '256x256',
        suggestedUsage: 'Folder Icon for raw_3d or production/models',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <rect width="256" height="256" rx="32" fill="#0A0F1D" stroke="#00F0FF" stroke-width="4"/>
  <g transform="translate(128, 130) scale(1.1)">
    <!-- Top Face -->
    <polygon points="0,-60 52,-30 0,0 -52,-30" fill="#00F0FF" opacity="0.9"/>
    <!-- Left Face -->
    <polygon points="-52,-30 0,0 0,60 -52,30" fill="#102A45" stroke="#00F0FF" stroke-width="2"/>
    <!-- Right Face -->
    <polygon points="0,0 52,-30 52,30 0,60" fill="#FF0055" opacity="0.8"/>
  </g>
</svg>`,
      },
      {
        id: 'gt_icon_terminal_sys',
        name: 'Terminal System Core Icon',
        category: 'app_icon',
        themeId: 'glitch_tech',
        description: 'Terminal command prompt icon for engineering applications and backend backend tools.',
        tags: ['icon', 'terminal', 'code', 'dlinacre'],
        dimensions: '256x256',
        suggestedUsage: 'Folder Icon for raw_vector or production/shaders',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <rect width="256" height="256" rx="32" fill="#080C14" stroke="#00F0FF" stroke-width="4"/>
  <rect x="36" y="50" width="184" height="156" rx="12" fill="#121B2D" stroke="#334155" stroke-width="2"/>
  <path d="M 60 90 L 100 120 L 60 150" fill="none" stroke="#00F0FF" stroke-width="5" stroke-linecap="round"/>
  <line x1="115" y1="150" x2="160" y2="150" stroke="#FF0055" stroke-width="5" stroke-linecap="round"/>
</svg>`,
      },
      {
        id: 'gt_shield_security',
        name: 'Cyber Shield & Auth Vault Badge',
        category: 'app_icon',
        themeId: 'glitch_tech',
        description: 'Emblem badge for security, credentials, OAuth keys, and protected repository vaults.',
        tags: ['icon', 'shield', 'auth', 'security', 'vault'],
        dimensions: '256x256',
        suggestedUsage: 'Security Repositories, Environment Setup & Vault Modules',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <rect width="256" height="256" rx="32" fill="#070B14" stroke="#FF0055" stroke-width="4"/>
  <!-- Hex Pattern background -->
  <path d="M 128 32 L 196 64 L 196 140 C 196 186 128 220 128 220 C 128 220 60 186 60 140 L 60 64 Z" fill="#121B2D" stroke="#00F0FF" stroke-width="4"/>
  <!-- Lock Core -->
  <circle cx="128" cy="120" r="18" fill="#FF0055"/>
  <path d="M 128 138 L 128 165" stroke="#FF0055" stroke-width="6" stroke-linecap="round"/>
  <path d="M 116 108 C 116 95 140 95 140 108" fill="none" stroke="#00F0FF" stroke-width="4"/>
</svg>`,
      },
      {
        id: 'gt_radar_hud',
        name: 'Radar HUD Target Reticle Icon',
        category: 'game_icon',
        themeId: 'glitch_tech',
        description: 'Tactical Cyber HUD radar target icon for military or sci-fi game dev UI.',
        tags: ['icon', 'radar', 'hud', 'target', 'sci-fi'],
        dimensions: '256x256',
        suggestedUsage: 'HUD Crosshairs & Sci-Fi Game Engine Assets',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <rect width="256" height="256" rx="32" fill="#060911" stroke="#00F0FF" stroke-width="4"/>
  <circle cx="128" cy="128" r="70" fill="none" stroke="#00F0FF" stroke-width="2" stroke-dasharray="8,4"/>
  <circle cx="128" cy="128" r="45" fill="none" stroke="#FF0055" stroke-width="2"/>
  <circle cx="128" cy="128" r="8" fill="#00FF66"/>
  <line x1="128" y1="38" x2="128" y2="218" stroke="#00F0FF" stroke-width="2"/>
  <line x1="38" y1="128" x2="218" y2="128" stroke="#00F0FF" stroke-width="2"/>
</svg>`,
      },
      {
        id: 'gt_audio_synth',
        name: 'Glitch Synth Waveform Audio Icon',
        category: 'app_icon',
        themeId: 'glitch_tech',
        description: 'Equalizer audio wave frequency icon for music loops and sound effects.',
        tags: ['icon', 'audio', 'sound', 'synth', 'waveform'],
        dimensions: '256x256',
        suggestedUsage: 'Folder Icon for audio/sfx and audio/music',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <rect width="256" height="256" rx="32" fill="#0D061A" stroke="#FF0055" stroke-width="4"/>
  <g transform="translate(48, 80)">
    <rect x="0" y="30" width="16" height="40" rx="4" fill="#00F0FF"/>
    <rect x="26" y="10" width="16" height="80" rx="4" fill="#FF0055"/>
    <rect x="52" y="0" width="16" height="100" rx="4" fill="#00FF66"/>
    <rect x="78" y="20" width="16" height="60" rx="4" fill="#00F0FF"/>
    <rect x="104" y="5" width="16" height="90" rx="4" fill="#FF0055"/>
    <rect x="130" y="40" width="16" height="20" rx="4" fill="#FFCC00"/>
  </g>
</svg>`,
      },
      {
        id: 'gt_repo_banner_games',
        name: 'Game Repository Header Banner',
        category: 'banner',
        themeId: 'glitch_tech',
        description: 'Dedicated widescreen header for game repositories, 3D mechanics, and interactive builds.',
        tags: ['banner', 'game-dev', 'repo-header', 'lin4cre'],
        dimensions: '1200x400',
        suggestedUsage: 'Header image for individual game repositories',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
  <rect width="1200" height="400" fill="#0A0612"/>
  <path d="M 0 0 L 1200 400 M 1200 0 L 0 400" stroke="#FF0055" stroke-width="1" opacity="0.15"/>
  <rect x="60" y="60" width="1080" height="280" rx="16" fill="#140A24" stroke="#00F0FF" stroke-width="2"/>
  <text x="100" y="150" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="42" fill="#00F0FF">GAME_PROJECT // ENGINE CORE</text>
  <text x="100" y="195" font-family="'Space Grotesk', sans-serif" font-size="20" fill="#D8B4FE">3D Physics, Custom Shaders, Glitch Audio & Realtime Controls</text>
  <rect x="100" y="235" width="220" height="40" rx="8" fill="#FF0055"/>
  <text x="210" y="261" font-family="monospace" font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">LIN4CRE APPROVED</text>
</svg>`,
      },
      {
        id: 'gt_social_card',
        name: 'linacre.site Social OpenGraph Card',
        category: 'banner',
        themeId: 'glitch_tech',
        description: 'OpenGraph preview social image for linacre.site links shared on Twitter/GitHub/Discord.',
        tags: ['banner', 'social', 'opengraph', 'linacre.site'],
        dimensions: '1200x630',
        suggestedUsage: 'OpenGraph / Social Media Link Preview Image',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="100%" height="100%">
  <rect width="1200" height="630" fill="#060911"/>
  <circle cx="600" cy="315" r="280" fill="#00F0FF" opacity="0.06" filter="blur(30px)"/>
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="#0D1322" stroke="#FF0055" stroke-width="3"/>
  <text x="600" y="260" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="64" fill="#00F0FF" text-anchor="middle">LINACRE.SITE</text>
  <text x="600" y="320" font-family="'Space Grotesk', sans-serif" font-size="26" fill="#FFFFFF" text-anchor="middle">Official Game Dev & Engineering Asset Studio</text>
  <text x="600" y="370" font-family="monospace" font-size="18" fill="#FF0055" text-anchor="middle">@DLinacre // @LIN4CRE GitHub Repository Ecosystem</text>
  <rect x="420" y="420" width="360" height="50" rx="10" fill="#121B2D" stroke="#00F0FF" stroke-width="2"/>
  <text x="600" y="452" font-family="monospace" font-weight="bold" font-size="16" fill="#00F0FF" text-anchor="middle">🎨_FOLDER READY FOR DOWNLOAD</text>
</svg>`,
      },
    ],
  },
  {
    id: 'neon_circuit',
    title: 'Neon Circuit',
    subtitle: 'Futuristic Electric Blue, Glowing Traces & Hardware Aesthetic',
    description: 'Electric blue and ultraviolet neon circuitry on deep space void dark slate. Designed for hardware systems, compilers, and core engines.',
    primaryColor: '#00F0FF',
    accentColor: '#3B82F6',
    bgGradient: 'from-slate-950 via-blue-950 to-cyan-950',
    badgeTag: 'SYSTEMS & HARDWARE',
    assets: [
      {
        id: 'nc_logo',
        name: 'Neon Circuit Main Logo',
        category: 'logo',
        themeId: 'neon_circuit',
        description: 'High-voltage electric blue glowing logo with wireframe schematic styling.',
        tags: ['logo', 'circuit', 'electric', 'neon'],
        dimensions: '800x200',
        suggestedUsage: 'Hardware & System Web Headers',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#030712"/>
  <path d="M 100 100 L 250 100 L 290 140 L 700 140" stroke="#00F0FF" stroke-width="3" fill="none"/>
  <circle cx="100" cy="100" r="8" fill="#00F0FF"/>
  <circle cx="700" cy="140" r="8" fill="#3B82F6"/>
  <text x="120" y="85" font-family="'JetBrains Mono', monospace" font-weight="bold" font-size="42" fill="#00F0FF" letter-spacing="3">LINACRE // CIRCUIT</text>
</svg>`,
      },
    ],
  },
  {
    id: 'retro_pixel',
    title: 'Retro Pixel 8-Bit / 16-Bit',
    subtitle: 'Classic Arcade Nostalgia, Pixelated Grid & Pixel Hearts',
    description: 'Charming 8-bit and 16-bit blocky game art aesthetic inspired by early Nintendo and Genesis game consoles.',
    primaryColor: '#F43F5E',
    accentColor: '#F59E0B',
    bgGradient: 'from-zinc-900 via-stone-900 to-amber-950',
    badgeTag: 'RETRO GAMING',
    assets: [
      {
        id: 'rp_logo',
        name: '8-Bit Retro Pixel Logo',
        category: 'logo',
        themeId: 'retro_pixel',
        description: 'Blocky pixelated header rendering of Linacre.Site with 8-bit pixel heart.',
        tags: ['logo', 'pixel', '8bit', 'retro'],
        dimensions: '800x200',
        suggestedUsage: 'Retro Game Repositories',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#18181B"/>
  <text x="80" y="110" font-family="monospace" font-weight="900" font-size="44" fill="#F43F5E">LINACRE.SITE [8-BIT]</text>
  <!-- Pixel Heart -->
  <rect x="620" y="70" width="20" height="20" fill="#F43F5E"/>
  <rect x="640" y="70" width="20" height="20" fill="#F43F5E"/>
  <rect x="610" y="90" width="60" height="20" fill="#F43F5E"/>
  <rect x="620" y="110" width="40" height="20" fill="#F43F5E"/>
  <rect x="630" y="130" width="20" height="20" fill="#F43F5E"/>
</svg>`,
      },
    ],
  },
  {
    id: 'minimal_vector',
    title: 'Minimal Vector',
    subtitle: 'Sleek Corporate Tech, Pristine Typography & Subtle Gradients',
    description: 'Ultra-clean, modern tech startup identity with high contrast, precise vector geometries, and elegant negative space.',
    primaryColor: '#38BDF8',
    accentColor: '#6366F1',
    bgGradient: 'from-slate-900 via-slate-800 to-zinc-900',
    badgeTag: 'CLEAN & PROFESSIONAL',
    assets: [
      {
        id: 'mv_logo',
        name: 'Minimal Vector Intersect Logo',
        category: 'logo',
        themeId: 'minimal_vector',
        description: 'Clean vector L curves intersecting smoothly with crisp typography.',
        tags: ['logo', 'minimal', 'clean', 'corporate'],
        dimensions: '800x200',
        suggestedUsage: 'Main Documentation & Corporate Landing Pages',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#0F172A"/>
  <circle cx="120" cy="100" r="45" fill="none" stroke="#38BDF8" stroke-width="6"/>
  <circle cx="150" cy="100" r="45" fill="none" stroke="#6366F1" stroke-width="6"/>
  <text x="230" y="112" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="42" fill="#F8FAFC">linacre<tspan fill="#38BDF8">.site</tspan></text>
</svg>`,
      },
    ],
  },
  {
    id: 'sketch_hand',
    title: 'Sketch Hand-Drawn',
    subtitle: 'Creative Indie Studio, Ink Lines & Sketchbook Art',
    description: 'Warm, hand-drawn vector doodle aesthetic perfect for indie game jams, creative experiments, and conceptual notebooks.',
    primaryColor: '#F59E0B',
    accentColor: '#EC4899',
    bgGradient: 'from-amber-950 via-zinc-900 to-stone-900',
    badgeTag: 'INDIE CREATIVE',
    assets: [
      {
        id: 'sh_logo',
        name: 'Sketched Ink Logo',
        category: 'logo',
        themeId: 'sketch_hand',
        description: 'Ink scribbled text with cartoonish lightbulb idea spark.',
        tags: ['logo', 'sketch', 'hand-drawn', 'indie'],
        dimensions: '800x200',
        suggestedUsage: 'Creative Notebooks & Game Jam Repos',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#1C1917"/>
  <text x="100" y="115" font-family="cursive, sans-serif" font-size="46" fill="#F59E0B">linacre.site // sketch</text>
  <circle cx="620" cy="95" r="28" fill="none" stroke="#F59E0B" stroke-width="3" stroke-dasharray="6,3"/>
</svg>`,
      },
    ],
  },
  {
    id: 'flat_ui',
    title: 'Flat UI Modern OS',
    subtitle: 'Vibrant Colors, Smooth Rounded Corners & Friendly Visuals',
    description: 'Friendly, modern desktop app aesthetic with vibrant saturated colors and clean stacked geometry.',
    primaryColor: '#10B981',
    accentColor: '#3B82F6',
    bgGradient: 'from-slate-900 via-emerald-950 to-teal-950',
    badgeTag: 'MODERN DESKTOP APP',
    assets: [
      {
        id: 'fui_logo',
        name: 'Flat Stacked Cubes Logo',
        category: 'logo',
        themeId: 'flat_ui',
        description: 'Playful stacked building block icons next to friendly typography.',
        tags: ['logo', 'flat-ui', 'app', 'stacked'],
        dimensions: '800x200',
        suggestedUsage: 'Mobile & Web App Frontends',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#064E3B"/>
  <rect x="80" y="60" width="40" height="40" rx="8" fill="#10B981"/>
  <rect x="130" y="60" width="40" height="40" rx="8" fill="#3B82F6"/>
  <rect x="105" y="110" width="40" height="40" rx="8" fill="#F59E0B"/>
  <text x="210" y="115" font-family="sans-serif" font-weight="900" font-size="42" fill="#FFFFFF">LINACRE <tspan fill="#10B981">BUILD</tspan></text>
</svg>`,
      },
    ],
  },
  {
    id: 'material_tech',
    title: 'Material Tech Layered',
    subtitle: 'Paper Shadow Layering, Tactile Depth & Teal Accents',
    description: 'Layered sheet aesthetics inspired by material UI design with subtle drop shadows and tactile structural feel.',
    primaryColor: '#14B8A6',
    accentColor: '#0EA5E9',
    bgGradient: 'from-slate-950 via-teal-950 to-slate-900',
    badgeTag: 'LAYERED UI',
    assets: [
      {
        id: 'mt_logo',
        name: 'Material Layered Monogram Logo',
        category: 'logo',
        themeId: 'material_tech',
        description: 'Folded paper L monogram with teal and deep cyan layers.',
        tags: ['logo', 'material', 'layered', 'teal'],
        dimensions: '800x200',
        suggestedUsage: 'Developer Documentation Portals',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#0F172A"/>
  <polygon points="80,50 140,50 140,150 80,150" fill="#0EA5E9"/>
  <polygon points="120,110 200,110 200,150 120,150" fill="#14B8A6"/>
  <text x="230" y="115" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="42" fill="#F8FAFC">linacre.site</text>
</svg>`,
      },
    ],
  },
  {
    id: 'gradient_abstract',
    title: 'Gradient Abstract Fluid',
    subtitle: 'Vibrant Purple, Pink & Synth Orange Liquid Motion',
    description: 'Dynamic gradient fluid shapes merging into energetic curves representing creative flow and generative art.',
    primaryColor: '#A855F7',
    accentColor: '#EC4899',
    bgGradient: 'from-purple-950 via-fuchsia-950 to-slate-950',
    badgeTag: 'CREATIVE SYNTH',
    assets: [
      {
        id: 'ga_logo',
        name: 'Fluid Gradient Flow Logo',
        category: 'logo',
        themeId: 'gradient_abstract',
        description: 'Flowing purple/pink fluid shape carrying the Linacre brand name.',
        tags: ['logo', 'gradient', 'fluid', 'purple'],
        dimensions: '800x200',
        suggestedUsage: 'Soundtrack & Media Assets',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
  </defs>
  <rect width="800" height="200" fill="#0B0314"/>
  <path d="M 80 120 C 120 40, 180 160, 220 80" stroke="url(#grad1)" stroke-width="12" fill="none" stroke-linecap="round"/>
  <text x="260" y="112" font-family="sans-serif" font-weight="900" font-size="42" fill="#FFFFFF">LINACRE <tspan fill="#EC4899">FLUID</tspan></text>
</svg>`,
      },
    ],
  },
  {
    id: 'vaporwave',
    title: 'Vaporwave 80s Synthwave',
    subtitle: 'Glowing Neon Wireframe Sun, Grid Horizon & Chrome Fonts',
    description: '1980s retro-futurism with synthwave horizons, chrome reflection typography, and glowing pink/cyan wireframe suns.',
    primaryColor: '#F43F5E',
    accentColor: '#06B6D4',
    bgGradient: 'from-pink-950 via-purple-950 to-cyan-950',
    badgeTag: 'SYNTHWAVE 80S',
    assets: [
      {
        id: 'vw_logo',
        name: 'Vaporwave Chrome Sunset Logo',
        category: 'logo',
        themeId: 'vaporwave',
        description: '80s chrome text with striped geometric synthwave sun.',
        tags: ['logo', 'vaporwave', '80s', 'synthwave'],
        dimensions: '800x200',
        suggestedUsage: 'Game Soundtracks & Arcade Games',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#18042B"/>
  <circle cx="650" cy="100" r="50" fill="#F43F5E"/>
  <line x1="580" y1="90" x2="720" y2="90" stroke="#18042B" stroke-width="4"/>
  <line x1="580" y1="105" x2="720" y2="105" stroke="#18042B" stroke-width="6"/>
  <text x="80" y="115" font-family="monospace" font-weight="bold" font-size="44" fill="#06B6D4">RETRO_LINACRE</text>
</svg>`,
      },
    ],
  },
  {
    id: 'geometric_isometric',
    title: 'Geometric Isometric 3D',
    subtitle: 'Modular 3D Block Assembly, Precise Angles & Architecture',
    description: 'Structural 3D isometric perspectives mapping out modular game assets, code packages, and systems infrastructure.',
    primaryColor: '#0284C7',
    accentColor: '#10B981',
    bgGradient: 'from-slate-900 via-sky-950 to-emerald-950',
    badgeTag: 'MODULAR 3D',
    assets: [
      {
        id: 'gi_logo',
        name: 'Isometric 3D Modular Cube Logo',
        category: 'logo',
        themeId: 'geometric_isometric',
        description: '3D isometric block layout representing modular development.',
        tags: ['logo', 'isometric', '3d', 'modular'],
        dimensions: '800x200',
        suggestedUsage: 'System Engine Architecture Docs',
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="100%">
  <rect width="800" height="200" fill="#0B132B"/>
  <g transform="translate(110, 100)">
    <polygon points="0,-30 30,-15 0,0 -30,-15" fill="#0284C7"/>
    <polygon points="-30,-15 0,0 0,30 -30,15" fill="#1C2541"/>
    <polygon points="0,0 30,-15 30,15 0,30" fill="#10B981"/>
  </g>
  <text x="180" y="112" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="40" fill="#FFFFFF">MODULAR // LINACRE</text>
</svg>`,
      },
    ],
  },
];
