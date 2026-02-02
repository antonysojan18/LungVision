import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PatientProvider } from '@/contexts/PatientContext';
import CinematicIntro from '@/components/CinematicIntro';
import PatientWizard from '@/components/PatientWizard';
import ResultsDashboard from '@/components/ResultsDashboard';
import SpecialistBooking from '@/components/SpecialistBooking';
import ThemeToggle from '@/components/ThemeToggle';

type AppState = 'intro' | 'wizard' | 'results' | 'booking';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('intro');

  return (
    <ThemeProvider>
      <PatientProvider>
        <div className="min-h-screen bg-background">
          {/* Theme Toggle - Always visible */}
          {appState !== 'intro' && <ThemeToggle />}
          
          <AnimatePresence mode="wait">
            {appState === 'intro' && (
              <CinematicIntro 
                key="intro"
                onComplete={() => setAppState('wizard')} 
              />
            )}
            
            {appState === 'wizard' && (
              <PatientWizard 
                key="wizard"
                onComplete={() => setAppState('results')} 
              />
            )}
            
            {appState === 'results' && (
              <ResultsDashboard 
                key="results"
                onConsultSpecialist={() => setAppState('booking')} 
              />
            )}
            
            {appState === 'booking' && (
              <SpecialistBooking 
                key="booking"
                onBack={() => setAppState('results')} 
              />
            )}
          </AnimatePresence>
        </div>
      </PatientProvider>
    </ThemeProvider>
  );
};

export default Index;
