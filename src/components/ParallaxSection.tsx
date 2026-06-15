import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, type ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  id?: string;
}

// Stable divider dot configs
const generateDividerDots = () => {
  const dots = [];
  for (let i = 0; i < 4; i++) {
    dots.push({
      id: i,
      duration: 3 + Math.random() * 2,
      delay: i * 0.8,
      size: 3 + Math.random() * 2,
    });
  }
  return dots;
};

const ParallaxSection = ({
  children,
  speed = 0.05,
  className = "",
  id,
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle Y parallax based on speed
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  // Scale effect: 1.0 at center → 0.98 at edges
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

  // Progressive opacity reduction as section scrolls away
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.6, 1, 1, 0.6]
  );

  // Progressive blur as section scrolls away (mapped to filter string)
  const blurValue = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [2, 0, 0, 2]
  );

  const dividerDots = useMemo(() => generateDividerDots(), []);

  return (
    <div ref={ref} id={id} className={`relative ${className}`}>
      <motion.div
        style={{
          y,
          scale,
          opacity,
          filter: useTransform(blurValue, (v) => `blur(${v}px)`),
        }}
      >
        {children}
      </motion.div>

      {/* Gold particle divider at the bottom */}
      <div className="relative w-full h-[1px] mt-8" aria-hidden="true">
        {/* Static gold line */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(45, 82%, 54% / 0.15) 20%, hsl(45, 82%, 54% / 0.25) 50%, hsl(45, 82%, 54% / 0.15) 80%, transparent 100%)",
          }}
        />

        {/* Animated dots traveling along the line */}
        {dividerDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: dot.size,
              height: dot.size,
              background: "hsl(45, 82%, 54%)",
              boxShadow:
                "0 0 8px hsl(45, 82%, 54% / 0.8), 0 0 20px hsl(45, 82%, 54% / 0.3)",
            }}
            animate={{
              left: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: dot.duration,
              delay: dot.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParallaxSection;
