import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type TransitionType = "zoom" | "wipe" | "dissolve";

interface SceneTransitionProps {
  type: TransitionType;
  children: ReactNode;
  className?: string;
}

const ZoomTransition = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scale from 0.9 → 1.0 as element enters viewport
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.9, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 1, 1]);

  return (
    <div ref={ref}>
      <motion.div style={{ scale, opacity }}>{children}</motion.div>
    </div>
  );
};

const WipeTransition = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Wipe progress: gold line sweeps left → right
  const wipeProgress = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.5],
    [0, 0.5, 1]
  );

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Gold wipe line */}
      <motion.div
        className="absolute inset-y-0 z-10 pointer-events-none"
        style={{
          left: useTransform(wipeProgress, (v) => `${v}%`),
          width: "3px",
          background:
            "linear-gradient(180deg, transparent 0%, hsl(45, 82%, 54%) 30%, hsl(45, 90%, 65%) 50%, hsl(45, 82%, 54%) 70%, transparent 100%)",
          boxShadow:
            "0 0 20px hsl(45, 82%, 54% / 0.6), 0 0 40px hsl(45, 82%, 54% / 0.3), -10px 0 30px hsl(45, 82%, 54% / 0.1), 10px 0 30px hsl(45, 82%, 54% / 0.1)",
          opacity: useTransform(
            scrollYProgress,
            [0, 0.05, 0.45, 0.5],
            [0, 1, 1, 0]
          ),
        }}
      />

      {/* Content revealed via clip-path driven by scroll */}
      <motion.div
        style={{
          opacity: contentOpacity,
          clipPath: useTransform(
            wipeProgress,
            (v) => `inset(0 ${100 - v}% 0 0)`
          ),
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const DissolveTransition = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Dissolve via animated mask — gradient grows from center outward
  const maskSize = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0.8, 1]);

  return (
    <div ref={ref}>
      <motion.div
        style={{
          opacity,
          maskImage: useTransform(
            maskSize,
            (v) =>
              `radial-gradient(ellipse ${v}% ${v}% at 50% 50%, black ${Math.min(v * 0.8, 80)}%, transparent 100%)`
          ),
          WebkitMaskImage: useTransform(
            maskSize,
            (v) =>
              `radial-gradient(ellipse ${v}% ${v}% at 50% 50%, black ${Math.min(v * 0.8, 80)}%, transparent 100%)`
          ),
        }}
      >
        {children}
      </motion.div>

      {/* Particle dissolve overlay — fading specks */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          opacity: useTransform(
            scrollYProgress,
            [0, 0.2, 0.5],
            [0.6, 0.3, 0]
          ),
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, hsl(45, 82%, 54% / 0.5) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 60% 20%, hsl(45, 82%, 54% / 0.4) 50%, transparent 100%),
            radial-gradient(1px 1px at 40% 70%, hsl(45, 82%, 54% / 0.3) 50%, transparent 100%),
            radial-gradient(2px 2px at 80% 50%, hsl(45, 82%, 54% / 0.5) 50%, transparent 100%),
            radial-gradient(1px 1px at 10% 80%, hsl(45, 82%, 54% / 0.4) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 90% 10%, hsl(45, 82%, 54% / 0.3) 50%, transparent 100%),
            radial-gradient(1px 1px at 50% 50%, hsl(45, 82%, 54% / 0.5) 50%, transparent 100%),
            radial-gradient(2px 2px at 30% 90%, hsl(45, 82%, 54% / 0.4) 50%, transparent 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
    </div>
  );
};

const SceneTransition = ({
  type,
  children,
  className = "",
}: SceneTransitionProps) => {
  const TransitionComponent = {
    zoom: ZoomTransition,
    wipe: WipeTransition,
    dissolve: DissolveTransition,
  }[type];

  return (
    <div className={`relative ${className}`}>
      <TransitionComponent>{children}</TransitionComponent>
    </div>
  );
};

export default SceneTransition;
