'use client';
import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

const COLORS = [
  'rgba(106, 169, 255, 1)',
  'rgba(143, 192, 255, 1)',
  'rgba(200, 224, 255, 1)',
  'rgba(207, 205, 197, 1)',
  'rgba(160, 160, 165, 1)',
  'rgba(120, 120, 128, 1)',
];

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    let running = true;
    let raf = 0;

    const burst = (x?: number, y?: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = x ?? w * (0.15 + Math.random() * 0.7);
      const cy = y ?? h * (0.18 + Math.random() * 0.4);
      const count = 46 + Math.floor(Math.random() * 32);
      const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25;
        const speed = 1.6 + Math.random() * 3.8;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 70 + Math.random() * 50,
          color: Math.random() < 0.65 ? baseColor : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1.6 + Math.random() * 2.2,
        });
      }
    };

    const schedule = [0, 280, 620, 980, 1300, 1720, 2100, 2520, 2900, 3400, 3900];
    const timeouts = schedule.map((t) =>
      setTimeout(() => {
        if (running) burst();
      }, t),
    );

    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.055;
        p.vx *= 0.992;
        p.vy *= 0.992;
        const t = p.life / p.maxLife;
        const alpha = Math.max(0, 1 - t) * (t < 0.1 ? t * 10 : 1);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life > p.maxLife) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const stopTimeout = setTimeout(() => {
      const drainer = () => {
        if (particles.length === 0) {
          running = false;
          cancelAnimationFrame(raf);
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        } else {
          setTimeout(drainer, 200);
        }
      };
      drainer();
    }, 4400);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      timeouts.forEach(clearTimeout);
      clearTimeout(stopTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />;
}
