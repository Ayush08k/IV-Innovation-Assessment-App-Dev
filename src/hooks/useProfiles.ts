// S (SRP): Only manages profile CRUD and switching for the Profiles screen.
// I (ISP): Exposes only profile management actions — no auth, no weight data.

import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { getProfiles, createProfile, deleteProfile } from '../services/profileService';
import type { Profile } from '../types';
import type { AddProfileFormData } from '../utils/validation';

type UseProfilesReturn = {
  profiles: Profile[];
  activeProfile: Profile | null;
  isLoading: boolean;
  isAdding: boolean;
  error: string | null;
  switchProfile: (profile: Profile) => void;
  addProfile: (data: AddProfileFormData) => Promise<boolean>;
  removeProfile: (profileId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
};

export const useProfiles = (): UseProfilesReturn => {
  const user = useAuthStore((s) => s.user);
  const { profiles, activeProfile, setProfiles, setActiveProfile, addProfile: storeAdd, removeProfile: storeRemove } =
    useProfileStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const result = await getProfiles(user.id);
    if (result.success) setProfiles(result.data);
    else setError(result.error);
    setIsLoading(false);
  }, [user, setProfiles]);

  const switchProfile = useCallback(
    (profile: Profile) => setActiveProfile(profile),
    [setActiveProfile]
  );

  const addProfile = useCallback(
    async (data: AddProfileFormData): Promise<boolean> => {
      if (!user) return false;
      setIsAdding(true);
      setError(null);
      const result = await createProfile(user.id, data, profiles.length === 0);
      if (result.success) {
        storeAdd(result.data);
        setIsAdding(false);
        return true;
      }
      setError(result.error);
      setIsAdding(false);
      return false;
    },
    [user, profiles.length, storeAdd]
  );

  const removeProfile = useCallback(
    async (profileId: string): Promise<boolean> => {
      setError(null);
      const result = await deleteProfile(profileId);
      if (result.success) {
        storeRemove(profileId);
        return true;
      }
      setError(result.error);
      return false;
    },
    [storeRemove]
  );

  return {
    profiles,
    activeProfile,
    isLoading,
    isAdding,
    error,
    switchProfile,
    addProfile,
    removeProfile,
    refresh,
  };
};
