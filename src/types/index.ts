// S (SRP): Single source of truth for all shared types across the app.
// I (ISP): Each type is minimal — no interface forces unused properties.

export type Gender = 'male' | 'female' | 'other';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'inches';

export type BMICategory = {
  label: 'Underweight' | 'Normal Weight' | 'Overweight' | 'Obese';
  color: string;
  min: number;
  max: number;
};

export type Profile = {
  id: string;
  owner_id: string;
  name: string;
  gender: Gender;
  is_primary: boolean;
  created_at: string;
};

export type WeightEntry = {
  id: string;
  profile_id: string;
  weight_kg: number;
  height_cm: number;
  bmi: number;
  recorded_at: string;
};

export type UserFormData = {
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  heightUnit: HeightUnit;
  gender: Gender;
};

export type AuthUser = {
  id: string;
  email: string | undefined;
  full_name?: string;
  avatar_url?: string;
};

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ChartDataPoint = {
  value: number;
  label: string;
  date: string;
};
