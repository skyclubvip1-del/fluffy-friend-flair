import { motion } from "framer-motion";
import { ArrowUpRight, Phone, Instagram, Clock, MessageCircle } from "lucide-react";
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

const Footer = () => {
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && href !== "#") {
      e.preventDefault();
      const id = href.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="relative bg-void border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
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
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gold-base group-hover:w-full transition-all duration-300" />
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
                    className="font-body text-sm text-white/30 hover:text-white/50 transition-colors duration-300"
                  >
                    {link.name}
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
                  className="flex items-center gap-2 text-white/60 hover:text-gold-base transition-colors duration-300"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-gold-base" />
                  WhatsApp · Reservar
                </a>
              </li>
              <li>
                <a
                  href="tel:+34677263672"
                  className="flex items-center gap-2 text-white/60 hover:text-gold-base transition-colors duration-300"
                >
                  <Phone className="w-3.5 h-3.5 text-gold-base" />
                  +34 677 26 36 72
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/skyclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-gold-base transition-colors duration-300"
                >
                  <Instagram className="w-3.5 h-3.5 text-gold-base" />
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
            © 2024 Sky Club. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/10">
            Architected by Paimon
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
