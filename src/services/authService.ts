// S (SRP): Only handles authentication operations.
// D (DIP): Screens depend on this service interface, NOT on supabase directly.
// L (LSP): Returns consistent ServiceResult<T> so any mock can substitute it.

import { supabase } from '../lib/supabase';
import type { ServiceResult } from '../types';

// ─── Sign In with Email/Password ──────────────────────────────────────────────

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<ServiceResult<null>> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

// ─── Sign Up with Email/Password ──────────────────────────────────────────────

export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<ServiceResult<null>> => {
  try {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

// ─── Sign In with Google ──────────────────────────────────────────────────────

export const signInWithGoogle = async (
  idToken: string
): Promise<ServiceResult<null>> => {
  try {
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Google sign-in failed. Please try again.' };
  }
};

// ─── Password Reset ───────────────────────────────────────────────────────────

export const sendPasswordReset = async (
  email: string
): Promise<ServiceResult<null>> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Failed to send reset email. Please try again.' };
  }
};

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export const signOut = async (): Promise<ServiceResult<null>> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Sign-out failed. Please try again.' };
  }
};
