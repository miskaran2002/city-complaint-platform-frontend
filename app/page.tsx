// app/page.tsx

import FeatureStackSection from '@/components/landing/FeatureStackSection';
import GallerySection from '@/components/landing/GallerySection';
import HeroSection from '@/components/landing/HeroSection';

import MissionSection from '@/components/landing/MissionSection';
import ShowcaseSection from '@/components/landing/ShowcaseSection';
import Footer from '@/components/shared/Footer';
import { Navbar } from '@/components/shared/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-clip">
      {/* Background Decorative Blobs  */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Navigation Bar */}
      <Navbar />
      

      {/* Hero Section */}
      <HeroSection/>

      <div className="relative z-10 bg-background rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.12)]">
  <MissionSection/>
      <GallerySection/>
      <ShowcaseSection/>
      <FeatureStackSection/>
      <Footer/>
</div>
      
      
     

    </div>
  );
}