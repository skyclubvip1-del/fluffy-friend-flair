import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import blancoExitoso from "@/assets/blanco-exitoso.jpeg";
import latinoExitoso from "@/assets/latino-exitoso.jpeg";
import negroExitoso from "@/assets/negro-exitoso.jpeg";

interface TestimonialCardProps {
  name: string;
  role: string;
  achievement: string;
  quote: string;
  image: string;
  delay?: number;
}

const TestimonialCard = ({ name, role, achievement, quote, image, delay = 0 }: TestimonialCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-18, 18]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group-hover:border-gold-base/40 shadow-[0_15px_45px_rgba(212,163,89,0.35)] transition-all duration-500 border-beam">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className={`
            w-full h-full object-cover transition-all duration-700 ease-out
            ${isHovered ? 'scale-115 rotate-[2deg] saturate-[1.2] grayscale-0' : 'scale-100 grayscale saturate-0 rotate-0'}
          `}
        />

        {/* Ambient warm golden tone for grayscale image */}
        <div className={`absolute inset-0 bg-gold-base/5 mix-blend-color transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />

        {/* Glassmorphic Quote Panel Sliding Up - Midas Gold nuanced */}
        <motion.div
          initial={{ y: "101%" }}
          animate={{ y: isHovered ? "0%" : "101%" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[#0a0805]/92 border border-gold-base/25 p-8 flex flex-col justify-center items-center text-center z-10"
        >
          {/* Spark icon */}
          <Sparkles className="w-5 h-5 text-gold-base mb-4 animate-pulse-slow shadow-[0_0_8px_rgba(212,163,89,0.4)]" />
          <p className="font-body italic text-gold-light/95 text-sm sm:text-base leading-relaxed max-w-[85%]" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            "{quote}"
          </p>
          <div className="w-12 h-[1px] bg-gold-base/30 mt-6" />
          <span className="font-mono text-[9px] text-gold-base/50 uppercase tracking-[0.2em] mt-3 font-semibold">
            SKY MEMBER
          </span>
        </motion.div>

        {/* Info Card */}
        <div className="absolute inset-x-4 bottom-4 glass-panel rounded-xl p-4 z-20 border border-white/10 group-hover:border-gold-base/20 shadow-lg transition-colors duration-500" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-semibold text-white tracking-wide">{name}</h4>
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest mt-0.5">{role}</p>
            </div>
            <div className="text-right">
              <p className={`font-display font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-500 ${
                isHovered 
                  ? 'text-gold-base border-gold-base/40 bg-gold-base/5 shadow-[0_0_10px_rgba(212,163,89,0.2)]' 
                  : 'text-white/60 border-white/10 bg-white/5'
              }`}>
                {achievement}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "MARCUS V.",
      role: "Arquitecto",
      achievement: "Facturación x3",
      quote: "Sky Club cambió mi perspectiva. No se trata solo de imagen, se trata de mentalidad.",
      image: blancoExitoso,
    },
    {
      name: "DANIEL R.",
      role: "Empresario",
      achievement: "2 Startups",
      quote: "El networking aquí vale más que cualquier MBA. Conexiones reales, resultados reales.",
      image: latinoExitoso,
    },
    {
      name: "ADRIÁN M.",
      role: "Director Creativo",
      achievement: "+40% Clientes",
      quote: "Cada detalle cuenta. Sky Club me enseñó que la excelencia no es negociable.",
      image: negroExitoso,
    },
  ];

  return (
    <section id="testimonials" className="relative py-24 md:py-32 px-6 bg-void overflow-hidden">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-base/20 to-transparent" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-base/60">
            // PROOF OF ASCENSION
          </span>
          <h2 className="font-display font-bold text-heading-1 text-gold-midas mt-4">
            Los Ascendidos
          </h2>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              {...testimonial}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
