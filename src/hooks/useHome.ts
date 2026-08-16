// S (SRP): Only manages home screen data — current BMI entry and submission.
// I (ISP): Exposes only { currentEntry, submitDetails, isLoading, error } — nothing auth-related.
// D (DIP): Depends on weightService abstraction, not supabase directly.

import { useState, useEffect, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';
import { addWeightEntry, getLatestEntry } from '../services/weightService';
import { calculateBMI, lbsToKg, inchesToCm } from '../utils/bmi';
import type { WeightEntry } from '../types';
import type { UserDetailsFormData } from '../utils/validation';

type UseHomeReturn = {
  currentEntry: WeightEntry | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submitDetails: (data: UserDetailsFormData) => Promise<boolean>;
  refresh: () => Promise<void>;
};

export const useHome = (): UseHomeReturn => {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const [currentEntry, setCurrentEntry] = useState<WeightEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLatestEntry = useCallback(async () => {
    if (!activeProfile) return;
    setIsLoading(true);
    setError(null);
    const result = await getLatestEntry(activeProfile.id);
    if (result.success) {
      setCurrentEntry(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }, [activeProfile]);

  useEffect(() => {
    loadLatestEntry();
  }, [loadLatestEntry]);

  const submitDetails = useCallback(
    async (data: UserDetailsFormData): Promise<boolean> => {
      if (!activeProfile) return false;
      setIsSubmitting(true);
      setError(null);

      // Convert to SI units
      const weightKg =
        data.weightUnit === 'lbs' ? lbsToKg(data.weight) : data.weight;
      const heightCm =
        data.heightUnit === 'inches' ? inchesToCm(data.height) : data.height;
      const bmi = calculateBMI(weightKg, heightCm);

      const result = await addWeightEntry(activeProfile.id, weightKg, heightCm, bmi);
      if (result.success) {
        setCurrentEntry(result.data);
        setIsSubmitting(false);
        return true;
      } else {
        setError(result.error);
        setIsSubmitting(false);
        return false;
      }
    },
    [activeProfile]
  );

  return {
    currentEntry,
    isLoading,
    isSubmitting,
    error,
    submitDetails,
    refresh: loadLatestEntry,
  };
};
