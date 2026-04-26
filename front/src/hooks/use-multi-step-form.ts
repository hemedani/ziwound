"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "report-form-progress";

interface UseMultiStepFormProps {
  initialStep?: number;
  totalSteps: number;
}

interface MultiStepFormState {
  currentStep: number;
  completedSteps: number[];
  formData: Record<string, unknown>;
}

function getInitialState(initialStep: number): MultiStepFormState {
  if (typeof window === "undefined") {
    return { currentStep: initialStep, completedSteps: [], formData: {} };
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        currentStep: parsed.currentStep ?? initialStep,
        completedSteps: parsed.completedSteps ?? [],
        formData: parsed.formData ?? {},
      };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return { currentStep: initialStep, completedSteps: [], formData: {} };
}

export function useMultiStepForm({
  initialStep = 1,
  totalSteps,
}: UseMultiStepFormProps) {
  const [initialState] = useState(() => getInitialState(initialStep));
  
  const [currentStep, setCurrentStep] = useState(initialState.currentStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialState.completedSteps);
  const [formData, setFormData] = useState<Record<string, unknown>>(initialState.formData);

  useEffect(() => {
    const state = { currentStep, completedSteps, formData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [currentStep, completedSteps, formData]);

  const nextStep = useCallback(
    async (_data: Record<string, unknown>): Promise<boolean> => {
      setFormData((prev: Record<string, unknown>) => ({
        ...prev,
        ..._data,
      }));

      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev: number[]) => [...prev, currentStep]);
      }

      if (currentStep < totalSteps) {
        setCurrentStep((prev: number) => prev + 1);
      }

      return true;
    },
    [currentStep, totalSteps, completedSteps]
  );

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev: number) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const updateStepData = useCallback((_data: Record<string, unknown>) => {
    setFormData((prev: Record<string, unknown>) => ({
      ...prev,
      ..._data,
    }));
  }, []);

  const getAllData = useCallback((): Record<string, unknown> => {
    return formData;
  }, [formData]);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStep(initialStep);
    setCompletedSteps([]);
    setFormData({});
  }, [initialStep]);

  const setCurrentStepDirectly = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  return {
    currentStep,
    totalSteps,
    completedSteps,
    formData,
    nextStep,
    prevStep,
    goToStep,
    updateStepData,
    getAllData,
    clearProgress,
    setCurrentStepDirectly,
    setFormData,
  };
}