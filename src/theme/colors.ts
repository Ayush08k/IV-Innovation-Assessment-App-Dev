// S (SRP): Only responsible for color design tokens

export const Colors = {
  // Backgrounds - deep clean obsidian slate with fresh health tint
  background: '#071013',
  surface: '#0E1A1E',
  surfaceElevated: '#15252A',
  surfaceBorder: '#1F353C',

  // Health Brand - Emerald Vitality & Mint Glow
  primary: '#10B981',        // Vital Health Emerald
  primaryLight: '#34D399',   // Vibrant Mint
  primaryDark: '#059669',    // Deep Forest Health
  accent: '#06B6D4',         // Cyan Pulse
  accentLight: '#22D3EE',    // Sky Glow
  accentDark: '#0891B2',

  // BMI Category colours
  underweight: '#38BDF8',    // Crisp Sky Blue
  normal: '#10B981',         // Healthy Emerald Green
  overweight: '#FBBF24',     // Warm Amber Warning
  obese: '#F43F5E',          // Rose Coral Alert

  // Text
  textPrimary: '#F0FDFA',
  textSecondary: '#99F6E4',
  textMuted: '#64748B',
  textInverse: '#071013',

  // UI status
  success: '#10B981',
  warning: '#FBBF24',
  error: '#F43F5E',
  info: '#06B6D4',

  // Input
  inputBackground: '#112227',
  inputBorder: '#1D3B43',
  inputBorderFocused: '#10B981',
  inputPlaceholder: '#64748B',

  // Gradients (start, end)
  gradientPrimary: ['#10B981', '#059669'] as const,
  gradientAccent: ['#06B6D4', '#10B981'] as const,
  gradientCard: ['#15252A', '#0E1A1E'] as const,

  // White / Black
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
