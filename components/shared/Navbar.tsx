// components/shared/Navbar.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Departments', href: '/departments' },
  { label: 'Categories', href: '/category' },
  { label: 'About Us', href: '/about' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const linkBase =
  'px-4 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors';
const linkActive = 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400';

const mobileLinkBase =
  'block px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors';

const gradientBtn =
  'bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white rounded-full font-bold shadow-md';

/* ---------- Theme toggle (desktop + mobile same button) ---------- */
function ThemeToggle({ iconClass }: { iconClass: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-100 dark:bg-card/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-card/20 transition-all focus:outline-none"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state: any) => state.clearAuth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // page bodlale mobile menu bondho hoye jabe
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (clearAuth) {
      clearAuth();
    } else {
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    }
    localStorage.removeItem('city_auth_token');
    localStorage.removeItem('user');

    toast.success('Logout successful!');
    router.push('/login');
  };

  const getDashboardLink = (role?: string) => {
    switch (role) {
      case 'CITIZEN': return '/citizen/dashboard';
      case 'TECHNICIAN': return '/technician/dashboard';
      case 'DEPARTMENT_STAFF': return '/staff/dashboard';
      case 'DEPARTMENT_MANAGER': return '/manager/dashboard';
      case 'CITY_ADMIN': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  const dashboardLink = getDashboardLink(user?.role);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));
  const legalActive = legalLinks.some((l) => isActive(l.href));

  return (
    <header data-site-navbar className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-5xl flex items-center justify-between gap-4 px-6 py-3 bg-card/90 dark:bg-[#0A0515]/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-border text-gray-800 dark:text-gray-200 text-sm font-medium transition-colors duration-300">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C026D3] animate-pulse"></span>
          <Link
            href="/"
            className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-[#C026D3] dark:from-purple-400 dark:to-[#C026D3]"
          >
            SmartCity.
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 font-semibold text-gray-600 dark:text-gray-300">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={`${linkBase} ${isActive(l.href) ? linkActive : ''}`}>
              {l.label}
            </Link>
          ))}

          {/* Legal dropdown: Privacy Policy + Terms of Service */}
          <div className="relative group">
            <button
              type="button"
              aria-haspopup="menu"
              className={`${linkBase} inline-flex items-center gap-1 focus:outline-none ${legalActive ? linkActive : ''}`}
            >
              Legal
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* pt-3 diye gap ta hover er moddhe rakha hoyeche, jate mouse niche nambar somoy menu bondho na hoy */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-200">
              <div className="w-48 p-2 bg-card/95 dark:bg-[#0A0515]/95 backdrop-blur-xl border border-gray-100 dark:border-border rounded-2xl shadow-2xl">
                {legalLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`block px-4 py-2 rounded-xl whitespace-nowrap hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
                      isActive(l.href) ? linkActive : ''
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Action Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          {isMounted && <ThemeToggle iconClass="w-4 h-4" />}

          {isMounted && user ? (
            <>
              <button
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-bold px-3 py-1.5 transition-colors cursor-pointer text-sm"
              >
                Logout
              </button>
              <Link
                href={dashboardLink}
                className={`${gradientBtn} px-5 py-2 hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm`}
              >
                Dashboard
              </Link>
            </>
          ) : (
            isMounted && (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-bold px-3 py-1.5 transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={`${gradientBtn} px-5 py-2 hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm`}
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Buttons (Theme + Hamburger) */}
        <div className="flex md:hidden items-center gap-2">
          {isMounted && <ThemeToggle iconClass="w-5 h-5" />}

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            className="p-2 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-20 inset-x-4 max-h-[75vh] overflow-y-auto bg-card/95 dark:bg-[#0A0515]/95 backdrop-blur-xl border border-gray-100 dark:border-border rounded-3xl px-6 py-6 space-y-3 shadow-2xl md:hidden z-50 transition-colors duration-300">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setIsOpen(false)}
              className={`${mobileLinkBase} ${isActive(l.href) ? linkActive : ''}`}
            >
              {l.label}
            </Link>
          ))}

          {/* Legal links */}
          <div className="pt-3 border-t border-gray-100 dark:border-border space-y-1">
            <div className="px-4 pb-1 text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500">Legal</div>
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className={`${mobileLinkBase} ${isActive(l.href) ? linkActive : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-border flex flex-col space-y-3">
            {isMounted && user ? (
              <>
                <Link
                  href={dashboardLink}
                  onClick={() => setIsOpen(false)}
                  className={`text-center ${gradientBtn} px-6 py-2.5`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-center w-full text-red-600 dark:text-red-400 font-bold py-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              isMounted && (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-bold py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className={`text-center ${gradientBtn} px-6 py-2.5`}
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};