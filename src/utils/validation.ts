// S (SRP): Only responsible for Zod validation schemas.
// I (ISP): Each schema is fine-grained — only includes fields actually needed.

import { z } from 'zod';

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

// ─── User Details Schema ──────────────────────────────────────────────────────

export const userDetailsSchema = z.object({
  weight: z
    .number({ invalid_type_error: 'Weight must be a number' })
    .positive('Weight must be a positive number')
    .min(1, 'Weight must be at least 1')
    .max(700, 'Weight seems too high — please double-check'),
  weightUnit: z.enum(['kg', 'lbs']),
  height: z
    .number({ invalid_type_error: 'Height must be a number' })
    .positive('Height must be a positive number')
    .min(1, 'Height must be at least 1')
    .max(300, 'Height seems too high — please double-check'),
  heightUnit: z.enum(['cm', 'inches']),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
});

// ─── Profile Schema ───────────────────────────────────────────────────────────

export const addProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or less')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;
export type AddProfileFormData = z.infer<typeof addProfileSchema>;
