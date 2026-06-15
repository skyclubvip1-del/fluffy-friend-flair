import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { ArrowDown, Sparkles } from "lucide-react";

// Generate stable star positions
const generateStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3.5 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3.5 + 1.5,
    });
  }
  return stars;
};

// Generate stable shooting stars
const generateShootingStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 40 + 5,
      delay: Math.random() * 4 + 0.5,
      duration: Math.random() * 0.9 + 0.6,
    });
  }
  return stars;
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const stars = useMemo(() => generateStars(140), []);
  const shootingStars = useMemo(() => generateShootingStars(7), []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-300, 300], [6, -6]);
  const rotateY = useTransform(x, [-300, 300], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);

    // Dynamic metallic lighting reflection direction based on cursor
    const lightEl = document.getElementById("specular-light");
    if (lightEl) {
      const xPercent = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      const azimuth = Math.atan2(-yPercent, xPercent) * (180 / Math.PI);
      const normalizedAzimuth = azimuth < 0 ? azimuth + 360 : azimuth;
      lightEl.setAttribute("azimuth", normalizedAzimuth.toFixed(1));
      
      const dist = Math.sqrt(xPercent * xPercent + yPercent * yPercent);
      const elevation = 30 + (1 - Math.min(dist, 1)) * 30;
      lightEl.setAttribute("elevation", elevation.toFixed(1));
    }
  };

  // Magnetic button effect
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonX = useMotionValue(0);
  const buttonY = useMotionValue(0);
  const buttonSpringX = useSpring(buttonX, { damping: 15, stiffness: 150 });
  const buttonSpringY = useSpring(buttonY, { damping: 15, stiffness: 150 });

  const handleButtonMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    buttonX.set((e.clientX - centerX) * 0.35);
    buttonY.set((e.clientY - centerY) * 0.35);
  };

  const handleButtonMouseLeave = () => {
    buttonX.set(0);
    buttonY.set(0);
    setIsButtonHovered(false);
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-void"
    >
      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-void" />

      {/* Starfield */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            animate={{ opacity: [0.1, 0.9, 0.1] }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-gold-base/50"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shootingStars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ x: "-100px", y: "-100px", opacity: 0 }}
            animate={{
              x: ["0px", "400px"],
              y: ["0px", "400px"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 12 + 8,
              ease: "easeOut",
            }}
            className="absolute w-[120px] h-[1px] bg-gradient-to-r from-transparent via-gold-base to-white rotate-[45deg]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
          />
        ))}
      </div>

      {/* Animated Storm Clouds Effect */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(25, 25, 25, 0.8) 0%, transparent 50%),
              radial-gradient(ellipse 60% 30% at 20% 20%, rgba(35, 35, 35, 0.6) 0%, transparent 40%),
              radial-gradient(ellipse 55% 25% at 80% 30%, rgba(30, 30, 30, 0.5) 0%, transparent 35%)
            `,
            animation: "pulse 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Golden Light Ray */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[70%] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 0%, hsl(45 82% 54% / 0.15) 0%, transparent 75%)",
        }}
      />

      {/* Subtle Gradient Orb */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.06, 0.1, 0.06],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(45 82% 54% / 0.22) 0%, transparent 65%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        {/* Micro Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-base/50">
            // EST. 2024 — GLOBAL ELEVATION NETWORK
          </span>
        </motion.div>

        {/* Main Headline with 3D Parallax */}
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          className="relative group inline-block"
        >
          {/* Hot molten golden glow core */}
          <div className="absolute inset-0 w-[140%] h-[140%] -left-[20%] -top-[20%] bg-gold-base/15 blur-[90px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
          
          {/* Sparkling Midas Stars */}
          <motion.div 
            animate={{ y: [0, -12, 0], scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-12 -left-12 text-gold-base pointer-events-none hidden sm:block"
          >
            <Sparkles className="w-7 h-7 animate-pulse shadow-[0_0_15px_rgba(212,163,89,0.5)]" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 12, 0], scale: [1.2, 1, 1.2], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            className="absolute -bottom-8 -right-12 text-gold-base pointer-events-none hidden sm:block"
          >
            <Sparkles className="w-6 h-6 animate-pulse shadow-[0_0_15px_rgba(212,163,89,0.5)]" />
          </motion.div>

          <motion.div 
            animate={{ x: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute top-12 -right-16 text-gold-base/70 pointer-events-none hidden sm:block"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative font-display font-bold text-gold-midas tracking-tight animate-neon-flicker animate-glitch metallic-gold"
            style={{ fontSize: "clamp(3.5rem, 11vw, 9.5rem)", lineHeight: 0.85, letterSpacing: "-0.04em" }}
          >
            SKY
            <br />
            <span className="relative inline-block text-gold-midas">
              CLUB
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-2 left-0 w-full h-[2.5px] bg-gradient-to-r from-gold-base/30 via-white to-gold-base/30 origin-left shadow-[0_0_8px_rgba(212,163,89,0.5)]"
              />
            </span>
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-8 font-display font-semibold text-2xl md:text-3xl tracking-[0.2em] uppercase text-gold-light"
          style={{ textShadow: "0 2px 15px rgba(212,163,89,0.35)" }}
        >
          Sky is the limit
        </motion.p>

        {/* Gandhi Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-6 font-body italic text-base md:text-lg text-white/50 max-w-lg mx-auto leading-relaxed"
        >
          "La forma más rápida de cambiar tu vida es cambiar lo que haces todos los días."
          <span className="block mt-2.5 not-italic font-mono text-xs uppercase tracking-[0.25em] text-white/30">
            — Mahatma Gandhi
          </span>
        </motion.p>

        {/* CTA Button - Magnetic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12"
          onMouseMove={handleButtonMouseMove}
          onMouseLeave={handleButtonMouseLeave}
          onMouseEnter={() => setIsButtonHovered(true)}
        >
          <motion.button
            ref={buttonRef}
            style={{ x: buttonSpringX, y: buttonSpringY }}
            onClick={() => document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' })}
            className={`
              relative px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-widest
              border transition-all duration-500 overflow-hidden cursor-pointer
              ${isButtonHovered
                ? 'bg-gold-base text-void border-gold-base shadow-[0_0_20px_rgba(212,163,89,0.6)] scale-[1.04]'
                : 'bg-transparent text-gold-light border-gold-base/35 hover:border-gold-base/60'
              }
            `}
          >
            {/* Shimmer Effect */}
            {isButtonHovered && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            )}
            <span className="relative z-10 flex items-center gap-3">
              Iniciar Ascenso
              <ArrowDown className={`w-4 h-4 transition-transform duration-300 ${isButtonHovered ? 'translate-y-0.5' : 'rotate-[-45deg]'}`} />
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold-light/40">
          Deslizar
        </span>
        <div className="w-6 h-10 rounded-full border border-gold-base/30 flex justify-center p-1.5 backdrop-blur-sm shadow-[0_0_12px_rgba(212,163,89,0.15)]">
          <motion.div
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 rounded-full bg-gold-base shadow-[0_0_6px_#d4a359]"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
