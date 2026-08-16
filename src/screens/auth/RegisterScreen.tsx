// S (SRP): Only handles account creation UI.
// D (DIP): Calls authService.signUpWithEmail, not supabase directly.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { registerSchema, type RegisterFormData } from '../../utils/validation';
import { signUpWithEmail } from '../../services/authService';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onRegister = async (data: RegisterFormData) => {
    const result = await signUpWithEmail(data.email, data.password);
    if (result.success) {
      Alert.alert(
        'Account Created! 🎉',
        'Please check your email to confirm your account, then sign in.',
        [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  const renderField = (
    name: keyof RegisterFormData,
    label: string,
    placeholder: string,
    icon: keyof typeof Ionicons.glyphMap,
    secure?: boolean,
    showToggle?: boolean,
    toggleState?: boolean,
    onToggle?: () => void,
    keyboardType?: 'email-address' | 'default'
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View style={[styles.inputWrapper, errors[name] && styles.inputWrapperError]}>
            <Ionicons name={icon} size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={Colors.inputPlaceholder}
              keyboardType={keyboardType ?? 'default'}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={secure && !toggleState}
              value={value}
              onChangeText={onChange}
              accessibilityLabel={`${label} input`}
            />
            {showToggle && onToggle && (
              <TouchableOpacity onPress={onToggle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name={toggleState ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {errors[name] && <Text style={styles.errorText}>{errors[name]?.message}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="person-add" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your BMI tracking journey</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {renderField('email', 'Email Address', 'you@example.com', 'mail-outline', false, false, false, undefined, 'email-address')}
          {renderField('password', 'Password', 'Min 8 chars, 1 uppercase, 1 number', 'lock-closed-outline', true, true, showPassword, () => setShowPassword((p) => !p))}
          {renderField('confirmPassword', 'Confirm Password', 'Re-enter your password', 'shield-checkmark-outline', true, true, showConfirm, () => setShowConfirm((p) => !p))}

          {/* Password requirements hint */}
          <View style={styles.hintBox}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.info} />
            <Text style={styles.hintText}>
              Min. 8 characters · At least 1 uppercase · At least 1 number
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, isSubmitting && styles.btnDisabled]}
            onPress={handleSubmit(onRegister)}
            disabled={isSubmitting}
            accessibilityLabel="Create account button"
            accessibilityRole="button"
          >
            {isSubmitting
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.primaryBtnText}>Create Account</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityLabel="Go to login">
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: Spacing[6], justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: Spacing[8] },
  logoContainer: {
    width: 76, height: 76, borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary + '22', borderWidth: 1,
    borderColor: Colors.primary + '44', alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  title: { fontFamily: FontFamily.extraBold, fontSize: FontSize['3xl'], color: Colors.textPrimary, marginBottom: Spacing[1] },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary },
  form: { gap: Spacing[4] },
  fieldGroup: { gap: Spacing[2] },
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
  hintBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing[2],
    backgroundColor: Colors.info + '11', borderRadius: BorderRadius.sm,
    padding: Spacing[3], borderWidth: 1, borderColor: Colors.info + '33',
  },
  hintText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.info, flex: 1 },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.lg,
    padding: Spacing[4], alignItems: 'center', marginTop: Spacing[2],
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white, letterSpacing: 0.5 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing[8] },
  footerText: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary },
  footerLink: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.primary },
});
