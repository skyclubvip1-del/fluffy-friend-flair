import { motion } from "framer-motion";

export const GoldDivider = () => {
  return (
    <div className="relative w-full py-12 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* Left line */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gold-base/30 to-gold-base/60" />
      
      {/* Center ornament */}
      <div className="mx-6 flex items-center justify-center gap-2">
        <div className="w-1 h-1 rounded-full bg-gold-base/40" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border border-gold-base/70 rotate-45 flex items-center justify-center shadow-[0_0_8px_rgba(212,163,89,0.4)] bg-void"
        >
          <div className="w-1.5 h-1.5 bg-gold-base" />
        </motion.div>
        <div className="w-1 h-1 rounded-full bg-gold-base/40" />
      </div>

      {/* Right line */}
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-gold-base/30 to-gold-base/60" />
    </div>
  );
};

export default GoldDivider;
