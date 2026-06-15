import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Scissors, BookOpen, Mic, ArrowRight, X, ArrowLeft, Sparkles, ShoppingBag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { buildWhatsAppUrl, reserveServiceMessage, generalReserveMessage } from "@/lib/whatsapp";

// upgraded 3D holographic detailed service overlay
const ServiceOverlay = ({ url, title, onClose }: { url: string; title: string; onClose: () => void }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 140 };
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!modalRef.current) return;
        const rect = modalRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    useEffect(() => {
        // Play rising portal entry FM chimes
        window.dispatchEvent(
            new CustomEvent("play-audio-chime", { 
                detail: { freq: 392, isDeep: true } 
            })
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("play-audio-chime", { 
                    detail: { freq: 587, isDeep: false } 
                })
            );
        }, 100);
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("play-audio-chime", { 
                    detail: { freq: 784, isDeep: false } 
                })
            );
        }, 200);
    }, []);

    const handleClose = () => {
        window.dispatchEvent(
            new CustomEvent("play-audio-chime", { 
                detail: { freq: 587, isDeep: false } 
            })
        );
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent("play-audio-chime", { 
                    detail: { freq: 294, isDeep: true } 
                })
            );
        }, 120);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 bg-void/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-hidden">
                {/* 3D Perspective Wrapper */}
                <div 
                    className="w-full h-full max-w-6xl perspective-1200 flex items-center justify-center cursor-none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.9, rotateX: 12 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateX: -12 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                        className="relative w-full h-full glass-panel-deep rounded-3xl border border-gold-base/35 shadow-gold-ultra overflow-hidden flex flex-col preserve-3d border-beam cursor-none"
                    >
                        {/* Header bar */}
                        <div 
                            className="flex items-center justify-between px-6 py-4 border-b border-gold-base/20 bg-void-deep/80 backdrop-blur-xl preserve-3d"
                            style={{ transform: "translateZ(15px)" }}
                        >
                            <button
                                onClick={handleClose}
                                className="flex items-center gap-2 text-gold-light hover:text-gold-base transition-colors duration-300 font-display text-sm uppercase tracking-wider cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver a Sky Club
                            </button>
                            <span className="font-display font-semibold text-white/80 text-sm uppercase tracking-wider">
                                {title}
                            </span>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-full border border-gold-base/20 flex items-center justify-center hover:bg-white/5 transition-colors duration-300 cursor-pointer"
                            >
                                <X className="w-5 h-5 text-gold-base" />
                            </button>
                        </div>

                        {/* Iframe portal wrapper */}
                        <div 
                            className="flex-1 w-full bg-void-deep/50 relative preserve-3d"
                            style={{ transform: "translateZ(5px)" }}
                        >
                            {/* Scanning beam line overlay */}
                            <div className="gold-scanner-line opacity-20" />
                            
                            <iframe
                                src={url}
                                title={title}
                                className="w-full h-full border-0 rounded-b-3xl"
                                allow="autoplay; fullscreen"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

interface ServiceSectionProps {
    id: string;
    label: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    image: string;
    icon: React.ReactNode;
    href: string;
    reversed?: boolean;
    delay?: number;
    onExplore: (url: string, title: string) => void;
}

