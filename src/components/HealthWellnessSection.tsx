import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Brain,
  Leaf,
  Moon,
  Heart,
  Sparkles,
  ArrowRight,
  Wind,
  Droplets,
  Sun,
  Eye,
  Shield,
  Flame,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { buildWhatsAppUrl, reserveServiceMessage } from "@/lib/whatsapp";

/* â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•*/
const wellnessPillars = [
  {
    id: "mente",
    icon: Brain,
    title: "MENTE",
    tagline: "Claridad Interior",
    gradient: "from-[#8a0303]/20 via-[#d4a359]/5 to-transparent",
    glowColor: "rgba(138, 3, 3, 0.1)",
    heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85",
    philosophy: "La mente es el sistema operativo de tu vida. Cuando la actualizas, todo cambia.",
    description:
      "Protocolos de neurociencia aplicada, meditaciÃ³n guiada y coaching cognitivo diseÃ±ados para reducir ruido mental, aumentar la concentraciÃ³n y cultivar una resiliencia emocional profunda.",
    services: [
      {
        name: "MeditaciÃ³n Guiada & Mindfulness",
        desc: "Sesiones individuales con tÃ©cnicas de respiraciÃ³n, visualizaciÃ³n y escaneo corporal para silenciar el ruido mental.",
        price: "35â‚¬",
        duration: "45 min",
        featured: false,
      },
      {
        name: "Coaching Cognitivo-Conductual",
        desc: "ReestructuraciÃ³n de patrones de pensamiento limitantes con un especialista en psicologÃ­a positiva.",
        price: "70â‚¬",
        duration: "60 min",
        featured: true,
      },
      {
        name: "Neurofeedback & Ondas Cerebrales",
        desc: "Entrenamiento cerebral asistido por EEG para optimizar estados de flow y reducir ansiedad.",
        price: "90â‚¬",
        duration: "50 min",
        featured: false,
      },
      {
        name: "Journaling TerapÃ©utico Guiado",
        desc: "Taller de escritura introspectiva con protocolos cientÃ­ficos para procesamiento emocional profundo.",
        price: "25â‚¬",
        duration: "40 min",
        featured: false,
      },
    ],
    stat: { value: 73, label: "ReducciÃ³n del estrÃ©s", sub: "tras 8 sesiones" },
  },
  {
    id: "cuerpo",
    icon: Droplets,
    title: "CUIDADO CORPORAL",
    tagline: "Ritual Sensorial",
    gradient: "from-[#d4a359]/25 via-[#8a0303]/5 to-transparent",
    glowColor: "rgba(212, 163, 89, 0.12)",
    heroImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=85",
    philosophy: "Tu piel es el lienzo de tu bienestar. Cada ritual es una conversaciÃ³n contigo mismo.",
    description:
      "Tratamientos faciales y corporales de alta gama, aromaterapia, y rituales de spa con ingredientes naturales y tÃ©cnicas ancestrales fusionadas con tecnologÃ­a dermocosmÃ©tica.",
    services: [
      {
        name: "Facial HidrataciÃ³n Profunda",
        desc: "Limpieza con vapor de ozono, exfoliaciÃ³n enzimÃ¡tica, mascarilla de Ã¡cido hialurÃ³nico y masaje kobido japonÃ©s.",
        price: "55â‚¬",
        duration: "60 min",
        featured: false,
      },
      {
        name: "Masaje Descontracturante Premium",
        desc: "Terapia miofascial con aceites esenciales de lavanda y eucalipto. LiberaciÃ³n de tensiones crÃ³nicas.",
        price: "65â‚¬",
        duration: "75 min",
        featured: true,
      },
      {
        name: "Ritual Hammam Completo",
        desc: "ExfoliaciÃ³n corporal con guante kessa, envoltura de arcilla rhassoul y masaje con argÃ¡n.",
        price: "85â‚¬",
        duration: "90 min",
        featured: false,
      },
      {
        name: "ReflexologÃ­a Podal Integral",
        desc: "EstimulaciÃ³n de puntos reflejos del pie para reequilibrar Ã³rganos internos y sistema nervioso.",
        price: "40â‚¬",
        duration: "45 min",
        featured: false,
      },
    ],
    stat: { value: 98, label: "SatisfacciÃ³n clientes", sub: "en tratamientos corporales" },
  },
  {
    id: "nutricion",
    icon: Leaf,
    title: "NUTRICIÃ“N",
    tagline: "Alquimia Vital",
    gradient: "from-[#660000]/25 via-[#ffeeb8]/5 to-transparent",
    glowColor: "rgba(102, 0, 0, 0.1)",
    heroImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=85",
    philosophy: "Eres lo que absorbes. La nutriciÃ³n consciente es el acto de amor propio mÃ¡s radical.",
    description:
      "ConsultorÃ­a nutricional personalizada basada en analÃ­tica sanguÃ­nea, intolerancias y objetivos vitales. No dietas, sino un sistema alimentario sostenible para tu biologÃ­a Ãºnica.",
    services: [
      {
        name: "Consulta Nutricional Integral",
        desc: "EvaluaciÃ³n completa: analÃ­tica, historial clÃ­nico, objetivos y diseÃ±o del primer plan nutricional personalizado.",
        price: "75â‚¬",
        duration: "75 min",
        featured: true,
      },
      {
        name: "Plan Detox & Reset Digestivo",
        desc: "Protocolo de 7 dÃ­as con menÃºs antiinflamatorios, suplementaciÃ³n y guÃ­a diaria por WhatsApp.",
        price: "120â‚¬",
        duration: "7 dÃ­as",
        featured: false,
      },
      {
        name: "Taller de Cocina Consciente",
        desc: "SesiÃ³n prÃ¡ctica en grupo: recetas funcionales, combinaciones sinÃ©rgicas y batch cooking.",
        price: "45â‚¬",
        duration: "120 min",
        featured: false,
      },
      {
        name: "Seguimiento Mensual Premium",
        desc: "RevisiÃ³n de progreso, ajuste de macros y micronutrientes, soporte continuo vÃ­a app.",
        price: "50â‚¬",
        duration: "Mensual",
        featured: false,
      },
    ],
    stat: { value: 89, label: "Mejora en energÃ­a", sub: "en los primeros 30 dÃ­as" },
  },
  {
    id: "descanso",
    icon: Moon,
    title: "SUEÃ‘O & RECOVERY",
    tagline: "RestauraciÃ³n Profunda",
    gradient: "from-[#d4a359]/20 via-[#4a0000]/5 to-transparent",
    glowColor: "rgba(212, 163, 89, 0.1)",
    heroImage: "https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=900&q=85",
    philosophy: "El verdadero rendimiento no se forja despierto â€” se construye mientras descansas.",
    description:
      "Protocolos de higiene del sueÃ±o, terapia de flotaciÃ³n sensorial y tÃ©cnicas de regulaciÃ³n del sistema nervioso autÃ³nomo para una regeneraciÃ³n celular completa.",
    services: [
      {
        name: "DiagnÃ³stico de SueÃ±o & Cronotipo",
        desc: "EvaluaciÃ³n con actigrafÃ­a, cuestionarios validados y diseÃ±o de rutina circadiana personalizada.",
        price: "80â‚¬",
        duration: "60 min",
        featured: false,
      },
      {
        name: "CÃ¡mara de FlotaciÃ³n Sensorial",
        desc: "Ingravidez en soluciÃ³n de sales de Epsom a oscuridad total. Reset completo del sistema nervioso.",
        price: "50â‚¬",
        duration: "60 min",
        featured: true,
      },
      {
        name: "Sauna Infrarroja & Contraste TÃ©rmico",
        desc: "Calor penetrante seguido de ducha frÃ­a para activar la respuesta vagal y limpiar toxinas.",
        price: "35â‚¬",
        duration: "45 min",
        featured: false,
      },
      {
        name: "Terapia de Sonido & Cuencos Tibetanos",
        desc: "BaÃ±o sonoro con frecuencias 432Hz para inducir ondas theta y relajaciÃ³n profunda.",
        price: "40â‚¬",
        duration: "50 min",
        featured: false,
      },
    ],
    stat: { value: 81, label: "Mejora calidad sueÃ±o", sub: "con protocolo completo" },
  },
  {
    id: "emocional",
    icon: Heart,
    title: "EQUILIBRIO EMOCIONAL",
    tagline: "ArmonÃ­a Interior",
    gradient: "from-[#cc0000]/20 via-[#ffeeb8]/5 to-transparent",
    glowColor: "rgba(204, 0, 0, 0.1)",
    heroImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=900&q=85",
    philosophy: "La verdadera fuerza no es no sentir â€” es sentir todo y seguir eligiendo la paz.",
    description:
      "AcompaÃ±amiento emocional con terapias holÃ­sticas, breathwork y cÃ­rculos de vulnerabilidad. Un espacio seguro para explorar, sanar y reconectarte con tu esencia.",
    services: [
      {
        name: "Breathwork Transformacional",
        desc: "RespiraciÃ³n consciente intensa para liberar bloqueos emocionales almacenados en el cuerpo.",
        price: "45â‚¬",
        duration: "60 min",
        featured: true,
      },
      {
        name: "Constelaciones Familiares",
        desc: "ExploraciÃ³n sistÃ©mica de dinÃ¡micas familiares inconscientes que condicionan tus relaciones.",
        price: "80â‚¬",
        duration: "90 min",
        featured: false,
      },
      {
        name: "CÃ­rculo de Vulnerabilidad",
        desc: "Espacio compartido de expresiÃ³n emocional autÃ©ntica facilitado por terapeuta Gestalt certificado.",
        price: "30â‚¬",
        duration: "120 min",
        featured: false,
      },
      {
        name: "Aromaterapia & Reiki Integrativo",
        desc: "Terapia energÃ©tica con imposiciÃ³n de manos combinada con aceites esenciales terapÃ©uticos.",
        price: "55â‚¬",
        duration: "60 min",
        featured: false,
      },
    ],
    stat: { value: 92, label: "Bienestar general", sub: "reportado por asistentes" },
  },
];

