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

const Marquee = () => {
  return (
    <section className="relative py-16 bg-void overflow-hidden">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Marquee Container */}
      <div className="relative mask-gradient">
        {/* First Row - Left to Right */}
        <div className="flex gap-0 mb-4 overflow-hidden">
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="flex gap-0 shrink-0"
          >
            {[...images, ...images].map((src, i) => (
              <motion.div
                key={`row1-${i}`}
                whileHover={{ scale: 1.25, rotate: 4, zIndex: 30 }}
                className="relative w-48 h-32 shrink-0 overflow-hidden group border border-gold-base/10"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:saturate-[1.3] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-void/50 group-hover:bg-transparent transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Right to Left */}
        <div className="flex gap-0 overflow-hidden">
          <motion.div
            animate={{ x: ["-50%", 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="flex gap-0 shrink-0"
          >
            {[...images.slice().reverse(), ...images.slice().reverse()].map((src, i) => (
              <motion.div
                key={`row2-${i}`}
                whileHover={{ scale: 1.25, rotate: -4, zIndex: 30 }}
                className="relative w-48 h-32 shrink-0 overflow-hidden group border border-gold-base/10"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:saturate-[1.3] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-void/50 group-hover:bg-transparent transition-colors duration-300" />
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
