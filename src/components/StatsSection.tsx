import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const Counter = ({ value, duration = 2.0 }: { value: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    // Parse the number from the value string (e.g., "+2.000" -> 2000, "5★" -> 5, "8+" -> 8)
    const sanitizedVal = value.replace(/\./g, ""); // Remove dots for parsing
    const match = sanitizedVal.match(/\d+/);
    if (!match) {
      return;
    }
    const target = parseInt(match[0], 10);
    const start = 0;
    const end = target;
    const range = end - start;
    if (range === 0) return;

    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / (duration * 1000), 1);
      
      // Quadratic ease-out formula
      const easeProgress = 1 - (1 - progressPercent) * (1 - progressPercent);
      const currentCount = Math.floor(start + easeProgress * range);
      
      setCount(currentCount);

      if (progressPercent < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animateCount);
  }, [value, duration, isInView]);

  if (!value.match(/\d+/)) {
    return <span ref={ref}>{value}</span>;
  }

  // Re-assemble the string with the animated counter
  const formattedCount = count.toLocaleString("es-ES");
  const prefix = value.startsWith("+") ? "+" : "";
  const suffix = value.endsWith("+") ? "+" : value.endsWith("★") ? "★" : "";
  
  return (
    <span ref={ref} className="font-display">
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
};

export const StatsSection = () => {
  const stats = [
    { label: "Años de experiencia", value: "8+" },
    { label: "Clientes satisfechos", value: "+2.000" },
    { label: "en Google", value: "5★" },
    { label: "Ubicación", value: "Valencia, ESP" },
  ];

  return (
    <section className="relative py-20 bg-[#080808] border-y border-gold-base/15 overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute inset-0 bg-void opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gold-base/5 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gold-base/5 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center justify-center"
            >
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gold-base tracking-tight mb-2 filter drop-shadow-[0_2px_8px_rgba(212,163,89,0.35)]">
                {stat.value.includes("Valencia") ? (
                  <span className="text-2xl md:text-3xl lg:text-4xl tracking-wider font-semibold">{stat.value}</span>
                ) : (
                  <Counter value={stat.value} />
                )}
              </h3>
              <p className="font-mono text-[9px] md:text-xs uppercase tracking-[0.25em] text-gold-light/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
