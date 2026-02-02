import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import introMusic from '@/assets/intro-music.mp3';
import lungvisionLogo from '@/assets/lungvision-logo.png';

interface CinematicIntroProps {
  onComplete: () => void;
}

const phases = [
  { type: 'logo', duration: 5000 },
  { type: 'text', content: 'Your lungs breathe 20,000 times a day.', duration: 2500 },
  { type: 'text', content: 'Are you protecting them?', duration: 2500 },
  { type: 'text', content: 'Decode Your Risk.', duration: 2000 },
  { type: 'text', content: 'Empower Your Life.', duration: 2000 },
  { type: 'final', content: "Let's Get Started", duration: 2500 },
];

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play intro music on mount
  useEffect(() => {
    audioRef.current = new Audio(introMusic);
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(() => {
      // Autoplay blocked - that's okay
    });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Flash effect at 2.2 seconds during logo phase
  useEffect(() => {
    if (currentPhase === 0) {
      const flashTimer = setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 400);
      }, 2200);
      return () => clearTimeout(flashTimer);
    }
  }, [currentPhase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPhase < phases.length - 1) {
        setCurrentPhase(prev => prev + 1);
      } else {
        // Final phase complete - auto transition
        onComplete();
      }
    }, phases[currentPhase].duration);
    return () => clearTimeout(timer);
  }, [currentPhase, onComplete]);

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
        {/* Phase 0: Logo with Image */}
        {currentPhase === 0 && (
          <motion.div
            key="logo"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="text-center relative flex flex-col items-center gap-6"
          >
            {/* Logo Image */}
            <motion.img
              src={lungvisionLogo}
              alt="LungVision Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />
            
            {/* Text Logo */}
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="text-primary glow-text">LungVision</span>
              <span className="text-foreground dark:text-white ml-3">AI</span>
              
              {/* Flash Ray Effect */}
              {showFlash && (
                <motion.div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div 
                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/90 to-transparent blur-sm"
                    animate={{ left: ['-20%', '120%'] }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              )}
            </motion.h1>
          </motion.div>
        )}

        {/* Phase 1-4: Text Phases */}
        {currentPhase >= 1 && currentPhase <= 4 && (
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

        {/* Phase 5: Final text - auto transitions */}
        {currentPhase === 5 && (
          <motion.div
            key="final"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-3xl md:text-5xl font-light text-foreground/80 tracking-wide">
              {phases[currentPhase].content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {currentPhase < 5 && (
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
