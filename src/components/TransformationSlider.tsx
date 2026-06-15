import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import latinoMal from "@/assets/latino-mal.jpeg";
import latinoBien from "@/assets/latino-bien.png";

const generatePath = (pos: number, amplitude: number, phase: number) => {
  let path = `M 0 0 L ${pos.toFixed(4)} 0 `;
  const steps = 14;
  for (let i = 1; i <= steps; i++) {
    const y = i / steps;
    const edgeDecay = Math.sin(y * Math.PI);
    const wave = Math.sin(y * Math.PI * 2.5 + phase) * amplitude * edgeDecay;
    const x = pos + wave;
    path += `L ${x.toFixed(4)} ${y.toFixed(4)} `;
  }
  path += `L 0 1 Z`;
  return path;
};

const TransformationSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  
  const pathRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  
  const amplitude = useRef(0);
  const phase = useRef(0);
  const targetAmplitude = useRef(0);
  const prevX = useRef<number | null>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);

    if (prevX.current !== null) {
      const vel = Math.abs(clientX - prevX.current);
      // Distort the wave based on dragging velocity
      targetAmplitude.current = Math.min(0.08, targetAmplitude.current + vel * 0.0028);
    }
    prevX.current = clientX;
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    window.dispatchEvent(
      new CustomEvent("play-audio-chime", { 
        detail: { freq: 440, isDeep: false } 
      })
    );
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    prevX.current = null;
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
      prevX.current = null;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Animation Loop for Liquid Wave Physics (60 FPS DOM updates)
  useEffect(() => {
    let animId = 0;

    const tick = () => {
      targetAmplitude.current *= 0.94; // Amortiguación (damping)
      amplitude.current += (targetAmplitude.current - amplitude.current) * 0.09;
      phase.current += isDragging.current ? 0.22 : 0.1; // Speed up wave osc when dragging

      const pos = sliderPosition / 100;
      
      // Update clip path
      if (pathRef.current) {
        const d = generatePath(pos, amplitude.current, phase.current);
        pathRef.current.setAttribute("d", d);
      }

      // Update gold line & circle handle using absolute coordinates
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        if (lineRef.current) {
          let linePath = `M ${pos * width} 0 `;
          const steps = 14;
          for (let i = 1; i <= steps; i++) {
            const y = i / steps;
            const edgeDecay = Math.sin(y * Math.PI);
            const wave = Math.sin(y * Math.PI * 2.5 + phase.current) * amplitude.current * edgeDecay;
            const x = pos + wave;
            linePath += `L ${(x * width).toFixed(2)} ${(y * height).toFixed(2)} `;
          }
          lineRef.current.setAttribute("d", linePath);
        }

        if (circleRef.current) {
          const centerY = height / 2;
          // Middle Y = 0.5 -> edgeDecay is sin(0.5 * PI) = 1
          const wave = Math.sin(0.5 * Math.PI * 2.5 + phase.current) * amplitude.current;
          const xVal = (pos + wave) * width;
          circleRef.current.style.transform = `translate(-50%, -50%)`;
          circleRef.current.style.left = `${xVal}px`;
          circleRef.current.style.top = `${centerY}px`;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [sliderPosition]);

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
          onTouchEnd={handleMouseUp}
          className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-gold-base/20 shadow-gold"
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
            <div className="absolute top-6 left-6 z-20">
              <span className="px-4 py-2 rounded-full glass-panel font-mono text-xs uppercase tracking-widest text-white/60">
                Invisible
              </span>
            </div>
          </div>

          {/* After Image (Ascended) - Clipped by SVG clipPath */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: "url(#liquid-wave-clip)" }}
          >
            <img
              src={latinoBien}
              alt="After"
              className="w-full h-full object-contain saturate-[0.9] bg-[#0c0905]"
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
            <div className="absolute top-6 left-6 z-20">
              <span className="px-4 py-2 rounded-full bg-gold-base/20 backdrop-blur-xl border border-gold-base/30 font-mono text-xs uppercase tracking-widest text-gold-light">
                Ascendido
              </span>
            </div>
          </div>

          {/* SVG Glowing Liquid Divider Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ mixBlendMode: "screen" }}>
            <path 
              ref={lineRef} 
              fill="none" 
              stroke="url(#handle-gold-gradient)" 
              strokeWidth="3.0" 
              style={{ filter: "drop-shadow(0px 0px 8px #d4a359)" }} 
            />
            <defs>
              <linearGradient id="handle-gold-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffeeb8" />
                <stop offset="50%" stopColor="#d4a359" />
                <stop offset="100%" stopColor="#805b21" />
              </linearGradient>
            </defs>
          </svg>

          {/* Slider Handle (Circle) */}
          <div 
            ref={circleRef}
            className="absolute w-12 h-12 rounded-full bg-gold-gradient shadow-gold flex items-center justify-center pointer-events-none z-20"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <div className="flex gap-1">
              <div className="w-0.5 h-4 bg-void rounded-full" />
              <div className="w-0.5 h-4 bg-void rounded-full" />
            </div>
            
            {/* Glow Aura */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-20 h-20 rounded-full bg-gold-base/20 blur-xl pointer-events-none -z-10"
            />
          </div>
        </motion.div>

        {/* Hidden SVG for clip-path rendering */}
        <svg style={{ position: "absolute", width: 0, height: 0 }} width="0" height="0">
          <defs>
            <clipPath id="liquid-wave-clip" clipPathUnits="objectBoundingBox">
              <path ref={pathRef} d={`M 0 0 L ${sliderPosition / 100} 0 L ${sliderPosition / 100} 1 L 0 1 Z`} />
            </clipPath>
          </defs>
        </svg>

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
