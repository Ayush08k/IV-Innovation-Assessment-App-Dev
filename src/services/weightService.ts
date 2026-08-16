// S (SRP): Only handles weight/BMI entry operations.
// D (DIP): All callers use this service, never supabase directly.

import { supabase } from '../lib/supabase';
import type { WeightEntry, ServiceResult } from '../types';

// ─── Add a New Weight Entry ───────────────────────────────────────────────────

export const addWeightEntry = async (
  profileId: string,
  weightKg: number,
  heightCm: number,
  bmi: number
): Promise<ServiceResult<WeightEntry>> => {
  try {
    const { data, error } = await supabase
      .from('weight_entries')
      .insert({
        profile_id: profileId,
        weight_kg: weightKg,
        height_cm: heightCm,
        bmi,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as WeightEntry };
  } catch {
    return { success: false, error: 'Failed to save entry.' };
  }
};

// ─── Get Latest Entry for a Profile ──────────────────────────────────────────

export const getLatestEntry = async (
  profileId: string
): Promise<ServiceResult<WeightEntry | null>> => {
  try {
    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('profile_id', profileId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as WeightEntry | null };
  } catch {
    return { success: false, error: 'Failed to load data.' };
  }
};

// ─── Get Weight History (last 7 entries) ─────────────────────────────────────

export const getWeightHistory = async (
  profileId: string,
  limit: number = 7
): Promise<ServiceResult<WeightEntry[]>> => {
  try {
    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('profile_id', profileId)
      .order('recorded_at', { ascending: true })
      .limit(limit);

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as WeightEntry[] };
  } catch {
    return { success: false, error: 'Failed to load history.' };
  }
};
