// Web Audio Theme Tune Synthesizer & Infinite Prompt Generator

export interface ThemeTuneTrack {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  notes: number[]; // Frequencies in Hz
  durations: number[]; // Duration multiplier
  waveType: OscillatorType;
}

// Retro Pentatonic & Minor Scales in Hz for Cyber Synth Tunes
const N = {
  C3: 130.81,
  D3: 146.83,
  Eb3: 155.56,
  F3: 174.61,
  Gb3: 185.00,
  G3: 196.00,
  Ab3: 207.65,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  Eb4: 311.13,
  F4: 349.23,
  G4: 392.00,
  Ab4: 415.30,
  Bb4: 466.16,
  C5: 523.25,
  D5: 587.33,
  Eb5: 622.25,
  F5: 698.46,
  G5: 783.99,
  Bb5: 932.33,
};

export class ThemeTunePlayer {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTimeout: number | null = null;
  private noteIndex: number = 0;
  private track: ThemeTuneTrack;
  private volume: number = 0.15;

  constructor(track?: ThemeTuneTrack) {
    this.track = track || THEME_TUNE_TRACKS[0];
  }

  public setTrack(track: ThemeTuneTrack) {
    this.track = track;
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public play() {
    if (this.isPlaying) return;
    
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.noteIndex = 0;
    this.step();
  }

  private step = () => {
    if (!this.isPlaying || !this.audioCtx) return;

    const freq = this.track.notes[this.noteIndex % this.track.notes.length];
    const durMult = this.track.durations[this.noteIndex % this.track.durations.length] || 1;
    const stepDuration = (60 / this.track.bpm) * durMult;

    if (freq > 0) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = this.track.waveType;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Cyber Envelope: fast attack, quick decay
      gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume, this.audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + stepDuration * 0.9);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + stepDuration);
    }

    this.noteIndex++;
    this.currentTimeout = window.setTimeout(this.step, stepDuration * 1000);
  };

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout !== null) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const THEME_TUNE_TRACKS: ThemeTuneTrack[] = [
  {
    id: 'cyber_pulse',
    name: 'Cyber Pulse Arpeggiator',
    genre: 'Cyberpunk Synth',
    bpm: 135,
    waveType: 'sawtooth',
    notes: [N.C4, N.Eb4, N.G4, N.C5, N.Bb4, N.G4, N.Eb4, N.C4, N.F4, N.Ab4, N.C5, N.F5, N.Eb5, N.C5, N.Ab4, N.F4],
    durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  },
  {
    id: 'matrix_grid',
    name: 'Matrix Chiptune Drive',
    genre: '8-Bit Retro',
    bpm: 145,
    waveType: 'square',
    notes: [N.C3, N.C4, N.G3, N.C4, N.Eb3, N.Eb4, N.Bb3, N.Eb4, N.F3, N.F4, N.C4, N.F4, N.G3, N.G4, N.D4, N.G4],
    durations: [0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35],
  },
  {
    id: 'volcanic_bass',
    name: 'Volcanic Dark Synth',
    genre: 'Darksynth',
    bpm: 120,
    waveType: 'sawtooth',
    notes: [N.C3, N.C3, N.Eb3, N.C3, N.F3, N.C3, N.Gb3, N.F3, N.C3, N.C3, N.Bb3, N.C3, N.Ab3, N.G3, N.F3, N.Eb3],
    durations: [0.75, 0.25, 0.5, 0.5, 0.5, 0.25, 0.25, 0.5, 0.75, 0.25, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  },
  {
    id: 'synth_horizon',
    name: 'Synthwave Neon Glide',
    genre: 'Outrun Wave',
    bpm: 115,
    waveType: 'triangle',
    notes: [N.C4, N.G4, N.Eb4, N.Bb4, N.F4, N.C5, N.G4, N.D5, N.C4, N.Ab4, N.Eb4, N.Bb4, N.G4, N.Eb5, N.C5, N.G4],
    durations: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
];

// --- INFINITE RANDOM PROMPT GENERATOR ---

const ADJECTIVES = [
  'High-contrast', 'Ultra-minimalist', 'Glitch-heavy', 'Stealth black', 'Hyper-luminescent',
  'Vector-sharp', 'Arcade-style 8-bit', 'Zero-trust', 'Low-latency', 'Neon-soaked',
  'Terminal-inspired', 'Cyber-military', 'Holographic', 'Quantum-encrypted', 'Darksynth',
  'Industrial cyberpunk', 'Retro-futuristic', 'Binary-distorted', 'Chromatic-aberrated'
];

const SUBJECTS = [
  'HUD interface overlay', 'developer repository banner', 'open-source project asset',
  'command-line tool branding', 'WebGL shader catalog', 'cryptographic vault badge',
  'synthwave game engine header', 'micro-framework logo', 'real-time telemetry monitor',
  'cyber-deck avatar frame', 'system architecture card', 'package registry graphic'
];

const VISUAL_EFFECTS = [
  'with glowing cyan scanlines and matrix particles',
  'featuring volcanic red accents and circuit trace geometry',
  'with toxic green terminal glyphs and CRT noise',
  'with electric gold neon outlines and speed vectors',
  'featuring ultra-blue glowing nodes and high-tech typography',
  'with stealth white wireframes and high-contrast negative space',
  'with purple synthwave gradient glow and retro grid lines'
];

const DIRECTIVES = [
  'Focus on punchy short titles and high-tech status codes.',
  'Emphasize low-level performance, C++/Rust vibe, and zero bloat.',
  'Highlight community star rating, developer handle, and version tag.',
  'Inject a subtle 90s hacker aesthetic with terminal prompt styling.',
  'Keep typography bold, wide-tracked, and HUD-optimized for dark mode.',
  'Optimize for GitHub README header presentation and instant readability.'
];

export function generateInfiniteRandomPrompt(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const subj = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const fx = VISUAL_EFFECTS[Math.floor(Math.random() * VISUAL_EFFECTS.length)];
  const dir = DIRECTIVES[Math.floor(Math.random() * DIRECTIVES.length)];
  
  return `${adj} ${subj} ${fx}. ${dir}`;
}
