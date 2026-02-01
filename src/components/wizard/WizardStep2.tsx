import { motion, AnimatePresence } from 'framer-motion';
import { usePatient } from '@/contexts/PatientContext';
import WizardSlider from '@/components/WizardSlider';
import WizardToggle from '@/components/WizardToggle';
import { Cigarette, Wine } from 'lucide-react';

interface WizardStep2Props {
  onSmokerChange: (isSmoker: boolean) => void;
}

const WizardStep2 = ({ onSmokerChange }: WizardStep2Props) => {
  const { patientData, updatePatientData } = usePatient();

  const handleSmokerChange = (isSmoker: boolean) => {
    updatePatientData({ isSmoker });
    onSmokerChange(isSmoker);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Lifestyle & Habits</h2>
        <p className="text-muted-foreground">Understanding your behavioral risk factors</p>
      </div>

      {/* Smoker Toggle - Large and Prominent */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          onClick={() => handleSmokerChange(false)}
          className={`p-6 rounded-xl border-2 transition-all ${
            !patientData.isSmoker
              ? 'border-particle-safe bg-particle-safe/10'
              : 'border-border glass-card hover:border-particle-safe/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-particle-safe/20 flex items-center justify-center">
              <span className="text-3xl">🌿</span>
            </div>
            <span className="text-lg font-medium">Non-Smoker</span>
          </div>
        </motion.button>

        <motion.button
          onClick={() => handleSmokerChange(true)}
          className={`p-6 rounded-xl border-2 transition-all ${
            patientData.isSmoker
              ? 'border-particle-danger bg-particle-danger/10'
              : 'border-border glass-card hover:border-particle-danger/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-particle-danger/20 flex items-center justify-center">
              <Cigarette className="w-8 h-8 text-particle-danger" />
            </div>
            <span className="text-lg font-medium">Smoker</span>
          </div>
        </motion.button>
      </div>

      {/* Smoker-specific fields */}
      <AnimatePresence>
        {patientData.isSmoker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 overflow-hidden"
          >
            <WizardSlider
              label="Years of Smoking"
              value={patientData.yearsOfSmoking}
              onChange={(val) => updatePatientData({ yearsOfSmoking: val })}
              description="How many years have you been smoking?"
            />
            <WizardSlider
              label="Smoking Intensity"
              value={patientData.smokingIntensity}
              onChange={(val) => updatePatientData({ smokingIntensity: val })}
              description="How heavily do you smoke? (1 = Light, 9 = Heavy)"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <WizardToggle
        label="Passive Smoker"
        checked={patientData.isPassiveSmoker}
        onChange={(checked) => updatePatientData({ isPassiveSmoker: checked })}
        description="Are you frequently exposed to secondhand smoke?"
      />

      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wine className="w-5 h-5" />
          <span className="font-medium">Other Lifestyle Factors</span>
        </div>
        
        <WizardSlider
          label="Alcohol Use"
          value={patientData.alcoholUse}
          onChange={(val) => updatePatientData({ alcoholUse: val })}
          description="Level of alcohol consumption"
        />
        
        <WizardSlider
          label="Obesity Level"
          value={patientData.obesityLevel}
          onChange={(val) => updatePatientData({ obesityLevel: val })}
          description="Body mass assessment"
        />
        
        <WizardSlider
          label="Balanced Diet"
          value={patientData.balancedDiet}
          onChange={(val) => updatePatientData({ balancedDiet: val })}
          description="How well-balanced is your diet? (1 = Poor, 9 = Excellent)"
        />
      </div>
    </motion.div>
  );
};

export default WizardStep2;
