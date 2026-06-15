import { motion } from "framer-motion";
import { Home, Crown, Eye, Mic, Users, Scissors, MapPin, Heart, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

const navItems = [
  { icon: Home, label: "Inicio", href: "#home" },
  { icon: Eye, label: "Visión", href: "#vision" },
  { icon: Scissors, label: "Servicios", href: "#barberia" },
  { icon: Heart, label: "Bienestar", href: "#bienestar" },
  { icon: Crown, label: "Membresía", href: "#membership" },
  { icon: Mic, label: "Podcast", href: "#podcast-section" },
  { icon: Users, label: "Comunidad", href: "#community" },
  { icon: MapPin, label: "Contacto", href: "#footer" },
];

const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState("home");
  const { isPlaying, toggle } = useAmbientAudio();

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggleSound = () => {
    toggle();
    // Play a start/stop chime directly
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("play-audio-chime", { 
          detail: { freq: isPlaying ? 330 : 660, isDeep: true } 
        })
      );
    }, 50);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
    >
      <motion.div
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="backdrop-blur-2xl bg-[#0d0a06]/85 border border-gold-base/35 rounded-full px-3 py-2 flex items-center gap-0.5 shadow-[0_8px_32px_rgba(212,163,89,0.25)] hover:border-gold-base/50 transition-colors duration-500"
      >
        {navItems.map((item, index) => {
          const isActive = activeSection === item.href.replace("#", "");
          return (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              onMouseEnter={() => {
                // Play an ascending scale of crystal chimes for menu sweep
                window.dispatchEvent(
                  new CustomEvent("play-audio-chime", { 
                    detail: { freq: 520 + index * 65, isDeep: false } 
                  })
                );
              }}
              whileHover={{ 
                scale: 1.25, 
                y: -5,
                rotate: [0, -6, 6, 0],
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.08 }}
              className={`group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${isActive ? "bg-gold-base/20 shadow-[0_0_12px_rgba(212,163,89,0.35)]" : "hover:bg-white/5"
                }`}
            >
              <item.icon
                className={`w-4.5 h-4.5 transition-colors duration-300 ${isActive ? "text-gold-base filter drop-shadow-[0_0_8px_rgba(212,163,89,0.85)]" : "text-gold-light/70 group-hover:text-gold-base"
                  }`}
              />
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-gold-base shadow-[0_0_8px_#d4a359]"
                  transition={{ 
                    scale: {
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut"
                    },
                    layout: {
                      type: "spring",
                      stiffness: 450,
                      damping: 25
                    }
                  }}
                  animate={{ scale: [1, 1.4, 1] }}
                />
              )}
              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-void-deep/95 backdrop-blur-xl border border-gold-base/20 text-[9px] font-mono uppercase tracking-[0.15em] text-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-md">
                {item.label}
              </span>
            </motion.a>
          );
        })}

        {/* Divider between Nav Items and Audio Toggle */}
        <div className="w-[1px] h-6 bg-gold-base/25 mx-2" />

        {/* Audio Toggle Button */}
        <motion.button
          onClick={handleToggleSound}
          onMouseEnter={() => {
            window.dispatchEvent(
              new CustomEvent("play-audio-chime", { 
                detail: { freq: 900, isDeep: false } 
              })
            );
          }}
          whileHover={{ 
            scale: 1.25, 
            y: -5,
          }}
          whileTap={{ scale: 0.95 }}
          className={`group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 cursor-pointer ${
            isPlaying ? "bg-gold-base/25 shadow-[0_0_12px_rgba(212,163,89,0.35)]" : "hover:bg-white/5"
          }`}
        >
          {isPlaying ? (
            <Volume2 className="w-4.5 h-4.5 text-gold-base filter drop-shadow-[0_0_8px_rgba(212,163,89,0.85)] animate-pulse-slow" />
          ) : (
            <VolumeX className="w-4.5 h-4.5 text-gold-light/60 group-hover:text-gold-base" />
          )}
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-void-deep/95 backdrop-blur-xl border border-gold-base/20 text-[9px] font-mono uppercase tracking-[0.15em] text-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-md">
            {isPlaying ? "Silenciar" : "Santuario de Sonido"}
          </span>
        </motion.button>
      </motion.div>
    </motion.nav>
  );
};

export default FloatingNav;
