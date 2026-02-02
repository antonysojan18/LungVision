import React, { createContext, useContext, useState } from 'react';

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
  calculateRisk: () => { level: 'Low' | 'Medium' | 'High'; score: number };
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patientData, setPatientData] = useState<PatientData>(defaultPatientData);

  const updatePatientData = (data: Partial<PatientData>) => {
    setPatientData(prev => ({ ...prev, ...data }));
  };

  const resetPatientData = () => {
    setPatientData(defaultPatientData);
  };

  const calculateRisk = () => {
    let score = 0;
    
    // Lifestyle factors (weighted heavily)
    if (patientData.isSmoker) {
      score += patientData.yearsOfSmoking * 2;
      score += patientData.smokingIntensity * 3;
    }
    score += patientData.passiveSmokingLevel;
    score += patientData.alcoholUse * 1.5;
    score += patientData.obesityLevel * 1.5;
    score += (9 - patientData.balancedDiet) * 1.5;
    
    // Respiratory symptoms (critical)
    score += patientData.coughingBlood * 5; // Most critical
    score += patientData.wheezing * 2;
    score += patientData.shortnessOfBreath * 3;
    score += patientData.swallowingDifficulty * 2;
    score += patientData.dryCough * 2;
    score += patientData.chestPain * 3;
    score += patientData.snoring * 1;
    
    // Systemic signs
    score += patientData.fatigue * 2;
    score += patientData.weightLoss * 3;
    score += patientData.clubbingFingers * 4;
    score += patientData.frequentColds * 1.5;
    
    // Environmental
    score += patientData.airPollution * 2;
    score += patientData.occupationalHazards * 2;
    score += patientData.dustAllergy * 1.5;
    if (patientData.geneticRisk) score += 15;
    if (patientData.chronicLungDisease) score += 20;
    
    // Normalize to percentage
    const maxPossibleScore = 200;
    const normalizedScore = Math.min((score / maxPossibleScore) * 100, 100);
    
    let level: 'Low' | 'Medium' | 'High';
    if (normalizedScore < 30) level = 'Low';
    else if (normalizedScore < 60) level = 'Medium';
    else level = 'High';
    
    return { level, score: Math.round(normalizedScore) };
  };

  return (
    <PatientContext.Provider value={{ patientData, updatePatientData, resetPatientData, calculateRisk }}>
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
