import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useCallback } from "react";

interface VaultLoaderProps {
  onComplete: () => void;
}

// Stable particle config generated outside render
const generateParticles = (count: number) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2,
      driftX: (Math.random() - 0.5) * 60,
      driftY: -(Math.random() * 80 + 40),
    });
  }
  return particles;
};

const TITLE_LETTERS = "SKY CLUB".split("");

const VaultLoader = ({ onComplete }: VaultLoaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const particles = useMemo(() => generateParticles(40), []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem("vault-opened", "true");
    setIsVisible(false);
    // Allow exit animation to play before calling onComplete
    setTimeout(onComplete, 600);
  }, [onComplete]);

  // Check session storage — skip if already opened
  useEffect(() => {
    if (sessionStorage.getItem("vault-opened") === "true") {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Animate progress bar over ~3s
    const startTime = Date.now();
    const duration = 3000;
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - pct, 3);
      setProgress(eased * 100);

      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    const timer = setTimeout(handleComplete, 3500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [onComplete, handleComplete]);

  // Don't render if not visible and exit animation complete
  if (!isVisible && sessionStorage.getItem("vault-opened") === "true") {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="vault-loader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#050403" }}
        >
          {/* Floating gold dust particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background:
                    "radial-gradient(circle, hsl(45, 82%, 54%) 0%, hsl(45, 82%, 40%) 100%)",
                  boxShadow: "0 0 6px hsl(45, 82%, 54% / 0.6)",
                }}
                animate={{
                  x: [0, p.driftX, p.driftX * 0.5],
                  y: [0, p.driftY * 0.5, p.driftY],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            ))}
          </div>

          {/* Central content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* SKY CLUB title — letter-by-letter stagger */}
            <div className="flex items-center gap-[2px]" aria-label="SKY CLUB">
              {TITLE_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-[0.3em] select-none"
                  style={{
                    color: "hsl(45, 82%, 54%)",
                    textShadow:
                      "0 0 20px hsl(45, 82%, 54% / 0.6), 0 0 60px hsl(45, 82%, 54% / 0.3), 0 0 100px hsl(45, 82%, 40% / 0.15)",
                  }}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>

            {/* Vault door gold line — expands from center */}
            <motion.div
              className="relative h-[2px] overflow-hidden"
              style={{ width: "clamp(200px, 50vw, 500px)" }}
            >
              <motion.div
                className="absolute inset-y-0 left-1/2"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, hsl(45, 82%, 54%) 30%, hsl(45, 90%, 65%) 50%, hsl(45, 82%, 54%) 70%, transparent 100%)",
                  boxShadow:
                    "0 0 20px hsl(45, 82%, 54% / 0.5), 0 0 40px hsl(45, 82%, 54% / 0.2)",
                }}
                initial={{ width: "0%", x: "0%" }}
                animate={{ width: "100%", x: "-50%" }}
                transition={{
                  duration: 1.8,
                  delay: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              {/* Glow pulse on the line */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, hsl(45, 82%, 54% / 0.4) 0%, transparent 70%)",
                }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 2,
                  delay: 2,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-xs md:text-sm tracking-[0.5em] uppercase font-body"
              style={{ color: "hsl(45, 82%, 54% / 0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
            >
              Entering the Vault
            </motion.p>
          </div>

          {/* Liquid gold progress bar at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden">
            <motion.div
              className="h-full origin-left"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, hsl(45, 82%, 40%) 0%, hsl(45, 82%, 54%) 40%, hsl(45, 90%, 70%) 60%, hsl(45, 82%, 54%) 100%)",
                boxShadow:
                  "0 0 12px hsl(45, 82%, 54% / 0.6), 0 0 30px hsl(45, 82%, 54% / 0.3)",
              }}
              transition={{ duration: 0.05, ease: "linear" }}
            />
            {/* Shimmer on progress bar leading edge */}
            <motion.div
              className="absolute top-0 h-full w-12"
              style={{
                left: `${progress}%`,
                transform: "translateX(-100%)",
                background:
                  "linear-gradient(90deg, transparent 0%, hsl(45, 90%, 75% / 0.8) 50%, transparent 100%)",
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VaultLoader;
