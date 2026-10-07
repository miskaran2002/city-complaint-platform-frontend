// components/landing/MissionSection.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const PARAGRAPH =
  'SmartCity turns complaints into action. Every report is routed to the right department, every status change is tracked, and every citizen stays informed until the issue is resolved.';

const steps = [
  { title: 'Report', text: 'Pick a category, add a photo and a location. It takes about a minute.' },
  { title: 'Route', text: 'The complaint goes straight to the department that owns the problem.' },
  { title: 'Resolve', text: 'Follow each status change and get notified when the work is done.' },
];

const stats = [
  { value: '12.4k', label: 'Issues reported' },
  { value: '9.8k', label: 'Issues resolved' },
  { value: '18', label: 'Departments' },
  { value: '48h', label: 'Average response' },
];

/* ---------- scroll e word by word jele otha paragraph ---------- */
function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.28em]">
      {word}
    </motion.span>
  );
}

function RevealParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="text-2xl md:text-3xl leading-snug font-light text-foreground">
      {words.map((w, i) => (
        <Word key={i} word={w} range={[i / words.length, (i + 1) / words.length]} progress={scrollYProgress} />
      ))}
    </p>
  );
}

/* ---------- hero r particle ring er-i choto version ---------- */
function ParticleRing() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    const colors = ['#a855f7', '#c026d3', '#e9d5ff', '#8B5CF6'];
    const ps = Array.from({ length: 1400 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.68 + Math.pow(Math.random(), 0.7) * 0.32,
      s: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.6 + 0.3,
      v: 0.85 + Math.random() * 0.3,
      ph: Math.random() * 6.28,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));

    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      t += 0.003;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.47;
      for (const p of ps) {
        const ang = p.a + t * p.v;
        const rr = R * p.r * (1 + 0.03 * Math.sin(t * 6 + p.ph));
        ctx.globalAlpha = p.o;
        ctx.fillStyle = p.c;
        ctx.fillRect(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * 0.95, p.s, p.s);
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

export default function MissionSection() {
  return (
    <section className="relative bg-background text-foreground overflow-hidden px-6 lg:px-8 py-28 md:py-36 transition-colors duration-300">
      
      {/* ambient glow */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-[#4C1D95]/20 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Top: heading + ring */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-6xl md:text-8xl font-light tracking-tight leading-[0.95] mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] via-[#C026D3] to-[#7E22CE] dark:from-purple-300 dark:to-white"
            >
              Beyond
              <br />
              bureaucracy
            </motion.h2>
            <div className="max-w-xl">
              <RevealParagraph text={PARAGRAPH} />
            </div>
          </div>

          <div className="relative mx-auto w-[300px] h-[300px] sm:w-[420px] sm:h-[420px]">
            <ParticleRing />
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600 dark:text-white drop-shadow-[0_0_18px_rgba(192,38,211,0.5)]">
                <path d="M12 0c.6 5.5 2.5 9.6 6 11.3C21.5 12.4 23 12 24 12c-1 0-2.5-.4-6 .7-3.5 1.7-5.4 5.8-6 11.3-.6-5.5-2.5-9.6-6-11.3C2.5 11.6 1 12 0 12c1 0 2.5.4 6-.7C9.5 9.6 11.4 5.5 12 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Middle: Report -> Route -> Resolve */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.12 }}
              className="rounded-3xl p-8 border border-border bg-card shadow-sm hover:shadow-lg transition-all"
            >
              <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-6 uppercase tracking-widest">Step {i + 1}</div>
              <h3 className="text-3xl font-light tracking-tight mb-4 text-foreground">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">{s.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom: stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-border">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-light tracking-tight text-foreground">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}