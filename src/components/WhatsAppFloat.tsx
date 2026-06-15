import { motion } from "framer-motion";
import { buildWhatsAppUrl, generalReserveMessage } from "@/lib/whatsapp";

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.003 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.46 1.74 6.4L3.2 28.8l6.62-1.73a12.78 12.78 0 0 0 6.18 1.58h.01c7.07 0 12.8-5.73 12.8-12.8s-5.74-12.65-12.81-12.65zm0 23.36h-.01a10.62 10.62 0 0 1-5.4-1.48l-.39-.23-3.93 1.03 1.05-3.83-.25-.4a10.6 10.6 0 0 1-1.62-5.65c0-5.87 4.78-10.65 10.66-10.65 2.85 0 5.52 1.11 7.53 3.13a10.57 10.57 0 0 1 3.12 7.53c0 5.88-4.78 10.55-10.76 10.55zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.1-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.5.14-.66.15-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54l-.61-.01c-.21 0-.55.08-.84.4s-1.1 1.07-1.1 2.62c0 1.55 1.13 3.05 1.29 3.27.16.21 2.23 3.4 5.4 4.77.75.32 1.34.52 1.8.66.76.24 1.45.21 1.99.13.61-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37z" />
  </svg>
);

const WhatsAppFloat = () => {
  return (
    <motion.a
      href={buildWhatsAppUrl(generalReserveMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar por WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 left-8 z-50 group cursor-pointer"
    >
      {/* Golden pulsing wave */}
      <span className="absolute inset-0 rounded-full bg-gold-base/50 animate-ping-slow opacity-60" />
      {/* Solid gold button face */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gold-gradient border border-gold-light/40 shadow-[0_8px_32px_rgba(212,163,89,0.55)] text-void hover:text-[#1c1002] transition-colors duration-300">
        <WhatsAppIcon className="w-7 h-7" />
      </span>
      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-void-deep/95 backdrop-blur-xl border border-gold-base/20 font-mono text-[9px] uppercase tracking-[0.15em] text-gold-light whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md">
        Reservar por WhatsApp
      </span>
    </motion.a>
  );
};

export default WhatsAppFloat;
