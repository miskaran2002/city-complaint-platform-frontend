// app/about/page.tsx
'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
        
        {/* Platform About Section */}
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            About The Platform
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#C026D3]">SmartCity</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            SmartCity is a modern, fully automated civic issue reporting and municipal service management platform. It bridges the gap between citizens looking for quick grievance redressal and city authorities managing municipal operations efficiently.
          </p>
        </div>

        {/* Meet the Developer Section */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C026D3] animate-pulse"></span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Meet The Developer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Developer Image Card */}
            <div className="relative h-72 md:h-80 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 shadow-md flex flex-col items-center justify-center p-2 text-center text-white">
              <img 
                src="/raihan.jpg" 
                alt="Md Raihan Uddin" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Developer Details & Bio */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">Md Raihan Uddin</h2>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
                  Department of Computer Science and Engineering, University of Barishal
                </p>
              </div>

              <blockquote className="p-4 rounded-xl bg-background border border-border text-gray-600 dark:text-gray-300 italic text-sm leading-relaxed">
                "I am a passionate Full-Stack Developer skilled in building highly scalable, secure web applications. I love solving complex algorithms and designing clean database relations."
              </blockquote>

              {/* Core Expertise Tags */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Core Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {['React.js', 'Next.js', 'Node.js', 'Express.js', 'TypeScript', 'JavaScript', 'MongoDB', 'PostgreSQL', 'Prisma ORM', 'Tailwind CSS'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-500/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connect Links */}
              <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="text-purple-600 font-bold">✉</span> raihanuddin.cse8.bu@gmail.com
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="text-purple-600 font-bold">📞</span> +8801608822137
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="text-purple-600 font-bold">🐙</span> github.com/miskaran2002
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="text-purple-600 font-bold">💼</span> linkedin.com/in/md-raihan-uddin-cse8
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}