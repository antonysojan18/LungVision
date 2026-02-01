import { motion } from 'framer-motion';
import { usePatient } from '@/contexts/PatientContext';
import WizardSlider from '@/components/WizardSlider';
import { Activity } from 'lucide-react';

const WizardStep4 = () => {
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
          <Activity className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Systemic Signs</h2>
        <p className="text-muted-foreground">Have you experienced these body-wide changes? Rate 1-9</p>
      </div>

      <div className="space-y-6">
        <WizardSlider
          label="Fatigue"
          value={patientData.fatigue}
          onChange={(val) => updatePatientData({ fatigue: val })}
          description="Extreme tiredness that doesn't improve with rest"
        />

        <WizardSlider
          label="Unexplained Weight Loss"
          value={patientData.weightLoss}
          onChange={(val) => updatePatientData({ weightLoss: val })}
          description="Losing weight without trying"
        />

        <WizardSlider
          label="Clubbing of Finger Nails"
          value={patientData.clubbingFingers}
          onChange={(val) => updatePatientData({ clubbingFingers: val })}
          description="Changes in fingertip shape or nail curvature"
        />

        <WizardSlider
          label="Frequent Colds"
          value={patientData.frequentColds}
          onChange={(val) => updatePatientData({ frequentColds: val })}
          description="Getting sick more often than usual"
        />
      </div>
    </motion.div>
  );
};

export default WizardStep4;
