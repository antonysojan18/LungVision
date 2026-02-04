import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface AppHeaderProps {
  currentStep?: number;
  showSteps?: boolean;
  showNewPatient?: boolean;
  onNewPatient?: () => void;
}

const steps = [
  { number: 1, title: 'Patient Info' },
  { number: 2, title: 'Lifestyle' },
  { number: 3, title: 'Respiratory' },
  { number: 4, title: 'Body' },
  { number: 5, title: 'Environment' },
  { number: 6, title: 'Analysis' },
];

const AppHeader = ({ currentStep, showSteps = false, showNewPatient = false, onNewPatient }: AppHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass-header">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              <span className="text-primary">LungVision</span>
              <span className="text-foreground dark:text-white"> AI</span>
            </h1>

            {/* Steps Indicator - Only show when showSteps is true */}
            {showSteps && currentStep && (
              <div className="hidden md:flex items-center gap-1">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${currentStep >= step.number
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                          : 'bg-muted/50 text-muted-foreground'
                          }`}
                        animate={{
                          scale: currentStep === step.number ? 1.15 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {step.number}
                      </motion.div>
                      <span className={`text-[10px] mt-1 whitespace-nowrap transition-colors ${currentStep >= step.number
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                        }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 w-6 lg:w-10 mx-1 mt-[-16px] transition-all ${currentStep > step.number
                          ? 'bg-primary'
                          : 'bg-muted/50'
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Step Counter */}
            {showSteps && currentStep && (
              <div className="md:hidden flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep}/6
                </span>
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 6) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* New Patient reset - top right on results page */}
            {showNewPatient && onNewPatient && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNewPatient}
                className="gap-1.5 shrink-0 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Patient</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AppHeader;
