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

// ─── Sign In with Google (Universal: Expo Go + WebBrowser / Native) ───────────

export const signInWithGoogleOAuth = async (): Promise<ServiceResult<null>> => {
  try {
    const WebBrowser = require('expo-web-browser');
    const AuthSession = require('expo-auth-session');
    
    WebBrowser.maybeCompleteAuthSession();
    const redirectUrl = AuthSession.makeRedirectUri({
      preferLocalhost: true,
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) return { success: false, error: error.message };
    if (!data?.url) return { success: false, error: 'No OAuth URL returned from Supabase' };

    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (res.type === 'success' && res.url) {
      // Parse parameters from the redirect URL
      const parsedUrl = new URL(res.url.replace('#', '?'));
      const accessToken = parsedUrl.searchParams.get('access_token');
      const refreshToken = parsedUrl.searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) return { success: false, error: sessionError.message };
      }
      return { success: true, data: null };
    } else if (res.type === 'cancel' || res.type === 'dismiss') {
      return { success: false, error: 'Sign in was cancelled' };
    }
    return { success: true, data: null };
  } catch (err: any) {
    return { success: false, error: err.message ?? 'Google OAuth sign-in failed' };
  }
};

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
