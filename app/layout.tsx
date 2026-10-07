import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Providers } from '@/components/Providers';

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "City Complaint Platform",
  description: "Smart City Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#030014] text-gray-900 dark:text-white transition-colors duration-300`}
      >
        {/* 🔴 ThemeProvider দিয়ে অ্যাপ র‍্যাপ করা হয়েছে (ট্যাগের ভেতরে কমেন্ট রাখা সেফ) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <Providers>
              {children}
              <Toaster position="top-right" reverseOrder={false} />
            </Providers>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}