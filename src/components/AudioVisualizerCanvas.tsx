import React, { useRef, useEffect, useState } from 'react';
import { ThemeTunePlayer } from '../utils/themeTuneSynth';
import { Activity, Radio, Waves, Sparkles, Sliders } from 'lucide-react';

interface AudioVisualizerCanvasProps {
  player: ThemeTunePlayer | null;
  isPlaying: boolean;
  accentColor?: string;
  trackTitle?: string;
}

export const AudioVisualizerCanvas: React.FC<AudioVisualizerCanvasProps> = ({
  player,
  isPlaying,
  accentColor = '#06b6d4',
  trackTitle = 'Cyber Synth Loop',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [vizMode, setVizMode] = useState<'spectrum' | 'oscilloscope' | 'particles'>('spectrum');
  const animFrameIdRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fftSize = 64;
    const freqData = new Uint8Array(fftSize / 2);
    const waveData = new Uint8Array(fftSize);

    const render = () => {
      phaseRef.current += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with deep dark background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle cyber grid lines in background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      const gridStep = 20;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (player && isPlaying) {
        player.getFrequencyData(freqData);
        player.getWaveformData(waveData);
      }

      if (vizMode === 'spectrum') {
        // --- MODE 1: CYBERPUNK FREQUENCY SPECTRUM EQUALIZER BARS ---
        const numBars = 32;
        const barWidth = (width / numBars) - 3;
        const centerY = height - 15;

        for (let i = 0; i < numBars; i++) {
          let val = isPlaying ? freqData[i] || 0 : 0;
          
          // Fallback ambient wave when idle/loading
          if (!isPlaying || val === 0) {
            val = Math.sin(phaseRef.current + i * 0.3) * 20 + 25 + Math.cos(phaseRef.current * 0.5 + i * 0.2) * 15;
          }

          const barHeight = Math.max(4, (val / 255) * (height - 30));
          const x = i * (barWidth + 3) + 4;
          const y = centerY - barHeight;

          // Multi-color Cyber Gradient
          const grad = ctx.createLinearGradient(0, centerY, 0, y);
          grad.addColorStop(0, '#06b6d4'); // Cyan base
          grad.addColorStop(0.5, '#3b82f6'); // Cobalt
          grad.addColorStop(1, '#ec4899'); // Pink peak

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
          ctx.fill();

          // Peak glow cap dot
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, Math.max(5, y - 3), barWidth, 2);

          // Subtle reflection below baseline
          const reflectionGrad = ctx.createLinearGradient(0, centerY, 0, centerY + barHeight * 0.3);
          reflectionGrad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
          reflectionGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
          ctx.fillStyle = reflectionGrad;
          ctx.fillRect(x, centerY + 2, barWidth, barHeight * 0.3);
        }
      } else if (vizMode === 'oscilloscope') {
        // --- MODE 2: NEON CYBER OSCILLOSCOPE WAVE ---
        ctx.lineWidth = 2.5;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.5, '#a855f7');
        grad.addColorStop(1, '#ec4899');
        ctx.strokeStyle = grad;

        ctx.beginPath();
        const sliceWidth = width / (waveData.length || 1);
        let x = 0;

        for (let i = 0; i < waveData.length; i++) {
          let v = isPlaying ? waveData[i] / 128.0 : 1.0;
          if (!isPlaying) {
            v = 1.0 + Math.sin(phaseRef.current * 2 + i * 0.2) * 0.2;
          }
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Glow effect line
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // --- MODE 3: CYBER PARTICLE PULSE CIRCLE ---
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = 35;
        
        let avgFreq = 0;
        if (isPlaying) {
          let sum = 0;
          for (let i = 0; i < freqData.length; i++) sum += freqData[i];
          avgFreq = sum / (freqData.length || 1);
        } else {
          avgFreq = (Math.sin(phaseRef.current * 1.5) + 1) * 30;
        }

        const pulseRadius = baseRadius + (avgFreq / 255) * 25;

        // Outer Neon Ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner Core Ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
        ctx.fill();

        // Orbiting particles
        const numParticles = 12;
        for (let p = 0; p < numParticles; p++) {
          const angle = phaseRef.current + (p * (Math.PI * 2)) / numParticles;
          const px = centerX + Math.cos(angle) * (pulseRadius + 15);
          const py = centerY + Math.sin(angle) * (pulseRadius + 15);

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p % 2 === 0 ? '#38bdf8' : '#f43f5e';
          ctx.fill();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [player, isPlaying, vizMode]);

  return (
    <div className="bg-gray-950 border border-cyan-500/30 rounded-xl p-3 space-y-2 relative overflow-hidden shadow-xl animate-fadeIn">
      {/* Visualizer Top Bar Header */}
      <div className="flex items-center justify-between text-[11px] font-mono border-b border-gray-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-white">DYNAMIC AUDIO SPECTRUM VISUALIZER</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            {isPlaying ? 'LIVE FFT RUNNING' : 'AMBIENT STANDBY'}
          </span>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => setVizMode('spectrum')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              vizMode === 'spectrum' ? 'bg-cyan-500 text-slate-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            Bars
          </button>
          <button
            type="button"
            onClick={() => setVizMode('oscilloscope')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              vizMode === 'oscilloscope' ? 'bg-cyan-500 text-slate-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            Wave
          </button>
          <button
            type="button"
            onClick={() => setVizMode('particles')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              vizMode === 'particles' ? 'bg-cyan-500 text-slate-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pulse
          </button>
        </div>
      </div>

      {/* HTML5 Canvas Surface */}
      <canvas
        ref={canvasRef}
        width={700}
        height={130}
        className="w-full h-[130px] rounded-lg border border-gray-900 bg-gray-950 block"
      />
    </div>
  );
};
