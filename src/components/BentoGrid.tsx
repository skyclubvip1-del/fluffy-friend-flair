import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, useRef } from "react";

interface BentoCardProps {
  title: string;
  subtitle: string;
  image: string;
  className?: string;
  delay?: number;
  scrollTo?: string;
  externalLink?: string;
}

const BentoCard = ({ title, subtitle, image, className = "", delay = 0, scrollTo, externalLink }: BentoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Mouse tracking glow position
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${xPos}px`);
    cardRef.current.style.setProperty("--mouse-y", `${yPos}px`);

    // 3D Tilt calculation
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    window.dispatchEvent(
      new CustomEvent("play-audio-chime", { 
        detail: { freq: 440 + Math.random() * 200, isDeep: false } 
      })
    );
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    if (externalLink) {
      window.open(externalLink, "_blank", "noopener,noreferrer");
    } else if (scrollTo) {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={`group relative bg-void border border-gold-base/20 rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-700 hover:shadow-[0_25px_70px_rgba(212,163,89,0.3)] min-h-[220px] border-beam ${className} preserve-3d`}
    >
      {/* Diagonal hatching pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          opacity: 0.02,
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 20px)",
        }}
      />
      {/* Gold scanner line on hover */}
      <div
        className={`absolute left-0 right-0 h-[1px] pointer-events-none z-[15] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,163,89,0.6), rgba(255,223,150,0.8), rgba(212,163,89,0.6), transparent)",
          boxShadow: "0 0 8px rgba(212,163,89,0.4), 0 0 20px rgba(212,163,89,0.2)",
          animation: isHovered ? "scanLine 2.5s ease-in-out infinite" : "none",
        }}
      />
      <style>{`@keyframes scanLine { 0%, 100% { top: 0%; } 50% { top: 100%; } }`}</style>
      {/* Intense Midas Gold Glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          background: "radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 163, 89, 0.18) 0%, transparent 60%)"
        }}
      />

      {/* Background Image */}
      <div className="absolute inset-0 transition-all duration-700 ease-out z-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className={`
            w-full h-full object-cover transition-all duration-700 ease-out
            ${isHovered ? 'opacity-90 scale-[1.12] rotate-[1.5deg]' : 'opacity-60 scale-100 rotate-0'}
          `}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
      </div>

      {/* Content */}
      <div 
        className="relative z-20 h-full p-6 md:p-8 flex flex-col justify-end min-h-[200px] preserve-3d" 
        style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
      >
        <div 
          className="transition-transform duration-500 preserve-3d"
          style={{ transform: isHovered ? "translateZ(25px)" : "translateZ(0px)" }}
        >
          <h3 className="font-display font-bold text-heading-3 text-white mb-1.5 transition-colors duration-300 group-hover:text-gold-base" style={{ textShadow: isHovered ? "0 0 10px rgba(212,163,89,0.35)" : "none" }}>
            {title}
          </h3>
          <p className="font-body text-xs md:text-sm text-gold-light/65 tracking-wide font-medium">{subtitle}</p>
        </div>

        {/* Arrow Button */}
        <div 
          className="absolute bottom-6 right-6 md:bottom-8 md:right-8 transition-transform duration-500"
          style={{ transform: isHovered ? "translateZ(40px)" : "translateZ(0px)" }}
        >
          <div className="w-10 h-10 rounded-full border border-gold-base/40 bg-gold-base/5 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:bg-gold-gradient group-hover:border-gold-base group-hover:shadow-[0_0_20px_rgba(212,163,89,0.5)]">
            <ArrowUpRight className="w-4.5 h-4.5 text-gold-base transition-colors duration-500 group-hover:text-void" />
          </div>
        </div>
      </div>

      {/* Hover Border Light - Gold Frame */}
      <div
        className={`
          absolute inset-0 rounded-2xl border pointer-events-none transition-all duration-500 z-30
          ${isHovered ? 'border-gold-base/50' : 'border-transparent'}
        `}
      />
    </motion.div>
  );
};

const AudioWave = () => (
  <div className="audio-wave ml-3">
    {[...Array(5)].map((_, i) => (
      <span key={i} className="bg-gold-base shadow-[0_0_5px_rgba(212,163,89,0.5)]" />
    ))}
  </div>
);

const BentoGrid = () => {
  const podcastCardRef = useRef<HTMLDivElement>(null);
  const [isPodcastHovered, setIsPodcastHovered] = useState(false);

  const podcastMouseX = useMotionValue(0);
  const podcastMouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const podcastRotateX = useSpring(useTransform(podcastMouseY, [-100, 100], [7, -7]), springConfig);
  const podcastRotateY = useSpring(useTransform(podcastMouseX, [-100, 100], [-7, 7]), springConfig);

  const handlePodcastMouseMove = (e: React.MouseEvent) => {
    if (!podcastCardRef.current) return;
    const rect = podcastCardRef.current.getBoundingClientRect();
    
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    podcastCardRef.current.style.setProperty("--mouse-x", `${xPos}px`);
    podcastCardRef.current.style.setProperty("--mouse-y", `${yPos}px`);

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    podcastMouseX.set(e.clientX - centerX);
    podcastMouseY.set(e.clientY - centerY);
  };

  const handlePodcastMouseLeave = () => {
    setIsPodcastHovered(false);
    podcastMouseX.set(0);
    podcastMouseY.set(0);
  };

  return (
    <section id="vision" className="relative py-24 md:py-32 px-6 bg-void">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-base/60">
            // THE CONSTELLATION
          </span>
          <h2 className="font-display font-bold text-heading-1 text-gold-midas mt-4">
            Tu Universo de Elevación
          </h2>
          <p className="font-body text-white/40 mt-4 max-w-md mx-auto">
            Explora cada pilar de tu transformación. Haz clic para descubrir más.
          </p>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:auto-rows-[180px]">
        {/* Barbershop - Large */}
        <BentoCard
          title="LA BARBERÍA"
          subtitle="Rituales de Acero"
          image="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80"
          className="md:col-span-2 md:row-span-2"
          delay={0}
          scrollTo="barberia"
        />

        {/* Library */}
        <BentoCard
          title="LIBRERÍA"
          subtitle="Arquitectura Mental"
          image="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80"
          className="md:col-span-1 md:row-span-1"
          delay={0.1}
          scrollTo="libreria"
        />

        {/* Tienda */}
        <BentoCard
          title="TIENDA"
          subtitle="Estilo & Exclusividad"
          image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
          className="md:col-span-1 md:row-span-2"
          delay={0.2}
          scrollTo="tienda"
        />

        {/* Podcast with Audio Wave */}
        <motion.div
          ref={podcastCardRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onMouseMove={handlePodcastMouseMove}
          onMouseEnter={() => {
            setIsPodcastHovered(true);
            window.dispatchEvent(
              new CustomEvent("play-audio-chime", { 
                detail: { freq: 500, isDeep: false } 
              })
            );
          }}
          onMouseLeave={handlePodcastMouseLeave}
          onClick={() => document.getElementById('podcast-section')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            rotateX: podcastRotateX,
            rotateY: podcastRotateY,
            transformPerspective: 1000,
            transformStyle: "preserve-3d",
          }}
          className="group relative bg-void border border-gold-base/20 rounded-2xl overflow-hidden cursor-pointer md:col-span-1 md:row-span-2 hover:shadow-[0_25px_70px_rgba(212,163,89,0.3)] transition-shadow duration-700 border-beam"
        >
          {/* Diagonal hatching pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              opacity: 0.02,
              backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 20px)",
            }}
          />
          {/* Gold scanner line on hover */}
          <div
            className={`absolute left-0 right-0 h-[1px] pointer-events-none z-[15] transition-opacity duration-300 ${isPodcastHovered ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,163,89,0.6), rgba(255,223,150,0.8), rgba(212,163,89,0.6), transparent)",
              boxShadow: "0 0 8px rgba(212,163,89,0.4), 0 0 20px rgba(212,163,89,0.2)",
              animation: isPodcastHovered ? "scanLine 2.5s ease-in-out infinite" : "none",
            }}
          />
          {/* Glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
            style={{
              background: "radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 163, 89, 0.18) 0%, transparent 60%)"
            }}
          />

          <div className="absolute inset-0 transition-all duration-700 z-0">
            <img
              src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80"
              alt="Podcast"
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                isPodcastHovered ? 'opacity-90 scale-[1.12] rotate-[1.5deg]' : 'opacity-60 scale-100 rotate-0'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
          </div>
          <div 
            className="relative z-20 h-full p-6 md:p-8 flex flex-col justify-end preserve-3d" 
            style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
          >
            <div 
              className="transition-transform duration-500 preserve-3d"
              style={{ transform: isPodcastHovered ? "translateZ(25px)" : "translateZ(0px)" }}
            >
              <div className="flex items-center">
                <h3 className="font-display font-bold text-heading-3 text-white transition-colors duration-300 group-hover:text-gold-base" style={{ textShadow: isPodcastHovered ? "0 0 10px rgba(212,163,89,0.3)" : "none" }}>PODCAST</h3>
                <AudioWave />
              </div>
              <p className="font-body text-xs md:text-sm text-gold-light/65 mt-1 tracking-wide font-medium">Frecuencia Élite</p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold-base/50 pointer-events-none transition-all duration-500 z-30" />
        </motion.div>

        {/* Health & Wellness - Wide */}
        <BentoCard
          title="SALUD & BIENESTAR"
          subtitle="Santuario de Bienestar"
          image="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
          className="md:col-span-2 md:row-span-1"
          delay={0.5}
          scrollTo="bienestar"
        />
      </div>
    </section>
  );
};

export default BentoGrid;