const quotes = [
  { text: "Cuida tu cuerpo. Es el Ãºnico lugar que tienes para vivir.", author: "Jim Rohn" },
  { text: "La salud no lo es todo, pero sin ella, todo lo demÃ¡s es nada.", author: "Schopenhauer" },
  { text: "El mayor acto de revoluciÃ³n es cuidarte cuando el mundo te enseÃ±Ã³ a descuidarte.", author: "AnÃ³nimo" },
];

/* â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•� SUB-COMPONENTS â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•� */

/* â”€â”€â”€â”€ Animated SVG Stat Ring â”€â”€â”€â”€ */
const StatRing = ({ value, label, sub }: { value: number; label: string; sub: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [visible, setVisible] = useState(false);
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible) {
          setVisible(true);
          const dur = 1800;
          const start = Date.now();
          const tick = () => {
            const p = Math.min((Date.now() - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.floor(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, visible]);

  const offset = circumference - (circumference * (visible ? value : 0)) / 100;

  return (
    <div ref={ref} className="flex items-center gap-5">
      <div className="relative w-24 h-24 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id="gold-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(40 65% 88%)" />
              <stop offset="50%" stopColor="hsl(45 75% 52%)" />
              <stop offset="100%" stopColor="hsl(43 60% 42%)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" className="stat-ring-track" />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stat-ring-value"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-xl text-gold-gradient">{display}%</span>
        </div>
      </div>
      <div>
        <p className="font-display font-semibold text-sm text-white/80">{label}</p>
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{sub}</p>
      </div>
    </div>
  );
};

/* â”€â”€â”€â”€ 3D Tilt Service Card â”€â”€â”€â”€ */
const ServiceCard = ({
  service,
  index,
}: {
  service: { name: string; desc: string; price: string; duration: string; featured: boolean };
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 250 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 250 });
  const rotateX = useTransform(springY, [-80, 80], [4, -4]);
  const rotateY = useTransform(springX, [-80, 80], [-4, 4]);

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const r = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - r.left - r.width / 2);
      mouseY.set(e.clientY - r.top - r.height / 2);
      // set CSS custom props for glow position
      cardRef.current.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
      cardRef.current.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
    },
    [mouseX, mouseY]
  );

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={`wellness-card-glow group relative rounded-2xl border transition-all duration-500 overflow-hidden ${
        service.featured
          ? "bg-white/[0.03] border-gold-base/20 shadow-[0_0_30px_rgba(212,175,55,0.04)]"
          : "bg-white/[0.015] border-white/[0.06] hover:border-white/10"
      }`}
    >
      {/* Featured shimmer bar */}
      {service.featured && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-base/40 to-transparent shimmer" />
      )}

      <div className="relative z-10 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Content */}
          <div className="flex-1 space-y-2.5 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${service.featured ? "bg-gold-base" : "bg-white/20"}`} />
              <h4 className="font-display font-semibold text-[13px] text-white/90 group-hover:text-gold-light transition-colors duration-400 tracking-wide">
                {service.name}
              </h4>
              {service.featured && (
                <span className="px-2 py-0.5 rounded-full bg-gold-base/10 border border-gold-base/20 font-mono text-[8px] uppercase tracking-widest text-gold-base shrink-0">
                  Popular
                </span>
              )}
            </div>
            <p className="font-body text-[11px] text-white/30 leading-relaxed pl-4">{service.desc}</p>
            <div className="flex items-center gap-4 pl-4">
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> {service.duration}
              </span>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2.5 shrink-0 border-t border-white/[0.04] pt-3 sm:pt-0 sm:border-0">
            <span className="font-display font-bold text-gold-base text-lg tracking-tight">{service.price}</span>
            <a
              href={buildWhatsAppUrl(reserveServiceMessage(service.name, service.price))}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-300 font-display text-[10px] uppercase tracking-wider ${
                service.featured
                  ? "bg-gold-base/10 border-gold-base/30 text-gold-light hover:bg-gold-base hover:text-void hover:border-gold-base shadow-[0_0_12px_rgba(212,175,55,0.08)]"
                  : "border-white/10 text-white/50 hover:border-gold-base/30 hover:text-gold-light hover:bg-gold-base/5"
              }`}
            >
              Reservar
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* â”€â”€â”€â”€ Breathing Widget â”€â”€â”€â”€ */
const BreathingWidget = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(4);

  const durations = { inhale: 4, hold: 7, exhale: 8 } as const;
  const nextOf = { inhale: "hold" as const, hold: "exhale" as const, exhale: "inhale" as const };

  useEffect(() => {
    if (!isActive) return;
    const iv = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          const n = nextOf[phase];
          setPhase(n);
          return durations[n];
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isActive, phase]);

  const label = phase === "inhale" ? "Inspira" : phase === "hold" ? "SostÃ©n" : "Exhala";
  const color = phase === "inhale" ? "text-emerald-400" : phase === "hold" ? "text-amber-300" : "text-sky-400";
  const ringColor = phase === "inhale" ? "border-emerald-500/30" : phase === "hold" ? "border-amber-400/30" : "border-sky-400/30";
  const bgColor = phase === "inhale" ? "bg-emerald-500/5" : phase === "hold" ? "bg-amber-400/5" : "bg-sky-400/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel-deep rounded-2xl p-6 md:p-7"
    >
      <div className="flex items-center gap-2 mb-5">
        <Wind className="w-4 h-4 text-gold-base/70" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          RespiraciÃ³n Guiada 4-7-8
        </span>
      </div>

      {!isActive ? (
        <motion.button
          onClick={() => { setIsActive(true); setPhase("inhale"); setSeconds(4); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-xl border border-gold-base/15 text-gold-light font-display text-sm uppercase tracking-wider hover:bg-gold-base/5 hover:border-gold-base/30 transition-all duration-400 group"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-base/40 group-hover:bg-gold-base transition-colors" />
            Comenzar RespiraciÃ³n
          </span>
        </motion.button>
      ) : (
        <div className="flex items-center gap-6">
          {/* Animated circle */}
          <div className="relative w-24 h-24 shrink-0">
            {/* Glow ring */}
            <div className={`absolute inset-0 rounded-full breathing-ring ${bgColor} transition-colors duration-700`} />
            
            {/* Dynamic outer aura */}
            <motion.div
              animate={{
                scale: phase === "inhale" ? [0.65, 1.25] : phase === "hold" ? [1.25, 1.3, 1.25] : [1.25, 0.65],
                opacity: phase === "inhale" ? [0.3, 0.8] : phase === "hold" ? 0.8 : [0.8, 0.3],
              }}
              transition={{
                duration: durations[phase],
                ease: "easeInOut",
              }}
              className={`absolute inset-[-6px] rounded-full blur-[6px] ${bgColor} border border-gold-base/30`}
            />

            <motion.div
              animate={{
                scale: phase === "inhale" ? [0.55, 1] : phase === "hold" ? 1 : [1, 0.55],
              }}
              transition={{
                duration: durations[phase],
                ease: "easeInOut",
              }}
              className={`absolute inset-1 rounded-full border-2 ${ringColor} ${bgColor} transition-colors duration-700`}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display font-bold text-2xl ${color} transition-colors duration-500`}>
                {seconds}
              </span>
              <span className={`font-mono text-[9px] uppercase tracking-wider ${color} transition-colors duration-500 mt-0.5`}>
                {label}
              </span>
            </div>
          </div>

          {/* Info + stop */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="font-body text-xs text-white/40 leading-relaxed">
                Inspira 4s Â· SostÃ©n 7s Â· Exhala 8s
              </p>
              <p className="font-mono text-[10px] text-white/20 mt-1">
                TÃ©cnica del Dr. Andrew Weil para calmar el sistema nervioso.
              </p>
            </div>
            <button
              onClick={() => setIsActive(false)}
              className="font-display text-[10px] uppercase tracking-wider text-white/25 hover:text-white/50 transition-colors border border-white/5 px-3 py-1.5 rounded-full hover:border-white/15"
            >
              Detener
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�
   MAIN SECTION COMPONENT
   â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•�â•� */

const HealthWellnessSection = () => {
  const [activePillar, setActivePillar] = useState(wellnessPillars[0].id);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const current = wellnessPillars.find((p) => p.id === activePillar) || wellnessPillars[0];
  const CurrentIcon = current.icon;

  // Auto-rotate quotes
  useEffect(() => {
    const iv = setInterval(() => setQuoteIdx((i) => (i + 1) % quotes.length), 6000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="bienestar" className="relative py-28 md:py-40 px-6 bg-void overflow-hidden">
      {/* â•�â•�â•� AMBIENT BACKGROUND â•�â•�â•� */}
      {/* Gold nebula */}
      <div
        className="absolute pointer-events-none transition-all duration-[1500ms]"
        style={{
          top: "25%", left: "10%",
          transform: "translate(-50%, -50%)",
          width: 800, height: 800,
          background: "radial-gradient(circle, hsl(45 75% 52% / 0.02) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />
      {/* Pillar-specific glow (transitions with active pillar) */}
      <motion.div
        key={activePillar + "-glow"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute pointer-events-none"
        style={{
          top: "50%", right: "5%",
          transform: "translateY(-50%)",
          width: 600, height: 600,
          background: `radial-gradient(circle, ${current.glowColor} 0%, transparent 55%)`,
          filter: "blur(100px)",
        }}
      />
      {/* Floating decorative orbs */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-gold-base/20 animate-orbit pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-gold-base/15 animate-orbit-reverse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white/10 animate-orbit pointer-events-none" style={{ animationDuration: "40s" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* â•�â•�â•� HEADER â•�â•�â•� */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 md:mb-24"
        >
          <span className="inline-block font-mono text-[11px] uppercase tracking-[0.35em] text-gold-base/40 mb-6">
            // SANTUARIO DE BIENESTAR
          </span>

          <h2 className="font-display font-bold text-white mb-5" style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            Salud &{" "}
            <span className="text-gold-gradient animate-pulse-slow">Bienestar</span>
          </h2>

          <p className="font-body text-white/35 max-w-xl mx-auto leading-relaxed text-balance text-[15px]">
            Un espacio sagrado donde cuidar de ti no es un lujo â€” es una necesidad.
            Cinco pilares para restaurar tu equilibrio mental, emocional y fÃ­sico.
          </p>

          {/* Rotating quote */}
          <div className="relative h-14 max-w-md mx-auto overflow-hidden mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <p className="font-body italic text-[13px] text-white/20 leading-relaxed">
                  "{quotes[quoteIdx].text}"
                </p>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gold-base/20 mt-1">
                  â€” {quotes[quoteIdx].author}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Decorative line */}
          <div className="mt-10 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-base/15 to-transparent" />
        </motion.div>

        {/* â•�â•�â•� PILLAR SELECTOR â•�â•�â•� */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex justify-center gap-2 md:gap-3 mb-16 flex-wrap"
        >
          {wellnessPillars.map((p) => {
            const Icon = p.icon;
            const active = activePillar === p.id;
            return (
              <motion.button
                key={p.id}
                onClick={() => setActivePillar(p.id)}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center gap-1.5 px-5 py-3.5 rounded-2xl border transition-all duration-500 min-w-[76px] ${
                  active
                    ? "bg-gold-base/8 border-gold-base/35 shadow-[0_0_30px_rgba(212,175,55,0.08)]"
                    : "bg-white/[0.015] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.025]"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] transition-colors duration-500 ${active ? "text-gold-base" : "text-white/25"}`} />
                <span className={`font-mono text-[8px] uppercase tracking-[0.15em] transition-colors duration-500 ${active ? "text-white/70" : "text-white/20"}`}>
                  {p.title.split(" ")[0]}
                </span>
                {/* Active dot */}
                {active && (
                  <motion.div
                    layoutId="pillar-dot"
                    className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-gold-base"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* â•�â•�â•� CONTENT AREA â•�â•�â•� */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* â”€â”€ LEFT COLUMN â”€â”€ */}
              <div className="lg:col-span-5 space-y-5">
                {/* Hero Image */}
                <div className="relative group rounded-2xl overflow-hidden border border-white/[0.08] aspect-[4/3]">
                  <motion.img
                    key={current.heroImage}
                    src={current.heroImage}
                    alt={current.title}
                    loading="lazy"
                    initial={{ scale: 1.08, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-50 transition-opacity duration-700`} />

                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-gold-base/20 rounded-tl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-gold-base/20 rounded-br-lg" />

                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-void-deep/80 backdrop-blur-xl border border-white/[0.08]">
                    <CurrentIcon className="w-3 h-3 text-gold-base" />
                    <span className="font-mono text-[9px] text-white/60 uppercase tracking-wider">
                      {current.tagline}
                    </span>
                  </div>
                </div>

                {/* Philosophy */}
                <div className="glass-panel rounded-xl p-5 border-l-2 border-gold-base/15">
                  <p className="font-body italic text-[13px] text-white/35 leading-relaxed">
                    "{current.philosophy}"
                  </p>
                </div>

                {/* Description */}
                <p className="font-body text-white/40 text-[13px] leading-relaxed px-1">
                  {current.description}
                </p>

                {/* Stat Ring */}
                <div className="glass-panel rounded-xl p-5">
                  <StatRing value={current.stat.value} label={current.stat.label} sub={current.stat.sub} />
                </div>

                {/* Breathing Widget (desktop) */}
                <div className="hidden lg:block">
                  <BreathingWidget />
                </div>
              </div>

              {/* â”€â”€ RIGHT COLUMN â”€â”€ */}
              <div className="lg:col-span-7 space-y-5">
                {/* Pillar Header */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-gold-base/8 border border-gold-base/20 flex items-center justify-center">
                    <CurrentIcon className="w-5 h-5 text-gold-base" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl tracking-wide text-white">{current.title}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-base/40">
                      {current.tagline}
                    </p>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-3">
                  {current.services.map((svc, i) => (
                    <ServiceCard key={svc.name} service={svc} index={i} />
                  ))}
                </div>

                {/* Quick Pillar Switcher */}
                <div className="pt-5 border-t border-white/[0.04]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/15 mb-3">
                    Explorar otros pilares
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {wellnessPillars
                      .filter((p) => p.id !== activePillar)
                      .map((p) => {
                        const Icon = p.icon;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setActivePillar(p.id)}
                            className="flex items-center gap-2 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 group"
                          >
                            <Icon className="w-3.5 h-3.5 text-white/20 group-hover:text-gold-base/50 transition-colors" />
                            <span className="font-display text-[10px] uppercase tracking-wider text-white/25 group-hover:text-white/45 transition-colors truncate">
                              {p.title.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Breathing Widget (mobile) */}
                <div className="lg:hidden">
                  <BreathingWidget />
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 pt-3">
                  <motion.a
                    whileHover={{ scale: 1.03, x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    href={buildWhatsAppUrl(
                      `Hola SKY CLUB ðŸ‘‹, me interesa el pilar de ${current.title} de Salud y Bienestar. Â¿Me podÃ©is dar mÃ¡s informaciÃ³n?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3 px-7 py-3.5 rounded-full bg-gold-base text-void font-display text-xs uppercase tracking-wider hover:bg-gold-light transition-all duration-300 shadow-gold shimmer overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Consulta Gratuita
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    href="https://vital-depth-guide.lovable.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-7 py-3.5 rounded-full border border-gold-base/15 text-gold-light font-display text-xs uppercase tracking-wider hover:bg-gold-base/5 hover:border-gold-base/30 transition-all duration-300"
                  >
                    Programa Completo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* â•�â•�â•� HOLISTIC BENEFITS STRIP â•�â•�â•� */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mt-24 md:mt-28"
        >
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold-base/10 to-transparent mb-12" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {[
              { icon: Shield, label: "Inmunidad", desc: "Reforzada" },
              { icon: Brain, label: "Claridad Mental", desc: "Expandida" },
              { icon: Flame, label: "EnergÃ­a Vital", desc: "Restaurada" },
              { icon: Eye, label: "Autoconciencia", desc: "Despertada" },
              { icon: Heart, label: "Paz Interior", desc: "Cultivada" },
            ].map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="glass-panel rounded-xl p-5 text-center group hover:border-gold-base/15 transition-all duration-500 cursor-default"
              >
                <b.icon className="w-5 h-5 text-gold-base/40 mx-auto mb-2.5 group-hover:text-gold-base transition-colors duration-500" />
                <p className="font-display text-[11px] font-semibold text-white/60 uppercase tracking-wider group-hover:text-white/80 transition-colors">
                  {b.label}
                </p>
                <p className="font-mono text-[9px] text-white/20 mt-0.5 group-hover:text-gold-base/40 transition-colors">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-base/15 to-transparent" />
    </section>
  );
};

export default HealthWellnessSection;
