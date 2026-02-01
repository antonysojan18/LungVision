import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticleBackgroundProps {
  smokerMode?: 'neutral' | 'danger' | 'safe';
}

const ParticleBackground = ({ smokerMode = 'neutral' }: ParticleBackgroundProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  const getParticleColor = () => {
    switch (smokerMode) {
      case 'danger':
        return 'bg-particle-danger';
      case 'safe':
        return 'bg-particle-safe';
      default:
        return 'bg-primary/30';
    }
  };

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${getParticleColor()} blur-sm`}
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 0.6, 0.6, 0],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Ambient glow */}
      <div className="absolute inset-0 gradient-radial opacity-50" />
    </div>
  );
};

export default ParticleBackground;
