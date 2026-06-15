import NoiseOverlay from "@/components/NoiseOverlay";
import FluidGoldCanvas from "@/components/FluidGoldCanvas";
import MidasTouch from "@/components/MidasTouch";
import FloatingNav from "@/components/FloatingNav";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
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

const Index = () => {
  return (
    <main className="relative bg-void min-h-screen overflow-x-hidden">
      {/* Interactive WebGL Fluid Background */}
      <FluidGoldCanvas />

      {/* Noise Texture Overlay */}
      <NoiseOverlay />

      {/* Midas Touch interactive cursor & blood-gold clicks */}
      <MidasTouch />

      {/* Floating Island Navigation */}
      <FloatingNav />

      {/* Hero Section - The Gate */}
      <Hero />

      {/* Bento Grid Hub - The Constellation */}
      <BentoGrid />

      {/* Service Sections - Detailed Content */}
      <ServiceSections />

      {/* Marquee - Lookbook Infinito */}
      <Marquee />

      {/* Salud & Bienestar - Santuario de Bienestar */}
      <HealthWellnessSection />

      {/* Membership Section - The Altar */}
      <MembershipSection />

      {/* Testimonials - Proof of Ascension */}
      <Testimonials />

      {/* Podcast Visualizer - Live Signal */}
      <PodcastVisualizer />

      {/* Community Teaser - The Locker Room */}
      <CommunityTeaser />

      {/* Transformation Slider - The Mirror */}
      <TransformationSlider />

      {/* Footer - Base Operations */}
      <Footer />

      {/* Concierge FAB */}
      <ConciergeButton />

      {/* WhatsApp quick reserve */}
      <WhatsAppFloat />
    </main>
  );
};

export default Index;
