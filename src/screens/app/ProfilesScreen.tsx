// S (SRP): Only renders the profiles management screen.
// I (ISP): Consumes only profile-related data from useProfiles hook.

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfiles } from '../../hooks/useProfiles';
import { ProfileCard } from '../../components/ProfileCard';
import { addProfileSchema, type AddProfileFormData } from '../../utils/validation';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../theme';
import type { Gender } from '../../types';

const GENDERS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const ProfilesScreen: React.FC = () => {
  const { profiles, activeProfile, isLoading, isAdding, error, switchProfile, addProfile, removeProfile, refresh } = useProfiles();
  const [showModal, setShowModal] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<AddProfileFormData>({
    resolver: zodResolver(addProfileSchema),
    defaultValues: { gender: 'male' },
  });

  useEffect(() => { refresh(); }, []);

  const onAddProfile = async (data: AddProfileFormData) => {
    const success = await addProfile(data);
    if (success) { setShowModal(false); reset(); }
    else if (error) Alert.alert('Error', error);
  };

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Profiles</Text>
            <Text style={styles.subtitle}>{profiles.length} profile{profiles.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowModal(true)}
            accessibilityLabel="Add new profile"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
          <Text style={styles.infoText}>
            Tap a profile to switch to it. The active profile is used for all BMI calculations.
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Profile List */}
        {profiles.length === 0 && !isLoading ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Profiles Yet</Text>
            <Text style={styles.emptySubtitle}>Create your first profile to start tracking.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowModal(true)}>
              <Text style={styles.emptyBtnText}>Add Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isActive={activeProfile?.id === profile.id}
              onSelect={() => switchProfile(profile)}
              onDelete={() => removeProfile(profile.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Add Profile Modal */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Profile</Text>

            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="e.g. John Doe"
                    placeholderTextColor={Colors.inputPlaceholder}
                    value={value}
                    onChangeText={onChange}
                    accessibilityLabel="Profile name input"
                  />
                )}
              />
              {errors.name && <Text style={styles.errorFieldText}>{errors.name.message}</Text>}
            </View>

            {/* Gender */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender</Text>
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.genderRow}>
                    {GENDERS.map((g) => (
                      <TouchableOpacity
                        key={g.value}
                        onPress={() => onChange(g.value)}
                        style={[styles.genderBtn, value === g.value && styles.genderBtnActive]}
                        accessibilityLabel={`Gender ${g.label}`}
                      >
                        <Text style={[styles.genderBtnText, value === g.value && styles.genderBtnTextActive]}>
                          {g.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors.gender && <Text style={styles.errorFieldText}>{errors.gender.message}</Text>}
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelModalBtn} onPress={() => { setShowModal(false); reset(); }}>
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, isAdding && styles.btnDisabled]}
                onPress={handleSubmit(onAddProfile)}
                disabled={isAdding}
              >
                {isAdding
                  ? <ActivityIndicator color={Colors.white} size="small" />
                  : <Text style={styles.confirmBtnText}>Add Profile</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[5], paddingBottom: Spacing[10] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing[4] },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.textPrimary, marginBottom: Spacing[1] },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  addBtn: {
    width: 44, height: 44, borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.md,
  },
  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[2],
    backgroundColor: Colors.info + '11', borderRadius: BorderRadius.md,
    padding: Spacing[3], marginBottom: Spacing[4], borderWidth: 1, borderColor: Colors.info + '33',
  },
  infoText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.info, flex: 1, lineHeight: 18 },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing[2],
    backgroundColor: Colors.error + '22', borderRadius: BorderRadius.md,
    padding: Spacing[3], marginBottom: Spacing[4], borderWidth: 1, borderColor: Colors.error + '44',
  },
  errorText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  emptyState: { alignItems: 'center', paddingVertical: Spacing[16] },
  emptyTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary, marginTop: Spacing[4] },
  emptySubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textSecondary, marginTop: Spacing[2], textAlign: 'center' },
  emptyBtn: {
    marginTop: Spacing[6], backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing[6], paddingVertical: Spacing[3],
  },
  emptyBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.white },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'], padding: Spacing[6], paddingBottom: Spacing[10],
    gap: Spacing[5],
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.surfaceBorder, alignSelf: 'center', marginBottom: Spacing[2],
  },
  modalTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary },
  fieldGroup: { gap: Spacing[2] },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.inputBackground, borderWidth: 1, borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.md, padding: Spacing[4],
    fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textPrimary,
  },
  inputError: { borderColor: Colors.error },
  errorFieldText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.error },
  genderRow: { flexDirection: 'row', gap: Spacing[3] },
  genderBtn: {
    flex: 1, paddingVertical: Spacing[3], borderRadius: BorderRadius.md,
    alignItems: 'center', backgroundColor: Colors.inputBackground,
    borderWidth: 1, borderColor: Colors.inputBorder,
  },
  genderBtnActive: { backgroundColor: Colors.primary + '22', borderColor: Colors.primary },
  genderBtnText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textSecondary },
  genderBtnTextActive: { color: Colors.primary, fontFamily: FontFamily.semiBold },
  modalActions: { flexDirection: 'row', gap: Spacing[3], marginTop: Spacing[2] },
  cancelModalBtn: {
    flex: 1, padding: Spacing[4], borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceElevated, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  cancelModalText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textSecondary },
  confirmBtn: { flex: 1, padding: Spacing[4], borderRadius: BorderRadius.lg, backgroundColor: Colors.primary, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  confirmBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.base, color: Colors.white },
});
