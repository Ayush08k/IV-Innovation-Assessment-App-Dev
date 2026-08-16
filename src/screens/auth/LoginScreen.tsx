// S (SRP): Only renders the login screen UI and delegates logic to authService.
// D (DIP): Calls authService functions, never supabase directly.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Note: GoogleSignin is dynamically loaded inside onGoogleSignIn to prevent TurboModuleRegistry crash in Expo Go
import { loginSchema, type LoginFormData } from '../../utils/validation';
import { signInWithEmail, signInWithGoogleOAuth } from '../../services/authService';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onLogin = async (data: LoginFormData) => {
    const result = await signInWithEmail(data.email, data.password);
    if (!result.success) Alert.alert('Login Failed', result.error);
  };

  const onGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInWithGoogleOAuth();
      if (!result.success && result.error !== 'Sign in was cancelled') {
        Alert.alert('Google Sign-In', result.error);
      }
    } catch (err: any) {
      Alert.alert('Google Sign-In', err.message ?? 'An error occurred during Google sign-in');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="pulse" size={42} color={Colors.primary} />
          </View>
          <Text style={styles.title}>VitalFit BMI</Text>
          <Text style={styles.subtitle}>Health monitoring &amp; weight intelligence</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
                  <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={Colors.inputPlaceholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    accessibilityLabel="Email input"
                  />
                </View>
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Your password"
                    placeholderTextColor={Colors.inputPlaceholder}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    accessibilityLabel="Password input"
                  />
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}
            accessibilityLabel="Forgot password"
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.primaryBtn, isSubmitting && styles.btnDisabled]}
            onPress={handleSubmit(onLogin)}
            disabled={isSubmitting}
            accessibilityLabel="Sign in button"
            accessibilityRole="button"
          >
            {isSubmitting
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.primaryBtnText}>Sign In</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In */}
          <TouchableOpacity
            style={[styles.googleBtn, isGoogleLoading && styles.btnDisabled]}
            onPress={onGoogleSignIn}
            disabled={isGoogleLoading}
            accessibilityLabel="Sign in with Google"
            accessibilityRole="button"
          >
            {isGoogleLoading ? (
              <ActivityIndicator color={Colors.textPrimary} />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text style={styles.googleBtnText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} accessibilityLabel="Go to register">
            <Text style={styles.footerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    padding: Spacing[6],
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: Spacing[8] },
  logoContainer: {
    width: 80, height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary + '22',
    borderWidth: 1,
    borderColor: Colors.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  form: { gap: Spacing[4] },
  fieldGroup: { gap: Spacing[2] },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  inputWrapperError: { borderColor: Colors.error },
  inputIcon: { marginRight: Spacing[3] },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  forgotButton: { alignSelf: 'flex-end' },
  forgotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginVertical: Spacing[2],
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.surfaceBorder },
  dividerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  googleBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing[8],
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
});
