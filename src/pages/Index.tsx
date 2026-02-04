import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PatientProvider } from '@/contexts/PatientContext';
import CinematicIntro from '@/components/CinematicIntro';
import PatientWizard from '@/components/PatientWizard';
import ResultsDashboard from '@/components/ResultsDashboard';
import SpecialistBooking from '@/components/SpecialistBooking';
import ThemeToggle from '@/components/ThemeToggle';
import AppFooter from '@/components/AppFooter';

type AppState = 'intro' | 'wizard' | 'results' | 'booking';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('intro');

  return (
    <ThemeProvider>
      <PatientProvider>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Theme Toggle - Always visible */}
          {appState !== 'intro' && <ThemeToggle />}
          {/* Scrollable content area - footer stays at bottom, no overlap/underlap */}
          <div className={appState !== 'intro' ? 'flex-1 min-h-0 flex flex-col overflow-auto' : ''}>
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
                onNewPatient={() => setAppState('wizard')}
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
          {/* Footer at exact bottom of page, in flow - no overlap or underlap */}
          {appState !== 'intro' && <AppFooter />}
        </div>
      </PatientProvider>
    </ThemeProvider>
  );
};

export default Index;
