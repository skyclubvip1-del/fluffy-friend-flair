import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";

interface OrbConfig {
  id: number;
  color: string;
  size: number;
  x: number;
  y: number;
  blur: number;
  opacity: number;
  duration: number;
  /** Keyframes for orbital drift (percentage-based offsets) */
  driftX: number[];
  driftY: number[];
}

const ORB_COLORS = [
  "#0a0805",
  "#0f0b06",
  "#1a1505",
  "#0f0505",
  "#050403",
  "#120e05",
];

const GradientMeshBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse tracking
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 40 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 40 });

  // Map mouse position to ±15px offset
  const offsetX = useTransform(smoothMouseX, [0, 1], [-15, 15]);
  const offsetY = useTransform(smoothMouseY, [0, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const orbs = useMemo<OrbConfig[]>(() => {
    const configs: OrbConfig[] = [];
    for (let i = 0; i < 6; i++) {
      const size = 300 + Math.random() * 300; // 300-600px
      configs.push({
        id: i,
        color: ORB_COLORS[i],
        size,
        x: Math.random() * 80 + 10, // 10-90% of viewport
        y: Math.random() * 80 + 10,
        blur: 120 + Math.random() * 60, // 120-180px
        opacity: 0.15 + Math.random() * 0.15, // 0.15-0.3
        duration: 20 + Math.random() * 20, // 20-40s
        driftX: [
          0,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 25,
          0,
        ],
        driftY: [
          0,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 15,
          0,
        ],
      });
    }
    return configs;
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
            mixBlendMode: "screen",
            // React to mouse — add offset
            x: offsetX,
            y: offsetY,
          }}
          animate={{
            translateX: orb.driftX.map((v) => `${v}%`),
            translateY: orb.driftY.map((v) => `${v}%`),
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle gold radial wash at center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(45, 82%, 54% / 0.02) 0%, transparent 60%)",
        }}
      />
    </div>
  );
};

export default GradientMeshBackground;
