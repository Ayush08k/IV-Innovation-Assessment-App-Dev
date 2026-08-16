// S (SRP): Only responsible for color design tokens

export const Colors = {
  // Backgrounds
  background: '#0A0F1E',
  surface: '#111827',
  surfaceElevated: '#1C2333',
  surfaceBorder: '#1F2A3C',

  // Brand
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4A42D8',
  accent: '#00D4AA',
  accentLight: '#33DDBB',

  // BMI Category colours
  underweight: '#3B82F6',
  normal: '#10B981',
  overweight: '#F59E0B',
  obese: '#EF4444',

  // Text
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textInverse: '#0A0F1E',

  // UI
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Input
  inputBackground: '#1C2333',
  inputBorder: '#2D3748',
  inputBorderFocused: '#6C63FF',
  inputPlaceholder: '#6B7280',

  // Gradients (start, end)
  gradientPrimary: ['#6C63FF', '#4A42D8'] as const,
  gradientAccent: ['#00D4AA', '#0099CC'] as const,
  gradientCard: ['#1C2333', '#111827'] as const,

  // White / Black
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
