import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { usePatient } from '@/contexts/PatientContext';
import { User, UserRound } from 'lucide-react';

const WizardStep1 = () => {
  const { patientData, updatePatientData } = usePatient();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Patient Information</h2>
        <p className="text-muted-foreground">Let's start with the basics</p>
      </div>

      {/* Name Input */}
      <div className="space-y-3">
        <Label htmlFor="name">Patient Name</Label>
        <Input
          id="name"
          placeholder="Enter your name"
          value={patientData.name}
          onChange={(e) => updatePatientData({ name: e.target.value })}
          className="h-12 text-lg glass-card"
        />
      </div>

      {/* Age Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Age</Label>
          <span className="text-2xl font-bold text-primary">{patientData.age}</span>
        </div>
        <Slider
          value={[patientData.age]}
          onValueChange={(vals) => updatePatientData({ age: vals[0] })}
          min={1}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 year</span>
          <span>100 years</span>
        </div>
      </div>

      {/* Gender Selection */}
      <div className="space-y-4">
        <Label>Gender</Label>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            onClick={() => updatePatientData({ gender: 'male' })}
            className={`p-6 rounded-xl border-2 transition-all ${
              patientData.gender === 'male'
                ? 'border-primary bg-primary/10 glow'
                : 'border-border glass-card hover:border-primary/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <User className="w-12 h-12 mx-auto mb-3 text-primary" />
            <span className="text-lg font-medium">Male</span>
          </motion.button>

          <motion.button
            onClick={() => updatePatientData({ gender: 'female' })}
            className={`p-6 rounded-xl border-2 transition-all ${
              patientData.gender === 'female'
                ? 'border-primary bg-primary/10 glow'
                : 'border-border glass-card hover:border-primary/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserRound className="w-12 h-12 mx-auto mb-3 text-primary" />
            <span className="text-lg font-medium">Female</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WizardStep1;
