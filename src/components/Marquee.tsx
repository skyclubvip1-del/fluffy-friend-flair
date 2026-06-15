import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80", // Suit
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", // Watch
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80", // Haircut
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80", // Car
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80", // Gym
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", // Fabric
  "https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=400&q=80", // Perfume
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80", // Gold chain
];

const depthValues = [-20, 0, 10];

const Marquee = () => {
  return (
    <section className="relative py-16 bg-void overflow-hidden">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Film Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay' as const,
          opacity: 0.08,
        }}
      />

      {/* Marquee Container */}
      <div className="relative mask-gradient" style={{ perspective: '800px' }}>
        {/* First Row - Left to Right */}
        <div className="flex gap-[2px] mb-4 overflow-hidden">
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="flex gap-[2px] shrink-0 group/row"
          >
            {[...images, ...images].map((src, i) => (
              <motion.div
                key={`row1-${i}`}
                whileHover={{ scale: 1.3, z: 40, zIndex: 30 }}
                className="relative w-48 h-44 shrink-0 group border border-gold-base/10 transition-all duration-300 group-hover/row:blur-[2px] group-hover/row:opacity-60 hover:!blur-none hover:!opacity-100"
                style={{ transform: `translateZ(${depthValues[i % 3]}px)` }}
              >
                {/* Main Image */}
                <div className="relative w-full h-32 overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:saturate-[1.3] transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-void/50 group-hover:bg-transparent transition-colors duration-300" />
                  {/* Border Beam on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-beam pointer-events-none" />
                </div>
                {/* Mirror Reflection */}
                <div
                  className="w-full h-12 overflow-hidden pointer-events-none"
                  style={{
                    transform: 'scaleY(-1)',
                    opacity: 0.15,
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                  }}
                >
                  <img src={src} alt="" className="w-full h-32 object-cover grayscale" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Right to Left */}
        <div className="flex gap-[2px] overflow-hidden">
          <motion.div
            animate={{ x: ["-50%", 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="flex gap-[2px] shrink-0 group/row"
          >
            {[...images.slice().reverse(), ...images.slice().reverse()].map((src, i) => (
              <motion.div
                key={`row2-${i}`}
                whileHover={{ scale: 1.3, z: 40, zIndex: 30 }}
                className="relative w-48 h-44 shrink-0 group border border-gold-base/10 transition-all duration-300 group-hover/row:blur-[2px] group-hover/row:opacity-60 hover:!blur-none hover:!opacity-100"
                style={{ transform: `translateZ(${depthValues[i % 3]}px)` }}
              >
                {/* Main Image */}
                <div className="relative w-full h-32 overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:saturate-[1.3] transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-void/50 group-hover:bg-transparent transition-colors duration-300" />
                  {/* Border Beam on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-beam pointer-events-none" />
                </div>
                {/* Mirror Reflection */}
                <div
                  className="w-full h-12 overflow-hidden pointer-events-none"
                  style={{
                    transform: 'scaleY(-1)',
                    opacity: 0.15,
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                  }}
                >
                  <img src={src} alt="" className="w-full h-32 object-cover grayscale" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default Marquee;
