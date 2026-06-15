import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  char: string;
  vx: number;
  vy: number;
}

interface BloodGoldParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number; // 0 to 1
  maxLife: number; // in ms
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

const WORDS = ["HAIL JESUS", "MIDAS", "SANGUIS", "AURUM", "AVARITIA", "HAIL MARIA"];

export default function MidasTouch() {
  const [trail, setTrail] = useState<TrailParticle[]>([]);
  const [bloodParticles, setBloodParticles] = useState<BloodGoldParticle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const lastMoveTimeRef = useRef(0);
  const particleIdRef = useRef(0);
  const bloodIdRef = useRef(0);
  const textIdRef = useRef(0);

  // Check touch capability
  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Handle mouse move & custom cursor position
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Throttle particle emission
      const now = Date.now();
      if (now - lastMoveTimeRef.current > 30) {
        lastMoveTimeRef.current = now;
        
        // Spawn 2-4 gold & luxury dust particles
        const newParticles: TrailParticle[] = [];
        const count = Math.floor(Math.random() * 3) + 2; // 2 to 4 particles
        
        for (let i = 0; i < count; i++) {
          const chars = ["✦", "★", "✧", "•", "✨", "⚜", "♛", "🜚"];
          const char = chars[Math.floor(Math.random() * chars.length)];
          const size = Math.random() * 10 + 4;
          const id = particleIdRef.current++;
          
          newParticles.push({
            id,
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            size,
            color: Math.random() > 0.4 ? "text-gold-base" : (Math.random() > 0.3 ? "text-gold-light" : "text-[#8a0303]"),
            opacity: Math.random() * 0.6 + 0.4,
            char,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.3) * -2.0 - 0.8, // drift upwards faster
          });
        }

        setTrail((prev) => [...prev, ...newParticles].slice(-75)); // Keep max 75 particles
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      if (target) {
        const isInteractive =
          target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") ||
          target.closest("button") ||
          target.closest(".cursor-pointer") ||
          target.getAttribute("role") === "button" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT";
        
        setIsHoveringInteractive(!!isInteractive);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouchDevice]);

  // Trail physics update loop
  useEffect(() => {
    let frameId: number;
    
    const updateTrail = () => {
      setTrail((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.02,
          }))
          .filter((p) => p.opacity > 0)
      );

      frameId = requestAnimationFrame(updateTrail);
    };

    frameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Blood to gold particles physics loop
  useEffect(() => {
    let frameId: number;
    const tickTime = 16; // ~60fps target

    const updateBloodParticles = () => {
      setBloodParticles((prev) =>
        prev
          .map((p) => {
            const nextLife = p.life + tickTime / p.maxLife;
            // apply gravity and air resistance
            const nextVx = p.vx * 0.96;
            const nextVy = p.vy * 0.96 + 0.12; // slow fall down
            return {
              ...p,
              x: p.x + nextVx,
              y: p.y + nextVy,
              vx: nextVx,
              vy: nextVy,
              life: nextLife,
            };
          })
          .filter((p) => p.life < 1)
      );

      frameId = requestAnimationFrame(updateBloodParticles);
    };

    frameId = requestAnimationFrame(updateBloodParticles);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Click handler: Blood splash transmuting to gold
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Trigger dynamic chime audio on click
      window.dispatchEvent(
        new CustomEvent("play-audio-chime", { 
          detail: { freq: 180 + Math.random() * 90, isDeep: true } 
        })
      );

      // 1. Create Blood & Gold particles
      const newParticles: BloodGoldParticle[] = [];
      const particleCount = Math.floor(Math.random() * 8) + 16; // 16 to 24 particles
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        const maxLife = Math.random() * 500 + 700; // 700ms - 1200ms
        
        newParticles.push({
          id: bloodIdRef.current++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5, // initial upward blast
          size: Math.random() * 6 + 3,
          life: 0,
          maxLife,
        });
      }

      setBloodParticles((prev) => [...prev, ...newParticles]);

      // 2. Create gothic texts floating up
      if (Math.random() > 0.3) {
        const text = WORDS[Math.floor(Math.random() * WORDS.length)];
        const textId = textIdRef.current++;
        setFloatingTexts((prev) => [
          ...prev,
          {
            id: textId,
            x,
            y: y - 20,
            text,
          },
        ]);

        // Auto remove text after 1.5s
        setTimeout(() => {
          setFloatingTexts((prev) => prev.filter((t) => t.id !== textId));
        }, 1500);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, []);

  return (
    <>
      {/* Hide native cursor globally on desktop */}
      {!isTouchDevice && (
        <style>{`
          body, a, button, select, input, textarea, [role="button"], .cursor-pointer {
            cursor: none !important;
          }
        `}</style>
      )}

      {/* Interactive Custom Cursor */}
      {!isTouchDevice && (
        <div
          className="fixed pointer-events-none z-[99999] transition-transform duration-75 -translate-x-1/2 -translate-y-1/2"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          {/* Outer ring - Gold */}
          <motion.div
            animate={{
              rotate: 360,
              scale: isHoveringInteractive ? 1.4 : 1,
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 4, ease: "linear" },
              scale: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className={`w-8 h-8 rounded-full border border-gold-base/60 flex items-center justify-center`}
          >
            {/* Inner ring - Blood/Gold shifting */}
            <motion.div
              animate={{
                scale: isHoveringInteractive ? [1, 1.2, 1] : 1,
              }}
              transition={{
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              }}
              className={`w-3.5 h-3.5 rounded-full ${
                isHoveringInteractive ? "bg-[#8a0303] shadow-[0_0_10px_#8a0303]" : "bg-gold-base"
              } transition-colors duration-300`}
            />
          </motion.div>

          {/* Interactive expansion lock indicator */}
          {isHoveringInteractive && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.8, scale: 1 }}
                className="absolute inset-[-6px] rounded-full border border-dashed border-[#8a0303]/70 animate-[spin_10s_linear_infinite]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.5, scale: [1.6, 1.8, 1.6], rotate: -360 }}
                transition={{
                  rotate: { repeat: Infinity, duration: 8, ease: "linear" },
                  scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                }}
                className="absolute inset-[-12px] rounded-full border border-gold-base/35"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-[1px] bg-gold-base/50 blur-[1px] animate-pulse" />
            </>
          )}
        </div>
      )}

      {/* Cursor Mouse Trail */}
      {!isTouchDevice && (
        <div className="fixed inset-0 pointer-events-none z-[99998] overflow-hidden">
          {trail.map((p) => (
            <div
              key={p.id}
              className={`absolute font-display select-none transition-opacity ${p.color}`}
              style={{
                left: p.x - p.size / 2,
                top: p.y - p.size / 2,
                fontSize: `${p.size}px`,
                opacity: p.opacity,
                transform: `rotate(${p.id * 15}deg)`,
                textShadow: "0 0 8px currentColor",
              }}
            >
              {p.char}
            </div>
          ))}
        </div>
      )}

      {/* Blood to Gold Transmutation Clicks */}
      <div className="fixed inset-0 pointer-events-none z-[99997] overflow-hidden">
        {bloodParticles.map((p) => {
          // In the first 40% of its life, it is dark blood-red. After 40%, it transmutes to gold!
          const isGold = p.life >= 0.4;
          const progress = p.life;
          const opacity = 1 - progress;
          
          return (
            <div
              key={p.id}
              className="absolute rounded-full transition-colors duration-200"
              style={{
                left: p.x - p.size / 2,
                top: p.y - p.size / 2,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: isGold ? "#ffeeb8" : "#8a0303",
                boxShadow: isGold 
                  ? "0 0 10px #ffeeb8, 0 0 20px #d4a359"
                  : "0 0 6px #8a0303, inset 0 0 4px #000",
                opacity,
                transform: `scale(${isGold ? 1.4 : 1})`,
              }}
            />
          );
        })}
      </div>

      {/* Floating Divine / Luxury Labels */}
      <div className="fixed inset-0 pointer-events-none z-[99996] overflow-hidden">
        <AnimatePresence>
          {floatingTexts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: t.y, scale: 0.8 }}
              animate={{ opacity: 0.9, y: t.y - 60, scale: 1 }}
              exit={{ opacity: 0, y: t.y - 90 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute font-display text-[11px] font-bold tracking-[0.3em] pointer-events-none select-none text-transparent bg-clip-text"
              style={{
                left: t.x - 50,
                backgroundImage: "linear-gradient(90deg, #d4a359, #ffeeb8, #d4a359)",
                textShadow: "0 0 10px rgba(212, 163, 89, 0.4), 0 0 20px rgba(255, 238, 184, 0.3)",
              }}
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
