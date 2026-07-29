import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Zap, MousePointer, Activity } from 'lucide-react';

interface InteractiveNoiseOverlayProps {
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  enabled?: boolean;
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  maxRadius: number;
  id: number;
}

export const InteractiveNoiseOverlay: React.FC<InteractiveNoiseOverlayProps> = ({
  intensity = 60,
  primaryColor = '#00f0ff',
  secondaryColor = '#ff0055',
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const ripplesRef = useRef<ClickRipple[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: ClickRipple = {
      x,
      y,
      radius: 5,
      opacity: 1.0,
      maxRadius: Math.max(rect.width, rect.height) * 0.7,
      id: Date.now() + Math.random(),
    };

    ripplesRef.current.push(newRipple);
    setClickCount((prev) => prev + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    // Procedural Noise Animation Loop
    let time = 0;

    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, width, height);

      if (!enabled) return;

      const normMouseX = mousePos.x * width;
      const normMouseY = mousePos.y * height;
      const grainFactor = (intensity / 100) * 0.35;

      // Render Noise Grain Overlay
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      // Downsample noise rendering for smooth 60fps performance
      const step = 4;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const dx = x - normMouseX;
          const dy = y - normMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseProximity = Math.max(0, 1 - dist / 220);

          // Calculate interactive noise amplitude
          const noiseVal = (Math.random() - 0.5) * 255 * (grainFactor + mouseProximity * 0.4);

          // Apply chromatic shift based on mouse position
          const r = Math.min(255, Math.max(0, 120 + noiseVal + (isHovering ? mouseProximity * 80 : 0)));
          const g = Math.min(255, Math.max(0, 50 + noiseVal * 0.5));
          const b = Math.min(255, Math.max(0, 200 + noiseVal + (isHovering ? mouseProximity * 100 : 0)));
          const alpha = Math.min(180, Math.max(10, (0.08 + grainFactor * 0.15 + mouseProximity * 0.12) * 255));

          for (let sy = 0; sy < step && y + sy < height; sy++) {
            for (let sx = 0; sx < step && x + sx < width; sx++) {
              const pixelIdx = ((y + sy) * width + (x + sx)) * 4;
              data[pixelIdx] = r;
              data[pixelIdx + 1] = g;
              data[pixelIdx + 2] = b;
              data[pixelIdx + 3] = alpha;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Render Mouse Hover Spotlight Reticle
      if (isHovering) {
        const grad = ctx.createRadialGradient(
          normMouseX,
          normMouseY,
          5,
          normMouseX,
          normMouseY,
          140
        );
        grad.addColorStop(0, `${primaryColor}66`);
        grad.addColorStop(0.5, `${secondaryColor}33`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(normMouseX, normMouseY, 140, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair reticle lines
        ctx.strokeStyle = `${primaryColor}aa`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(normMouseX - 15, normMouseY);
        ctx.lineTo(normMouseX + 15, normMouseY);
        ctx.moveTo(normMouseX, normMouseY - 15);
        ctx.lineTo(normMouseX, normMouseY + 15);
        ctx.stroke();

        ctx.strokeStyle = `${secondaryColor}88`;
        ctx.beginPath();
        ctx.arc(normMouseX, normMouseY, 20 + Math.sin(time * 4) * 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Render Click Glitch Ripples Shockwave Rings
      ripplesRef.current.forEach((r, idx) => {
        r.radius += 8;
        r.opacity *= 0.93;

        ctx.save();
        ctx.strokeStyle = idx % 2 === 0 ? primaryColor : secondaryColor;
        ctx.lineWidth = 3 * r.opacity;
        ctx.globalAlpha = r.opacity;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Glitch line artifacts radiating outward
        const numSpikes = 8;
        for (let i = 0; i < numSpikes; i++) {
          const angle = (i / numSpikes) * Math.PI * 2 + time;
          const sx = r.x + Math.cos(angle) * (r.radius - 10);
          const sy = r.y + Math.sin(angle) * (r.radius - 10);
          const ex = r.x + Math.cos(angle) * (r.radius + 15);
          const ey = r.y + Math.sin(angle) * (r.radius + 15);

          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Filter out expired ripples
      ripplesRef.current = ripplesRef.current.filter((r) => r.opacity > 0.03 && r.radius < r.maxRadius);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enabled, intensity, mousePos, isHovering, primaryColor, secondaryColor]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="absolute inset-0 pointer-events-auto cursor-crosshair z-20 select-none overflow-hidden rounded-2xl"
      title="Dynamic Noise Overlay: Move cursor to shift grain warp • Click canvas to trigger glitch shockwave pulse"
    >
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />

      {/* Floating Dynamic HUD Status Badge */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-gray-950/90 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
          <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>NOISE OVERLAY {enabled ? 'ACTIVE' : 'OFF'}</span>
          <span className="text-gray-400 font-normal">
            ({Math.round(mousePos.x * 100)}%, {Math.round(mousePos.y * 100)}%)
          </span>
        </span>

        {clickCount > 0 && (
          <span className="px-2 py-1 rounded-lg bg-pink-950/90 text-pink-300 border border-pink-500/50 text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg backdrop-blur-md animate-bounce">
            <Zap className="w-3 h-3 text-pink-400 fill-current" />
            <span>PULSES: {clickCount}</span>
          </span>
        )}
      </div>

      {/* Mouse hint indicator overlay when hovering */}
      {!isHovering && (
        <div className="absolute bottom-3 right-3 z-30 pointer-events-none px-2.5 py-1 rounded-lg bg-slate-950/80 text-gray-400 border border-slate-700 text-[10px] font-mono flex items-center gap-1">
          <MousePointer className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>Move mouse / Click for Glitch Reactivity</span>
        </div>
      )}
    </div>
  );
};
