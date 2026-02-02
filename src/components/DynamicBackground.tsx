import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DynamicBackgroundProps {
  step: number;
  smokingIntensity?: number;
  isSmoker?: boolean;
}

const DynamicBackground = ({ step, smokingIntensity = 0, isSmoker = false }: DynamicBackgroundProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating particles based on step
    const count = step === 2 && isSmoker ? Math.floor(smokingIntensity * 3) + 10 : 15;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [step, smokingIntensity, isSmoker]);

  const getBackgroundStyle = () => {
    const baseClasses = "fixed inset-0 z-0 overflow-hidden transition-all duration-1000";
    
    switch (step) {
      case 1: // Patient Info - Clean medical atmosphere
        return {
          className: baseClasses,
          gradient: "radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
        };
      case 2: // Lifestyle - Smoke/Clear based on smoking
        return {
          className: baseClasses,
          gradient: isSmoker 
            ? `radial-gradient(ellipse at 50% 50%, hsl(var(--destructive) / ${0.1 + smokingIntensity * 0.02}) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, hsl(var(--particle-danger) / ${0.15 + smokingIntensity * 0.015}) 0%, transparent 50%)`
            : "radial-gradient(ellipse at 50% 50%, hsl(var(--particle-safe) / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
        };
      case 3: // Respiratory - Breath-like waves
        return {
          className: baseClasses,
          gradient: "radial-gradient(ellipse at 50% 30%, hsl(var(--primary) / 0.2) 0%, transparent 60%), radial-gradient(ellipse at 50% 70%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
        };
      case 4: // Systemic - Body circulation pattern
        return {
          className: baseClasses,
          gradient: "radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.15) 0%, transparent 40%), radial-gradient(circle at 70% 50%, hsl(var(--primary) / 0.15) 0%, transparent 40%)",
        };
      case 5: // Environment - Atmospheric
        return {
          className: baseClasses,
          gradient: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.2) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, hsl(var(--primary) / 0.1) 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, hsl(var(--primary) / 0.1) 0%, transparent 40%)",
        };
      case 6: // Analysis - Scanning effect
        return {
          className: baseClasses,
          gradient: "radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / 0.25) 0%, transparent 60%)",
        };
      default:
        return {
          className: baseClasses,
          gradient: "radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / 0.1) 0%, transparent 60%)",
        };
    }
  };

  const { className, gradient } = getBackgroundStyle();

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
              background: step === 2 && isSmoker 
                ? `hsl(var(--destructive) / ${0.08 + i * 0.02})`
                : `hsl(var(--primary) / ${0.1 + i * 0.03})`,
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
      </div>

      {/* Smoke particles for step 2 when smoker */}
      <AnimatePresence>
        {step === 2 && isSmoker && (
          <>
            {particles.map((particle) => (
              <motion.div
                key={`smoke-${particle.id}`}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  left: `${particle.x}%`,
                  background: 'hsl(var(--destructive) / 0.4)',
                  filter: 'blur(1px)',
                }}
                initial={{ y: '100vh', opacity: 0 }}
                animate={{ 
                  y: '-10vh', 
                  opacity: [0, 0.6, 0.4, 0],
                  x: [0, Math.sin(particle.id) * 50, Math.cos(particle.id) * 30],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "linear",
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
    </div>
  );
};

export default DynamicBackground;
