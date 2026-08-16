// S (SRP): Only responsible for color design tokens

export const Colors = {
  // Backgrounds - Clean fresh clinical light theme
  background: '#F4FBF7',      // Soft Fresh Mint Off-White
  surface: '#FFFFFF',         // Pure Crisp White
  surfaceElevated: '#FFFFFF', // Elevated Pure White Card
  surfaceBorder: '#E2EFE9',   // Gentle Sage Border

  // Health Brand - Vibrant Medical Emerald & Mint
  primary: '#059669',        // Deep Trustworthy Medical Emerald
  primaryLight: '#10B981',   // Vibrant Mint
  primaryDark: '#047857',    // Forest Health
  accent: '#0891B2',         // Clinical Cyan
  accentLight: '#06B6D4',
  accentDark: '#0E7490',

  // BMI Category colours
  underweight: '#0284C7',    // Sky Blue
  normal: '#059669',         // Health Green
  overweight: '#D97706',     // Amber Warm
  obese: '#E11D48',          // Rose Alert

  // Text
  textPrimary: '#0F2922',    // Deep Forest Charcoal
  textSecondary: '#4A6B62',  // Crisp Sage Gray
  textMuted: '#8BA39B',      // Soft Muted Slate
  textInverse: '#FFFFFF',

  // UI status
  success: '#059669',
  warning: '#D97706',
  error: '#E11D48',
  info: '#0284C7',

  // Input
  inputBackground: '#F0F9F5',
  inputBorder: '#D1E7DD',
  inputBorderFocused: '#059669',
  inputPlaceholder: '#8BA39B',

  // Gradients (start, end)
  gradientPrimary: ['#059669', '#10B981'] as const,
  gradientAccent: ['#0891B2', '#059669'] as const,
  gradientCard: ['#FFFFFF', '#F4FBF7'] as const,

  // White / Black
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
