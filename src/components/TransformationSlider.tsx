import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import latinoMal from "@/assets/latino-mal.jpeg";
import latinoBien from "@/assets/latino-bien.png";

const TransformationSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <section className="relative py-24 md:py-32 px-6 bg-void overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-base/60">
            // THE MIRROR
          </span>
          <h2 className="font-display font-bold text-heading-1 text-gold-midas mt-4">
            Tu Transformación
          </h2>
        </motion.div>

        {/* Slider Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none"
        >
          {/* Before Image (Shadow) */}
          <div className="absolute inset-0">
            <img
              src={latinoMal}
              alt="Before"
              className="w-full h-full object-cover grayscale brightness-50"
            />
            <div className="absolute inset-0 bg-void/30" />
            
            {/* Before Label */}
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 rounded-full glass-panel font-mono text-xs uppercase tracking-widest text-white/60">
                Invisible
              </span>
            </div>
          </div>

          {/* After Image (Ascended) */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={latinoBien}
              alt="After"
              className="w-full h-full object-contain saturate-[0.9]"
              style={{ 
                filter: "brightness(1.1) contrast(1.05)",
                objectPosition: "center top",
              }}
            />
            {/* Golden Hour Overlay */}
            <div 
              className="absolute inset-0 mix-blend-overlay"
              style={{
                background: "linear-gradient(135deg, hsl(45 75% 52% / 0.15) 0%, transparent 60%)",
              }}
            />
            
            {/* After Label */}
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 rounded-full bg-gold-base/20 backdrop-blur-xl border border-gold-base/30 font-mono text-xs uppercase tracking-widest text-gold-light">
                Ascendido
              </span>
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-gold-gradient shadow-gold cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
          >
            {/* Handle Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold-gradient shadow-gold flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-0.5 h-4 bg-void rounded-full" />
                <div className="w-0.5 h-4 bg-void rounded-full" />
              </div>
            </div>

            {/* Spark Effect */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gold-base/20 blur-xl pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 font-mono text-xs uppercase tracking-[0.2em] text-white/30"
        >
          ← Arrastra para revelar →
        </motion.p>
      </div>
    </section>
  );
};

export default TransformationSlider;
