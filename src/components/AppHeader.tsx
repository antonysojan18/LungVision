import { motion } from 'framer-motion';
import lungvisionLogo from '@/assets/lungvision-logo.png';

interface AppHeaderProps {
  currentStep?: number;
  showSteps?: boolean;
}

const steps = [
  { number: 1, title: 'Patient Info' },
  { number: 2, title: 'Lifestyle' },
  { number: 3, title: 'Respiratory' },
  { number: 4, title: 'Systemic' },
  { number: 5, title: 'Environment' },
  { number: 6, title: 'Analysis' },
];

const AppHeader = ({ currentStep, showSteps = false }: AppHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass-card border-b border-border/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <motion.img 
                src={lungvisionLogo} 
                alt="LungVision Logo" 
                className="w-10 h-10 object-contain"
                whileHover={{ scale: 1.05 }}
              />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-primary">LungVision</span>
                <span className="text-foreground dark:text-white ml-1">AI</span>
              </h1>
            </div>

            {/* Steps Indicator - Only show when showSteps is true */}
            {showSteps && currentStep && (
              <div className="hidden md:flex items-center gap-1">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                          currentStep >= step.number
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
                      <span className={`text-[10px] mt-1 whitespace-nowrap transition-colors ${
                        currentStep >= step.number
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 w-6 lg:w-10 mx-1 mt-[-16px] transition-all ${
                          currentStep > step.number 
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
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AppHeader;
