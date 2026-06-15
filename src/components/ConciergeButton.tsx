import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Crown, X, Users } from "lucide-react";
import { useState } from "react";

const ConciergeButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-void/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Main Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Pulsing rotating luxury glow halo */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            rotate: 360,
          }}
          transition={{
            scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 8, ease: "linear" }
          }}
          className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-gold-base via-[#8a0303] to-gold-light opacity-80 blur-[2px] pointer-events-none"
        />

        {/* Ping Ring */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full bg-gold-base"
        />

        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsExpanded(!isExpanded)}
          animate={{
            width: isHovered && !isExpanded ? 180 : 64,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative h-16 rounded-full bg-gold-gradient shadow-gold flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6 text-void" />
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-4"
              >
                <Crown className="w-6 h-6 text-void shrink-0" />
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-display font-semibold text-xs uppercase tracking-wider text-void whitespace-nowrap overflow-hidden"
                    >
                      Concierge VIP
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Expanded Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute bottom-20 right-0 w-80 glass-panel rounded-2xl p-6 border border-gold-base/20"
            >
              <h3 className="font-display font-bold text-white text-lg mb-2">
                Concierge VIP
              </h3>
              <p className="text-white/50 text-sm mb-6">
                Accede a asistencia exclusiva las 24 horas. Tu elevación personal comienza aquí.
              </p>

              <div className="space-y-3">
                <motion.a
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  href="https://wa.me/34677263672"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold-base/30 transition-colors duration-300"
                >
                  <MessageCircle className="w-5 h-5 text-gold-base" />
                  <div className="text-left">
                    <span className="font-display font-semibold text-white text-sm block">WhatsApp</span>
                    <span className="text-white/40 text-xs">Respuesta inmediata</span>
                  </div>
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  href="https://yeasyapp.com/#/commerce/4e922d95-5660-4e1e-b687-e6e1c45b9169"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-4 rounded-xl bg-gold-base/10 border border-gold-base/30 hover:bg-gold-base/20 transition-colors duration-300"
                >
                  <Crown className="w-5 h-5 text-gold-base" />
                  <div className="text-left">
                    <span className="font-display font-semibold text-gold-light text-sm block">Pedir Cita</span>
                    <span className="text-gold-base/60 text-xs">Consulta 1:1 con experto</span>
                  </div>
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  href="https://discord.gg/JS5teZkT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold-base/30 transition-colors duration-300"
                >
                  <Users className="w-5 h-5 text-gold-base" />
                  <div className="text-left">
                    <span className="font-display font-semibold text-white text-sm block">Comunidad</span>
                    <span className="text-white/40 text-xs">Únete al Discord exclusivo</span>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ConciergeButton;
