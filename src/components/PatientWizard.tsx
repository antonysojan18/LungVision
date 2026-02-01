import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WizardStep1 from './wizard/WizardStep1';
import WizardStep2 from './wizard/WizardStep2';
import WizardStep3 from './wizard/WizardStep3';
import WizardStep4 from './wizard/WizardStep4';
import WizardStep5 from './wizard/WizardStep5';
import WizardStep6 from './wizard/WizardStep6';
import ParticleBackground from './ParticleBackground';

interface PatientWizardProps {
  onComplete: () => void;
}

const steps = [
  { title: 'Patient Info', number: 1 },
  { title: 'Lifestyle', number: 2 },
  { title: 'Respiratory', number: 3 },
  { title: 'Systemic', number: 4 },
  { title: 'Environment', number: 5 },
  { title: 'Analysis', number: 6 },
];

const PatientWizard = ({ onComplete }: PatientWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [smokerMode, setSmokerMode] = useState<'neutral' | 'danger' | 'safe'>('neutral');

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSmokerChange = (isSmoker: boolean) => {
    setSmokerMode(isSmoker ? 'danger' : 'safe');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WizardStep1 />;
      case 2:
        return <WizardStep2 onSmokerChange={handleSmokerChange} />;
      case 3:
        return <WizardStep3 />;
      case 4:
        return <WizardStep4 />;
      case 5:
        return <WizardStep5 />;
      case 6:
        return <WizardStep6 onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground smokerMode={currentStep === 2 ? smokerMode : 'neutral'} />
      
      <div className="relative z-10 container max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep >= step.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  animate={{
                    scale: currentStep === step.number ? 1.1 : 1,
                  }}
                >
                  {step.number}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 md:w-12 lg:w-16 mx-1 transition-all ${
                      currentStep > step.number ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Step Content */}
        <div className="glass-card rounded-2xl p-6 md:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientWizard;
