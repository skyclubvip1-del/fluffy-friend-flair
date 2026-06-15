import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const navItems = [
  { label: "Inicio", href: "#home" },
  { label: "Visión", href: "#vision" },
  { label: "Servicios", href: "#barberia" },
  { label: "Bienestar", href: "#bienestar" },
  { label: "Membresía", href: "#membership" },
  { label: "Podcast", href: "#podcast-section" },
  { label: "Comunidad", href: "#community" },
  { label: "Contacto", href: "#footer" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 hidden md:block ${
        isScrolled
          ? "bg-[#0a0a0af0] backdrop-blur-md border-b border-gold-base/20 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo ("SKY CLUB") */}
        <motion.a
          href="#home"
          onClick={(e) => handleClick(e, "#home")}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-2xl tracking-[0.25em] text-gold-light hover:text-gold-base transition-colors duration-300 font-bold"
        >
          SKY CLUB
        </motion.a>

        {/* Nav Links */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className="relative group py-2 text-xs font-mono uppercase tracking-[0.2em] text-gold-light/80 hover:text-gold-base transition-colors duration-300"
            >
              <span className="transition-all duration-300 group-hover:[text-shadow:0_0_8px_rgba(212,163,89,0.8)]">
                {item.label}
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold-base origin-center scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div>
          <Button
            variant="outline"
            size="default"
            className="border-gold-base/30 text-gold-light hover:bg-gold-base/10 hover:border-gold-base/60 relative overflow-hidden group font-mono text-xs px-5 py-2 uppercase tracking-widest transition-all duration-300"
            onClick={() => {
              const target = document.getElementById("footer");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <span className="relative z-10">Reservar Cita</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
