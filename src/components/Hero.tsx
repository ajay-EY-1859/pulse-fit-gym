import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
          STRENGTH • CONDITIONING • RECOVERY
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          Build a body that keeps up with your ambition.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          Book coached classes, compare memberships, and train with specialists across Strength, HIIT, Boxing, and Mobility.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <a className="primary-button" href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}`} target="_blank" rel="noreferrer">
            Book coached classes
          </a>
        </motion.div>
      </div>
    </section>
  );
}
