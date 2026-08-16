// S (SRP): Only handles profile CRUD operations.
// D (DIP): Depends on supabase client abstraction, not raw fetch/axios.
// L (LSP): Consistent ServiceResult<T> allows mock substitution in tests.

import { supabase } from '../lib/supabase';
import type { Profile, ServiceResult } from '../types';
import type { AddProfileFormData } from '../utils/validation';

// ─── Get All Profiles for Current User ────────────────────────────────────────

export const getProfiles = async (
  ownerId: string
): Promise<ServiceResult<Profile[]>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Profile[] };
  } catch {
    return { success: false, error: 'Failed to load profiles.' };
  }
};

// ─── Create a New Profile ─────────────────────────────────────────────────────

export const createProfile = async (
  ownerId: string,
  formData: AddProfileFormData,
  isPrimary: boolean = false
): Promise<ServiceResult<Profile>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        owner_id: ownerId,
        name: formData.name.trim(),
        gender: formData.gender,
        is_primary: isPrimary,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Profile };
  } catch {
    return { success: false, error: 'Failed to create profile.' };
  }
};

// ─── Delete a Profile ─────────────────────────────────────────────────────────

export const deleteProfile = async (
  profileId: string
): Promise<ServiceResult<null>> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileId);

    if (error) return { success: false, error: error.message };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Failed to delete profile.' };
  }
};
