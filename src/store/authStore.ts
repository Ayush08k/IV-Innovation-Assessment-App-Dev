// S (SRP): Only manages authentication state.
// I (ISP): Only exposes auth-related slices — no profile data here.

import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  // Actions
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  initialize: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        set({ session: null, user: null, isLoading: false });
      } else {
        set({
          session: data?.session ?? null,
          user: data?.session?.user ?? null,
          isLoading: false,
        });
      }

      // Subscribe to auth changes for persistent session
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
    } catch {
      set({ session: null, user: null, isLoading: false });
    }
  },
}));
