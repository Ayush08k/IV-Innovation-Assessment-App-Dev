// S (SRP): Only manages the active user profile and profiles list.
// I (ISP): Exposes only profile-related slices — no auth session here.

import { create } from 'zustand';
import type { Profile } from '../types';

type ProfileState = {
  activeProfile: Profile | null;
  profiles: Profile[];
  // Actions
  setProfiles: (profiles: Profile[]) => void;
  setActiveProfile: (profile: Profile) => void;
  addProfile: (profile: Profile) => void;
  removeProfile: (profileId: string) => void;
  reset: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  activeProfile: null,
  profiles: [],

  setProfiles: (profiles) =>
    set({
      profiles,
      activeProfile: profiles.find((p) => p.is_primary) ?? profiles[0] ?? null,
    }),

  setActiveProfile: (profile) => set({ activeProfile: profile }),

  addProfile: (profile) =>
    set((state) => ({
      profiles: [...state.profiles, profile],
      activeProfile: state.activeProfile ?? profile,
    })),

  removeProfile: (profileId) =>
    set((state) => {
      const remaining = state.profiles.filter((p) => p.id !== profileId);
      const isActiveRemoved = state.activeProfile?.id === profileId;
      return {
        profiles: remaining,
        activeProfile: isActiveRemoved
          ? (remaining[0] ?? null)
          : state.activeProfile,
      };
    }),

  reset: () => set({ activeProfile: null, profiles: [] }),
}));