const ServiceSection = ({
    id,
    label,
    title,
    subtitle,
    description,
    features,
    image,
    icon,
    href,
    reversed = false,
    delay = 0,
    onExplore,
}: ServiceSectionProps) => {
    const imageRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const xVal = (e.clientX - rect.left - rect.width / 2) * 0.05;
        const yVal = (e.clientY - rect.top - rect.height / 2) * 0.05;
        imageRef.current.style.transform = `perspective(1000px) rotateX(${-yVal}deg) rotateY(${xVal}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        if (!imageRef.current) return;
        imageRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    return (
        <section id={id} className="relative py-20 md:py-28 px-6 bg-void overflow-hidden">
            {/* Background glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: "50%",
                    left: reversed ? "15%" : "85%",
                    transform: "translate(-50%, -50%)",
                    width: 550,
                    height: 550,
                    background:
                        "radial-gradient(circle, hsl(45 82% 54% / 0.045) 0%, transparent 70%)",
                    filter: "blur(90px)",
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? "lg:direction-rtl" : ""
                        }`}
                    style={reversed ? { direction: "rtl" } : {}}
                >
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, clipPath: reversed ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }}
                        whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
                        style={{ direction: "ltr" }}
                    >
                        <div 
                            className="relative group cursor-pointer"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div 
                                ref={imageRef}
                                className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-gold-base/20 shadow-[0_10px_35px_rgba(212,163,89,0.15)] transition-all duration-500 ease-out transform-style-3d"
                            >
                                <img
                                    src={image}
                                    alt={title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                />
                                {/* Gold overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
                                <div className="absolute inset-0 bg-gold-base/0 group-hover:bg-gold-base/5 transition-colors duration-700" />
                            </div>

                            {/* Decorative corner accents */}
                            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold-base/50 rounded-tl-lg group-hover:border-gold-base group-hover:shadow-[0_0_12px_rgba(212,163,89,0.5)] transition-all duration-500" />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold-base/50 rounded-br-lg group-hover:border-gold-base group-hover:shadow-[0_0_12px_rgba(212,163,89,0.5)] transition-all duration-500" />
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: reversed ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.9, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
                        style={{ direction: "ltr" }}
                    >
                        {/* Label */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gold-base/10 border border-gold-base/35 flex items-center justify-center shadow-[0_0_15px_rgba(212,163,89,0.15)]">
                                {icon}
                            </div>
                            <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-base/60">
                                // {label}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-display font-bold text-heading-1 text-gold-midas mb-2 tracking-tight">
                            {title}
                        </h2>
                        <p className="font-display text-lg text-gold-light/85 mb-6">
                            {subtitle}
                        </p>

                        {/* Description */}
                        <p className="font-body text-white/50 leading-relaxed mb-8 max-w-lg">
                            {description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            {features.map((feature, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: delay + 0.2 + i * 0.06 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-base shadow-[0_0_8px_rgba(212,163,89,0.5)] shrink-0" />
                                    <span className="font-body text-sm text-white/60">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <motion.button
                            whileHover={{ scale: 1.03, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onExplore(href, title)}
                            className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-gold-gradient text-void font-display text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300 cursor-pointer font-bold"
                        >
                            Explorar Ecosistema
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Section bottom divider */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-base/15 to-transparent" />
        </section>
    );
};

// Barbería pricing categories
const barberiaCategories = [
  {
    name: "Corte",
    items: [
      { service: "Corte Premium", price: "15€" },
    ],
  },
  {
    name: "Barbas",
    items: [
      { service: "Barba", price: "10€" },
    ],
  },
  {
    name: "Cejas",
    items: [
      { service: "Cejas", price: "4€" },
      { service: "Diseño de cejas (hilo)", price: "5€" },
      { service: "Diseño de cejas con tinte", price: "8€" },
    ],
  },
  {
    name: "Limpieza Facial",
    items: [
      { service: "Limpieza facial básica / Asesoramiento", price: "20€" },
      { service: "Limpieza facial profunda / Asesoramiento", price: "30€" },
    ],
  },
  {
    name: "Decoloración & Mechas",
    items: [
      { service: "Decoloración", price: "85€" },
      { service: "Decoloración + Corte", price: "95€" },
      { service: "Mechas", price: "65€" },
      { service: "Mechas + Corte", price: "75€" },
    ],
  },
  {
    name: "Packs Especiales",
    items: [
      { service: "Pack SKY IS THE LIMIT — Corte + Barba + Cejas", price: "22€" },
    ],
  },
];

const BarberiaSection = ({ onExplore }: { onExplore: (url: string, title: string) => void }) => {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left - rect.width / 2) * 0.05;
    const yVal = (e.clientY - rect.top - rect.height / 2) * 0.05;
    imageRef.current.style.transform = `perspective(1000px) rotateX(${-yVal}deg) rotateY(${xVal}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section id="barberia" className="relative py-20 md:py-28 px-6 bg-void overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "80%",
          transform: "translate(-50%, -50%)",
          width: 550,
          height: 550,
          background: "radial-gradient(circle, hsl(45 82% 54% / 0.045) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div 
              className="relative group cursor-pointer sticky top-28"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                ref={imageRef}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-gold-base/20 shadow-[0_10px_35px_rgba(212,163,89,0.15)] transition-all duration-500 ease-out transform-style-3d"
              >
                <img
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80"
                  alt="La Barbería"
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gold-base/0 group-hover:bg-gold-base/5 transition-colors duration-700" />
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold-base/50 rounded-tl-lg group-hover:border-gold-base group-hover:shadow-[0_0_12px_rgba(212,163,89,0.5)] transition-all duration-500" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold-base/50 rounded-br-lg group-hover:border-gold-base group-hover:shadow-[0_0_12px_rgba(212,163,89,0.5)] transition-all duration-500" />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold-base/10 border border-gold-base/35 flex items-center justify-center shadow-[0_0_15px_rgba(212,163,89,0.15)]">
                <Scissors className="w-5 h-5 text-gold-base" />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-base/60">
                // RITUALES DE ACERO
              </span>
            </div>

            <h2 className="font-display font-bold text-heading-1 text-gold-midas mb-2 tracking-tight">LA BARBERÍA</h2>
            <p className="font-display text-lg text-gold-light/85 mb-6">Donde el detalle define al hombre.</p>
            <p className="font-body text-white/50 leading-relaxed mb-8 max-w-lg">
              Un santuario de cuidado masculino donde cada corte es una declaración de intención. Nuestros maestros barberos combinan técnicas clásicas con tendencias contemporáneas.
            </p>

            {/* Pricing Accordion */}
            <Accordion type="multiple" className="space-y-4 mb-8">
              {barberiaCategories.map((cat) => (
                <AccordionItem
                  key={cat.name}
                  value={cat.name}
                  className="border border-white/10 hover:border-gold-base/30 rounded-xl overflow-hidden bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 backdrop-blur-sm px-5"
                >
                  <AccordionTrigger className="hover:no-underline py-4 gap-3 text-left">
                    <span className="font-display text-sm uppercase tracking-[0.15em] text-white/90 flex items-center gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-base animate-pulse-slow shadow-[0_0_8px_rgba(212,163,89,0.3)]" />
                      {cat.name}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pb-3 pt-1">
                      {cat.items.map((item) => (
                        <div
                          key={item.service}
                          className="flex items-center justify-between gap-4 py-2.5 border-b border-gold-base/10 last:border-0"
                        >
                          <span className="font-body text-sm text-white/75 flex-1 min-w-0 font-medium">{item.service}</span>
                          <span className="font-mono font-semibold text-gold-base text-sm shrink-0 tracking-wider mr-2">
                            {item.price}
                          </span>
                          <a
                            href={buildWhatsAppUrl(reserveServiceMessage(item.service, item.price))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-4 py-1.5 rounded-full bg-gold-gradient text-void hover:shadow-[0_0_10px_rgba(212,163,89,0.4)] transition-all duration-300 font-display text-[9px] uppercase tracking-wider cursor-pointer font-bold"
                            aria-label={`Reservar ${item.service} por WhatsApp`}
                          >
                            Reservar
                          </a>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                whileHover={{ scale: 1.03, x: 4 }}
                whileTap={{ scale: 0.98 }}
                href={buildWhatsAppUrl(generalReserveMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-gold-gradient text-void font-display text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300 font-bold"
              >
                Reservar por WhatsApp
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onExplore("https://skybladefinal.lovable.app", "LA BARBERÍA")}
                className="group flex items-center gap-3 px-6 py-3.5 rounded-full border border-gold-base/30 text-gold-light font-display text-sm uppercase tracking-wider hover:bg-gold-base/10 hover:border-gold-base/60 transition-all duration-300 cursor-pointer font-medium"
              >
                Ver más detalles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-base/15 to-transparent" />
    </section>
  );
};

const services = [
    {
        id: "tienda",
        label: "ESTILO & EXCLUSIVIDAD",
        title: "TIENDA",
        subtitle: "Tu imagen habla antes que tú.",
        description:
            "Una boutique curada con las piezas más exclusivas en moda masculina, accesorios y lifestyle. Desde joyería artesanal hasta ropa de diseño — cada artículo ha sido seleccionado para elevar tu presencia y comunicar tu nivel.",
        features: [
            "Colecciones exclusivas SKY CLUB",
            "Joyería y accesorios premium",
            "Ropa de diseño seleccionada",
            "Ediciones limitadas cada temporada",
            "Envío discreto y empaquetado luxury",
        ],
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        icon: <ShoppingBag className="w-5 h-5 text-gold-base" />,
        reversed: true,
        href: "https://orbit-boutique.lovable.app",
    },
    {
        id: "libreria",
        label: "ARQUITECTURA MENTAL",
        title: "LIBRERÍA",
        subtitle: "El conocimiento como arma secreta.",
        description:
            "Una curación editorial de los títulos más impactantes en negocios, psicología, filosofía y desarrollo personal. Cada libro en nuestra selección ha sido elegido por su capacidad de transformar perspectivas y acelerar tu crecimiento.",
        features: [
            "Selección curada mensual",
            "Club de lectura exclusivo",
            "Resúmenes ejecutivos semanales",
            "Encuentros con autores",
            "Biblioteca digital ilimitada",
        ],
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
        icon: <BookOpen className="w-5 h-5 text-gold-base" />,
        reversed: true,
        href: "https://skypressfinal.lovable.app",
    },
    {
        id: "podcast-section",
        label: "FRECUENCIA ÉLITE",
        title: "PODCAST",
        subtitle: "Sintoniza la frecuencia del éxito.",
        description:
            "Conversaciones sin filtro con emprendedores, atletas, inversores y líderes de industria. Cada episodio es una masterclass sobre mentalidad, dinero, relaciones y la construcción de una vida extraordinaria.",
        features: [
            "Episodios semanales exclusivos",
            "Entrevistas con líderes de industria",
            "Masterclasses de mentalidad",
            "Contenido behind-the-scenes",
            "Q&A en vivo para miembros",
        ],
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
        icon: <Mic className="w-5 h-5 text-gold-base" />,
        href: "https://skyhub-tribe.lovable.app",
    },
];


const ServiceSections = () => {
    const [overlay, setOverlay] = useState<{ url: string; title: string } | null>(null);

    const handleExplore = (url: string, title: string) => {
        setOverlay({ url, title });
        document.body.style.overflow = "hidden";
    };

    const handleClose = () => {
        setOverlay(null);
        document.body.style.overflow = "";
    };

    return (
        <div className="relative">
            {/* Top section divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gold-base/20 to-transparent" />

            {/* Custom Barbería Section with pricing */}
            <BarberiaSection onExplore={handleExplore} />

            {services.map((service) => (
                <ServiceSection
                    key={service.id}
                    {...service}
                    delay={0.1}
                    onExplore={handleExplore}
                />
            ))}

            {/* Iframe overlay */}
            {overlay && (
                <ServiceOverlay
                    url={overlay.url}
                    title={overlay.title}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default ServiceSections;
