import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LungsIcon from './LungsIcon';
import { Button } from '@/components/ui/button';

interface CinematicIntroProps {
  onComplete: () => void;
}

const phases = [
  { type: 'lungs', duration: 4000 },
  { type: 'logo', duration: 2500 },
  { type: 'text', content: 'Your lungs breathe 20,000 times a day.', duration: 2500 },
  { type: 'text', content: 'Are you protecting them?', duration: 2500 },
  { type: 'text', content: 'Decode Your Risk.', duration: 2000 },
  { type: 'text', content: 'Empower Your Life.', duration: 2000 },
  { type: 'button', duration: 0 },
];

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (currentPhase < phases.length - 1) {
      const timer = setTimeout(() => {
        setCurrentPhase(prev => prev + 1);
      }, phases[currentPhase].duration);
      return () => clearTimeout(timer);
    }
  }, [currentPhase]);

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence mode="wait">
        {/* Phase 0: Lungs Animation */}
        {currentPhase === 0 && (
          <motion.div
            key="lungs"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <LungsIcon className="w-64 h-64 md:w-80 md:h-80" animate={true} />
          </motion.div>
        )}

        {/* Phase 1: Logo */}
        {currentPhase === 1 && (
          <motion.div
            key="logo"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-primary glow-text">LungVision</span>
              <span className="text-primary-foreground bg-primary px-3 py-1 ml-2 rounded-lg">AI</span>
            </h1>
          </motion.div>
        )}

        {/* Phase 2-5: Text Phases */}
        {currentPhase >= 2 && currentPhase <= 5 && (
          <motion.div
            key={`text-${currentPhase}`}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="text-center px-8"
          >
            <p className="text-2xl md:text-4xl font-light text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              {phases[currentPhase].content}
            </p>
          </motion.div>
        )}

        {/* Phase 6: Button */}
        {currentPhase === 6 && (
          <motion.div
            key="button"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <Button
                size="lg"
                onClick={onComplete}
                className="text-lg px-10 py-7 rounded-full glow hover:scale-105 transition-transform"
              >
                Let's Get Started
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {currentPhase < 6 && (
        <motion.button
          className="absolute bottom-8 right-8 text-muted-foreground hover:text-foreground transition-colors text-sm"
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Skip intro →
        </motion.button>
      )}
    </motion.div>
  );
};

export default CinematicIntro;
