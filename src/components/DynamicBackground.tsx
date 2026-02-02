import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface DynamicBackgroundProps {
  step: number;
  smokingIntensity?: number;
  isSmoker?: boolean;
}

// Stronger primary visibility in light mode (cyan on light bg)
const lightModeBoost = (base: number, isLight: boolean) =>
  isLight ? Math.min(base * 1.6, base + 0.18) : base;

const DynamicBackground = ({ step, smokingIntensity = 0, isSmoker = false }: DynamicBackgroundProps) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Step 2: upward-flowing particles (green or red); other steps: ambient count
    const count = step === 2 ? (isSmoker ? Math.floor(smokingIntensity * 2) + 18 : 20) : 15;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: step === 2 ? Math.random() * 5 + 2 : Math.random() * 4 + 2,
      delay: Math.random() * 6,
    }));
    setParticles(newParticles);
  }, [step, smokingIntensity, isSmoker]);

  const getBackgroundStyle = () => {
    const baseClasses = "fixed inset-0 z-0 overflow-hidden transition-all duration-1000";
    const p = (v: number) => lightModeBoost(v, isLight);

    switch (step) {
      case 1: // Patient Info - Clean medical atmosphere
        return {
          className: baseClasses,
          gradient: `radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / ${p(0.15)}) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(var(--primary) / ${p(0.1)}) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / ${p(0.08)}) 0%, transparent 45%)`,
        };
      case 2: // Lifestyle - Aurora green (non-smoker) or red (smoker) + particles same in both modes
        return {
          className: baseClasses,
          gradient: isSmoker
            ? `radial-gradient(ellipse 120% 80% at 30% 90%, hsl(var(--destructive) / 0.12) 0%, transparent 50%), radial-gradient(ellipse 100% 60% at 70% 80%, hsl(var(--particle-danger) / 0.1) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, hsl(var(--destructive) / ${0.08 + smokingIntensity * 0.015}) 0%, transparent 55%)`
            : `radial-gradient(ellipse 120% 80% at 20% 85%, hsl(var(--particle-safe) / 0.14) 0%, transparent 50%), radial-gradient(ellipse 100% 60% at 80% 75%, hsl(var(--particle-safe) / 0.1) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, hsl(var(--particle-safe) / 0.1) 0%, transparent 50%)`,
        };
      case 3: // Respiratory - Breath-like waves
        return {
          className: baseClasses,
          gradient: `radial-gradient(ellipse at 50% 30%, hsl(var(--primary) / ${p(0.2)}) 0%, transparent 60%), radial-gradient(ellipse at 50% 70%, hsl(var(--primary) / ${p(0.1)}) 0%, transparent 50%), radial-gradient(ellipse at 10% 50%, hsl(var(--primary) / ${p(0.07)}) 0%, transparent 35%)`,
        };
      case 4: // Systemic - Body circulation pattern
        return {
          className: baseClasses,
          gradient: `radial-gradient(circle at 30% 50%, hsl(var(--primary) / ${p(0.15)}) 0%, transparent 40%), radial-gradient(circle at 70% 50%, hsl(var(--primary) / ${p(0.15)}) 0%, transparent 40%), radial-gradient(circle at 50% 20%, hsl(var(--primary) / ${p(0.09)}) 0%, transparent 35%)`,
        };
      case 5: // Environment - Atmospheric
        return {
          className: baseClasses,
          gradient: `radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / ${p(0.2)}) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, hsl(var(--primary) / ${p(0.1)}) 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, hsl(var(--primary) / ${p(0.1)}) 0%, transparent 40%), radial-gradient(ellipse at 100% 30%, hsl(var(--primary) / ${p(0.06)}) 0%, transparent 35%)`,
        };
      case 6: // Analysis - Scanning effect
        return {
          className: baseClasses,
          gradient: `radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / ${p(0.25)}) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, hsl(var(--primary) / ${p(0.1)}) 0%, transparent 40%), radial-gradient(ellipse at 20% 80%, hsl(var(--primary) / ${p(0.1)}) 0%, transparent 40%)`,
        };
      default:
        return {
          className: baseClasses,
          gradient: `radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / ${p(0.1)}) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, hsl(var(--primary) / ${p(0.06)}) 0%, transparent 45%)`,
        };
    }
  };

  const { className, gradient } = getBackgroundStyle();
  const orbOpacity = (i: number) =>
    step === 2 ? (isSmoker ? 0.1 + i * 0.02 : 0.12 + i * 0.02) : lightModeBoost(0.1 + i * 0.03, isLight);

  return (
    <div className={className}>
      {/* Base gradient layer */}
      <motion.div
        key={`gradient-${step}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
        style={{ background: gradient }}
      />

      {/* Floating orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              background: step === 2
                ? isSmoker
                  ? `hsl(var(--destructive) / ${orbOpacity(i)})`
                  : `hsl(var(--particle-safe) / ${orbOpacity(i)})`
                : `hsl(var(--primary) / ${orbOpacity(i)})`,
            }}
            animate={{
              x: [0, 50 + i * 20, -30, 0],
              y: [0, -30 + i * 15, 40, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            initial={{
              left: `${20 + i * 25}%`,
              top: `${20 + i * 20}%`,
            }}
          />
        ))}
        {/* Extra cyan orbs for light mode - skip on step 2 (green/red aurora instead) */}
        {isLight && step !== 2 && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`cyan-orb-${i}`}
                className="absolute rounded-full blur-2xl"
                style={{
                  width: `${120 + i * 60}px`,
                  height: `${120 + i * 60}px`,
                  background: `hsl(var(--primary) / ${0.12 + i * 0.02})`,
                  left: `${[15, 65, 40, 80][i]}%`,
                  top: `${[70, 25, 85, 45][i]}%`,
                }}
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -25, 15, 0],
                  scale: [1, 1.08, 0.92, 1],
                }}
                transition={{
                  duration: 12 + i * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.5,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Aurora overlay for step 2 - slight green or red, same in both modes */}
      {step === 2 && (
        <motion.div
          key="aurora-step2"
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{
            background: isSmoker
              ? 'radial-gradient(ellipse 150% 100% at 50% 100%, hsl(var(--destructive) / 0.08) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(var(--particle-danger) / 0.06) 0%, transparent 45%)'
              : 'radial-gradient(ellipse 150% 100% at 50% 100%, hsl(var(--particle-safe) / 0.1) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(var(--particle-safe) / 0.07) 0%, transparent 45%)',
          }}
        />
      )}

      {/* Step 2: Green particles flowing upward (non-smoker) - same in both modes */}
      <AnimatePresence>
        {step === 2 && !isSmoker && (
          <>
            {particles.map((particle) => (
              <motion.div
                key={`green-${particle.id}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: particle.size,
                  height: particle.size,
                  left: `${particle.x}%`,
                  background: 'hsl(var(--particle-safe))',
                  boxShadow: '0 0 8px hsl(var(--particle-safe) / 0.6)',
                  filter: 'blur(0.5px)',
                }}
                initial={{ y: '100vh', opacity: 0 }}
                animate={{
                  y: '-15vh',
                  opacity: [0, 0.5, 0.45, 0],
                  x: [0, Math.sin(particle.id * 0.7) * 30, Math.cos(particle.id * 0.5) * 20],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 6 + (particle.id % 4),
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'linear',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Step 2: Red particles flowing upward (smoker) - same in both modes */}
      <AnimatePresence>
        {step === 2 && isSmoker && (
          <>
            {particles.map((particle) => (
              <motion.div
                key={`red-${particle.id}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: particle.size,
                  height: particle.size,
                  left: `${particle.x}%`,
                  background: 'hsl(var(--destructive))',
                  boxShadow: '0 0 8px hsl(var(--destructive) / 0.5)',
                  filter: 'blur(0.5px)',
                }}
                initial={{ y: '100vh', opacity: 0 }}
                animate={{
                  y: '-15vh',
                  opacity: [0, 0.55, 0.4, 0],
                  x: [0, Math.sin(particle.id * 0.7) * 30, Math.cos(particle.id * 0.5) * 20],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 6 + (particle.id % 4),
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'linear',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Scan line for analysis step */}
      {step === 6 && (
        <motion.div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
          animate={{
            top: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      {/* Light mode: soft cyan accent mesh - skip on step 2 (green/red aurora) */}
      {isLight && step !== 2 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 100%, hsl(var(--primary) / 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 0% 0%, hsl(var(--primary) / 0.05) 0%, transparent 45%)',
          }}
        />
      )}
    </div>
  );
};

export default DynamicBackground;
