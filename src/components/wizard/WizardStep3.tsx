import { motion } from 'framer-motion';
import { usePatient } from '@/contexts/PatientContext';
import WizardSlider from '@/components/WizardSlider';
import { Stethoscope } from 'lucide-react';

const WizardStep3 = () => {
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
          <Stethoscope className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Respiratory Symptoms</h2>
        <p className="text-muted-foreground">Rate the severity of the following symptoms (1-9)</p>
      </div>

      <div className="space-y-6">
        <WizardSlider
          label="Coughing of Blood (Hemoptysis)"
          value={patientData.coughingBlood}
          onChange={(val) => updatePatientData({ coughingBlood: val })}
          critical={true}
          description="Any blood in cough or sputum"
        />

        <WizardSlider
          label="Wheezing"
          value={patientData.wheezing}
          onChange={(val) => updatePatientData({ wheezing: val })}
          description="Whistling sound when breathing"
        />

        <WizardSlider
          label="Shortness of Breath"
          value={patientData.shortnessOfBreath}
          onChange={(val) => updatePatientData({ shortnessOfBreath: val })}
          description="Difficulty breathing or feeling breathless"
        />

        <WizardSlider
          label="Swallowing Difficulty (Dysphagia)"
          value={patientData.swallowingDifficulty}
          onChange={(val) => updatePatientData({ swallowingDifficulty: val })}
          description="Trouble swallowing food or liquids"
        />

        <WizardSlider
          label="Dry Cough"
          value={patientData.dryCough}
          onChange={(val) => updatePatientData({ dryCough: val })}
          description="Persistent cough without mucus"
        />

        <WizardSlider
          label="Chest Pain"
          value={patientData.chestPain}
          onChange={(val) => updatePatientData({ chestPain: val })}
          description="Pain or discomfort in the chest area"
        />

        <WizardSlider
          label="Snoring"
          value={patientData.snoring}
          onChange={(val) => updatePatientData({ snoring: val })}
          description="Regular snoring during sleep"
        />
      </div>
    </motion.div>
  );
};

export default WizardStep3;
