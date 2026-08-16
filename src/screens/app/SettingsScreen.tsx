// S (SRP): Only renders the settings screen.
// I (ISP): Consumes only { updateMeasurements, handleSignOut, isUpdating, isSigningOut } from useSettings.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../hooks/useSettings';
import { useProfileStore } from '../../store/profileStore';
import { useAuthStore } from '../../store/authStore';
import { UserDetailsForm } from '../../components/UserDetailsForm';
import { LiquidTransitionView } from '../../components/LiquidTransitionView';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../theme';
import type { UserDetailsFormData } from '../../utils/validation';

export const SettingsScreen: React.FC = () => {
  const { isUpdating, isSigningOut, error, updateMeasurements, handleSignOut } = useSettings();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const user = useAuthStore((s) => s.user);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const onUpdate = async (data: UserDetailsFormData) => {
    const success = await updateMeasurements(data);
    if (success) {
      setShowUpdateForm(false);
      Alert.alert('Updated ✓', 'Your measurements have been saved and BMI recalculated.');
    } else if (error) {
      Alert.alert('Update Failed', error);
    }
    return success;
  };

  const confirmSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: handleSignOut },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      overScrollMode="always"
      bounces={true}
      decelerationRate="normal"
    >
      <LiquidTransitionView>
        {/* Header */}
        <Text style={styles.title}>Settings</Text>

      {/* Account Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.accountRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={Colors.primary} />
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountEmail}>{user?.email ?? 'Guest'}</Text>
            <Text style={styles.accountSub}>Active: {activeProfile?.name ?? 'No profile'}</Text>
          </View>
        </View>
      </View>

      {/* Update Measurements */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Update Measurements</Text>
        <Text style={styles.sectionSubtitle}>
          Any update creates a new timestamped entry and updates your BMI graph.
        </Text>
        {showUpdateForm ? (
          <>
            <View style={styles.formDivider} />
            <UserDetailsForm onSubmit={onUpdate} isSubmitting={isUpdating} />
            <TouchableOpacity onPress={() => setShowUpdateForm(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setShowUpdateForm(true)}
            accessibilityLabel="Update height and weight"
          >
            <Ionicons name="scale-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Update Height &amp; Weight</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* App Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App</Text>
          <Text style={styles.infoValue}>BMI Tracker</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Built with</Text>
          <Text style={styles.infoValue}>Expo + Supabase</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Company</Text>
          <Text style={styles.infoValue}>IV Innovations Pvt. Ltd.</Text>
        </View>
      </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.signOutBtn, isSigningOut && styles.btnDisabled]}
          onPress={confirmSignOut}
          disabled={isSigningOut}
          accessibilityLabel="Sign out"
          accessibilityRole="button"
        >
          {isSigningOut ? (
            <ActivityIndicator color={Colors.error} size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
      </LiquidTransitionView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[5], paddingBottom: Spacing[12] },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.textPrimary, marginBottom: Spacing[5] },
  card: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius['2xl'],
    padding: Spacing[5], borderWidth: 1, borderColor: Colors.surfaceBorder,
    marginBottom: Spacing[4], ...Shadow.sm,
  },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: Colors.textPrimary, marginBottom: Spacing[3] },
  sectionSubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing[4] },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4] },
  avatar: {
    width: 56, height: 56, borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '22', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primary + '44',
  },
  accountInfo: { flex: 1 },
  accountEmail: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  accountSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing[3],
    backgroundColor: Colors.primary + '11', borderRadius: BorderRadius.lg,
    padding: Spacing[4], borderWidth: 1, borderColor: Colors.primary + '22',
  },
  actionText: { flex: 1, fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.primary },
  formDivider: { height: 1, backgroundColor: Colors.surfaceBorder, marginBottom: Spacing[4] },
  cancelBtn: { marginTop: Spacing[3], alignItems: 'center' },
  cancelText: { fontFamily: FontFamily.medium, fontSize: FontSize.base, color: Colors.textMuted },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  infoLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary },
  infoValue: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing[3], backgroundColor: Colors.error + '11',
    borderRadius: BorderRadius.xl, padding: Spacing[4],
    borderWidth: 1, borderColor: Colors.error + '33',
  },
  btnDisabled: { opacity: 0.6 },
  signOutText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.error },
});
