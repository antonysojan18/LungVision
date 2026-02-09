import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import ElasticSlider from './ElasticSlider';

interface WizardSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  critical?: boolean;
  description?: string;
}

const WizardSlider = ({
  label,
  value,
  onChange,
  min = 1,
  max = 9,
  critical = false,
  description,
}: WizardSliderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className={`text-sm font-medium ${critical ? 'text-destructive' : 'text-foreground'}`}>
            {label}
          </Label>
          {critical && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-destructive/20 text-destructive font-medium">
              Critical
            </span>
          )}
        </div>
        <span className="text-lg font-bold text-primary">{value}</span>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <ElasticSlider
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={1}
        className="w-full"
        // Don't need icons for this specific use case as context varies, 
        // OR we could pass generic min/max icons if desired. 
        // For now, let's leave them null to use defaults or nothing if we want.
        // Actually, ElasticSlider has default icons (Volume). 
        // Since WizardSlider is used for different things (years, intensity), 
        // volume icons might be confusing. Let's pass null to hide them?
        // Or we can simple use span elements with text if we wanted.
        // The original design had "1 year" / "100 years" below.
        // ElasticSlider has icons slots. 
        // Let's pass empty fragments if we don't want icons inside the slider component itself,
        // as the labels are outside.
        leftIcon={<></>}
        rightIcon={<></>}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </motion.div>
  );
};

export default WizardSlider;
