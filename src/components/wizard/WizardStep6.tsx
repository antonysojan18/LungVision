import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WizardStep6Props {
  onComplete: () => void;
}

const WizardStep6 = ({ onComplete }: WizardStep6Props) => {
  const [progress, setProgress] = useState(0);
  const { fetchPrediction, isLoading, error } = usePatient();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      fetchPrediction();
    }
  }, [hasStarted, fetchPrediction]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      // Animate up to 90% while loading
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 1;
        });
      }, 50);
    } else if (!isLoading && !error && progress < 100) {
      // Complete the progress when loading finishes
      setProgress(100);
      setTimeout(onComplete, 1000);
    }

    return () => clearInterval(timer);
  }, [isLoading, error, onComplete, progress]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Analysis Failed</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => fetchPrediction()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Analyzing Your Data</h2>
        <p className="text-muted-foreground">Our AI is processing your risk factors...</p>
      </div>

      {/* Scanning Grid Animation */}
      <div className="relative w-48 h-48">
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5">
          {Array.from({ length: 64 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-primary/20 rounded-sm"
              initial={{ opacity: 0.2 }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                backgroundColor: ['hsl(var(--primary) / 0.2)', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.2)'],
              }}
              transition={{
                duration: 1.5,
                delay: (i % 8 + Math.floor(i / 8)) * 0.05,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Scan Line */}
        <motion.div
          className="absolute left-0 right-0 h-1 bg-primary glow"
          initial={{ top: 0 }}
          animate={{ top: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Progress Bar */}
      <div className="w-64 space-y-2">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground">{progress}% Complete</p>
      </div>

      {/* Processing Steps */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 20 ? 1 : 0.3 }}
        >
          ✓ Processing patient data...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 50 ? 1 : 0.3 }}
        >
          ✓ Analyzing risk factors...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 80 ? 1 : 0.3 }}
        >
          ✓ Generating recommendations...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default WizardStep6;
