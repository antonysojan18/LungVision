import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

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
      
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={1}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min} - None</span>
        <span>{max} - Severe</span>
      </div>
    </motion.div>
  );
};

export default WizardSlider;
