import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Radio } from "lucide-react";
import episodioAudio from "@/assets/episodio-42.m4a";

const AudioCanvas = ({ isPlaying }: { isPlaying: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 80;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let currentAmplitude = 0;
    const targetAmplitude = isPlaying ? 25 : 2;
    const ease = 0.08;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      currentAmplitude += (targetAmplitude - currentAmplitude) * ease;
      phaseRef.current += isPlaying ? 0.05 : 0.01;
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw 3 layers of waves
      const waves = [
        {
          amplitude: currentAmplitude * 0.5,
          frequency: 0.015,
          phase: phaseRef.current * 0.8,
          stroke: "rgba(212, 163, 89, 0.25)",
          lineWidth: 1,
        },
        {
          amplitude: currentAmplitude * 0.8,
          frequency: 0.02,
          phase: phaseRef.current * -1.2,
          stroke: "rgba(255, 238, 184, 0.4)",
          lineWidth: 1.5,
        },
        {
          amplitude: currentAmplitude * 1.1,
          frequency: 0.012,
          phase: phaseRef.current,
          stroke: "rgba(212, 163, 89, 0.85)",
          lineWidth: 2.5,
          glow: true,
        },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.stroke;
        ctx.lineWidth = wave.lineWidth;

        if (wave.glow) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#d4a359";
        } else {
          ctx.shadowBlur = 0;
        }

        for (let x = 0; x < width; x++) {
          const edgeDecay = Math.sin((x / width) * Math.PI);
          const y = centerY + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude * edgeDecay;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw subtle background bars
      if (isPlaying) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(212, 163, 89, 0.06)";
        const barWidth = 3;
        const gap = 4;
        const barCount = Math.floor(width / (barWidth + gap));
        
        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + gap);
          const noiseVal = Math.sin(i * 0.15 + phaseRef.current * 1.5) * Math.cos(i * 0.08 - phaseRef.current);
          const barHeight = Math.max(4, Math.abs(noiseVal) * 35);
          ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-20 block opacity-95 filter drop-shadow-[0_0_10px_rgba(212,163,89,0.3)]" 
    />
  );
};

const PodcastVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <section className="relative bg-void border-t border-gold-base/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left - Info */}
          <div className="flex items-center gap-6">
            {/* Audio Element */}
            <audio 
              ref={audioRef} 
              src={episodioAudio} 
              onEnded={handleAudioEnd}
            />
            
            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="relative w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold group"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-void" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 text-void ml-1" fill="currentColor" />
              )}
              
              {/* Ping Animation */}
              <span className="absolute inset-0 rounded-full bg-gold-base/50 animate-ping-slow" />
            </motion.button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-gold-base" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-base">
                  On Air
                </span>
              </div>
              <h3 className="font-display font-bold text-gold-gradient text-lg md:text-xl" style={{ textShadow: "0 0 10px rgba(212,163,89,0.2)" }}>
                Episodio 42 — La Psicología del Dinero
              </h3>
              <p className="font-body text-white/40 text-sm">
                Con Alejandro Romero • 45 min
              </p>
            </div>
          </div>

          {/* Center - Audio Visualizer */}
          <div className="hidden md:block flex-1 max-w-md">
            <AudioCanvas isPlaying={isPlaying} />
          </div>

          {/* Right - Subscribe */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gold-gradient text-void font-display text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300 font-bold cursor-pointer"
          >
            Escuchar Ahora
          </motion.button>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gold-gradient opacity-20 blur-xl" />
    </section>
  );
};

export default PodcastVisualizer;
