// S (SRP): Only handles settings-specific actions: update measurements + sign out.
// I (ISP): Exposes only what the Settings screen needs.

import { useState, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import { addWeightEntry } from '../services/weightService';
import { signOut } from '../services/authService';
import { calculateBMI, lbsToKg, inchesToCm } from '../utils/bmi';
import type { UserDetailsFormData } from '../utils/validation';

type UseSettingsReturn = {
  isUpdating: boolean;
  isSigningOut: boolean;
  error: string | null;
  updateMeasurements: (data: UserDetailsFormData) => Promise<boolean>;
  handleSignOut: () => Promise<void>;
};

export const useSettings = (): UseSettingsReturn => {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const setSession = useAuthStore((s) => s.setSession);
  const resetProfiles = useProfileStore((s) => s.reset);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMeasurements = useCallback(
    async (data: UserDetailsFormData): Promise<boolean> => {
      if (!activeProfile) return false;
      setIsUpdating(true);
      setError(null);

      const weightKg =
        data.weightUnit === 'lbs' ? lbsToKg(data.weight) : data.weight;
      const heightCm =
        data.heightUnit === 'inches' ? inchesToCm(data.height) : data.height;
      const bmi = calculateBMI(weightKg, heightCm);

      const result = await addWeightEntry(activeProfile.id, weightKg, heightCm, bmi);
      setIsUpdating(false);
      if (!result.success) setError(result.error);
      return result.success;
    },
    [activeProfile]
  );

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    await signOut();
    setSession(null);
    resetProfiles();
    setIsSigningOut(false);
  }, [setSession, resetProfiles]);

  return { isUpdating, isSigningOut, error, updateMeasurements, handleSignOut };
};
