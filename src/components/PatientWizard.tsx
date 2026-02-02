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
import DynamicBackground from './DynamicBackground';
import AppHeader from './AppHeader';
import { usePatient } from '@/contexts/PatientContext';

interface PatientWizardProps {
  onComplete: () => void;
}

const PatientWizard = ({ onComplete }: PatientWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { patientData } = usePatient();

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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WizardStep1 />;
      case 2:
        return <WizardStep2 />;
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
      <DynamicBackground 
        step={currentStep} 
        smokingIntensity={patientData.smokingIntensity}
        isSmoker={patientData.isSmoker}
      />
      
      <AppHeader currentStep={currentStep} showSteps={true} />
      
      <div className="relative z-10 container max-w-2xl mx-auto px-4 pt-28 pb-24">
        {/* Step Content */}
        <div className="glass-card rounded-2xl p-6 md:p-8 min-h-[500px] shadow-2xl shadow-primary/10">
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
            <Button onClick={handleNext} className="gap-2 glow">
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
