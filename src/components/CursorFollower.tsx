import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring for satisfying trailing effect
  const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Slower trail for outer shadow
  const trailConfig = { damping: 30, stiffness: 80, mass: 1.2 };
  const trailXSpring = useSpring(cursorX, trailConfig);
  const trailYSpring = useSpring(cursorY, trailConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Outer shadow trail - slowest, most satisfying */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div 
          className="w-12 h-12 rounded-full"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(circle, hsl(var(--foreground) / 0.15) 0%, transparent 70%)',
            filter: 'blur(6px)',
          }}
        />
      </motion.div>
      
      {/* Main shadow ball - follows with satisfying delay */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div 
          className="w-6 h-6 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(circle at 30% 30%, hsl(var(--foreground) / 0.25) 0%, hsl(var(--foreground) / 0.4) 50%, hsl(var(--foreground) / 0.2) 100%)',
            boxShadow: '0 4px 20px hsl(var(--foreground) / 0.3), inset 0 -2px 6px hsl(var(--foreground) / 0.2)',
          }}
        />
      </motion.div>
    </>
  );
};

export default CursorFollower;
