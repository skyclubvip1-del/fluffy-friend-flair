import { motion } from "framer-motion";
import { useMemo } from "react";

const NoiseOverlay = () => {
  // Generate stable random properties for 22 gold dust particles
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 22; i++) {
      arr.push({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 3.5 + 1.5}px`,
        delay: `${Math.random() * 14}s`,
        duration: `${Math.random() * 8 + 10}s`,
      });
    }
    return arr;
  }, []);

  return (
    <>
      {/* Absolute background grid */}
      <div className="absolute inset-0 premium-grid opacity-[0.25] pointer-events-none -z-20" aria-hidden="true" />


      {/* Floating Gold Dust Particles */}
      <div className="gold-dust-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="gold-dust-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Noise Texture Overlay */}
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
};

export default NoiseOverlay;
