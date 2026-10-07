// components/landing/HeroSection.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import Link from 'next/link';

const images = [
  { title: 'Smart Traffic', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=800&auto=format&fit=crop' },
  { title: 'City Skyline', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop' },
  { title: 'Digital Infrastructure', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop' },
  { title: 'Urban Planning', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop' },
  { title: 'Civic Services', image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=800&auto=format&fit=crop' },
];

const total = images.length + 1; // 0 = title card
const angleStep = 360 / total;
const radius = 360;

const Sparkle = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
    <path d="M12 0c.6 5.5 2.5 9.6 6 11.3C21.5 12.4 23 12 24 12c-1 0-2.5-.4-6 .7-3.5 1.7-5.4 5.8-6 11.3-.6-5.5-2.5-9.6-6-11.3C2.5 11.6 1 12 0 12c1 0 2.5.4 6-.7C9.5 9.6 11.4 5.5 12 0z" />
  </svg>
);

/* ---------- Stage 3: particle ring (canvas) ---------- */
function ParticleRing({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#a855f7', '#c026d3', '#e9d5ff', '#ffffff'];
    const ps = Array.from({ length: 1800 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.7 + Math.pow(Math.random(), 0.7) * 0.3,
      s: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.6 + 0.3,
      v: 0.85 + Math.random() * 0.3,
      ph: Math.random() * 6.28,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));

    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!activeRef.current) return; // stage dekha na gele CPU khay na
      t += 0.003;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.46;
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
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [covered, setCovered] = useState(true); // cover page active?
  const stickyRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef({ top: 140, left: 0, w: 260, h: 360 });

  // 3D ring er samner card ta thik kothay boshbe seta measure kori (cover oikhane shrink hobe)
  useEffect(() => {
    const measure = () => {
      const a = anchorRef.current;
      const s = stickyRef.current;
      if (!a || !s) return;
      const ar = a.getBoundingClientRect();
      const sr = s.getBoundingClientRect();
      rectRef.current = { top: ar.top - sr.top, left: ar.left - sr.left, w: ar.width, h: ar.height };
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });

  useMotionValueEvent(p, 'change', (v) => {
    setStage(v < 0.43 ? 0 : v < 0.71 ? 1 : 2);
    setCovered(v < 0.09);
  });

  // Hero pin thakar somoy navbar hide hobe (html e data-hero-pinned set kore, CSS e hide kora hoy)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const pinned = v > 0.035 && v < 0.965;
    document.documentElement.toggleAttribute('data-hero-pinned', pinned);
  });
  useEffect(() => {
    return () => document.documentElement.removeAttribute('data-hero-pinned');
  }, []);

  /*
    Scroll timeline
    0.00 - 0.40  Stage 1: 3D carousel (title card -> ring ghure -> abar title card)
    0.40 - 0.48  transition 1 -> 2
    0.48 - 0.68  Stage 2: "Complaints that get resolved" panel
    0.68 - 0.76  transition 2 -> 3
    0.76 - 1.00  Stage 3: particle ring + final card (shesh e fixed, tarpor next section)
  */

  // Stage 1
  const l1Opacity = useTransform(p, [0.4, 0.46], [1, 0]);
  const l1Scale = useTransform(p, [0.4, 0.46], [1, 0.92]);
  const ringRotate = useTransform(p, [0, 0.1, 0.34, 0.4], [0, 0, -360, -360]);
  const ringTilt = useTransform(p, [0, 0.1, 0.2, 0.34, 0.4], [0, 0, -8, 0, 0]);
  const marqueeX = useTransform(p, [0, 0.4], [0, -1400]);
  const ctaOpacity = useTransform(p, [0, 0.07, 0.1, 0.14, 0.3, 0.36], [0, 0, 1, 0.1, 0.1, 1]);
  const hintOpacity = useTransform(p, [0, 0.02], [1, 0]);

  // Cover page -> card morph (0.02 - 0.09)
  const k = useTransform(p, (v) => {
    const x = Math.min(Math.max((v - 0.02) / 0.07, 0), 1);
    return x * x * (3 - 2 * x);
  });
  const viewW = () => stickyRef.current?.clientWidth ?? (typeof window === 'undefined' ? 1440 : window.innerWidth);
  const viewH = () => stickyRef.current?.clientHeight ?? (typeof window === 'undefined' ? 800 : window.innerHeight);
  const coverTop = useTransform(k, (x) => x * rectRef.current.top);
  const coverLeft = useTransform(k, (x) => x * rectRef.current.left);
  const coverW = useTransform(k, (x) => viewW() + (rectRef.current.w - viewW()) * x);
  const coverH = useTransform(k, (x) => viewH() + (rectRef.current.h - viewH()) * x);
  const coverRadius = useTransform(k, (x) => x * 32);
  const coverH1 = useTransform(k, (x) => {
    const big = Math.min(viewW() * 0.09, 140);
    return big + (36 - big) * x;
  });
  const coverLH = useTransform(k, (x) => 1.02 + 0.23 * x);
  const coverPSize = useTransform(k, (x) => 20 - 6 * x);
  const coverSparkle = useTransform(k, (x) => 2.4 - 1.4 * x);
  const coverPadT = useTransform(k, (x) => 120 - 96 * x);
  const coverPadX = useTransform(k, (x) => 56 - 32 * x);
  const coverPadB = useTransform(k, (x) => 56 - 32 * x);
  const coverBtnH = useTransform(p, [0, 0.045], [84, 0]);
  const coverBtnOpacity = useTransform(p, [0, 0.035], [1, 0]);
  const coverOpacity = useTransform(p, [0.085, 0.096], [1, 0]);
  const ringFade = useTransform(p, [0.05, 0.095], [0, 1]);

  // Stage 2
  const l2Opacity = useTransform(p, [0.4, 0.47, 0.67, 0.73], [0, 1, 1, 0]);
  const l2Y = useTransform(p, [0.4, 0.48], [80, 0]);
  const line2Opacity = useTransform(p, [0.48, 0.58], [0.25, 0.9]);
  const line2X = useTransform(p, [0.48, 0.6], [-40, 0]);
  const tiltCardRotate = useTransform(p, [0.48, 0.68], [-5, 4]);
  const tiltCardY = useTransform(p, [0.48, 0.68], [30, -30]);

  // Stage 3
  const l3Opacity = useTransform(p, [0.67, 0.75], [0, 1]);
  const everyX = useTransform(p, [0.7, 0.82], [-220, 0]);
  const voiceX = useTransform(p, [0.7, 0.82], [220, 0]);
  const mattersY = useTransform(p, [0.74, 0.88], [120, 0]);
  const mattersOpacity = useTransform(p, [0.74, 0.88], [0, 0.55]);
  const finalCardOpacity = useTransform(p, [0.78, 0.88], [0, 1]);
  const finalCardScale = useTransform(p, [0.78, 0.88], [0.8, 1]);

  const layer = (n: number) => ({ pointerEvents: stage === n ? ('auto' as const) : ('none' as const) });

  return (
    <section
      ref={sectionRef}
      className="relative z-0 h-[900vh] bg-background text-foreground overflow-x-clip"
      // next section 100vh upore uthe ese hero r upor diye cover korbe
      style={{ marginBottom: '-100vh' }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
        {/* ================= STAGE 1: 3D carousel ================= */}
        <motion.div
          style={{ opacity: l1Opacity, scale: l1Scale, ...layer(0) }}
          className="absolute inset-0 flex flex-col items-center justify-center pt-24 pb-6 bg-background"
        >
          <motion.div style={{ opacity: ringFade }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 w-full overflow-hidden whitespace-nowrap pointer-events-none select-none opacity-[0.07]">
            <motion.div style={{ x: marqueeX }} className="flex gap-12 text-8xl md:text-[10rem] font-black tracking-tight">
              <span>YOUR CITY • YOUR VOICE • SMART BARISHAL • REPORT • TRACK • RESOLVE •</span>
              <span>YOUR CITY • YOUR VOICE • SMART BARISHAL • REPORT • TRACK • RESOLVE •</span>
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#4C1D95]/25 blur-[140px] pointer-events-none" />
          </motion.div>

          <motion.div
            className="relative z-10 flex items-center justify-center w-full h-[380px] sm:h-[400px] scale-[0.8] sm:scale-95 lg:scale-100"
            style={{ perspective: '1400px', opacity: ringFade }}
          >
            {/* invisible anchor: cover eikhane shrink hoye ashbe */}
            <div ref={anchorRef} className="invisible absolute w-[260px] h-[360px] pointer-events-none" />
            <div
              className="relative w-[260px] h-[360px]"
              style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${radius}px)` }}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d', rotateY: ringRotate, rotateX: ringTilt }}
              >
                <div
                  className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col justify-between p-6 text-white"
                  style={{
                    transform: `rotateY(0deg) translateZ(${radius}px)`,
                    backfaceVisibility: 'hidden',
                    background: 'radial-gradient(circle at 50% 25%, #c4b5fd 0%, #7c3aed 45%, #4C1D95 100%)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 font-medium">
                      Smart Barishal
                    </span>
                    <span className="opacity-80">citypulse</span>
                  </div>
                  <div className="flex justify-center">
                    <Sparkle />
                  </div>
                  <div>
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
                      Your City,<br />Your Voice
                    </h1>
                    <p className="mt-2 text-sm text-white/80">
                      Report civic issues, track resolutions, build a better city.
                    </p>
                  </div>
                </div>

                {images.map((item, i) => (
                  <div
                    key={item.title}
                    className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-card"
                    style={{
                      transform: `rotateY(${(i + 1) * angleStep}deg) translateZ(${radius}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                      <span className="text-white font-bold text-xl tracking-wide">{item.title}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: ctaOpacity }}
            className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 mt-5 mb-4 px-6"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#4C1D95] to-[#C026D3] text-white font-bold shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_35px_rgba(192,38,211,0.6)] transition-all duration-300 hover:-translate-y-1 text-center"
            >
              Get Started
            </Link>
            <Link
              href="/category"
              className="w-full sm:w-auto px-7 py-3 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-200 font-bold backdrop-blur-md hover:bg-purple-500/20 transition-all duration-300 hover:-translate-y-1 text-center"
            >
              Report an Issue
            </Link>
          </motion.div>

          {/* ===== COVER PAGE: shuru te full-screen, scroll korle card hoye ring er moddhe dhuke jay ===== */}
          <motion.div
            suppressHydrationWarning
            style={{
              top: coverTop,
              left: coverLeft,
              width: coverW,
              height: coverH,
              borderRadius: coverRadius,
              opacity: coverOpacity,
              pointerEvents: covered ? 'auto' : 'none',
              background: 'radial-gradient(circle at 50% 25%, #c4b5fd 0%, #7c3aed 45%, #4C1D95 100%)',
            }}
            className="absolute z-30 overflow-hidden text-white shadow-2xl"
          >
            <motion.div
              suppressHydrationWarning
              style={{ paddingTop: coverPadT, paddingBottom: coverPadB, paddingLeft: coverPadX, paddingRight: coverPadX }}
              className="h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 font-medium">
                  Smart Barishal
                </span>
                <span className="opacity-80">citypulse</span>
              </div>

              <motion.div style={{ scale: coverSparkle }} className="self-center">
                <Sparkle />
              </motion.div>

              <div>
                <motion.h1
                  suppressHydrationWarning
                  style={{ fontSize: coverH1, lineHeight: coverLH }}
                  className="font-extrabold tracking-tight"
                >
                  Your City,<br />Your Voice
                </motion.h1>
                <motion.p suppressHydrationWarning style={{ fontSize: coverPSize }} className="mt-2 text-white/80 max-w-xl">
                  Report civic issues, track resolutions, build a better city.
                </motion.p>
                <motion.div suppressHydrationWarning style={{ height: coverBtnH, opacity: coverBtnOpacity }} className="overflow-hidden">
                  <div className="flex flex-wrap gap-4 pt-6">
                    <Link
                      href="/login"
                      className="px-7 py-3 rounded-full bg-white text-[#4C1D95] font-bold hover:-translate-y-1 transition-transform"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/category"
                      className="px-7 py-3 rounded-full border border-white/40 bg-white/10 font-bold backdrop-blur-md hover:bg-white/20 transition-colors"
                    >
                      Report an Issue
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: hintOpacity }}
              className="absolute bottom-3 right-6 text-[10px] text-white/70 tracking-widest uppercase"
            >
              Scroll ↓
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================= STAGE 2: purple panel + tilted card ================= */}
        <motion.div
          style={{ opacity: l2Opacity, y: l2Y, ...layer(1) }}
          className="absolute inset-0 p-3 sm:p-4 pt-24"
        >
          <div
            className="relative w-full h-full rounded-[2rem] overflow-hidden text-white"
            style={{
              background:
                'radial-gradient(ellipse at 50% 120%, #a855f7 0%, #5b21b6 28%, #2e1065 55%, #0f0524 100%)',
            }}
          >
            {/* heading */}
            <div className="absolute top-6 left-6 sm:left-10 z-20 leading-[0.95] tracking-tight font-light text-5xl sm:text-7xl lg:text-8xl">
              <div>Complaints that</div>
              <motion.div style={{ opacity: line2Opacity, x: line2X }} className="text-white/60">
                get resolved
              </motion.div>
            </div>

            {/* tilted image card */}
            <motion.div
              style={{ rotate: tiltCardRotate, y: tiltCardY }}
              className="absolute z-10 left-1/2 top-[18%] -translate-x-1/2 w-[46%] max-w-[340px] min-w-[220px] aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/10"
            >
              <img
                src={images[1].image}
                alt="City skyline at night"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e0a45]/80 via-[#4c1d95]/20 to-transparent" />
            </motion.div>

            {/* left bottom: copy + buttons */}
            <div className="absolute z-20 left-6 sm:left-10 bottom-24 max-w-xs sm:max-w-sm">
              <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                Report a broken road, a leaking pipe or a dark street. Follow every report until the
                right department closes it, with updates at each step.
              </p>
              <div className="flex gap-3 mt-5">
                <Link
                  href="/category"
                  className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  Browse categories
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-white text-[#2e1065] text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Report an issue
                </Link>
              </div>
            </div>

            {/* bottom strip */}
            <div className="absolute z-20 left-6 right-6 sm:left-10 sm:right-10 bottom-6 pt-4 border-t border-white/15 flex items-center justify-between gap-6">
              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 pl-2 pr-4 py-1.5 backdrop-blur">
                <div className="flex -space-x-2">
                  {['A', 'R', 'S', 'M'].map((c, i) => (
                    <span
                      key={c}
                      className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-semibold border border-[#2e1065]"
                      style={{ background: ['#c026d3', '#7c3aed', '#6366f1', '#a855f7'][i] }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium">Trusted by 4000+ citizens</span>
              </div>
              <p className="hidden md:block text-xs text-white/65 text-right max-w-xs">
                Every report is routed to the right department and tracked until it is resolved.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= STAGE 3: particle ring + final card ================= */}
        <motion.div
          style={{ opacity: l3Opacity, ...layer(2) }}
          className="absolute inset-0 bg-black text-white overflow-hidden"
        >
          <ParticleRing active={stage === 2} />

          <motion.div
            style={{ x: everyX }}
            className="absolute top-20 left-4 sm:left-8 text-6xl sm:text-8xl lg:text-9xl font-light tracking-tight bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent"
          >
            Every
          </motion.div>
          <motion.div
            style={{ x: voiceX }}
            className="absolute top-[52%] right-4 sm:right-10 text-6xl sm:text-8xl lg:text-9xl font-light tracking-tight"
          >
            voice
          </motion.div>
          <motion.div
            style={{ y: mattersY, opacity: mattersOpacity }}
            className="absolute bottom-6 right-[18%] text-6xl sm:text-8xl lg:text-9xl font-light tracking-tight blur-[3px]"
          >
            counts
          </motion.div>

          <div className="absolute left-4 sm:left-8 bottom-8 max-w-xs sm:max-w-sm text-sm sm:text-base text-white/60 leading-relaxed space-y-3">
            <p>
              SmartCity connects citizens with the departments that run the city. Report an issue in a
              minute and watch it move from received to resolved.
            </p>
            <p>One platform for every ward, every department and every complaint.</p>
          </div>

          {/* Final card (city complaint platform) */}
          <motion.div
            style={{ opacity: finalCardOpacity, scale: finalCardScale }}
            className="absolute inset-0 grid place-items-center pointer-events-none"
          >
            <div className="pointer-events-auto w-[250px] sm:w-[270px] rounded-3xl p-5 border border-white/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_0_60px_rgba(168,85,247,0.35)]">
              <div className="flex justify-center mb-3">
                <Sparkle size={34} />
              </div>
              <h2 className="text-center text-2xl font-extrabold leading-tight tracking-tight">
                Your City,<br />Your Voice
              </h2>
              <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="rounded-xl bg-white/10 py-2">
                  <div className="text-lg font-bold">12.4k</div>
                  <div className="text-[11px] text-white/60">Reported</div>
                </div>
                <div className="rounded-xl bg-white/10 py-2">
                  <div className="text-lg font-bold">9.8k</div>
                  <div className="text-[11px] text-white/60">Resolved</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  href="/login"
                  className="py-2.5 rounded-full text-center text-sm font-bold bg-gradient-to-r from-[#4C1D95] to-[#C026D3] hover:shadow-[0_0_25px_rgba(192,38,211,0.6)] transition-shadow"
                >
                  Get Started
                </Link>
                <Link
                  href="/category"
                  className="py-2.5 rounded-full text-center text-sm font-semibold border border-white/25 hover:bg-white/10 transition-colors"
                >
                  Report an Issue
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}