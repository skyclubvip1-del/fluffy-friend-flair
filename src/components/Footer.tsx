import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Phone, Instagram, Clock, MessageCircle, ArrowUp } from "lucide-react";
import { buildWhatsAppUrl, generalReserveMessage } from "@/lib/whatsapp";


const footerLinks = [
  { name: "La Barbería", href: "#barberia" },
  { name: "Tienda", href: "#tienda" },
  { name: "Librería", href: "#libreria" },
  { name: "Podcast", href: "#podcast-section" },
  { name: "Salud & Bienestar", href: "#bienestar" },
  { name: "Membresía", href: "#membership" },
];

const legalLinks = [
  { name: "Términos de Uso", href: "#" },
  { name: "Política de Privacidad", href: "#" },
  { name: "Política de Reembolso", href: "#" },
];

/* Constellation dots positioned between columns */
const constellationPoints = [
  { x: 25, y: 30 },
  { x: 40, y: 55 },
  { x: 55, y: 25 },
  { x: 70, y: 60 },
  { x: 35, y: 75 },
];

const constellationLines: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 1],
];
const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"],
  });
  const bgTextY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && href !== "#") {
      e.preventDefault();
      const id = href.replace("#", "");
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="footer" ref={footerRef} className="relative bg-void overflow-hidden">
      {/* Top Border - Thin gold gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-base/45 to-transparent z-10" />

      {/* Giant Background SKY CLUB text with parallax */}
      <motion.div
        style={{ y: bgTextY }}
        className="text-[15vw] font-display font-bold text-white/[0.015] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none select-none"
      >
        SKY CLUB
      </motion.div>


      {/* Constellation Effect */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.1 }}
      >
        {/* Lines connecting constellation dots */}
        {constellationLines.map(([from, to], i) => (
          <motion.line
            key={`line-${i}`}
            x1={`${constellationPoints[from].x}%`}
            y1={`${constellationPoints[from].y}%`}
            x2={`${constellationPoints[to].x}%`}
            y2={`${constellationPoints[to].y}%`}
            stroke="hsl(45, 82%, 54%)"
            strokeWidth="0.5"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {/* Constellation dots */}
        {constellationPoints.map((pt, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={`${pt.x}%`}
            cy={`${pt.y}%`}
            r="2"
            fill="hsl(45, 82%, 54%)"
            animate={{ opacity: [0.4, 1, 0.4], r: [1.5, 2.5, 1.5] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-gold-gradient mb-4"
            >
              SKY
              <br />
              CLUB
            </motion.h2>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/30">
              EST. 2024 // GLOBAL HQ
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
              Ecosistema
            </h3>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScrollClick(e, link.href)}
                    className="group inline-flex items-center gap-2 font-body text-white/60 hover:text-gold-base transition-colors duration-300"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-base group-hover:w-full transition-all duration-300 shimmer" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
              Legal
            </h3>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group relative inline-block font-body text-sm text-white/30 hover:text-white/50 transition-colors duration-300"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-base/50 group-hover:w-full transition-all duration-300 shimmer" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={buildWhatsAppUrl(generalReserveMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-white/60 hover:text-gold-base transition-colors duration-300"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-gold-base transition-all duration-300 group-hover:scale-120 group-hover:filter group-hover:drop-shadow-[0_0_6px_rgba(212,163,89,0.85)]" />
                  WhatsApp · Reservar
                </a>
              </li>
              <li>
                <a
                  href="tel:+34677263672"
                  className="group flex items-center gap-2 text-white/60 hover:text-gold-base transition-colors duration-300"
                >
                  <Phone className="w-3.5 h-3.5 text-gold-base transition-all duration-300 group-hover:scale-120 group-hover:filter group-hover:drop-shadow-[0_0_6px_rgba(212,163,89,0.85)]" />
                  +34 677 26 36 72
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/skyclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-white/60 hover:text-gold-base transition-colors duration-300"
                >
                  <Instagram className="w-3.5 h-3.5 text-gold-base transition-all duration-300 group-hover:scale-120 group-hover:filter group-hover:drop-shadow-[0_0_6px_rgba(212,163,89,0.85)]" />
                  @skyclub
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/40 pt-2">
                <Clock className="w-3.5 h-3.5 text-gold-base mt-0.5 shrink-0" />

                <span className="font-mono text-xs leading-relaxed">
                  Lun – Sáb<br />10:00 – 20:00
                </span>
              </li>
              <li className="pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                Carrer Just Ramírez 2<br />Valencia · España
              </li>
            </ul>
          </div>
        </div>

        {/* Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 relative rounded-2xl overflow-hidden h-64 border border-white/10"
        >
          {/* Animated Gold Corner Decorations */}
          {/* Top-Left Corner */}
          <motion.div
            className="absolute top-0 left-0 z-10 pointer-events-none"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-[1px] bg-gold-base" />
            <div className="w-[1px] h-6 bg-gold-base" />
          </motion.div>
          {/* Top-Right Corner */}
          <motion.div
            className="absolute top-0 right-0 z-10 pointer-events-none flex flex-col items-end"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="w-6 h-[1px] bg-gold-base" />
            <div className="w-[1px] h-6 bg-gold-base self-end" />
          </motion.div>
          {/* Bottom-Left Corner */}
          <motion.div
            className="absolute bottom-0 left-0 z-10 pointer-events-none flex flex-col justify-end"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="w-[1px] h-6 bg-gold-base" />
            <div className="w-6 h-[1px] bg-gold-base" />
          </motion.div>
          {/* Bottom-Right Corner */}
          <motion.div
            className="absolute bottom-0 right-0 z-10 pointer-events-none flex flex-col items-end justify-end"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <div className="w-[1px] h-6 bg-gold-base self-end" />
            <div className="w-6 h-[1px] bg-gold-base" />
          </motion.div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3080.0247853957896!2d-0.3808433!3d39.4669444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6048a30e3e5f5f%3A0x8c5c5c5c5c5c5c5c!2sCarrer%20Just%20Ram%C3%ADrez%2C%202%2C%2046006%20Val%C3%A8ncia%2C%20Spain!5e0!3m2!1sen!2ses!4v1703789999999!5m2!1sen!2ses"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(90%)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SKY CLUB HQ - Carrer Just Ramírez 2, Valencia"
          />

          {/* Overlay for styling */}
          <div className="absolute inset-0 bg-void/30 pointer-events-none" />

          {/* Address & Label */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gold-base">
                SKY CLUB HQ
              </span>
              <p className="font-body text-xs text-white/60 mt-1">
                Carrer Just Ramírez 2, Valencia
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Carrer+Just+Ramirez+2+Valencia+Spain"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-wider text-gold-base/60 hover:text-gold-base transition-colors pointer-events-auto"
            >
              Ver en Maps →
            </a>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/20">
            © 2025 Sky Club. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/10">
            Architected by Paimon
          </p>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -4, 0],
              transition: {
                y: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                },
                default: { duration: 0.3 }
              }
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 163, 89, 0.15)" }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full border border-gold-base/50 bg-[#0a0a0a]/90 text-gold-base backdrop-blur-md flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(212,163,89,0.3)] hover:border-gold-base cursor-pointer transition-colors duration-300"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;

