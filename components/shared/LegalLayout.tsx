// components/shared/LegalLayout.tsx
import React from 'react';
import Link from 'next/link';

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  after?: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  other: { label: string; href: string };
};

export default function LegalLayout({ eyebrow, title, intro, updated, sections, other }: Props) {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[420px] rounded-full bg-[#4C1D95]/15 dark:bg-[#4C1D95]/30 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] rounded-full bg-[#C026D3]/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-40 pb-28">
        {/* Header */}
        <header className="max-w-3xl mb-16 md:mb-20">
          <span className="inline-block px-3 py-1.5 rounded-full text-xs text-purple-700 dark:text-purple-200 bg-purple-500/10 dark:bg-white/10 border border-purple-500/30 dark:border-white/15 backdrop-blur mb-6 font-medium">
            {eyebrow}
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[0.98] mb-6 bg-gradient-to-r from-[#4C1D95] via-[#C026D3] to-purple-600 dark:from-purple-200 dark:via-white dark:to-fuchsia-200 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-white/60 leading-relaxed font-medium">{intro}</p>
          <p className="mt-6 text-sm text-gray-500 dark:text-white/40">Last updated: {updated}</p>
        </header>

        <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-20">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <nav className="sticky top-32 rounded-3xl border border-border bg-card backdrop-blur-xl p-6 shadow-sm">
              <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-white/40 mb-4 font-bold">On this page</div>
              <ul className="space-y-3 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-3 text-gray-600 dark:text-white/60 hover:text-purple-600 dark:hover:text-fuchsia-300 transition-colors font-medium">
                      <span className="text-gray-400 dark:text-white/30 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="max-w-3xl space-y-14">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-32">
                <div className="flex items-baseline gap-4 mb-5">
                  <span className="text-sm text-purple-600 dark:text-purple-300 tabular-nums font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">{s.title}</h2>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-white/70 leading-relaxed font-medium">
                  {s.paragraphs?.map((p, k) => <p key={k}>{p}</p>)}
                  {s.list && (
                    <ul className="space-y-2.5">
                      {s.list.map((item, k) => (
                        <li key={k} className="flex gap-3">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-fuchsia-500 dark:bg-fuchsia-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.after?.map((p, k) => <p key={`a${k}`}>{p}</p>)}
                </div>
              </section>
            ))}

            {/* Bottom links */}
            <div className="pt-10 border-t border-border flex flex-col sm:flex-row gap-4 justify-between">
              <Link
                href={other.href}
                className="px-6 py-3 rounded-full text-center font-semibold border border-border bg-card hover:bg-purple-50 dark:hover:bg-white/10 transition-colors text-foreground"
              >
                {other.label}
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-full text-center font-bold bg-gradient-to-r from-[#4C1D95] to-[#C026D3] text-white shadow-[0_0_25px_rgba(192,38,211,0.35)] hover:-translate-y-1 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}