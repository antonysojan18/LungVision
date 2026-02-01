import { motion } from 'framer-motion';
import { usePatient } from '@/contexts/PatientContext';
import WizardSlider from '@/components/WizardSlider';
import WizardToggle from '@/components/WizardToggle';
import { CloudRain, Factory, Dna } from 'lucide-react';

const WizardStep5 = () => {
  const { patientData, updatePatientData } = usePatient();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Factory className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Environmental & History</h2>
        <p className="text-muted-foreground">External factors that may affect your lung health</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <CloudRain className="w-5 h-5" />
          <span className="font-medium">Environmental Exposure</span>
        </div>

        <WizardSlider
          label="Air Pollution Exposure"
          value={patientData.airPollution}
          onChange={(val) => updatePatientData({ airPollution: val })}
          description="Level of exposure to polluted air"
        />

        <WizardSlider
          label="Occupational Hazards"
          value={patientData.occupationalHazards}
          onChange={(val) => updatePatientData({ occupationalHazards: val })}
          description="Exposure to harmful substances at work"
        />

        <WizardSlider
          label="Dust Allergy"
          value={patientData.dustAllergy}
          onChange={(val) => updatePatientData({ dustAllergy: val })}
          description="Sensitivity or reaction to dust"
        />
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Dna className="w-5 h-5" />
          <span className="font-medium">Medical History</span>
        </div>

        <WizardToggle
          label="Genetic Risk (Family History)"
          checked={patientData.geneticRisk}
          onChange={(checked) => updatePatientData({ geneticRisk: checked })}
          description="History of lung cancer in your family"
        />

        <WizardToggle
          label="Chronic Lung Disease"
          checked={patientData.chronicLungDisease}
          onChange={(checked) => updatePatientData({ chronicLungDisease: checked })}
          description="COPD, Asthma, or other chronic conditions"
        />
      </div>
    </motion.div>
  );
};

export default WizardStep5;
