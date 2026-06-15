import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NoiseOverlay from "@/components/NoiseOverlay";
import FluidGoldCanvas from "@/components/FluidGoldCanvas";
import MidasTouch from "@/components/MidasTouch";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import StatsSection from "@/components/StatsSection";
import ServiceSections from "@/components/ServiceSections";
import HealthWellnessSection from "@/components/HealthWellnessSection";
import MembershipSection from "@/components/MembershipSection";
import Testimonials from "@/components/Testimonials";
import Marquee from "@/components/Marquee";
import PodcastVisualizer from "@/components/PodcastVisualizer";
import CommunityTeaser from "@/components/CommunityTeaser";
import TransformationSlider from "@/components/TransformationSlider";
import ConciergeButton from "@/components/ConciergeButton";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Footer from "@/components/Footer";
import GoldDivider from "@/components/GoldDivider";
import VaultLoader from "@/components/VaultLoader";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(() => {
    return sessionStorage.getItem("vault-opened") === "true";
  });

  return (
    <main className="relative bg-void min-h-screen overflow-x-hidden">
      {/* Vault Entrance Loader - Plays once per session */}
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <VaultLoader onComplete={() => setIsLoaded(true)} />
        )}
      </AnimatePresence>

      {/* Global SVG Filters for Liquid / Gooey effects */}
      <svg className="hidden w-0 h-0 absolute pointer-events-none">
        <defs>
          <filter id="gooey-gold">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Interactive WebGL Fluid Background */}
      <FluidGoldCanvas />

      {/* Noise Texture Overlay */}
      <NoiseOverlay />

      {/* Midas Touch interactive cursor & blood-gold clicks */}
      <MidasTouch />

      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Desktop Sticky Header */}
          <Navbar />

          {/* Floating Island Navigation (Mobile only now) */}
          <FloatingNav />

          {/* Hero Section - The Gate */}
          <Hero />

          <GoldDivider />

          {/* Bento Grid Hub - The Constellation */}
          <BentoGrid />

          {/* Stats Panel - Key Indicators */}
          <StatsSection />

          <GoldDivider />

          {/* Service Sections - Detailed Content */}
          <ServiceSections />

          <GoldDivider />

          {/* Marquee - Lookbook Infinito */}
          <Marquee />

          <GoldDivider />

          {/* Salud & Bienestar - Santuario de Bienestar */}
          <HealthWellnessSection />

          <GoldDivider />

          {/* Membership Section - The Altar */}
          <MembershipSection />

          <GoldDivider />

          {/* Testimonials - Proof of Ascension */}
          <Testimonials />

          <GoldDivider />

          {/* Podcast Visualizer - Live Signal */}
          <PodcastVisualizer />

          <GoldDivider />

          {/* Community Teaser - The Locker Room */}
          <CommunityTeaser />

          <GoldDivider />

          {/* Transformation Slider - The Mirror */}
          <TransformationSlider />

          <GoldDivider />

          {/* Footer - Base Operations */}
          <Footer />

          {/* Concierge FAB */}
          <ConciergeButton />

          {/* WhatsApp quick reserve */}
          <WhatsAppFloat />
        </motion.div>
      )}
    </main>
  );
};

export default Index;
