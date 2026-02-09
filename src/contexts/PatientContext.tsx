import React, { createContext, useContext, useState } from 'react';
import { api, PredictionResult } from '@/lib/api';

export interface PatientData {
  // Page 1: Basics
  name: string;
  age: number;
  gender: 'male' | 'female' | '';

  // Page 2: Lifestyle
  isSmoker: boolean;
  yearsOfSmoking: number;
  smokingIntensity: number;
  passiveSmokingLevel: number;
  alcoholUse: number;
  obesityLevel: number;
  balancedDiet: number;

  // Page 3: Respiratory
  coughingBlood: number;
  wheezing: number;
  shortnessOfBreath: number;
  swallowingDifficulty: number;
  dryCough: number;
  chestPain: number;
  snoring: number;

  // Page 4: Systemic
  fatigue: number;
  weightLoss: number;
  clubbingFingers: number;
  frequentColds: number;

  // Page 5: Environmental
  airPollution: number;
  occupationalHazards: number;
  dustAllergy: number;
  geneticRisk: boolean;
  chronicLungDisease: boolean;
}

const defaultPatientData: PatientData = {
  name: '',
  age: 30,
  gender: '',
  isSmoker: false,
  yearsOfSmoking: 1,
  smokingIntensity: 1,
  passiveSmokingLevel: 0,
  alcoholUse: 1,
  obesityLevel: 1,
  balancedDiet: 5,
  coughingBlood: 1,
  wheezing: 1,
  shortnessOfBreath: 1,
  swallowingDifficulty: 1,
  dryCough: 1,
  chestPain: 1,
  snoring: 1,
  fatigue: 1,
  weightLoss: 1,
  clubbingFingers: 1,
  frequentColds: 1,
  airPollution: 1,
  occupationalHazards: 1,
  dustAllergy: 1,
  geneticRisk: false,
  chronicLungDisease: false,
};

interface PatientContextType {
  patientData: PatientData;
  updatePatientData: (data: Partial<PatientData>) => void;
  resetPatientData: () => void;
  predictionResult: PredictionResult | null;
  isLoading: boolean;
  error: string | null;
  fetchPrediction: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patientData, setPatientData] = useState<PatientData>(defaultPatientData);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePatientData = (data: Partial<PatientData>) => {
    setPatientData(prev => ({ ...prev, ...data }));
  };

  const resetPatientData = () => {
    setPatientData(defaultPatientData);
  };

  const fetchPrediction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending patient data to API:", patientData);
      const result = await api.predict(patientData);
      console.log("API Result received:", result);

      if (!result || !result.prediction) {
        throw new Error("Invalid API response structure");
      }

      setPredictionResult(result);
    } catch (err: any) {
      console.error("fetchPrediction Error:", err);
      setError(err.message || 'Failed to fetch prediction. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PatientContext.Provider value={{ patientData, updatePatientData, resetPatientData, predictionResult, isLoading, error, fetchPrediction }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
