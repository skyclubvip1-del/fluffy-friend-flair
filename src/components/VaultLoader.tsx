import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

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

// Video configuration - checks public directory first, then fallback CDN URL
const VIDEO_PATH = "/intro.mp4";
const FALLBACK_VIDEO = "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054f4d82b07a9e3ee31976fc42f6c0e&profile_id=139&oauth2_token_id=57447761";

const VaultLoader = ({ onComplete }: VaultLoaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [useVideo, setUseVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState(VIDEO_PATH);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const particles = useMemo(() => generateParticles(40), []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem("vault-opened", "true");
    setIsVisible(false);
    // Allow exit animation to play before calling onComplete
    setTimeout(onComplete, 600);
  }, [onComplete]);

  // Handle video loading errors (fallback to standard animation)
  const handleVideoError = () => {
    console.log("Intro video failed to load, trying fallback or particle loader.");
    if (videoSrc === VIDEO_PATH) {
      setVideoSrc(FALLBACK_VIDEO);
    } else {
      setUseVideo(false);
    }
  };

  // Video progress tracking
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const handleVideoLoadedData = () => {
    setVideoLoaded(true);
  };

  // Check session storage — skip if already opened
  useEffect(() => {
    if (sessionStorage.getItem("vault-opened") === "true") {
      setIsVisible(false);
      onComplete();
      return;
    }

    if (!useVideo) {
      // Animate progress bar over ~3.5s for fallback loader
      const startTime = Date.now();
      const duration = 3500;
      let raf: number;

      const tick = () => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - pct, 3); // Ease-out cubic
        setProgress(eased * 100);

        if (pct < 1) {
          raf = requestAnimationFrame(tick);
        }
      };
      raf = requestAnimationFrame(tick);

      const timer = setTimeout(handleComplete, 4000);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [onComplete, handleComplete, useVideo]);

  // Don't render if not visible and exit animation complete
  if (!isVisible && sessionStorage.getItem("vault-opened") === "true") {
    return null;
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

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
          {useVideo ? (
            <div className="absolute inset-0 w-full h-full z-0">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                playsInline
                muted={isMuted}
                onEnded={handleComplete}
                onError={handleVideoError}
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={handleVideoLoadedData}
                className={`w-full h-full object-cover transition-opacity duration-1000 ${
                  videoLoaded ? "opacity-70" : "opacity-0"
                }`}
              />
              {/* Overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-transparent to-[#050403] pointer-events-none" />
              <div className="absolute inset-0 bg-black/45 pointer-events-none" />
            </div>
          ) : null}

          {/* Fallback & Layered Elements: Floating gold dust particles (hidden if video is loaded to keep screen clean) */}
          {(!useVideo || !videoLoaded) && (
            <div className="absolute inset-0 pointer-events-none z-10">
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
          )}

          {/* Central content */}
          <div className="relative z-20 flex flex-col items-center gap-8 mix-blend-difference sm:mix-blend-normal">
            {/* Display loader title only when video is not loaded yet or fallback is active */}
            {(!useVideo || !videoLoaded) && (
              <>
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
              </>
            )}
          </div>

          {/* Interactive controls overlay for Video Intro */}
          {useVideo && videoLoaded && (
            <div className="absolute bottom-12 left-0 right-0 px-8 z-30 flex items-center justify-between">
              {/* Sound toggle */}
              <motion.button
                onClick={toggleMute}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-gold-base/20 bg-void/80 text-gold-light hover:text-gold-base hover:border-gold-base/50 transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-4.5 h-4.5" />
                ) : (
                  <Volume2 className="w-4.5 h-4.5 animate-pulse-slow" />
                )}
                {/* Tooltip */}
                <span className="absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-void/90 border border-gold-base/20 text-[9px] font-mono uppercase tracking-widest text-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  {isMuted ? "Activar Sonido" : "Silenciar"}
                </span>
              </motion.button>

              {/* Skip Intro */}
              <motion.button
                onClick={handleComplete}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative px-5 py-2.5 rounded-full font-display font-bold text-[10px] uppercase tracking-[0.2em] bg-void/80 text-gold-light border border-gold-base/20 backdrop-blur-md hover:bg-gold-base hover:text-void hover:border-gold-base transition-all duration-300 flex items-center gap-2 shadow-[0_0_12px_rgba(212,163,89,0.15)] hover:shadow-[0_0_20px_rgba(212,163,89,0.3)] cursor-pointer"
              >
                Saltar Intro
                <SkipForward className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          )}

          {/* Liquid gold progress bar at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden z-25">
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
