// S (SRP): Composes HomeScreen UI — delegates data to useHome hook.
// I (ISP): Only consumes { currentEntry, submitDetails, isLoading, isSubmitting } from hook.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHome } from '../../hooks/useHome';
import { useProfileStore } from '../../store/profileStore';
import { BMIGauge } from '../../components/BMIGauge';
import { CategoryBadge } from '../../components/CategoryBadge';
import { UserDetailsForm } from '../../components/UserDetailsForm';
import { getHealthyWeightRange, kgToLbs } from '../../utils/bmi';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../theme';
import type { UserDetailsFormData } from '../../utils/validation';

export const HomeScreen: React.FC = () => {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { currentEntry, isLoading, isSubmitting, error, submitDetails, refresh } = useHome();
  const [showForm, setShowForm] = useState(!currentEntry);

  const handleSubmit = async (data: UserDetailsFormData) => {
    const success = await submitDetails(data);
    if (success) setShowForm(false);
    return success;
  };

  const healthyRange = currentEntry
    ? getHealthyWeightRange(currentEntry.height_cm)
    : null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.profileName}>{activeProfile?.name ?? 'Add a Profile'}</Text>
        </View>
        <View style={[styles.genderBadge, { backgroundColor: Colors.primary + '22' }]}>
          <Ionicons
            name={activeProfile?.gender === 'female' ? 'female' : activeProfile?.gender === 'male' ? 'male' : 'person'}
            size={16}
            color={Colors.primary}
          />
        </View>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color={Colors.error} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* BMI Display */}
      {currentEntry && !showForm ? (
        <>
          <View style={styles.card}>
            <BMIGauge bmi={currentEntry.bmi} />
            <CategoryBadge bmi={currentEntry.bmi} />

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="scale-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.statValue}>{currentEntry.weight_kg.toFixed(1)} kg</Text>
                <Text style={styles.statLabel}>Weight</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="resize-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.statValue}>{currentEntry.height_cm.toFixed(0)} cm</Text>
                <Text style={styles.statLabel}>Height</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="heart-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.statValue}>
                  {healthyRange?.minKg}–{healthyRange?.maxKg}
                </Text>
                <Text style={styles.statLabel}>Ideal kg</Text>
              </View>
            </View>
          </View>

          {/* Update button */}
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => setShowForm(true)}
            accessibilityLabel="Update measurements"
            accessibilityRole="button"
          >
            <Ionicons name="refresh-outline" size={18} color={Colors.primary} />
            <Text style={styles.updateBtnText}>Update Measurements</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.formTitle}>
            {currentEntry ? 'Update Your Measurements' : 'Enter Your Details'}
          </Text>
          <Text style={styles.formSubtitle}>
            We'll calculate your BMI and track changes over time.
          </Text>
          <View style={styles.formDivider} />
          <UserDetailsForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            defaultValues={
              currentEntry
                ? {
                    weight: currentEntry.weight_kg,
                    weightUnit: 'kg',
                    height: currentEntry.height_cm,
                    heightUnit: 'cm',
                    gender: activeProfile?.gender ?? 'male',
                  }
                : undefined
            }
          />
          {currentEntry && (
            <TouchableOpacity onPress={() => setShowForm(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[5], paddingBottom: Spacing[10] },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing[5],
  },
  greeting: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary },
  profileName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary },
  genderBadge: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing[2],
    backgroundColor: Colors.error + '22', borderRadius: BorderRadius.md,
    padding: Spacing[3], marginBottom: Spacing[4],
    borderWidth: 1, borderColor: Colors.error + '44',
  },
  errorBannerText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  card: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius['2xl'],
    padding: Spacing[5], borderWidth: 1, borderColor: Colors.surfaceBorder,
    ...Shadow.md,
  },
  statsRow: {
    flexDirection: 'row', marginTop: Spacing[5],
    paddingTop: Spacing[4], borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  statItem: { flex: 1, alignItems: 'center', gap: Spacing[1] },
  statDivider: { width: 1, backgroundColor: Colors.surfaceBorder },
  statValue: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.textPrimary },
  statLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textMuted },
  updateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing[2], marginTop: Spacing[4],
    backgroundColor: Colors.primary + '11', borderRadius: BorderRadius.lg,
    padding: Spacing[4], borderWidth: 1, borderColor: Colors.primary + '33',
  },
  updateBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.primary },
  formTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary, marginBottom: Spacing[1] },
  formSubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  formDivider: { height: 1, backgroundColor: Colors.surfaceBorder, marginVertical: Spacing[4] },
  cancelBtn: { marginTop: Spacing[3], alignItems: 'center', padding: Spacing[3] },
  cancelBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.base, color: Colors.textMuted },
});
