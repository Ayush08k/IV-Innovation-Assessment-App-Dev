// S (SRP): This module is ONLY responsible for BMI math and conversions.
// O (OCP): BMI_CATEGORIES array can be extended without modifying any consumer.
// D (DIP): Pure functions — zero dependencies on UI, navigation, or Supabase.

import type { BMICategory } from '../types';

// ─── Unit Converters ─────────────────────────────────────────────────────────

export const lbsToKg = (lbs: number): number =>
  parseFloat((lbs * 0.453592).toFixed(2));

export const kgToLbs = (kg: number): number =>
  parseFloat((kg * 2.20462).toFixed(2));

export const inchesToCm = (inches: number): number =>
  parseFloat((inches * 2.54).toFixed(2));

export const cmToInches = (cm: number): number =>
  parseFloat((cm / 2.54).toFixed(2));

// ─── BMI Categories (Open/Closed: add new entries here only) ─────────────────

export const BMI_CATEGORIES: BMICategory[] = [
  { label: 'Underweight',  color: '#3B82F6', min: 0,    max: 18.49 },
  { label: 'Normal Weight', color: '#10B981', min: 18.5, max: 24.99 },
  { label: 'Overweight',   color: '#F59E0B', min: 25.0, max: 29.99 },
  { label: 'Obese',        color: '#EF4444', min: 30.0, max: Infinity },
];

// ─── Core BMI Formula ─────────────────────────────────────────────────────────

/**
 * Calculates BMI from SI units.
 * Formula: BMI = weightKg / (heightM * heightM)
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

// ─── Category Lookup ──────────────────────────────────────────────────────────

export const getBMICategory = (bmi: number): BMICategory => {
  return (
    BMI_CATEGORIES.find((cat) => bmi >= cat.min && bmi <= cat.max) ??
    BMI_CATEGORIES[BMI_CATEGORIES.length - 1]
  );
};

// ─── Gauge Angle Mapping (0–100 → 0°–180°) ───────────────────────────────────

/**
 * Maps a BMI value to a 0–1 progress value for the gauge arc.
 * Clamps between 10 and 40 BMI for display purposes.
 */
export const bmiToGaugeProgress = (bmi: number): number => {
  const MIN_BMI = 10;
  const MAX_BMI = 40;
  const clamped = Math.min(Math.max(bmi, MIN_BMI), MAX_BMI);
  return (clamped - MIN_BMI) / (MAX_BMI - MIN_BMI);
};

// ─── Healthy Weight Range ─────────────────────────────────────────────────────

/**
 * Given heightCm, returns the [minKg, maxKg] for 'Normal Weight' BMI range.
 */
export const getHealthyWeightRange = (
  heightCm: number
): { minKg: number; maxKg: number } => {
  const heightM = heightCm / 100;
  return {
    minKg: parseFloat((18.5 * heightM * heightM).toFixed(1)),
    maxKg: parseFloat((24.9 * heightM * heightM).toFixed(1)),
  };
};
