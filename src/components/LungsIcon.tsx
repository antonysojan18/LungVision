import { motion, type Easing } from 'framer-motion';

interface LungsIconProps {
  className?: string;
  animate?: boolean;
}

const LungsIcon = ({ className = '', animate = true }: LungsIconProps) => {
  const ease: Easing = [0.4, 0, 0.2, 1];
  
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 3, ease },
        opacity: { duration: 0.5 },
      },
    },
  };

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={`${className}`}
      initial="hidden"
      animate={animate ? 'visible' : 'hidden'}
    >
      {/* Left Lung */}
      <motion.path
        d="M85 50 Q75 55, 70 70 Q60 90, 55 120 Q50 150, 60 170 Q70 185, 85 180 Q95 175, 95 160 Q95 140, 93 120 Q90 90, 88 70 Q87 60, 85 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={pathVariants}
        className="text-primary"
      />
      
      {/* Right Lung */}
      <motion.path
        d="M115 50 Q125 55, 130 70 Q140 90, 145 120 Q150 150, 140 170 Q130 185, 115 180 Q105 175, 105 160 Q105 140, 107 120 Q110 90, 112 70 Q113 60, 115 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={pathVariants}
        className="text-primary"
      />
      
      {/* Trachea */}
      <motion.path
        d="M100 20 L100 50 M95 50 Q100 55, 105 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={pathVariants}
        className="text-primary"
      />
      
      {/* Bronchi - Left */}
      <motion.path
        d="M95 55 Q85 65, 80 80 M80 80 Q75 95, 72 110 M75 90 Q70 100, 68 115 M78 85 Q72 92, 70 105"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={pathVariants}
        className="text-primary/70"
      />
      
      {/* Bronchi - Right */}
      <motion.path
        d="M105 55 Q115 65, 120 80 M120 80 Q125 95, 128 110 M125 90 Q130 100, 132 115 M122 85 Q128 92, 130 105"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={pathVariants}
        className="text-primary/70"
      />
    </motion.svg>
  );
};

export default LungsIcon;
