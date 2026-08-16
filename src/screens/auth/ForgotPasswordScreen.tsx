// S (SRP): Only handles the forgot-password flow UI.
// D (DIP): Calls authService.sendPasswordReset, not supabase directly.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../utils/validation';
import { sendPasswordReset } from '../../services/authService';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [sent, setSent] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting }, getValues } =
    useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await sendPasswordReset(data.email);
    if (result.success) {
      setSent(true);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (sent) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="mail-unread" size={48} color={Colors.success} />
        </View>
        <Text style={styles.successTitle}>Check Your Email</Text>
        <Text style={styles.successSubtitle}>
          We've sent a password reset link to{'\n'}
          <Text style={styles.emailHighlight}>{getValues('email')}</Text>
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Login')}
          accessibilityLabel="Back to login"
        >
          <Text style={styles.primaryBtnText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.iconContainer}>
          <Ionicons name="key" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you a link to reset your password.
        </Text>

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
                  accessibilityLabel="Email input for password reset"
                />
              </View>
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, isSubmitting && styles.btnDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          accessibilityLabel="Send reset link"
          accessibilityRole="button"
        >
          {isSubmitting
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.primaryBtnText}>Send Reset Link</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing[6], paddingTop: Spacing[12] },
  backBtn: { marginBottom: Spacing[8] },
  iconContainer: {
    width: 72, height: 72, borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary + '22', borderWidth: 1,
    borderColor: Colors.primary + '44', alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing[5],
  },
  title: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary, marginBottom: Spacing[2] },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary, marginBottom: Spacing[7], lineHeight: 22 },
  fieldGroup: { gap: Spacing[2], marginBottom: Spacing[5] },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBackground, borderWidth: 1,
    borderColor: Colors.inputBorder, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4], paddingVertical: Spacing[3],
  },
  inputWrapperError: { borderColor: Colors.error },
  inputIcon: { marginRight: Spacing[3] },
  input: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textPrimary },
  errorText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.error },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.lg,
    padding: Spacing[4], alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white, letterSpacing: 0.5 },
  // Success state
  successContainer: { flex: 1, backgroundColor: Colors.background, padding: Spacing[6], justifyContent: 'center', alignItems: 'center' },
  successIcon: {
    width: 100, height: 100, borderRadius: BorderRadius.full,
    backgroundColor: Colors.success + '22', borderWidth: 1,
    borderColor: Colors.success + '44', alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing[6],
  },
  successTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize['2xl'], color: Colors.textPrimary, marginBottom: Spacing[3] },
  successSubtitle: {
    fontFamily: FontFamily.regular, fontSize: FontSize.base,
    color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing[8], lineHeight: 24,
  },
  emailHighlight: { color: Colors.primary, fontFamily: FontFamily.semiBold },
});
