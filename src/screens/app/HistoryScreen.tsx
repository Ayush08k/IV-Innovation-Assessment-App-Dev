// S (SRP): Only renders the weight history graph screen.
// I (ISP): Consumes only { chartData, entries, isLoading } from useHistory hook.

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useHistory } from '../../hooks/useHistory';
import { useProfileStore } from '../../store/profileStore';
import { WeightChart } from '../../components/WeightChart';
import { getBMICategory } from '../../utils/bmi';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../theme';

export const HistoryScreen: React.FC = () => {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { entries, chartData, isLoading, error, refresh } = useHistory();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.title}>Weight History</Text>
      <Text style={styles.subtitle}>{activeProfile?.name ?? 'Profile'} · Last 7 entries</Text>

      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="trending-up-outline" size={18} color={Colors.primary} />
          <Text style={styles.chartTitle}>Weight Trend (kg)</Text>
        </View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : (
          <WeightChart data={chartData} weightUnit="kg" />
        )}
      </View>

      {/* Entry List */}
      {entries.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Entries</Text>
          {[...entries].reverse().map((entry) => {
            const cat = getBMICategory(entry.bmi);
            return (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryLeft}>
                  <Text style={styles.entryDate}>
                    {format(new Date(entry.recorded_at), 'dd MMM yyyy, hh:mm a')}
                  </Text>
                  <View style={styles.entryStats}>
                    <Text style={styles.entryStat}>{entry.weight_kg.toFixed(1)} kg</Text>
                    <Text style={styles.entryStatSep}>·</Text>
                    <Text style={styles.entryStat}>{entry.height_cm.toFixed(0)} cm</Text>
                  </View>
                </View>
                <View style={[styles.bmiChip, { backgroundColor: cat.color + '22', borderColor: cat.color + '55' }]}>
                  <Text style={[styles.bmiChipText, { color: cat.color }]}>
                    {entry.bmi.toFixed(1)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[5], paddingBottom: Spacing[10] },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.textPrimary, marginBottom: Spacing[1] },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing[5] },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing[2],
    backgroundColor: Colors.error + '22', borderRadius: BorderRadius.md,
    padding: Spacing[3], marginBottom: Spacing[4], borderWidth: 1, borderColor: Colors.error + '44',
  },
  errorText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  chartCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius['2xl'],
    padding: Spacing[4], borderWidth: 1, borderColor: Colors.surfaceBorder,
    marginBottom: Spacing[5], ...Shadow.md,
  },
  chartHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[3] },
  chartTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  loadingContainer: { height: 200, justifyContent: 'center', alignItems: 'center' },
  listSection: { gap: Spacing[3] },
  listTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: Colors.textPrimary },
  entryCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing[4], borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  entryLeft: { gap: 4 },
  entryDate: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  entryStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  entryStat: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary },
  entryStatSep: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textMuted },
  bmiChip: {
    paddingHorizontal: Spacing[3], paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full, borderWidth: 1,
  },
  bmiChipText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },
});
