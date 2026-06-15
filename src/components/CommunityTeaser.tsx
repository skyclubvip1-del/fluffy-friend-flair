import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Lock, Users } from "lucide-react";
import { useRef, useState } from "react";

const CommunityTeaser = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);

    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${xPos}px`);
    cardRef.current.style.setProperty("--mouse-y", `${yPos}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="community" className="relative py-20 px-6 bg-void overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1200,
            transformStyle: "preserve-3d",
          }}
          className="glass-panel border border-gold-base/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden cursor-pointer hover:shadow-[0_0_60px_rgba(212,163,89,0.35)] transition-shadow duration-700 border-beam"
        >
          {/* Glowing laser reflection */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
            style={{
              background: "radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 163, 89, 0.18) 0%, transparent 60%)"
            }}
          />

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-base/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Icon */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-void border border-gold-base/30 mb-6" style={{ transform: "translateZ(30px)" }}>
            <Lock className="w-8 h-8 text-gold-base" />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-gold-base/10"
            />
          </div>

          {/* Content */}
          <h3 className="font-display font-bold text-heading-2 text-gold-midas mb-4" style={{ transform: "translateZ(25px)" }}>
            El Vestuario VIP
          </h3>

          <div className="flex items-center justify-center gap-2 mb-4" style={{ transform: "translateZ(20px)" }}>
            <Users className="w-4 h-4 text-gold-base" />
            <span className="font-mono text-sm text-gold-base">
              500+ miembros activos ahora mismo
            </span>
          </div>

          <p className="font-body text-white/50 max-w-md mx-auto mb-8" style={{ transform: "translateZ(15px)" }}>
            Negocios cerrándose en tiempo real. Conexiones que transforman carreras.
            Acceso exclusivo para miembros del Inner Circle.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ transform: "translateZ(10px)" }}>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 font-display text-sm text-white/40 cursor-not-allowed">
              <Lock className="w-4 h-4" />
              Discord
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 font-display text-sm text-white/40 cursor-not-allowed">
              <Lock className="w-4 h-4" />
              Telegram
            </button>
          </div>

          <p className="mt-6 font-mono text-xs text-white/20 uppercase tracking-widest" style={{ transform: "translateZ(5px)" }}>
            Solo Miembros Verificados
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityTeaser;
