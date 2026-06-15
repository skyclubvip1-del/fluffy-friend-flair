import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Key, Crown, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface PricingCardProps {
  tier: string;
  price: number;
  originalPrice?: number;
  offerLabel?: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  isPopular?: boolean;
  isPremium?: boolean;
  isFree?: boolean;
  delay?: number;
  onCtaClick?: () => void;
}

const PricingCard = ({ tier, price, originalPrice, offerLabel, icon, features, cta, isPopular, isPremium, isFree, delay = 0, onCtaClick }: PricingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-100, 100], [16, -16]);
  const rotateY = useTransform(x, [-100, 100], [-16, 16]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Initial count up animation
  useEffect(() => {
    if (hasAnimated || isFree) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayPrice(Math.floor(price * eased * 100) / 100);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayPrice(price);
            }
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [price, hasAnimated, isFree]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        window.dispatchEvent(
          new CustomEvent("play-audio-chime", { 
            detail: { freq: 330 + Math.random() * 150, isDeep: false } 
          })
        );
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={`
        relative rounded-3xl p-8 transition-all duration-500 card-sheen cursor-pointer preserve-3d
        ${isPremium
          ? 'bg-[#140e08] border-beam border-2 border-gold-base scale-105 md:scale-110 shadow-[0_20px_50px_rgba(212,163,89,0.35)] z-10'
          : isPopular
            ? 'bg-[#0c0905]/85 border-beam border-2 border-gold-base/50 shadow-[0_15px_35px_rgba(212,163,89,0.2)]'
            : 'bg-[#0e0a05] border border-gold-base/35 shadow-md'
        }
      `}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold-gradient text-void text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(212,163,89,0.3)]">
          Más Elegido
        </div>
      )}

      {/* Offer Badge */}
      {offerLabel && (
        <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gold-gradient text-void text-xs font-bold uppercase tracking-wider shadow-gold animate-pulse-slow">
          {offerLabel}
        </div>
      )}

      {/* Premium Glow */}
      {isPremium && (
        <div className="absolute inset-0 rounded-3xl shadow-gold-glow opacity-30 pointer-events-none" />
      )}

      {/* Icon */}
      <div 
        className={`mb-6 transition-transform duration-500 preserve-3d ${isPremium ? 'animate-float' : ''}`} 
        style={{ transform: isHovered ? "translateZ(30px)" : "translateZ(15px)" }}
      >
        {icon}
      </div>

      {/* Tier Name */}
      <h3 
        className="font-display font-bold text-xl mb-2 text-gold-gradient transition-transform duration-500" 
        style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(10px)" }}
      >
        {tier}
      </h3>

      {/* Price */}
      <div 
        className="mb-6 transition-transform duration-500" 
        style={{ transform: isHovered ? "translateZ(25px)" : "translateZ(8px)" }}
      >
        {isFree ? (
          <span className="font-display font-bold text-5xl text-white">
            Gratis
          </span>
        ) : (
          <>
            {originalPrice && (
              <span className="font-display text-xl text-white/30 line-through mr-3">
                {originalPrice.toFixed(2)}€
              </span>
            )}
            <span className="font-display font-bold text-5xl text-gold-base" style={{ textShadow: "0 0 10px rgba(212,163,89,0.25)" }}>
              {displayPrice.toFixed(2)}€
            </span>
            <span className="text-white/40 text-sm">/mes</span>
            {originalPrice && (
              <p className="text-gold-base/70 text-xs mt-1 font-mono">
                Primeros 3 meses · después {originalPrice.toFixed(2)}€/mes
              </p>
            )}
          </>
        )}
      </div>

      {/* Features */}
      <ul 
        className="space-y-3 mb-8 transition-transform duration-500" 
        style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(5px)" }}
      >
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <Check className="w-4 h-4 shrink-0 text-gold-base" />
            <span className="text-white/75">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <div 
        className="transition-transform duration-500 preserve-3d"
        style={{ transform: isHovered ? "translateZ(35px)" : "translateZ(5px)" }}
      >
        <button
          type="button"
          onClick={onCtaClick}
          className={`
            relative z-20 cursor-pointer
            w-full py-4 rounded-full font-display font-bold text-sm uppercase tracking-wider
            transition-all duration-300
            ${isPremium
              ? 'bg-gold-gradient text-void hover:shadow-gold hover:scale-[1.02]'
              : isPopular
                ? 'bg-gold-gradient text-void hover:shadow-gold hover:scale-[1.02]'
                : 'border border-gold-base/30 text-gold-light hover:bg-gold-base/10 hover:border-gold-base/60'
            }
          `}
        >
          {cta}
        </button>
      </div>
    </motion.div>
  );
};

const InteractiveGoldCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 140 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-12, 12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);

    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    
    // Calculate percentage coordinates for the shining gloss reflection
    cardRef.current.style.setProperty("--shine-x", `${(xPos / rect.width) * 100}%`);
    cardRef.current.style.setProperty("--shine-y", `${(yPos / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      className="perspective-1200 flex justify-center mt-16 cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-80 sm:w-96 h-48 sm:h-56 rounded-2xl gold-card-bg border-beam border-2 border-gold-light/40 shadow-[0_25px_60px_rgba(212,163,89,0.38)] p-6 sm:p-8 flex flex-col justify-between overflow-hidden group select-none"
      >
        {/* Dynamic Light Shine effect - realistic gold foil specular reflection */}
        <div 
          className="absolute inset-0 opacity-70 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "radial-gradient(circle 240px at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255,255,255,0.65) 0%, transparent 65%)",
            mixBlendMode: "overlay"
          }}
        />

        {/* Card Border Highlight beam */}
        <div className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none group-hover:border-gold-light/50 transition-colors duration-500" />

        {/* Card Content - laser engraved look (deep gold-brown #2a1a05) */}
        <div className="flex justify-between items-start" style={{ transform: "translateZ(35px)" }}>
          <div className="font-display font-bold text-[#2a1a05]/75 text-[9px] sm:text-[10px] tracking-[0.3em]">
            24K GOLD MEMBERSHIP
          </div>
          {/* Logo */}
          <div className="font-display font-black text-[#261603] text-lg sm:text-xl tracking-wider" style={{ textShadow: "0.5px 0.5px 0px rgba(255,255,255,0.2)" }}>
            SKY CLUB
          </div>
        </div>

        {/* Card Chip - Platinum Chrome */}
        <div 
          className="w-11 h-9 sm:w-12 sm:h-10 rounded-md bg-gradient-to-br from-white via-slate-200 to-slate-400 border border-white/40 relative shadow-md overflow-hidden" 
          style={{ transform: "translateZ(25px)" }}
        >
          {/* Micro lines on chip */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:4px_4px]" />
        </div>

        {/* Card Holder Info */}
        <div className="flex justify-between items-end" style={{ transform: "translateZ(30px)" }}>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#2a1a05]/65">
              MEMBER NUMBER
            </div>
            <div className="font-mono text-xs text-[#201002] tracking-widest mt-0.5 font-bold">
              XXXX XXXX XXXX 0042
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#2a1a05]/65">
              STATUS
            </div>
            <div className="font-mono text-xs text-[#201002] tracking-widest uppercase mt-0.5 font-bold">
              MIDAS INNER CIRCLE
            </div>
          </div>
        </div>

        {/* Intense gold halo glow behind the card */}
        <div className="absolute -inset-10 bg-gold-base/20 blur-[85px] rounded-full -z-10 opacity-80 animate-pulse-slow" />
      </motion.div>
    </div>
  );
};

const MembershipSection = () => {
  const [sliderValue, setSliderValue] = useState(100);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();

  const multiplier = 2.5 + (sliderValue / 100) * 5;
  const projectedValue = Math.round(sliderValue * multiplier);

  const handleSubscribe = (priceId: string) => {
    openCheckout({
      priceId,
      customerEmail: user?.email ?? undefined,
      userId: user?.id ?? "",
      returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  const handleFree = () => {
    if (!user) navigate("/auth");
  };

  return (
    <section id="membership" className="relative py-24 md:py-32 px-6 bg-void overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-base/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-base/60">
            // THE ALTAR
          </span>
          <h2 className="font-display font-bold text-heading-1 text-white mt-4 mb-4">
            Elige Tu <span className="text-gold-gradient">Elevación</span>
          </h2>
          <p className="font-body text-white/50 max-w-md mx-auto">
            El coste de la ignorancia es mayor que el precio de la excelencia.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch mb-24">
          <PricingCard
            tier="GRATUITA"
            price={0}
            isFree
            icon={<Key className="w-10 h-10 text-gold-base/60" />}
            features={["Acceso Digital Básico", "Contenido Comunitario", "Newsletter Semanal", "Comunidad Discord"]}
            cta="Empezar Gratis"
            delay={0.1}
            onCtaClick={handleFree}
          />
          <PricingCard
            tier="NIVEL ATMOSFÉRICO"
            price={7.99}
            originalPrice={9.99}
            offerLabel="¡Oferta 3 meses!"
            icon={<Crown className="w-10 h-10 text-gold-base animate-pulse-slow shadow-[0_0_10px_rgba(212,163,89,0.3)]" />}
            features={["Todo lo Gratuito +", "Contenido Exclusivo Premium", "Descuentos 15%", "Eventos Mensuales", "Mentoría Grupal"]}
            cta="Elevarse"
            isPopular
            delay={0.2}
            onCtaClick={() => handleSubscribe("sky_atmospheric_monthly")}
          />
          <PricingCard
            tier="CÍRCULO INTERNO"
            price={15.99}
            icon={<Sparkles className="w-12 h-12 text-gold-base shadow-[0_0_15px_rgba(212,163,89,0.4)]" />}
            features={["Todo lo Atmosférico +", "Acceso VIP 24/7", "Mentoría Privada", "Sastrería a Medida", "Black Card Física"]}
            cta="Reclamar Trono"
            isPremium
            delay={0.3}
            onCtaClick={() => handleSubscribe("sky_inner_circle_monthly")}
          />
        </div>

        <Dialog open={isOpen} onOpenChange={(o) => !o && closeCheckout()}>
          <DialogContent className="max-w-2xl bg-void border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-gold-gradient">Completa tu suscripción</DialogTitle>
            </DialogHeader>
            {checkoutElement}
          </DialogContent>
        </Dialog>

        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-8 md:p-12 shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-gold-base/20"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display font-bold text-heading-2 text-white mb-4">
                ¿Cuánto Vale Tu <span className="text-gold-gradient">Imagen</span>?
              </h3>
              <p className="text-white/50 mb-8">
                Desliza para ver el impacto potencial de tu inversión en ti mismo.
              </p>

              {/* Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-6 
                    [&::-webkit-slider-thumb]:h-6 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-gold-gradient 
                    [&::-webkit-slider-thumb]:shadow-gold 
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="font-mono text-xs text-white/30">50€</span>
                  <span className="font-mono text-xs text-white/30">500€</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-base/60">
                Impacto Proyectado
              </span>
              <div className="flex items-baseline justify-center md:justify-end gap-2 mt-2">
                <span className="font-display font-bold text-6xl text-gold-gradient" style={{ textShadow: "0 0 15px rgba(212,163,89,0.35)" }}>
                  {projectedValue}€
                </span>
                <span className="text-white/40">/mes</span>
              </div>
              <p className="text-white/40 text-sm mt-2">
                En oportunidades, confianza y retorno de imagen
              </p>
            </div>
          </div>
        </motion.div>

        {/* Solid Gold Card 3D Interactive Visual */}
        <InteractiveGoldCard />
      </div>
    </section>
  );
};

export default MembershipSection;
