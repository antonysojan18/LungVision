import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { PatientProvider, usePatient } from '@/contexts/PatientContext';
import CinematicIntro from '@/components/CinematicIntro';
import PatientWizard from '@/components/PatientWizard';
import ResultsDashboard from '@/components/ResultsDashboard';
import SpecialistBooking from '@/components/SpecialistBooking';
import ThemeToggle from '@/components/ThemeToggle';
import AppFooter from '@/components/AppFooter';

type AppState = 'intro' | 'wizard' | 'results' | 'booking';

const IndexContent = () => {
  const [appState, setAppState] = useState<AppState>('intro');
  const { warmupServer } = usePatient();

  useEffect(() => {
    // Warm up the server as soon as the app loads
    warmupServer();
  }, [warmupServer]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
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
  );
}

const Index = () => {
  return (
    <PatientProvider>
      <IndexContent />
    </PatientProvider>
  );
};

export default Index;
